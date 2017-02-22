/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
const core_1 = require("@angular/core");
const common_options_1 = require("../common_options");
const reporter_1 = require("../reporter");
const sample_description_1 = require("../sample_description");
const util_1 = require("./util");
/**
 * A reporter that writes results into a json file.
 */
class JsonFileReporter extends reporter_1.Reporter {
    constructor(_description, _path, _writeFile, _now) {
        super();
        this._description = _description;
        this._path = _path;
        this._writeFile = _writeFile;
        this._now = _now;
    }
    reportMeasureValues(measureValues) { return Promise.resolve(null); }
    reportSample(completeSample, validSample) {
        const stats = {};
        util_1.sortedProps(this._description.metrics).forEach((metricName) => {
            stats[metricName] = util_1.formatStats(validSample, metricName);
        });
        const content = JSON.stringify({
            'description': this._description,
            'stats': stats,
            'completeSample': completeSample,
            'validSample': validSample,
        }, null, 2);
        const filePath = `${this._path}/${this._description.id}_${this._now().getTime()}.json`;
        return this._writeFile(filePath, content);
    }
}
JsonFileReporter.PATH = new core_1.InjectionToken('JsonFileReporter.path');
JsonFileReporter.PROVIDERS = [JsonFileReporter, { provide: JsonFileReporter.PATH, useValue: '.' }];
JsonFileReporter.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
JsonFileReporter.ctorParameters = () => [
    { type: sample_description_1.SampleDescription, },
    { type: undefined, decorators: [{ type: core_1.Inject, args: [JsonFileReporter.PATH,] },] },
    { type: Function, decorators: [{ type: core_1.Inject, args: [common_options_1.Options.WRITE_FILE,] },] },
    { type: Function, decorators: [{ type: core_1.Inject, args: [common_options_1.Options.NOW,] },] },
];
exports.JsonFileReporter = JsonFileReporter;
//# sourceMappingURL=json_file_reporter.js.map