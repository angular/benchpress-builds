"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_options_1 = require("../common_options");
const reporter_1 = require("../reporter");
const sample_description_1 = require("../sample_description");
const util_1 = require("./util");
/**
 * A reporter that writes results into a json file.
 */
let JsonFileReporter = JsonFileReporter_1 = class JsonFileReporter extends reporter_1.Reporter {
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
};
JsonFileReporter.PATH = new core_1.InjectionToken('JsonFileReporter.path');
JsonFileReporter.PROVIDERS = [
    {
        provide: JsonFileReporter_1,
        deps: [sample_description_1.SampleDescription, JsonFileReporter_1.PATH, common_options_1.Options.WRITE_FILE, common_options_1.Options.NOW]
    },
    { provide: JsonFileReporter_1.PATH, useValue: '.' }
];
JsonFileReporter = JsonFileReporter_1 = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__param(1, core_1.Inject(JsonFileReporter_1.PATH)),
    tslib_1.__param(2, core_1.Inject(common_options_1.Options.WRITE_FILE)),
    tslib_1.__param(3, core_1.Inject(common_options_1.Options.NOW)),
    tslib_1.__metadata("design:paramtypes", [sample_description_1.SampleDescription, String, Function,
        Function])
], JsonFileReporter);
exports.JsonFileReporter = JsonFileReporter;
var JsonFileReporter_1;
//# sourceMappingURL=json_file_reporter.js.map