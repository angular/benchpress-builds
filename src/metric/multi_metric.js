"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const metric_1 = require("../metric");
class MultiMetric extends metric_1.Metric {
    constructor(_metrics) {
        super();
        this._metrics = _metrics;
    }
    static provideWith(childTokens) {
        return [
            {
                provide: _CHILDREN,
                useFactory: (injector) => childTokens.map(token => injector.get(token)),
                deps: [core_1.Injector]
            },
            {
                provide: MultiMetric,
                useFactory: (children) => new MultiMetric(children),
                deps: [_CHILDREN]
            }
        ];
    }
    /**
     * Starts measuring
     */
    beginMeasure() {
        return Promise.all(this._metrics.map(metric => metric.beginMeasure()));
    }
    /**
     * Ends measuring and reports the data
     * since the begin call.
     * @param restart: Whether to restart right after this.
     */
    endMeasure(restart) {
        return Promise.all(this._metrics.map(metric => metric.endMeasure(restart)))
            .then(values => mergeStringMaps(values));
    }
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    describe() {
        return mergeStringMaps(this._metrics.map((metric) => metric.describe()));
    }
}
exports.MultiMetric = MultiMetric;
function mergeStringMaps(maps) {
    const result = {};
    maps.forEach(map => { Object.keys(map).forEach(prop => { result[prop] = map[prop]; }); });
    return result;
}
const _CHILDREN = new core_1.InjectionToken('MultiMetric.children');
//# sourceMappingURL=multi_metric.js.map