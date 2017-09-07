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
 * A metric is measures values
 */
class Metric {
    /**
     * Starts measuring
     */
    beginMeasure() { throw new Error('NYI'); }
    /**
     * Ends measuring and reports the data
     * since the begin call.
     * @param restart: Whether to restart right after this.
     */
    endMeasure(restart) { throw new Error('NYI'); }
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    describe() { throw new Error('NYI'); }
}
exports.Metric = Metric;
//# sourceMappingURL=metric.js.map