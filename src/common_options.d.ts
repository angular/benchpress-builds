/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
export declare class Options {
    static SAMPLE_ID: InjectionToken<{}>;
    static DEFAULT_DESCRIPTION: InjectionToken<{}>;
    static SAMPLE_DESCRIPTION: InjectionToken<{}>;
    static FORCE_GC: InjectionToken<{}>;
    static NO_PREPARE: () => boolean;
    static PREPARE: InjectionToken<{}>;
    static EXECUTE: InjectionToken<{}>;
    static CAPABILITIES: InjectionToken<{}>;
    static USER_AGENT: InjectionToken<{}>;
    static MICRO_METRICS: InjectionToken<{}>;
    static USER_METRICS: InjectionToken<{}>;
    static NOW: InjectionToken<{}>;
    static WRITE_FILE: InjectionToken<{}>;
    static RECEIVED_DATA: InjectionToken<{}>;
    static REQUEST_COUNT: InjectionToken<{}>;
    static CAPTURE_FRAMES: InjectionToken<{}>;
    static DEFAULT_PROVIDERS: ({
        provide: InjectionToken<{}>;
        useValue: {};
    } | {
        provide: InjectionToken<{}>;
        useValue: boolean;
    })[];
}
