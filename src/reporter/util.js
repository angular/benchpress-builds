"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const statistic_1 = require("../statistic");
function formatNum(n) {
    return n.toFixed(2);
}
exports.formatNum = formatNum;
function sortedProps(obj) {
    return Object.keys(obj).sort();
}
exports.sortedProps = sortedProps;
function formatStats(validSamples, metricName) {
    const samples = validSamples.map(measureValues => measureValues.values[metricName]);
    const mean = statistic_1.Statistic.calculateMean(samples);
    const cv = statistic_1.Statistic.calculateCoefficientOfVariation(samples, mean);
    const formattedMean = formatNum(mean);
    // Note: Don't use the unicode character for +- as it might cause
    // hickups for consoles...
    return isNaN(cv) ? formattedMean : `${formattedMean}+-${Math.floor(cv)}%`;
}
exports.formatStats = formatStats;
//# sourceMappingURL=util.js.map