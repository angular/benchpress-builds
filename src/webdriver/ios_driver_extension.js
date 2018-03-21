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
const web_driver_adapter_1 = require("../web_driver_adapter");
const web_driver_extension_1 = require("../web_driver_extension");
let IOsDriverExtension = IOsDriverExtension_1 = class IOsDriverExtension extends web_driver_extension_1.WebDriverExtension {
    constructor(_driver) {
        super();
        this._driver = _driver;
    }
    gc() { throw new Error('Force GC is not supported on iOS'); }
    timeBegin(name) {
        return this._driver.executeScript(`console.time('${name}');`);
    }
    timeEnd(name, restartName = null) {
        let script = `console.timeEnd('${name}');`;
        if (restartName != null) {
            script += `console.time('${restartName}');`;
        }
        return this._driver.executeScript(script);
    }
    // See https://github.com/WebKit/webkit/tree/master/Source/WebInspectorUI/Versions
    readPerfLog() {
        // TODO(tbosch): Bug in IOsDriver: Need to execute at least one command
        // so that the browser logs can be read out!
        return this._driver.executeScript('1+1')
            .then((_) => this._driver.logs('performance'))
            .then((entries) => {
            const records = [];
            entries.forEach((entry) => {
                const message = JSON.parse(entry['message'])['message'];
                if (message['method'] === 'Timeline.eventRecorded') {
                    records.push(message['params']['record']);
                }
            });
            return this._convertPerfRecordsToEvents(records);
        });
    }
    /** @internal */
    _convertPerfRecordsToEvents(records, events = null) {
        if (!events) {
            events = [];
        }
        records.forEach((record) => {
            let endEvent = null;
            const type = record['type'];
            const data = record['data'];
            const startTime = record['startTime'];
            const endTime = record['endTime'];
            if (type === 'FunctionCall' && (data == null || data['scriptName'] !== 'InjectedScript')) {
                events.push(createStartEvent('script', startTime));
                endEvent = createEndEvent('script', endTime);
            }
            else if (type === 'Time') {
                events.push(createMarkStartEvent(data['message'], startTime));
            }
            else if (type === 'TimeEnd') {
                events.push(createMarkEndEvent(data['message'], startTime));
            }
            else if (type === 'RecalculateStyles' || type === 'Layout' || type === 'UpdateLayerTree' ||
                type === 'Paint' || type === 'Rasterize' || type === 'CompositeLayers') {
                events.push(createStartEvent('render', startTime));
                endEvent = createEndEvent('render', endTime);
            }
            // Note: ios used to support GCEvent up until iOS 6 :-(
            if (record['children'] != null) {
                this._convertPerfRecordsToEvents(record['children'], events);
            }
            if (endEvent != null) {
                events.push(endEvent);
            }
        });
        return events;
    }
    perfLogFeatures() { return new web_driver_extension_1.PerfLogFeatures({ render: true }); }
    supports(capabilities) {
        return capabilities['browserName'].toLowerCase() === 'safari';
    }
};
IOsDriverExtension.PROVIDERS = [{ provide: IOsDriverExtension_1, deps: [web_driver_adapter_1.WebDriverAdapter] }];
IOsDriverExtension = IOsDriverExtension_1 = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter])
], IOsDriverExtension);
exports.IOsDriverExtension = IOsDriverExtension;
function createEvent(ph, name, time, args = null) {
    const result = {
        'cat': 'timeline',
        'name': name,
        'ts': time,
        'ph': ph,
        // The ios protocol does not support the notions of multiple processes in
        // the perflog...
        'pid': 'pid0'
    };
    if (args != null) {
        result['args'] = args;
    }
    return result;
}
function createStartEvent(name, time, args = null) {
    return createEvent('B', name, time, args);
}
function createEndEvent(name, time, args = null) {
    return createEvent('E', name, time, args);
}
function createMarkStartEvent(name, time) {
    return createEvent('B', name, time);
}
function createMarkEndEvent(name, time) {
    return createEvent('E', name, time);
}
var IOsDriverExtension_1;
//# sourceMappingURL=ios_driver_extension.js.map