/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { MeasureValues } from '../measure_values';
import { Validator } from '../validator';
/**
 * A validator that checks the regression slope of a specific metric.
 * Waits for the regression slope to be >=0.
 */
export declare class RegressionSlopeValidator extends Validator {
    private _sampleSize;
    private _metric;
    static SAMPLE_SIZE: InjectionToken<{}>;
    static METRIC: InjectionToken<{}>;
    static PROVIDERS: ({
        provide: typeof RegressionSlopeValidator;
        deps: InjectionToken<{}>[];
        useValue?: undefined;
    } | {
        provide: InjectionToken<{}>;
        useValue: number;
        deps?: undefined;
    } | {
        provide: InjectionToken<{}>;
        useValue: string;
        deps?: undefined;
    })[];
    constructor(_sampleSize: number, _metric: string);
    describe(): {
        [key: string]: any;
    };
    validate(completeSample: MeasureValues[]): MeasureValues[] | null;
}
