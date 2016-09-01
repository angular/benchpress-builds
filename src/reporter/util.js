/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var collection_1 = require('../facade/collection');
var lang_1 = require('../facade/lang');
var statistic_1 = require('../statistic');
function formatNum(n) {
    return lang_1.NumberWrapper.toFixed(n, 2);
}
exports.formatNum = formatNum;
function sortedProps(obj) {
    var props = [];
    collection_1.StringMapWrapper.forEach(obj, function (value, prop) { return props.push(prop); });
    props.sort();
    return props;
}
exports.sortedProps = sortedProps;
function formatStats(validSamples, metricName) {
    var samples = validSamples.map(function (measureValues) { return measureValues.values[metricName]; });
    var mean = statistic_1.Statistic.calculateMean(samples);
    var cv = statistic_1.Statistic.calculateCoefficientOfVariation(samples, mean);
    var formattedMean = formatNum(mean);
    // Note: Don't use the unicode character for +- as it might cause
    // hickups for consoles...
    return lang_1.NumberWrapper.isNaN(cv) ? formattedMean : formattedMean + "+-" + Math.floor(cv) + "%";
}
exports.formatStats = formatStats;
//# sourceMappingURL=util.js.map