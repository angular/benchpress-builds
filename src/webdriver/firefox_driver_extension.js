/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const core_1 = require("@angular/core");
const web_driver_extension_1 = require("../web_driver_extension");
let FirefoxDriverExtension = FirefoxDriverExtension_1 = class FirefoxDriverExtension extends web_driver_extension_1.WebDriverExtension {
    constructor(_driver) {
        super();
        this._driver = _driver;
        this._profilerStarted = false;
    }
    gc() { return this._driver.executeScript('window.forceGC()'); }
    timeBegin(name) {
        if (!this._profilerStarted) {
            this._profilerStarted = true;
            this._driver.executeScript('window.startProfiler();');
        }
        return this._driver.executeScript('window.markStart("' + name + '");');
    }
    timeEnd(name, restartName = null) {
        let script = 'window.markEnd("' + name + '");';
        if (restartName != null) {
            script += 'window.markStart("' + restartName + '");';
        }
        return this._driver.executeScript(script);
    }
    readPerfLog() {
        return this._driver.executeAsyncScript('var cb = arguments[0]; window.getProfile(cb);');
    }
    perfLogFeatures() { return new web_driver_extension_1.PerfLogFeatures({ render: true, gc: true }); }
    supports(capabilities) {
        return capabilities['browserName'].toLowerCase() === 'firefox';
    }
};
FirefoxDriverExtension.PROVIDERS = [FirefoxDriverExtension_1];
FirefoxDriverExtension = FirefoxDriverExtension_1 = __decorate([
    core_1.Injectable()
], FirefoxDriverExtension);
exports.FirefoxDriverExtension = FirefoxDriverExtension;
var FirefoxDriverExtension_1;
//# sourceMappingURL=firefox_driver_extension.js.map