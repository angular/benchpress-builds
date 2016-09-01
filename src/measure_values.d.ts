export declare class MeasureValues {
    runIndex: number;
    timeStamp: Date;
    values: {
        [key: string]: any;
    };
    constructor(runIndex: number, timeStamp: Date, values: {
        [key: string]: any;
    });
    toJson(): {
        'timeStamp': string;
        'runIndex': number;
        'values': {
            [key: string]: any;
        };
    };
}
