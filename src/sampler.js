/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
const core_1 = require('@angular/core');
const common_options_1 = require('./common_options');
const lang_1 = require('./facade/lang');
const measure_values_1 = require('./measure_values');
const metric_1 = require('./metric');
const reporter_1 = require('./reporter');
const validator_1 = require('./validator');
const web_driver_adapter_1 = require('./web_driver_adapter');
/**
 * The Sampler owns the sample loop:
 * 1. calls the prepare/execute callbacks,
 * 2. gets data from the metric
 * 3. asks the validator for a valid sample
 * 4. reports the new data to the reporter
 * 5. loop until there is a valid sample
 */
class Sampler {
    constructor(_driver, _metric, _reporter, _validator, _prepare, _execute, _now) {
        this._driver = _driver;
        this._metric = _metric;
        this._reporter = _reporter;
        this._validator = _validator;
        this._prepare = _prepare;
        this._execute = _execute;
        this._now = _now;
    }
    sample() {
        const loop = (lastState) => {
            return this._iterate(lastState).then((newState) => {
                if (lang_1.isPresent(newState.validSample)) {
                    return newState;
                }
                else {
                    return loop(newState);
                }
            });
        };
        return loop(new SampleState([], null));
    }
    _iterate(lastState) {
        let resultPromise;
        if (this._prepare !== common_options_1.Options.NO_PREPARE) {
            resultPromise = this._driver.waitFor(this._prepare);
        }
        else {
            resultPromise = Promise.resolve(null);
        }
        if (this._prepare !== common_options_1.Options.NO_PREPARE || lastState.completeSample.length === 0) {
            resultPromise = resultPromise.then((_) => this._metric.beginMeasure());
        }
        return resultPromise.then((_) => this._driver.waitFor(this._execute))
            .then((_) => this._metric.endMeasure(this._prepare === common_options_1.Options.NO_PREPARE))
            .then((measureValues) => this._report(lastState, measureValues));
    }
    _report(state, metricValues) {
        const measureValues = new measure_values_1.MeasureValues(state.completeSample.length, this._now(), metricValues);
        const completeSample = state.completeSample.concat([measureValues]);
        const validSample = this._validator.validate(completeSample);
        let resultPromise = this._reporter.reportMeasureValues(measureValues);
        if (lang_1.isPresent(validSample)) {
            resultPromise =
                resultPromise.then((_) => this._reporter.reportSample(completeSample, validSample));
        }
        return resultPromise.then((_) => new SampleState(completeSample, validSample));
    }
}
Sampler.PROVIDERS = [Sampler];
Sampler.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
Sampler.ctorParameters = () => [
    { type: web_driver_adapter_1.WebDriverAdapter, },
    { type: metric_1.Metric, },
    { type: reporter_1.Reporter, },
    { type: validator_1.Validator, },
    { type: Function, decorators: [{ type: core_1.Inject, args: [common_options_1.Options.PREPARE,] },] },
    { type: Function, decorators: [{ type: core_1.Inject, args: [common_options_1.Options.EXECUTE,] },] },
    { type: Function, decorators: [{ type: core_1.Inject, args: [common_options_1.Options.NOW,] },] },
];
exports.Sampler = Sampler;
class SampleState {
    constructor(completeSample, validSample) {
        this.completeSample = completeSample;
        this.validSample = validSample;
    }
}
exports.SampleState = SampleState;
//# sourceMappingURL=sampler.js.map