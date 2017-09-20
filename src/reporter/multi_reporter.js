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
const reporter_1 = require("../reporter");
class MultiReporter extends reporter_1.Reporter {
    constructor(_reporters) {
        super();
        this._reporters = _reporters;
    }
    static provideWith(childTokens) {
        return [
            {
                provide: _CHILDREN,
                useFactory: (injector) => childTokens.map(token => injector.get(token)),
                deps: [core_1.Injector],
            },
            {
                provide: MultiReporter,
                useFactory: (children) => new MultiReporter(children),
                deps: [_CHILDREN]
            }
        ];
    }
    reportMeasureValues(values) {
        return Promise.all(this._reporters.map(reporter => reporter.reportMeasureValues(values)));
    }
    reportSample(completeSample, validSample) {
        return Promise.all(this._reporters.map(reporter => reporter.reportSample(completeSample, validSample)));
    }
}
exports.MultiReporter = MultiReporter;
const _CHILDREN = new core_1.InjectionToken('MultiReporter.children');
//# sourceMappingURL=multi_reporter.js.map