/**
 * Utilities.js - Consolidated utility functions
 * Contains common, reusable functions extracted from across the codebase
 * to reduce code duplication and improve maintainability
 */

const Utilities = {
  /**
   * Clear data and UI for a new analysis
   * @param {Array<string>} elementIds - IDs of elements to hide
   */
  clearAnalysis: function(elementIds = []) {
    AppState.sample4Test = AppState.testData = [];
    elementIds.forEach(id => DOM.hide(id));
  },

  /**
   * Calculate standard error for a proportion
   * @param {number} phat - The proportion estimate
   * @param {number} n - Sample size
   * @returns {number} Standard error of the proportion
   */
  calculateProportionSE: function(phat, n) {
    return Math.sqrt(phat * (1 - phat) / n);
  },

  /**
   * Calculate standard error for a mean
   * @param {number} sd - Standard deviation
   * @param {number} n - Sample size
   * @returns {number} Standard error of the mean
   */
  calculateMeanSE: function(sd, n) {
    return sd / Math.sqrt(n);
  },

  /**
   * Calculate confidence interval half-width using z-score
   * @param {number} z - Z-score
   * @param {number} se - Standard error
   * @returns {number} Half-width of confidence interval
   */
  calculateCIHalfWidth: function(z, se) {
    return z * se;
  },

  /**
   * Calculate confidence interval half-width for proportion (alternative form)
   * @param {number} z - Z-score
   * @param {number} phat - The proportion estimate
   * @param {number} n - Sample size
   * @returns {number} Half-width of confidence interval
   */
  calculateProportionCIHalfWidth: function(z, phat, n) {
    return z * Math.sqrt(phat * (1 - phat) / n);
  },

  /**
   * Format a number for display in summary statistics
   * @param {number} value - Value to format
   * @param {number} precision - Number of significant digits
   * @returns {string} Formatted value
   */
  formatStat: function(value, precision = 4) {
    return value.toPrecision(precision);
  },

  /**
   * Get form input values and update AppState
   * Consolidates pattern of reading multiple inputs from DOM
   * @param {Object} spec - Object mapping AppState property to element ID
   * @example
   * Utilities.getFormInputs({
   *   cat1Label1: 'cat1Label1',
   *   cat1N1: 'cat1N1',
   *   cat1N2: 'cat1N2'
   * });
   */
  getFormInputs: function(spec) {
    const result = {};
    for (const [property, elementId] of Object.entries(spec)) {
      const element = document.getElementById(elementId);
      if (element) {
        // Try to convert to number if appropriate
        result[property] = isNaN(+element.value) ? element.value : +element.value;
      }
    }
    return result;
  },

  /**
   * Show/hide UI elements based on analysis type
   * @param {string} analysisType - Type of analysis (e.g., 'cat1', 'quant1')
   * @param {boolean} isTestMode - Whether in test mode vs CI mode
   */
  updateInferenceUI: function(analysisType, isTestMode) {
    if (isTestMode) {
      DOM.show(['inferenceInputs']);
      DOM.setDisplay('testInpt', 'block');
      DOM.hide(['confLvlInpt', 'inferenceText']);
    } else {
      DOM.show(['inferenceInputs']);
      DOM.hide(['testInpt']);
      DOM.setDisplay('confLvlInpt', 'block');
      DOM.hide(['inferenceText']);
    }
  },

  /**
   * Show inference results UI
   */
  showInferenceResults: function() {
    DOM.show(['inferenceText', 'moreTEsims', 'infSVGplot']);
  },

  /**
   * Clear inference results display
   */
  clearInferenceResults: function() {
    DOM.hide(['infSVGplot', 'moreTEsims', 'inferenceText']);
  },

  /**
   * Reset category 1 analysis UI
   */
  resetCat1UI: function() {
    DOM.hide([
      'cat1SummaryText',
      'cat1SummarySVGgoesHere',
      'moreTEsims',
      'inferenceText',
      'inferenceInputs',
      'infSVGplot'
    ]);
  },

  /**
   * Reset quantitative 1 analysis UI
   */
  resetQuant1UI: function() {
    const elements = [
      'q1Summary',
      'infSVGplot',
      'inferenceText',
      'confLvlInpt',
      'testInpt',
      'moreTEsims'
    ];
    elements.forEach(id => DOM.hide(id));
  },

  /**
   * Show/enable test replicate button
   */
  enableMoreTests: function() {
    DOM.setDisplay('moreTEsims', 'block');
  },

  /**
   * Show/enable CI replicate button
   */
  enableMoreCIs: function() {
    DOM.setDisplay('moreTEsims', 'block');
  },

  /**
   * Validate numeric input
   * @param {string} value - Value to validate
   * @param {number} min - Minimum allowed value (optional)
   * @param {number} max - Maximum allowed value (optional)
   * @returns {number|null} Parsed number or null if invalid
   */
  validateNumericInput: function(value, min, max) {
    const num = +value;
    if (isNaN(num)) return null;
    if (min !== undefined && num < min) return null;
    if (max !== undefined && num > max) return null;
    return num;
  }
};
