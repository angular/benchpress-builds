import { WebDriverAdapter } from '../web_driver_adapter';
/**
 * Adapter for the selenium-webdriver.
 */
export declare class SeleniumWebDriverAdapter extends WebDriverAdapter {
    private _driver;
    static PROTRACTOR_PROVIDERS: {
        provide: typeof WebDriverAdapter;
        useFactory: () => SeleniumWebDriverAdapter;
    }[];
    constructor(_driver: any);
    /** @internal */
    private _convertPromise(thenable);
    waitFor(callback: () => any): Promise<any>;
    executeScript(script: string): Promise<any>;
    executeAsyncScript(script: string): Promise<any>;
    capabilities(): Promise<any>;
    logs(type: string): Promise<any>;
}
