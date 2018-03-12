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
 * A validator that waits for the sample to have a certain size.
 */
export declare class SizeValidator extends Validator {
    private _sampleSize;
    static SAMPLE_SIZE: InjectionToken<{}>;
    static PROVIDERS: ({
        provide: typeof SizeValidator;
        deps: InjectionToken<{}>[];
        useValue?: undefined;
    } | {
        provide: InjectionToken<{}>;
        useValue: number;
        deps?: undefined;
    })[];
    constructor(_sampleSize: number);
    describe(): {
        [key: string]: any;
    };
    validate(completeSample: MeasureValues[]): MeasureValues[] | null;
}
