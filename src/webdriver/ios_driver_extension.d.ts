import { WebDriverAdapter } from '../web_driver_adapter';
import { PerfLogFeatures, WebDriverExtension } from '../web_driver_extension';
export declare class IOsDriverExtension extends WebDriverExtension {
    private _driver;
    static PROVIDERS: typeof IOsDriverExtension[];
    constructor(_driver: WebDriverAdapter);
    gc(): Promise<any>;
    timeBegin(name: string): Promise<any>;
    timeEnd(name: string, restartName?: string): Promise<any>;
    readPerfLog(): Promise<{
        cat?: string;
        ph?: "X" | "B" | "E" | "b" | "e";
        ts?: number;
        dur?: number;
        name?: string;
        pid?: string;
        args?: {
            encodedDataLength?: number;
            usedHeapSize?: number;
            majorGc?: number;
        };
    }[]>;
    /** @internal */
    private _convertPerfRecordsToEvents(records, events?);
    perfLogFeatures(): PerfLogFeatures;
    supports(capabilities: {
        [key: string]: any;
    }): boolean;
}
