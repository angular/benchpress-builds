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
const fs = require("fs");
class Options {
}
Options.SAMPLE_ID = new core_1.InjectionToken('Options.sampleId');
Options.DEFAULT_DESCRIPTION = new core_1.InjectionToken('Options.defaultDescription');
Options.SAMPLE_DESCRIPTION = new core_1.InjectionToken('Options.sampleDescription');
Options.FORCE_GC = new core_1.InjectionToken('Options.forceGc');
Options.NO_PREPARE = () => true;
Options.PREPARE = new core_1.InjectionToken('Options.prepare');
Options.EXECUTE = new core_1.InjectionToken('Options.execute');
Options.CAPABILITIES = new core_1.InjectionToken('Options.capabilities');
Options.USER_AGENT = new core_1.InjectionToken('Options.userAgent');
Options.MICRO_METRICS = new core_1.InjectionToken('Options.microMetrics');
Options.USER_METRICS = new core_1.InjectionToken('Options.userMetrics');
Options.NOW = new core_1.InjectionToken('Options.now');
Options.WRITE_FILE = new core_1.InjectionToken('Options.writeFile');
Options.RECEIVED_DATA = new core_1.InjectionToken('Options.receivedData');
Options.REQUEST_COUNT = new core_1.InjectionToken('Options.requestCount');
Options.CAPTURE_FRAMES = new core_1.InjectionToken('Options.frameCapture');
Options.DEFAULT_PROVIDERS = [
    { provide: Options.DEFAULT_DESCRIPTION, useValue: {} },
    { provide: Options.SAMPLE_DESCRIPTION, useValue: {} },
    { provide: Options.FORCE_GC, useValue: false },
    { provide: Options.PREPARE, useValue: Options.NO_PREPARE },
    { provide: Options.MICRO_METRICS, useValue: {} }, { provide: Options.USER_METRICS, useValue: {} },
    { provide: Options.NOW, useValue: () => new Date() },
    { provide: Options.RECEIVED_DATA, useValue: false },
    { provide: Options.REQUEST_COUNT, useValue: false },
    { provide: Options.CAPTURE_FRAMES, useValue: false },
    { provide: Options.WRITE_FILE, useValue: writeFile }
];
exports.Options = Options;
function writeFile(filename, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, content, (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
//# sourceMappingURL=common_options.js.map