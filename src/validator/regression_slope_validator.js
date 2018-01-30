"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const statistic_1 = require("../statistic");
const validator_1 = require("../validator");
/**
 * A validator that checks the regression slope of a specific metric.
 * Waits for the regression slope to be >=0.
 */
let RegressionSlopeValidator = RegressionSlopeValidator_1 = class RegressionSlopeValidator extends validator_1.Validator {
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
};
RegressionSlopeValidator.SAMPLE_SIZE = new core_1.InjectionToken('RegressionSlopeValidator.sampleSize');
RegressionSlopeValidator.METRIC = new core_1.InjectionToken('RegressionSlopeValidator.metric');
RegressionSlopeValidator.PROVIDERS = [
    {
        provide: RegressionSlopeValidator_1,
        deps: [RegressionSlopeValidator_1.SAMPLE_SIZE, RegressionSlopeValidator_1.METRIC]
    },
    { provide: RegressionSlopeValidator_1.SAMPLE_SIZE, useValue: 10 },
    { provide: RegressionSlopeValidator_1.METRIC, useValue: 'scriptTime' }
];
RegressionSlopeValidator = RegressionSlopeValidator_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(RegressionSlopeValidator_1.SAMPLE_SIZE)),
    __param(1, core_1.Inject(RegressionSlopeValidator_1.METRIC)),
    __metadata("design:paramtypes", [Number, String])
], RegressionSlopeValidator);
exports.RegressionSlopeValidator = RegressionSlopeValidator;
var RegressionSlopeValidator_1;
//# sourceMappingURL=regression_slope_validator.js.map