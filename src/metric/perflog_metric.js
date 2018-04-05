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
const metric_1 = require("../metric");
const web_driver_extension_1 = require("../web_driver_extension");
/**
 * A metric that reads out the performance log
 */
let PerflogMetric = PerflogMetric_1 = class PerflogMetric extends metric_1.Metric {
    /**
     * @param driverExtension
     * @param setTimeout
     * @param microMetrics Name and description of metrics provided via console.time / console.timeEnd
     * @param ignoreNavigation If true, don't measure from navigationStart events. These events are
     *   usually triggered by a page load, but can also be triggered when adding iframes to the DOM.
     **/
    constructor(_driverExtension, _setTimeout, _microMetrics, _forceGc, _captureFrames, _receivedData, _requestCount, _ignoreNavigation) {
        super();
        this._driverExtension = _driverExtension;
        this._setTimeout = _setTimeout;
        this._microMetrics = _microMetrics;
        this._forceGc = _forceGc;
        this._captureFrames = _captureFrames;
        this._receivedData = _receivedData;
        this._requestCount = _requestCount;
        this._ignoreNavigation = _ignoreNavigation;
        this._remainingEvents = [];
        this._measureCount = 0;
        this._perfLogFeatures = _driverExtension.perfLogFeatures();
        if (!this._perfLogFeatures.userTiming) {
            // User timing is needed for navigationStart.
            this._receivedData = false;
            this._requestCount = false;
        }
    }
    describe() {
        const res = {
            'scriptTime': 'script execution time in ms, including gc and render',
            'pureScriptTime': 'script execution time in ms, without gc nor render'
        };
        if (this._perfLogFeatures.render) {
            res['renderTime'] = 'render time in ms';
        }
        if (this._perfLogFeatures.gc) {
            res['gcTime'] = 'gc time in ms';
            res['gcAmount'] = 'gc amount in kbytes';
            res['majorGcTime'] = 'time of major gcs in ms';
            if (this._forceGc) {
                res['forcedGcTime'] = 'forced gc time in ms';
                res['forcedGcAmount'] = 'forced gc amount in kbytes';
            }
        }
        if (this._receivedData) {
            res['receivedData'] = 'encoded bytes received since navigationStart';
        }
        if (this._requestCount) {
            res['requestCount'] = 'count of requests sent since navigationStart';
        }
        if (this._captureFrames) {
            if (!this._perfLogFeatures.frameCapture) {
                const warningMsg = 'WARNING: Metric requested, but not supported by driver';
                // using dot syntax for metric name to keep them grouped together in console reporter
                res['frameTime.mean'] = warningMsg;
                res['frameTime.worst'] = warningMsg;
                res['frameTime.best'] = warningMsg;
                res['frameTime.smooth'] = warningMsg;
            }
            else {
                res['frameTime.mean'] = 'mean frame time in ms (target: 16.6ms for 60fps)';
                res['frameTime.worst'] = 'worst frame time in ms';
                res['frameTime.best'] = 'best frame time in ms';
                res['frameTime.smooth'] = 'percentage of frames that hit 60fps';
            }
        }
        for (const name in this._microMetrics) {
            res[name] = this._microMetrics[name];
        }
        return res;
    }
    beginMeasure() {
        let resultPromise = Promise.resolve(null);
        if (this._forceGc) {
            resultPromise = resultPromise.then((_) => this._driverExtension.gc());
        }
        return resultPromise.then((_) => this._beginMeasure());
    }
    endMeasure(restart) {
        if (this._forceGc) {
            return this._endPlainMeasureAndMeasureForceGc(restart);
        }
        else {
            return this._endMeasure(restart);
        }
    }
    /** @internal */
    _endPlainMeasureAndMeasureForceGc(restartMeasure) {
        return this._endMeasure(true).then((measureValues) => {
            // disable frame capture for measurements during forced gc
            const originalFrameCaptureValue = this._captureFrames;
            this._captureFrames = false;
            return this._driverExtension.gc()
                .then((_) => this._endMeasure(restartMeasure))
                .then((forceGcMeasureValues) => {
                this._captureFrames = originalFrameCaptureValue;
                measureValues['forcedGcTime'] = forceGcMeasureValues['gcTime'];
                measureValues['forcedGcAmount'] = forceGcMeasureValues['gcAmount'];
                return measureValues;
            });
        });
    }
    _beginMeasure() {
        return this._driverExtension.timeBegin(this._markName(this._measureCount++));
    }
    _endMeasure(restart) {
        const markName = this._markName(this._measureCount - 1);
        const nextMarkName = restart ? this._markName(this._measureCount++) : null;
        return this._driverExtension.timeEnd(markName, nextMarkName)
            .then((_) => this._readUntilEndMark(markName));
    }
    _readUntilEndMark(markName, loopCount = 0, startEvent = null) {
        if (loopCount > _MAX_RETRY_COUNT) {
            throw new Error(`Tried too often to get the ending mark: ${loopCount}`);
        }
        return this._driverExtension.readPerfLog().then((events) => {
            this._addEvents(events);
            const result = this._aggregateEvents(this._remainingEvents, markName);
            if (result) {
                this._remainingEvents = events;
                return result;
            }
            let resolve;
            const promise = new Promise(res => { resolve = res; });
            this._setTimeout(() => resolve(this._readUntilEndMark(markName, loopCount + 1)), 100);
            return promise;
        });
    }
    _addEvents(events) {
        let needSort = false;
        events.forEach(event => {
            if (event['ph'] === 'X') {
                needSort = true;
                const startEvent = {};
                const endEvent = {};
                for (const prop in event) {
                    startEvent[prop] = event[prop];
                    endEvent[prop] = event[prop];
                }
                startEvent['ph'] = 'B';
                endEvent['ph'] = 'E';
                endEvent['ts'] = startEvent['ts'] + startEvent['dur'];
                this._remainingEvents.push(startEvent);
                this._remainingEvents.push(endEvent);
            }
            else {
                this._remainingEvents.push(event);
            }
        });
        if (needSort) {
            // Need to sort because of the ph==='X' events
            this._remainingEvents.sort((a, b) => {
                const diff = a['ts'] - b['ts'];
                return diff > 0 ? 1 : diff < 0 ? -1 : 0;
            });
        }
    }
    _aggregateEvents(events, markName) {
        const result = { 'scriptTime': 0, 'pureScriptTime': 0 };
        if (this._perfLogFeatures.gc) {
            result['gcTime'] = 0;
            result['majorGcTime'] = 0;
            result['gcAmount'] = 0;
        }
        if (this._perfLogFeatures.render) {
            result['renderTime'] = 0;
        }
        if (this._captureFrames) {
            result['frameTime.mean'] = 0;
            result['frameTime.best'] = 0;
            result['frameTime.worst'] = 0;
            result['frameTime.smooth'] = 0;
        }
        for (const name in this._microMetrics) {
            result[name] = 0;
        }
        if (this._receivedData) {
            result['receivedData'] = 0;
        }
        if (this._requestCount) {
            result['requestCount'] = 0;
        }
        let markStartEvent = null;
        let markEndEvent = null;
        events.forEach((event) => {
            const ph = event['ph'];
            const name = event['name'];
            if (ph === 'B' && name === markName) {
                markStartEvent = event;
            }
            else if (ph === 'I' && name === 'navigationStart' && !this._ignoreNavigation) {
                // if a benchmark measures reload of a page, use the last
                // navigationStart as begin event
                markStartEvent = event;
            }
            else if (ph === 'E' && name === markName) {
                markEndEvent = event;
            }
        });
        if (!markStartEvent || !markEndEvent) {
            // not all events have been received, no further processing for now
            return null;
        }
        if (markStartEvent.pid !== markEndEvent.pid) {
            result['invalid'] = 1;
        }
        let gcTimeInScript = 0;
        let renderTimeInScript = 0;
        const frameTimestamps = [];
        const frameTimes = [];
        let frameCaptureStartEvent = null;
        let frameCaptureEndEvent = null;
        const intervalStarts = {};
        const intervalStartCount = {};
        let inMeasureRange = false;
        events.forEach((event) => {
            const ph = event['ph'];
            let name = event['name'];
            let microIterations = 1;
            const microIterationsMatch = name.match(_MICRO_ITERATIONS_REGEX);
            if (microIterationsMatch) {
                name = microIterationsMatch[1];
                microIterations = parseInt(microIterationsMatch[2], 10);
            }
            if (event === markStartEvent) {
                inMeasureRange = true;
            }
            else if (event === markEndEvent) {
                inMeasureRange = false;
            }
            if (!inMeasureRange || event['pid'] !== markStartEvent['pid']) {
                return;
            }
            if (this._requestCount && name === 'sendRequest') {
                result['requestCount'] += 1;
            }
            else if (this._receivedData && name === 'receivedData' && ph === 'I') {
                result['receivedData'] += event['args']['encodedDataLength'];
            }
            if (ph === 'B' && name === _MARK_NAME_FRAME_CAPTURE) {
                if (frameCaptureStartEvent) {
                    throw new Error('can capture frames only once per benchmark run');
                }
                if (!this._captureFrames) {
                    throw new Error('found start event for frame capture, but frame capture was not requested in benchpress');
                }
                frameCaptureStartEvent = event;
            }
            else if (ph === 'E' && name === _MARK_NAME_FRAME_CAPTURE) {
                if (!frameCaptureStartEvent) {
                    throw new Error('missing start event for frame capture');
                }
                frameCaptureEndEvent = event;
            }
            if (ph === 'I' && frameCaptureStartEvent && !frameCaptureEndEvent && name === 'frame') {
                frameTimestamps.push(event['ts']);
                if (frameTimestamps.length >= 2) {
                    frameTimes.push(frameTimestamps[frameTimestamps.length - 1] -
                        frameTimestamps[frameTimestamps.length - 2]);
                }
            }
            if (ph === 'B') {
                if (!intervalStarts[name]) {
                    intervalStartCount[name] = 1;
                    intervalStarts[name] = event;
                }
                else {
                    intervalStartCount[name]++;
                }
            }
            else if ((ph === 'E') && intervalStarts[name]) {
                intervalStartCount[name]--;
                if (intervalStartCount[name] === 0) {
                    const startEvent = intervalStarts[name];
                    const duration = (event['ts'] - startEvent['ts']);
                    intervalStarts[name] = null;
                    if (name === 'gc') {
                        result['gcTime'] += duration;
                        const amount = (startEvent['args']['usedHeapSize'] - event['args']['usedHeapSize']) / 1000;
                        result['gcAmount'] += amount;
                        const majorGc = event['args']['majorGc'];
                        if (majorGc && majorGc) {
                            result['majorGcTime'] += duration;
                        }
                        if (intervalStarts['script']) {
                            gcTimeInScript += duration;
                        }
                    }
                    else if (name === 'render') {
                        result['renderTime'] += duration;
                        if (intervalStarts['script']) {
                            renderTimeInScript += duration;
                        }
                    }
                    else if (name === 'script') {
                        result['scriptTime'] += duration;
                    }
                    else if (this._microMetrics[name]) {
                        result[name] += duration / microIterations;
                    }
                }
            }
        });
        if (frameCaptureStartEvent && !frameCaptureEndEvent) {
            throw new Error('missing end event for frame capture');
        }
        if (this._captureFrames && !frameCaptureStartEvent) {
            throw new Error('frame capture requested in benchpress, but no start event was found');
        }
        if (frameTimes.length > 0) {
            this._addFrameMetrics(result, frameTimes);
        }
        result['pureScriptTime'] = result['scriptTime'] - gcTimeInScript - renderTimeInScript;
        return result;
    }
    _addFrameMetrics(result, frameTimes) {
        result['frameTime.mean'] = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const firstFrame = frameTimes[0];
        result['frameTime.worst'] = frameTimes.reduce((a, b) => a > b ? a : b, firstFrame);
        result['frameTime.best'] = frameTimes.reduce((a, b) => a < b ? a : b, firstFrame);
        result['frameTime.smooth'] =
            frameTimes.filter(t => t < _FRAME_TIME_SMOOTH_THRESHOLD).length / frameTimes.length;
    }
    _markName(index) { return `${_MARK_NAME_PREFIX}${index}`; }
};
PerflogMetric.SET_TIMEOUT = new core_1.InjectionToken('PerflogMetric.setTimeout');
PerflogMetric.IGNORE_NAVIGATION = new core_1.InjectionToken('PerflogMetric.ignoreNavigation');
PerflogMetric.PROVIDERS = [
    {
        provide: PerflogMetric_1,
        deps: [
            web_driver_extension_1.WebDriverExtension, PerflogMetric_1.SET_TIMEOUT, common_options_1.Options.MICRO_METRICS, common_options_1.Options.FORCE_GC,
            common_options_1.Options.CAPTURE_FRAMES, common_options_1.Options.RECEIVED_DATA, common_options_1.Options.REQUEST_COUNT,
            PerflogMetric_1.IGNORE_NAVIGATION
        ]
    },
    {
        provide: PerflogMetric_1.SET_TIMEOUT,
        useValue: (fn, millis) => setTimeout(fn, millis)
    },
    { provide: PerflogMetric_1.IGNORE_NAVIGATION, useValue: false }
];
PerflogMetric = PerflogMetric_1 = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__param(1, core_1.Inject(PerflogMetric_1.SET_TIMEOUT)),
    tslib_1.__param(2, core_1.Inject(common_options_1.Options.MICRO_METRICS)),
    tslib_1.__param(3, core_1.Inject(common_options_1.Options.FORCE_GC)),
    tslib_1.__param(4, core_1.Inject(common_options_1.Options.CAPTURE_FRAMES)),
    tslib_1.__param(5, core_1.Inject(common_options_1.Options.RECEIVED_DATA)),
    tslib_1.__param(6, core_1.Inject(common_options_1.Options.REQUEST_COUNT)),
    tslib_1.__param(7, core_1.Inject(PerflogMetric_1.IGNORE_NAVIGATION)),
    tslib_1.__metadata("design:paramtypes", [web_driver_extension_1.WebDriverExtension,
        Function, Object, Boolean, Boolean, Boolean, Boolean, Boolean])
], PerflogMetric);
exports.PerflogMetric = PerflogMetric;
const _MICRO_ITERATIONS_REGEX = /(.+)\*(\d+)$/;
const _MAX_RETRY_COUNT = 20;
const _MARK_NAME_PREFIX = 'benchpress';
const _MARK_NAME_FRAME_CAPTURE = 'frameCapture';
// using 17ms as a somewhat looser threshold, instead of 16.6666ms
const _FRAME_TIME_SMOOTH_THRESHOLD = 17;
var PerflogMetric_1;
//# sourceMappingURL=perflog_metric.js.map