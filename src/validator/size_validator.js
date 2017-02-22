/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
const core_1 = require("@angular/core");
const validator_1 = require("../validator");
/**
 * A validator that waits for the sample to have a certain size.
 */
class SizeValidator extends validator_1.Validator {
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
}
SizeValidator.SAMPLE_SIZE = new core_1.InjectionToken('SizeValidator.sampleSize');
SizeValidator.PROVIDERS = [SizeValidator, { provide: SizeValidator.SAMPLE_SIZE, useValue: 10 }];
SizeValidator.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
SizeValidator.ctorParameters = () => [
    { type: undefined, decorators: [{ type: core_1.Inject, args: [SizeValidator.SAMPLE_SIZE,] },] },
];
exports.SizeValidator = SizeValidator;
//# sourceMappingURL=size_validator.js.map