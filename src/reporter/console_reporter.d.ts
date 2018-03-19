/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
import { MeasureValues } from '../measure_values';
import { Reporter } from '../reporter';
import { SampleDescription } from '../sample_description';
/**
 * A reporter for the console
 */
export declare class ConsoleReporter extends Reporter {
    private _columnWidth;
    private _print;
    static PRINT: InjectionToken<{}>;
    static COLUMN_WIDTH: InjectionToken<{}>;
    static PROVIDERS: ({
        provide: typeof ConsoleReporter;
        deps: (InjectionToken<{}> | typeof SampleDescription)[];
        useValue?: undefined;
    } | {
        provide: InjectionToken<{}>;
        useValue: number;
        deps?: undefined;
    } | {
        provide: InjectionToken<{}>;
        useValue: (v: any) => void;
        deps?: undefined;
    })[];
    private static _lpad(value, columnWidth, fill?);
    private _metricNames;
    constructor(_columnWidth: number, sampleDescription: SampleDescription, _print: Function);
    private _printDescription(sampleDescription);
    reportMeasureValues(measureValues: MeasureValues): Promise<any>;
    reportSample(completeSample: MeasureValues[], validSamples: MeasureValues[]): Promise<any>;
    private _printStringRow(parts, fill?);
}
