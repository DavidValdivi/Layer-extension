//
//  TrendlineCalculator.swift
//  AIComponentKit
//
//  Created by David Kim on 3/27/24.
//  Copyright © 2024 Massachusetts Institute of Technology. All rights reserved.
//

import Foundation
import Accelerate

protocol HasTrendline {
  func getPoints(xMin: CGFloat, xMax: CGFloat, viewWidth: Int) -> [CGPoint]
  func getColor() -> UIColor
  func getDashPattern() -> [CGFloat]?
  func getLineWidth() -> CGFloat
  func isVisible() -> Bool
}

protocol TrendlineCalculator {
  /**
   Compute the trendline for the given x and y values. The x and y arrays must be the same length.

   - Parameters:
   - x: The array of x values.
   - y: The array of y values.
   - Returns: A dictionary containing the results of the computation. The specific keys will vary depending on the underlying model.
   */
  func compute(x: [Double], y: [Double]) -> [String: Double]

  /**
   Compute a set of points that represents the trendline to be drawn on a Chart. The result is an array of
   CGPoint representing the points of the trendline.

   - Parameters:
   - results: The results from a previous call to `compute`.
   - xMin: The x value of the left edge of the chart.
   - xMax: The x value of the right edge of the chart.
   - viewWidth: The width of the chart view, in points.
   - steps: The number of segments to compute.
   - Returns: An array of CGPoint containing the points of the trendline.
   */
  func computePoints(results: [String: Double], xMin: Double, xMax: Double, viewWidth: Int, steps: Int) -> [CGPoint]
}

class LinearRegression: TrendlineCalculator {
  func compute(x: [Double], y: [Double]) -> [String: Double] {
    guard !x.isEmpty, !y.isEmpty, x.count == y.count else {
      fatalError("Lists must not be empty and must have equal numbers of elements")
    }

    let n = Double(x.count)
    let sumx = x.reduce(0, +)
    let sumy = y.reduce(0, +)
    let sumxy = zip(x, y).reduce(0) { $0 + $1.0 * $1.1 }
    let sumxSquared = x.reduce(0) { $0 + $1 * $1 }
    let sumySquared = y.reduce(0) { $0 + $1 * $1 }

    let xmean = sumx / n
    let ymean = sumy / n

    let xxmean = x.reduce(0) { $0 + ($1 - xmean) * ($1 - xmean) }
    let xymean = zip(x, y).reduce(0) { $0 + ($1.0 - xmean) * ($1.1 - ymean) }

    let slope = xymean / xxmean
    let intercept = ymean - slope * xmean

    let predictions = x.map { slope * $0 + intercept }

    let corrNumerator = n * sumxy - sumx * sumy
    let corrDenominator = sqrt((n * sumxSquared - sumx * sumx) * (n * sumySquared - sumy * sumy))
    let corr = corrNumerator / corrDenominator

    let results: [String: Double] = [
      "slope": slope,
      "Yintercept": intercept,
      "correlation coefficient": corr,
      "r^2": corr * corr,
      "Xintercepts": slope == 0 ? Double.nan : -intercept / slope
    ]

    return results
  }

  func computePoints(results: [String: Double], xMin: Double, xMax: Double, viewWidth: Int, steps: Int) -> [CGPoint] {
    guard let slope = results["slope"],
          let intercept = results["Yintercept"] else {
      return []
    }

    let yMin = slope * xMin + intercept
    let yMax = slope * xMax + intercept

    return [CGPoint(x: xMin, y: yMin), CGPoint(x: xMax, y: yMax)]
  }
}
