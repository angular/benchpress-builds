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
const metric_1 = require("./metric");
const multi_metric_1 = require("./metric/multi_metric");
const perflog_metric_1 = require("./metric/perflog_metric");
const user_metric_1 = require("./metric/user_metric");
const reporter_1 = require("./reporter");
const console_reporter_1 = require("./reporter/console_reporter");
const multi_reporter_1 = require("./reporter/multi_reporter");
const sample_description_1 = require("./sample_description");
const sampler_1 = require("./sampler");
const validator_1 = require("./validator");
const regression_slope_validator_1 = require("./validator/regression_slope_validator");
const size_validator_1 = require("./validator/size_validator");
const web_driver_adapter_1 = require("./web_driver_adapter");
const web_driver_extension_1 = require("./web_driver_extension");
const chrome_driver_extension_1 = require("./webdriver/chrome_driver_extension");
const firefox_driver_extension_1 = require("./webdriver/firefox_driver_extension");
const ios_driver_extension_1 = require("./webdriver/ios_driver_extension");
/**
 * The Runner is the main entry point for executing a sample run.
 * It provides defaults, creates the injector and calls the sampler.
 */
class Runner {
    constructor(_defaultProviders = []) {
        this._defaultProviders = _defaultProviders;
    }
    sample({ id, execute, prepare, microMetrics, providers, userMetrics }) {
        const sampleProviders = [
            _DEFAULT_PROVIDERS, this._defaultProviders, { provide: common_options_1.Options.SAMPLE_ID, useValue: id },
            { provide: common_options_1.Options.EXECUTE, useValue: execute }
        ];
        if (prepare != null) {
            sampleProviders.push({ provide: common_options_1.Options.PREPARE, useValue: prepare });
        }
        if (microMetrics != null) {
            sampleProviders.push({ provide: common_options_1.Options.MICRO_METRICS, useValue: microMetrics });
        }
        if (userMetrics != null) {
            sampleProviders.push({ provide: common_options_1.Options.USER_METRICS, useValue: userMetrics });
        }
        if (providers != null) {
            sampleProviders.push(providers);
        }
        const inj = core_1.Injector.create(sampleProviders);
        const adapter = inj.get(web_driver_adapter_1.WebDriverAdapter);
        return Promise
            .all([adapter.capabilities(), adapter.executeScript('return window.navigator.userAgent;')])
            .then((args) => {
            const capabilities = args[0];
            const userAgent = args[1];
            // This might still create instances twice. We are creating a new injector with all the
            // providers.
            // Only WebDriverAdapter is reused.
            // TODO(vsavkin): consider changing it when toAsyncFactory is added back or when child
            // injectors are handled better.
            const injector = core_1.Injector.create([
                sampleProviders, { provide: common_options_1.Options.CAPABILITIES, useValue: capabilities },
                { provide: common_options_1.Options.USER_AGENT, useValue: userAgent },
                { provide: web_driver_adapter_1.WebDriverAdapter, useValue: adapter }
            ]);
            // TODO: With TypeScript 2.5 injector.get does not infer correctly the
            // return type. Remove 'any' and investigate the issue.
            const sampler = injector.get(sampler_1.Sampler);
            return sampler.sample();
        });
    }
}
exports.Runner = Runner;
const _DEFAULT_PROVIDERS = [
    common_options_1.Options.DEFAULT_PROVIDERS,
    sampler_1.Sampler.PROVIDERS,
    console_reporter_1.ConsoleReporter.PROVIDERS,
    regression_slope_validator_1.RegressionSlopeValidator.PROVIDERS,
    size_validator_1.SizeValidator.PROVIDERS,
    chrome_driver_extension_1.ChromeDriverExtension.PROVIDERS,
    firefox_driver_extension_1.FirefoxDriverExtension.PROVIDERS,
    ios_driver_extension_1.IOsDriverExtension.PROVIDERS,
    perflog_metric_1.PerflogMetric.PROVIDERS,
    user_metric_1.UserMetric.PROVIDERS,
    sample_description_1.SampleDescription.PROVIDERS,
    multi_reporter_1.MultiReporter.provideWith([console_reporter_1.ConsoleReporter]),
    multi_metric_1.MultiMetric.provideWith([perflog_metric_1.PerflogMetric, user_metric_1.UserMetric]),
    { provide: reporter_1.Reporter, useExisting: multi_reporter_1.MultiReporter },
    { provide: validator_1.Validator, useExisting: regression_slope_validator_1.RegressionSlopeValidator },
    web_driver_extension_1.WebDriverExtension.provideFirstSupported([chrome_driver_extension_1.ChromeDriverExtension, firefox_driver_extension_1.FirefoxDriverExtension, ios_driver_extension_1.IOsDriverExtension]),
    { provide: metric_1.Metric, useExisting: multi_metric_1.MultiMetric },
];
//# sourceMappingURL=runner.js.map