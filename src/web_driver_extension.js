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
const common_options_1 = require("./common_options");
/**
 * A WebDriverExtension implements extended commands of the webdriver protocol
 * for a given browser, independent of the WebDriverAdapter.
 * Needs one implementation for every supported Browser.
 */
class WebDriverExtension {
    static provideFirstSupported(childTokens) {
        const res = [
            {
                provide: _CHILDREN,
                useFactory: (injector) => childTokens.map(token => injector.get(token)),
                deps: [core_1.Injector]
            },
            {
                provide: WebDriverExtension,
                useFactory: (children, capabilities) => {
                    let delegate = undefined;
                    children.forEach(extension => {
                        if (extension.supports(capabilities)) {
                            delegate = extension;
                        }
                    });
                    if (!delegate) {
                        throw new Error('Could not find a delegate for given capabilities!');
                    }
                    return delegate;
                },
                deps: [_CHILDREN, common_options_1.Options.CAPABILITIES]
            }
        ];
        return res;
    }
    gc() { throw new Error('NYI'); }
    timeBegin(name) { throw new Error('NYI'); }
    timeEnd(name, restartName) { throw new Error('NYI'); }
    /**
     * Format:
     * - cat: category of the event
     * - name: event name: 'script', 'gc', 'render', ...
     * - ph: phase: 'B' (begin), 'E' (end), 'X' (Complete event), 'I' (Instant event)
     * - ts: timestamp in ms, e.g. 12345
     * - pid: process id
     * - args: arguments, e.g. {heapSize: 1234}
     *
     * Based on [Chrome Trace Event
     *Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)
     **/
    readPerfLog() { throw new Error('NYI'); }
    perfLogFeatures() { throw new Error('NYI'); }
    supports(capabilities) { return true; }
}
exports.WebDriverExtension = WebDriverExtension;
class PerfLogFeatures {
    constructor({ render = false, gc = false, frameCapture = false, userTiming = false } = {}) {
        this.render = render;
        this.gc = gc;
        this.frameCapture = frameCapture;
        this.userTiming = userTiming;
    }
}
exports.PerfLogFeatures = PerfLogFeatures;
const _CHILDREN = new core_1.InjectionToken('WebDriverExtension.children');
//# sourceMappingURL=web_driver_extension.js.map