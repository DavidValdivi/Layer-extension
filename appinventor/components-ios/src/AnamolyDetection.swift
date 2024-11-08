import Foundation
import UIKit

// Define a custom class to handle result tuples in a way that is Objective-C compatible
@objc class AnomalyResult: NSObject {
    @objc var index: Int
    @objc var value: Double
    
    @objc init(index: Int, value: Double) {
        self.index = index
        self.value = value
    }
}

@objc class AnomalyDetection: NonvisibleComponent {

    public override init(_ container: ComponentContainer) {
        super.init(container)
        print(testMethod())
    }
    
    // Helper function to calculate mean and standard deviation, using Objective-C compatible return types
    private func calculateStatistics(dataList: NSArray) -> [NSNumber] {
        let doubleList = dataList.compactMap { ($0 as? NSNumber)?.doubleValue }
        let mean = doubleList.reduce(0, +) / Double(doubleList.count)
        let variance = doubleList.reduce(0) { $0 + pow($1 - mean, 2) } / Double(doubleList.count)
        let standardDeviation = sqrt(variance)
        
        return [NSNumber(value: mean), NSNumber(value: standardDeviation)]
    }
    
    // Detect anomalies based on Z-score and return an array of AnomalyResult objects for Objective-C compatibility
    @objc func detectAnomalies(dataList: NSArray, threshold: NSNumber) -> NSArray {
        let stats = calculateStatistics(dataList: dataList)
        let mean = stats[0].doubleValue
        let sd = stats[1].doubleValue
        let anomalies = NSMutableArray()
        
        for (index, value) in dataList.enumerated() {
            guard let doubleValue = (value as? NSNumber)?.doubleValue else { continue }
            let zScore = abs((doubleValue - mean) / sd)
            if zScore > threshold.doubleValue {
                anomalies.add(AnomalyResult(index: index + 1, value: doubleValue))
            }
        }
        
        return anomalies
    }
    
    // Detect anomalies in chart data and return an array of NSArrays, representing pairs of (x, y)
    @objc func detectAnomaliesInChartData(chartData: NSArray, threshold: NSNumber) -> NSArray {
        let yValues = chartData.compactMap { ($0 as? InputData)?.y }
        let anomalies = detectAnomalies(dataList: yValues as NSArray, threshold: threshold) as! [AnomalyResult]
        
        let results = NSMutableArray()
        for anomaly in anomalies {
            if let inputData = chartData[anomaly.index - 1] as? InputData {
                results.add([inputData.x, anomaly.value])
            }
        }
        
        return results
    }
    
    // Clean data by removing anomalies
    @objc func cleanData(anomalyIndex: NSNumber, xList: NSArray, yList: NSArray) -> NSArray {
        let anomalyIdx = anomalyIndex.intValue
        guard xList.count == yList.count, anomalyIdx > 0, anomalyIdx <= xList.count else {
            fatalError("Invalid input data")
        }
        
        let newXList = NSMutableArray(array: xList)
        let newYList = NSMutableArray(array: yList)
        newXList.removeObject(at: anomalyIdx - 1)
        newYList.removeObject(at: anomalyIdx - 1)
        
        let cleanedData = NSMutableArray()
        for i in 0..<newXList.count {
            cleanedData.add([newXList[i], newYList[i]])
        }
        
        return cleanedData
    }

    // Dummy method to test Objective-C compatibility with App Inventor
    public func testMethod() -> NSString {
        return "Test Successful"
    }
}

// InputData class needs to be Objective-C compatible
@objc class InputData: NSObject {
    @objc var x: Double
    @objc var y: Double
    @objc var threshold: Double
    
    @objc init(x: Double, y: Double, threshold: Double) {
        self.x = x
        self.y = y
        self.threshold = threshold
    }
}
