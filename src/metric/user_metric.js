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
const common_options_1 = require("../common_options");
const metric_1 = require("../metric");
const web_driver_adapter_1 = require("../web_driver_adapter");
let UserMetric = UserMetric_1 = class UserMetric extends metric_1.Metric {
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
};
UserMetric.PROVIDERS = [{ provide: UserMetric_1, deps: [common_options_1.Options.USER_METRICS, web_driver_adapter_1.WebDriverAdapter] }];
UserMetric = UserMetric_1 = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(common_options_1.Options.USER_METRICS)),
    __metadata("design:paramtypes", [Object, web_driver_adapter_1.WebDriverAdapter])
], UserMetric);
exports.UserMetric = UserMetric;
var UserMetric_1;
//# sourceMappingURL=user_metric.js.map