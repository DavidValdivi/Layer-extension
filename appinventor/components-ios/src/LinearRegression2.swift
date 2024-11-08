import Foundation
import UIKit

// Define a custom class to hold linear input data in an Objective-C compatible way
@objc class LinearInputDataObjC: NSObject {
    @objc var x: Double
    @objc var y: Double
    
    @objc init(x: Double, y: Double) {
        self.x = x
        self.y = y
    }
}

// Define a custom result class for storing regression results in an Objective-C compatible way
@objc class LinearRegressionResult: NSObject {
    @objc var slope: Double
    @objc var intercept: Double
    @objc var correlationCoefficient: Double
    @objc var predictions: NSArray
    
    @objc init(slope: Double, intercept: Double, correlationCoefficient: Double, predictions: NSArray) {
        self.slope = slope
        self.intercept = intercept
        self.correlationCoefficient = correlationCoefficient
        self.predictions = predictions
    }
}

@objc class LinearRegression2: NonvisibleComponent {
    
    public override init(_ container: ComponentContainer) {
        super.init(container)
    }
    
    // Helper function to compute coefficients (Objective-C compatible return types)
    private func computeCoefficients(xList: NSArray, yList: NSArray) -> [NSNumber] {
        // Dummy calculation for illustration purposes
        let slope = 0.0
        let intercept = 0.0
        let correlationCoefficient = 0.0
        return [NSNumber(value: slope), NSNumber(value: intercept), NSNumber(value: correlationCoefficient)]
    }
    
    // Calculate predictions based on the computed line of best fit
    private func calculatePredictions(xList: NSArray, slope: Double, intercept: Double) -> NSArray {
        return xList.compactMap { ($0 as? NSNumber)?.doubleValue }.map { NSNumber(value: intercept + slope * $0) } as NSArray
    }

    // Calculate the line of best fit, returning a LinearRegressionResult object for Objective-C compatibility
    @objc func calculateLineOfBestFit(inputData: NSArray) -> LinearRegressionResult {
        let xList = inputData.compactMap { ($0 as? LinearInputDataObjC)?.x } as NSArray
        let yList = inputData.compactMap { ($0 as? LinearInputDataObjC)?.y } as NSArray
        let coefficients = computeCoefficients(xList: xList, yList: yList)
        let slope = coefficients[0].doubleValue
        let intercept = coefficients[1].doubleValue
        let correlationCoefficient = coefficients[2].doubleValue
        let predictions = calculatePredictions(xList: xList, slope: slope, intercept: intercept)
        
        return LinearRegressionResult(slope: slope, intercept: intercept, correlationCoefficient: correlationCoefficient, predictions: predictions)
    }
    
    // Dummy method to test Objective-C compatibility with App Inventor
    @objc func testMethod() -> NSString {
        return "Test Successful for Linear Regression"
    }
}
