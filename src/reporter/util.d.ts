import { MeasureValues } from '../measure_values';
export declare function formatNum(n: number): string;
export declare function sortedProps(obj: {
    [key: string]: any;
}): string[];
export declare function formatStats(validSamples: MeasureValues[], metricName: string): string;
