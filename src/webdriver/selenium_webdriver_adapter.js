/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var webdriver = require('selenium-webdriver');
var web_driver_adapter_1 = require('../web_driver_adapter');
/**
 * Adapter for the selenium-webdriver.
 */
var SeleniumWebDriverAdapter = (function (_super) {
    __extends(SeleniumWebDriverAdapter, _super);
    function SeleniumWebDriverAdapter(_driver) {
        _super.call(this);
        this._driver = _driver;
    }
    /** @internal */
    SeleniumWebDriverAdapter.prototype._convertPromise = function (thenable) {
        var resolve;
        var reject;
        var promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        thenable.then(
        // selenium-webdriver uses an own Node.js context,
        // so we need to convert data into objects of this context.
        function (data) { return resolve(convertToLocalProcess(data)); }, reject);
        return promise;
    };
    SeleniumWebDriverAdapter.prototype.waitFor = function (callback) {
        return this._convertPromise(this._driver.controlFlow().execute(callback));
    };
    SeleniumWebDriverAdapter.prototype.executeScript = function (script) {
        return this._convertPromise(this._driver.executeScript(script));
    };
    SeleniumWebDriverAdapter.prototype.executeAsyncScript = function (script) {
        return this._convertPromise(this._driver.executeAsyncScript(script));
    };
    SeleniumWebDriverAdapter.prototype.capabilities = function () {
        return this._convertPromise(this._driver.getCapabilities().then(function (capsObject) { return capsObject.serialize(); }));
    };
    SeleniumWebDriverAdapter.prototype.logs = function (type) {
        // Needed as selenium-webdriver does not forward
        // performance logs in the correct way via manage().logs
        return this._convertPromise(this._driver.schedule(new webdriver.Command(webdriver.CommandName.GET_LOG).setParameter('type', type), 'WebDriver.manage().logs().get(' + type + ')'));
    };
    SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS = [{
            provide: web_driver_adapter_1.WebDriverAdapter,
            useFactory: function () { return new SeleniumWebDriverAdapter(global.browser); }
        }];
    return SeleniumWebDriverAdapter;
}(web_driver_adapter_1.WebDriverAdapter));
exports.SeleniumWebDriverAdapter = SeleniumWebDriverAdapter;
function convertToLocalProcess(data) {
    var serialized = JSON.stringify(data);
    if ('' + serialized === 'undefined') {
        return undefined;
    }
    return JSON.parse(serialized);
}
//# sourceMappingURL=selenium_webdriver_adapter.js.map