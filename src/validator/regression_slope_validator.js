/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
const core_1 = require('@angular/core');
const statistic_1 = require('../statistic');
const validator_1 = require('../validator');
/**
 * A validator that checks the regression slope of a specific metric.
 * Waits for the regression slope to be >=0.
 */
class RegressionSlopeValidator extends validator_1.Validator {
    constructor(_sampleSize, _metric) {
        super();
        this._sampleSize = _sampleSize;
        this._metric = _metric;
    }
    describe() {
        return { 'sampleSize': this._sampleSize, 'regressionSlopeMetric': this._metric };
    }
    validate(completeSample) {
        if (completeSample.length >= this._sampleSize) {
            const latestSample = completeSample.slice(completeSample.length - this._sampleSize, completeSample.length);
            const xValues = [];
            const yValues = [];
            for (let i = 0; i < latestSample.length; i++) {
                // For now, we only use the array index as x value.
                // TODO(tbosch): think about whether we should use time here instead
                xValues.push(i);
                yValues.push(latestSample[i].values[this._metric]);
            }
            const regressionSlope = statistic_1.Statistic.calculateRegressionSlope(xValues, statistic_1.Statistic.calculateMean(xValues), yValues, statistic_1.Statistic.calculateMean(yValues));
            return regressionSlope >= 0 ? latestSample : null;
        }
        else {
            return null;
        }
    }
}
RegressionSlopeValidator.SAMPLE_SIZE = new core_1.InjectionToken('RegressionSlopeValidator.sampleSize');
RegressionSlopeValidator.METRIC = new core_1.InjectionToken('RegressionSlopeValidator.metric');
RegressionSlopeValidator.PROVIDERS = [
    RegressionSlopeValidator, { provide: RegressionSlopeValidator.SAMPLE_SIZE, useValue: 10 },
    { provide: RegressionSlopeValidator.METRIC, useValue: 'scriptTime' }
];
RegressionSlopeValidator.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
RegressionSlopeValidator.ctorParameters = () => [
    { type: undefined, decorators: [{ type: core_1.Inject, args: [RegressionSlopeValidator.SAMPLE_SIZE,] },] },
    { type: undefined, decorators: [{ type: core_1.Inject, args: [RegressionSlopeValidator.METRIC,] },] },
];
exports.RegressionSlopeValidator = RegressionSlopeValidator;
//# sourceMappingURL=regression_slope_validator.js.map