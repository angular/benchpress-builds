import { WebDriverAdapter } from '../web_driver_adapter';
import { PerfLogFeatures, WebDriverExtension } from '../web_driver_extension';
export declare class IOsDriverExtension extends WebDriverExtension {
    private _driver;
    static PROVIDERS: typeof IOsDriverExtension[];
    constructor(_driver: WebDriverAdapter);
    gc(): Promise<any>;
    timeBegin(name: string): Promise<any>;
    timeEnd(name: string, restartName?: string | null): Promise<any>;
    readPerfLog(): Promise<any>;
    /** @internal */
    private _convertPerfRecordsToEvents(records, events?);
    perfLogFeatures(): PerfLogFeatures;
    supports(capabilities: {
        [key: string]: any;
    }): boolean;
}
