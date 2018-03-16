"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_options_1 = require("../common_options");
const web_driver_adapter_1 = require("../web_driver_adapter");
const web_driver_extension_1 = require("../web_driver_extension");
/**
 * Set the following 'traceCategories' to collect metrics in Chrome:
 * 'v8,blink.console,disabled-by-default-devtools.timeline,devtools.timeline,blink.user_timing'
 *
 * In order to collect the frame rate related metrics, add 'benchmark'
 * to the list above.
 */
let ChromeDriverExtension = ChromeDriverExtension_1 = class ChromeDriverExtension extends web_driver_extension_1.WebDriverExtension {
    constructor(_driver, userAgent) {
        super();
        this._driver = _driver;
        this._firstRun = true;
        this._majorChromeVersion = this._parseChromeVersion(userAgent);
    }
    _parseChromeVersion(userAgent) {
        if (!userAgent) {
            return -1;
        }
        let v = userAgent.split(/Chrom(e|ium)\//g)[2];
        if (!v) {
            return -1;
        }
        v = v.split('.')[0];
        if (!v) {
            return -1;
        }
        return parseInt(v, 10);
    }
    gc() { return this._driver.executeScript('window.gc()'); }
    timeBegin(name) {
        if (this._firstRun) {
            this._firstRun = false;
            // Before the first run, read out the existing performance logs
            // so that the chrome buffer does not fill up.
            this._driver.logs('performance');
        }
        return this._driver.executeScript(`console.time('${name}');`);
    }
    timeEnd(name, restartName = null) {
        let script = `console.timeEnd('${name}');`;
        if (restartName) {
            script += `console.time('${restartName}');`;
        }
        return this._driver.executeScript(script);
    }
    // See [Chrome Trace Event
    // Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)
    readPerfLog() {
        // TODO(tbosch): Chromedriver bug https://code.google.com/p/chromedriver/issues/detail?id=1098
        // Need to execute at least one command so that the browser logs can be read out!
        return this._driver.executeScript('1+1')
            .then((_) => this._driver.logs('performance'))
            .then((entries) => {
            const events = [];
            entries.forEach((entry) => {
                const message = JSON.parse(entry['message'])['message'];
                if (message['method'] === 'Tracing.dataCollected') {
                    events.push(message['params']);
                }
                if (message['method'] === 'Tracing.bufferUsage') {
                    throw new Error('The DevTools trace buffer filled during the test!');
                }
            });
            return this._convertPerfRecordsToEvents(events);
        });
    }
    _convertPerfRecordsToEvents(chromeEvents, normalizedEvents = null) {
        if (!normalizedEvents) {
            normalizedEvents = [];
        }
        chromeEvents.forEach((event) => {
            const categories = this._parseCategories(event['cat']);
            const normalizedEvent = this._convertEvent(event, categories);
            if (normalizedEvent != null)
                normalizedEvents.push(normalizedEvent);
        });
        return normalizedEvents;
    }
    _convertEvent(event, categories) {
        const name = event['name'];
        const args = event['args'];
        if (this._isEvent(categories, name, ['blink.console'])) {
            return normalizeEvent(event, { 'name': name });
        }
        else if (this._isEvent(categories, name, ['benchmark'], 'BenchmarkInstrumentation::ImplThreadRenderingStats')) {
            // TODO(goderbauer): Instead of BenchmarkInstrumentation::ImplThreadRenderingStats the
            // following events should be used (if available) for more accurate measurements:
            //   1st choice: vsync_before - ground truth on Android
            //   2nd choice: BenchmarkInstrumentation::DisplayRenderingStats - available on systems with
            //               new surfaces framework (not broadly enabled yet)
            //   3rd choice: BenchmarkInstrumentation::ImplThreadRenderingStats - fallback event that is
            //               always available if something is rendered
            const frameCount = event['args']['data']['frame_count'];
            if (frameCount > 1) {
                throw new Error('multi-frame render stats not supported');
            }
            if (frameCount == 1) {
                return normalizeEvent(event, { 'name': 'frame' });
            }
        }
        else if (this._isEvent(categories, name, ['disabled-by-default-devtools.timeline'], 'Rasterize') ||
            this._isEvent(categories, name, ['disabled-by-default-devtools.timeline'], 'CompositeLayers')) {
            return normalizeEvent(event, { 'name': 'render' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline', 'v8'], 'MajorGC')) {
            const normArgs = {
                'majorGc': true,
                'usedHeapSize': args['usedHeapSizeAfter'] !== undefined ? args['usedHeapSizeAfter'] :
                    args['usedHeapSizeBefore']
            };
            return normalizeEvent(event, { 'name': 'gc', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline', 'v8'], 'MinorGC')) {
            const normArgs = {
                'majorGc': false,
                'usedHeapSize': args['usedHeapSizeAfter'] !== undefined ? args['usedHeapSizeAfter'] :
                    args['usedHeapSizeBefore']
            };
            return normalizeEvent(event, { 'name': 'gc', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'FunctionCall') &&
            (!args || !args['data'] ||
                (args['data']['scriptName'] !== 'InjectedScript' && args['data']['scriptName'] !== ''))) {
            return normalizeEvent(event, { 'name': 'script' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'EvaluateScript')) {
            return normalizeEvent(event, { 'name': 'script' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline', 'blink'], 'UpdateLayoutTree')) {
            return normalizeEvent(event, { 'name': 'render' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'UpdateLayerTree') ||
            this._isEvent(categories, name, ['devtools.timeline'], 'Layout') ||
            this._isEvent(categories, name, ['devtools.timeline'], 'Paint')) {
            return normalizeEvent(event, { 'name': 'render' });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'ResourceReceivedData')) {
            const normArgs = { 'encodedDataLength': args['data']['encodedDataLength'] };
            return normalizeEvent(event, { 'name': 'receivedData', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['devtools.timeline'], 'ResourceSendRequest')) {
            const data = args['data'];
            const normArgs = { 'url': data['url'], 'method': data['requestMethod'] };
            return normalizeEvent(event, { 'name': 'sendRequest', 'args': normArgs });
        }
        else if (this._isEvent(categories, name, ['blink.user_timing'], 'navigationStart')) {
            return normalizeEvent(event, { 'name': 'navigationStart' });
        }
        return null; // nothing useful in this event
    }
    _parseCategories(categories) { return categories.split(','); }
    _isEvent(eventCategories, eventName, expectedCategories, expectedName = null) {
        const hasCategories = expectedCategories.reduce((value, cat) => value && eventCategories.indexOf(cat) !== -1, true);
        return !expectedName ? hasCategories : hasCategories && eventName === expectedName;
    }
    perfLogFeatures() {
        return new web_driver_extension_1.PerfLogFeatures({ render: true, gc: true, frameCapture: true, userTiming: true });
    }
    supports(capabilities) {
        return this._majorChromeVersion >= 44 && capabilities['browserName'].toLowerCase() === 'chrome';
    }
};
ChromeDriverExtension.PROVIDERS = [{
        provide: ChromeDriverExtension_1,
        deps: [web_driver_adapter_1.WebDriverAdapter, common_options_1.Options.USER_AGENT]
    }];
ChromeDriverExtension = ChromeDriverExtension_1 = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__param(1, core_1.Inject(common_options_1.Options.USER_AGENT)),
    tslib_1.__metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter, String])
], ChromeDriverExtension);
exports.ChromeDriverExtension = ChromeDriverExtension;
function normalizeEvent(chromeEvent, data) {
    let ph = chromeEvent['ph'].toUpperCase();
    if (ph === 'S') {
        ph = 'B';
    }
    else if (ph === 'F') {
        ph = 'E';
    }
    else if (ph === 'R') {
        // mark events from navigation timing
        ph = 'I';
    }
    const result = { 'pid': chromeEvent['pid'], 'ph': ph, 'cat': 'timeline', 'ts': chromeEvent['ts'] / 1000 };
    if (ph === 'X') {
        let dur = chromeEvent['dur'];
        if (dur === undefined) {
            dur = chromeEvent['tdur'];
        }
        result['dur'] = !dur ? 0.0 : dur / 1000;
    }
    for (const prop in data) {
        result[prop] = data[prop];
    }
    return result;
}
var ChromeDriverExtension_1;
//# sourceMappingURL=chrome_driver_extension.js.map