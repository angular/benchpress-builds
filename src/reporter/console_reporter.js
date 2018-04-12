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
const reporter_1 = require("../reporter");
const sample_description_1 = require("../sample_description");
const util_1 = require("./util");
/**
 * A reporter for the console
 */
let ConsoleReporter = ConsoleReporter_1 = class ConsoleReporter extends reporter_1.Reporter {
    constructor(_columnWidth, sampleDescription, _print) {
        super();
        this._columnWidth = _columnWidth;
        this._print = _print;
        this._metricNames = util_1.sortedProps(sampleDescription.metrics);
        this._printDescription(sampleDescription);
    }
    static _lpad(value, columnWidth, fill = ' ') {
        let result = '';
        for (let i = 0; i < columnWidth - value.length; i++) {
            result += fill;
        }
        return result + value;
    }
    _printDescription(sampleDescription) {
        this._print(`BENCHMARK ${sampleDescription.id}`);
        this._print('Description:');
        const props = util_1.sortedProps(sampleDescription.description);
        props.forEach((prop) => { this._print(`- ${prop}: ${sampleDescription.description[prop]}`); });
        this._print('Metrics:');
        this._metricNames.forEach((metricName) => {
            this._print(`- ${metricName}: ${sampleDescription.metrics[metricName]}`);
        });
        this._print('');
        this._printStringRow(this._metricNames);
        this._printStringRow(this._metricNames.map((_) => ''), '-');
    }
    reportMeasureValues(measureValues) {
        const formattedValues = this._metricNames.map(metricName => {
            const value = measureValues.values[metricName];
            return util_1.formatNum(value);
        });
        this._printStringRow(formattedValues);
        return Promise.resolve(null);
    }
    reportSample(completeSample, validSamples) {
        this._printStringRow(this._metricNames.map((_) => ''), '=');
        this._printStringRow(this._metricNames.map(metricName => util_1.formatStats(validSamples, metricName)));
        return Promise.resolve(null);
    }
    _printStringRow(parts, fill = ' ') {
        this._print(parts.map(part => ConsoleReporter_1._lpad(part, this._columnWidth, fill)).join(' | '));
    }
};
ConsoleReporter.PRINT = new core_1.InjectionToken('ConsoleReporter.print');
ConsoleReporter.COLUMN_WIDTH = new core_1.InjectionToken('ConsoleReporter.columnWidth');
ConsoleReporter.PROVIDERS = [
    {
        provide: ConsoleReporter_1,
        deps: [ConsoleReporter_1.COLUMN_WIDTH, sample_description_1.SampleDescription, ConsoleReporter_1.PRINT]
    },
    { provide: ConsoleReporter_1.COLUMN_WIDTH, useValue: 18 }, {
        provide: ConsoleReporter_1.PRINT,
        useValue: function (v) {
            // tslint:disable-next-line:no-console
            console.log(v);
        }
    }
];
ConsoleReporter = ConsoleReporter_1 = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__param(0, core_1.Inject(ConsoleReporter_1.COLUMN_WIDTH)),
    tslib_1.__param(2, core_1.Inject(ConsoleReporter_1.PRINT)),
    tslib_1.__metadata("design:paramtypes", [Number, sample_description_1.SampleDescription,
        Function])
], ConsoleReporter);
exports.ConsoleReporter = ConsoleReporter;
var ConsoleReporter_1;
//# sourceMappingURL=console_reporter.js.map