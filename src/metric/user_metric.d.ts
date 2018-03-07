/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { StaticProvider } from '@angular/core';
import { Metric } from '../metric';
import { WebDriverAdapter } from '../web_driver_adapter';
export declare class UserMetric extends Metric {
    private _userMetrics;
    private _wdAdapter;
    static PROVIDERS: StaticProvider[];
    constructor(_userMetrics: {
        [key: string]: string;
    }, _wdAdapter: WebDriverAdapter);
    /**
     * Starts measuring
     */
    beginMeasure(): Promise<any>;
    /**
     * Ends measuring.
     */
    endMeasure(restart: boolean): Promise<{
        [key: string]: any;
    }>;
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    describe(): {
        [key: string]: any;
    };
}
