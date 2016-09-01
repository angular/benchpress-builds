export declare type PerfLogEvent = {
    cat?: string;
    ph?: 'X' | 'B' | 'E' | 'b' | 'e';
    ts?: number;
    dur?: number;
    name?: string;
    pid?: string;
    args?: {
        encodedDataLength?: number;
        usedHeapSize?: number;
        majorGc?: number;
    };
};
/**
 * A WebDriverExtension implements extended commands of the webdriver protocol
 * for a given browser, independent of the WebDriverAdapter.
 * Needs one implementation for every supported Browser.
 */
export declare abstract class WebDriverExtension {
    static provideFirstSupported(childTokens: any[]): any[];
    gc(): Promise<any>;
    timeBegin(name: string): Promise<any>;
    timeEnd(name: string, restartName: string): Promise<any>;
    /**
     * Format:
     * - cat: category of the event
     * - name: event name: 'script', 'gc', 'render', ...
     * - ph: phase: 'B' (begin), 'E' (end), 'b' (nestable start), 'e' (nestable end), 'X' (Complete
     *event)
     * - ts: timestamp in ms, e.g. 12345
     * - pid: process id
     * - args: arguments, e.g. {heapSize: 1234}
     *
     * Based on [Chrome Trace Event
     *Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit)
     **/
    readPerfLog(): Promise<PerfLogEvent[]>;
    perfLogFeatures(): PerfLogFeatures;
    supports(capabilities: {
        [key: string]: any;
    }): boolean;
}
export declare class PerfLogFeatures {
    render: boolean;
    gc: boolean;
    frameCapture: boolean;
    userTiming: boolean;
    constructor({render, gc, frameCapture, userTiming}?: {
        render?: boolean;
        gc?: boolean;
        frameCapture?: boolean;
        userTiming?: boolean;
    });
}
