"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const common_options_1 = require("./common_options");
const metric_1 = require("./metric");
const validator_1 = require("./validator");
/**
 * SampleDescription merges all available descriptions about a sample
 */
class SampleDescription {
    constructor(id, descriptions, metrics) {
        this.id = id;
        this.metrics = metrics;
        this.description = {};
        descriptions.forEach(description => {
            Object.keys(description).forEach(prop => { this.description[prop] = description[prop]; });
        });
    }
    toJson() { return { 'id': this.id, 'description': this.description, 'metrics': this.metrics }; }
}
SampleDescription.PROVIDERS = [{
        provide: SampleDescription,
        useFactory: (metric, id, forceGc, userAgent, validator, defaultDesc, userDesc) => new SampleDescription(id, [
            { 'forceGc': forceGc, 'userAgent': userAgent }, validator.describe(), defaultDesc,
            userDesc
        ], metric.describe()),
        deps: [
            metric_1.Metric, common_options_1.Options.SAMPLE_ID, common_options_1.Options.FORCE_GC, common_options_1.Options.USER_AGENT, validator_1.Validator,
            common_options_1.Options.DEFAULT_DESCRIPTION, common_options_1.Options.SAMPLE_DESCRIPTION
        ]
    }];
exports.SampleDescription = SampleDescription;
//# sourceMappingURL=sample_description.js.map