/**
 * Configuration constants for JSpin statistical tool
 * Centralized location for all magic numbers and configuration values
 * Updated: February 2026
 */

const CONFIG = {
  // ============ UI Dimensions ============
  UI: {
    // Mix box drawing
    mixBoxWidth: 400,
    mixBoxHeight: 300,
    mixRadius: 10,
    mixDuration: 500,
    mixSlideDuration: 250,
    mixSpacing: 12,

    // Proportion CI demo
    propCIWidth: 400,
    propCIHeight: 300,
    propCIRadius: 6,
    propCIMargin: { top: 10, right: 20, bottom: 30, left: 50 },

    // T-distribution plot
    tplotWidth: 540,
    tplotHeight: 320,
    tplotMargin: { top: 10, right: 20, bottom: 30, left: 50 },
    tplotTicksX: 7,
    tplotTicksY: 5,

    // Spinner visualization
    spinnerWidth: 400,
    spinnerHeight: 300,
    spinnerRadius: 110,
    spinnerTextRadius: 150,
    spinnerInnerRadius: 75,
    spinnerMargin: { top: 50, right: 20, bottom: 50, left: 20 },
    spinnerSpacing: 10,
    spinnerDuration: 400,
    spinnerSlideDuration: 400,
  },

  // ============ Default Values ============
  DEFAULTS: {
    // Proportions and probabilities
    defaultProportion: 0.5,
    defaultConfidence: 0.80,
    defaultConfidenceLevelPercent: 90,
    defaultNullValue: 0.0,
    defaultTrueP: 0.45,

    // Sample sizes
    defaultSampleSize: 40,
    defaultNumSpins: 20,
    defaultNumIntervals: 10,
    nLevels: [4, 10, 20, 30, 40, 50],
  },

  // ============ Colors ============
  COLORS: {
    propCIColors: ["red", "steelblue"],
    ciSuccessColor: "steelblue",
    ciFailureColor: "red",
    lightBlueHighlight: "lightblue",
  },

  // ============ T-Distribution Plot ============
  TPLOT: {
    sequenceMin: -5.2,
    sequenceMax: 5.2,
    sequenceStep: 1 / 30,
    defaultDegreesFreedom: 10,
    defaultAlpha: 0.05,
    zeroThreshold: 0.000,
  },

  // ============ Box Coordinates (Mix) ============
  BOX: {
    getBoxData: function(w, h) {
      return [
        { x: w / 2 - 40, y: h / 2 - 2 },
        { x: -w / 2 + 22, y: h / 2 - 2 },
        { x: -w / 2 + 22, y: -h / 2 },
        { x: w / 2 - 40, y: -h / 2 + 2 },
        { x: w / 2 - 40, y: h / 2 - 40 }
      ];
    },
  },

  // ============ Confidence Level Ranges ============
  VALIDATION: {
    confidenceLevelMin: 50,
    confidenceLevelMax: 100,
    alphaThreshold: 0.0000001,
  },

  // ============ Text/UI Labels ============
  LABELS: {
    plusMinus: "+/-",
    ruleOf3Label: "rule of 3",
    estimate: "Estimate",
  },
};

// Make CONFIG globally available
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
