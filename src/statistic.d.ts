export declare class Statistic {
    static calculateCoefficientOfVariation(sample: number[], mean: number): number;
    static calculateMean(samples: number[]): number;
    static calculateStandardDeviation(samples: number[], mean: number): number;
    static calculateRegressionSlope(xValues: number[], xMean: number, yValues: number[], yMean: number): number;
}
