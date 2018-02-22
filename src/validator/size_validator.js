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
SizeValidator = SizeValidator_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(SizeValidator_1.SAMPLE_SIZE)),
    __metadata("design:paramtypes", [Number])
], SizeValidator);
exports.SizeValidator = SizeValidator;
var SizeValidator_1;
//# sourceMappingURL=size_validator.js.map