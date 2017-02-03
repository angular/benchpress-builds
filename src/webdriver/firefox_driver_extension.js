/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
const core_1 = require('@angular/core');
const lang_1 = require('../facade/lang');
const web_driver_adapter_1 = require('../web_driver_adapter');
const web_driver_extension_1 = require('../web_driver_extension');
class FirefoxDriverExtension extends web_driver_extension_1.WebDriverExtension {
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
        if (lang_1.isPresent(restartName)) {
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
}
FirefoxDriverExtension.PROVIDERS = [FirefoxDriverExtension];
FirefoxDriverExtension.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
FirefoxDriverExtension.ctorParameters = () => [
    { type: web_driver_adapter_1.WebDriverAdapter, },
];
exports.FirefoxDriverExtension = FirefoxDriverExtension;
//# sourceMappingURL=firefox_driver_extension.js.map