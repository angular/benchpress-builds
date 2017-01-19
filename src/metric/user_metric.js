/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
const core_1 = require('@angular/core');
const common_options_1 = require('../common_options');
const metric_1 = require('../metric');
const web_driver_adapter_1 = require('../web_driver_adapter');
class UserMetric extends metric_1.Metric {
    constructor(_userMetrics, _wdAdapter) {
        super();
        this._userMetrics = _userMetrics;
        this._wdAdapter = _wdAdapter;
    }
    /**
     * Starts measuring
     */
    beginMeasure() { return Promise.resolve(true); }
    /**
     * Ends measuring.
     */
    endMeasure(restart) {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        const adapter = this._wdAdapter;
        const names = Object.keys(this._userMetrics);
        function getAndClearValues() {
            Promise.all(names.map(name => adapter.executeScript(`return window.${name}`)))
                .then((values) => {
                if (values.every(v => typeof v === 'number')) {
                    Promise.all(names.map(name => adapter.executeScript(`delete window.${name}`)))
                        .then((_) => {
                        const map = {};
                        for (let i = 0, n = names.length; i < n; i++) {
                            map[names[i]] = values[i];
                        }
                        resolve(map);
                    }, reject);
                }
                else {
                    setTimeout(getAndClearValues, 100);
                }
            }, reject);
        }
        getAndClearValues();
        return promise;
    }
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    describe() { return this._userMetrics; }
}
UserMetric.PROVIDERS = [UserMetric];
UserMetric.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
UserMetric.ctorParameters = () => [
    { type: undefined, decorators: [{ type: core_1.Inject, args: [common_options_1.Options.USER_METRICS,] },] },
    { type: web_driver_adapter_1.WebDriverAdapter, },
];
exports.UserMetric = UserMetric;
//# sourceMappingURL=user_metric.js.map