"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A Validator calculates a valid sample out of the complete sample.
 * A valid sample is a sample that represents the population that should be observed
 * in the correct way.
 */
class Validator {
    /**
     * Calculates a valid sample out of the complete sample
     */
    validate(completeSample) { throw new Error('NYI'); }
    /**
     * Returns a Map that describes the properties of the validator
     * (e.g. sample size, ...)
     */
    describe() { throw new Error('NYI'); }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map