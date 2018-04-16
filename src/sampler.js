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
const common_options_1 = require("./common_options");
const measure_values_1 = require("./measure_values");
const metric_1 = require("./metric");
const reporter_1 = require("./reporter");
const validator_1 = require("./validator");
const web_driver_adapter_1 = require("./web_driver_adapter");
/**
 * The Sampler owns the sample loop:
 * 1. calls the prepare/execute callbacks,
 * 2. gets data from the metric
 * 3. asks the validator for a valid sample
 * 4. reports the new data to the reporter
 * 5. loop until there is a valid sample
 */
let Sampler = Sampler_1 = class Sampler {
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
                if (newState.validSample != null) {
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
            .then((measureValues) => {
            if (!!measureValues['invalid']) {
                return lastState;
            }
            return this._report(lastState, measureValues);
        });
    }
    _report(state, metricValues) {
        const measureValues = new measure_values_1.MeasureValues(state.completeSample.length, this._now(), metricValues);
        const completeSample = state.completeSample.concat([measureValues]);
        const validSample = this._validator.validate(completeSample);
        let resultPromise = this._reporter.reportMeasureValues(measureValues);
        if (validSample != null) {
            resultPromise =
                resultPromise.then((_) => this._reporter.reportSample(completeSample, validSample));
        }
        return resultPromise.then((_) => new SampleState(completeSample, validSample));
    }
};
Sampler.PROVIDERS = [{
        provide: Sampler_1,
        deps: [
            web_driver_adapter_1.WebDriverAdapter, metric_1.Metric, reporter_1.Reporter, validator_1.Validator, common_options_1.Options.PREPARE, common_options_1.Options.EXECUTE, common_options_1.Options.NOW
        ]
    }];
Sampler = Sampler_1 = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__param(4, core_1.Inject(common_options_1.Options.PREPARE)),
    tslib_1.__param(5, core_1.Inject(common_options_1.Options.EXECUTE)),
    tslib_1.__param(6, core_1.Inject(common_options_1.Options.NOW)),
    tslib_1.__metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter, metric_1.Metric, reporter_1.Reporter,
        validator_1.Validator, Function,
        Function,
        Function])
], Sampler);
exports.Sampler = Sampler;
class SampleState {
    constructor(completeSample, validSample) {
        this.completeSample = completeSample;
        this.validSample = validSample;
    }
}
exports.SampleState = SampleState;
var Sampler_1;
//# sourceMappingURL=sampler.js.map