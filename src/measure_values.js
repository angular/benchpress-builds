"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
class MeasureValues {
    constructor(runIndex, timeStamp, values) {
        this.runIndex = runIndex;
        this.timeStamp = timeStamp;
        this.values = values;
    }
    toJson() {
        return {
            'timeStamp': this.timeStamp.toJSON(),
            'runIndex': this.runIndex,
            'values': this.values,
        };
    }
}
exports.MeasureValues = MeasureValues;
//# sourceMappingURL=measure_values.js.map