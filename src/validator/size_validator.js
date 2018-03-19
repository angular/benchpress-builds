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
const validator_1 = require("../validator");
/**
 * A validator that waits for the sample to have a certain size.
 */
let SizeValidator = SizeValidator_1 = class SizeValidator extends validator_1.Validator {
    constructor(_sampleSize) {
        super();
        this._sampleSize = _sampleSize;
    }
    describe() { return { 'sampleSize': this._sampleSize }; }
    validate(completeSample) {
        if (completeSample.length >= this._sampleSize) {
            return completeSample.slice(completeSample.length - this._sampleSize, completeSample.length);
        }
        else {
            return null;
        }
    }
};
SizeValidator.SAMPLE_SIZE = new core_1.InjectionToken('SizeValidator.sampleSize');
SizeValidator.PROVIDERS = [
    { provide: SizeValidator_1, deps: [SizeValidator_1.SAMPLE_SIZE] },
    { provide: SizeValidator_1.SAMPLE_SIZE, useValue: 10 }
];
SizeValidator = SizeValidator_1 = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__param(0, core_1.Inject(SizeValidator_1.SAMPLE_SIZE)),
    tslib_1.__metadata("design:paramtypes", [Number])
], SizeValidator);
exports.SizeValidator = SizeValidator;
var SizeValidator_1;
//# sourceMappingURL=size_validator.js.map