/**
 * Input Validation and Error Handling Utilities
 * Centralized validation functions for all user inputs
 * Updated: February 2026
 */

const VALIDATION = {
  /**
   * Error callback function for displaying errors to user
   * Default: shows alert. Can be overridden for different UI patterns
   */
  onError: (message) => {
    console.error(message);
    alert(message);
  },

  /**
   * Validate that a numeric input is within bounds
   * @param {number} value - The value to validate
   * @param {number} min - Minimum allowed value (inclusive)
   * @param {number} max - Maximum allowed value (inclusive)
   * @param {string} fieldName - Name of field for error message
   * @returns {boolean} True if valid, false otherwise
   */
  isInRange: (value, min, max, fieldName = 'Value') => {
    if (isNaN(value) || value < min || value > max) {
      VALIDATION.onError(`${fieldName} must be between ${min} and ${max}. Got: ${value}`);
      return false;
    }
    return true;
  },

  /**
   * Validate that a value is a positive number
   * @param {number} value - The value to validate
   * @param {string} fieldName - Name of field for error message
   * @returns {boolean} True if valid, false otherwise
   */
  isPositive: (value, fieldName = 'Value') => {
    if (isNaN(value) || value <= 0) {
      VALIDATION.onError(`${fieldName} must be a positive number. Got: ${value}`);
      return false;
    }
    return true;
  },

  /**
   * Validate that a value is a non-negative integer
   * @param {number} value - The value to validate
   * @param {string} fieldName - Name of field for error message
   * @returns {boolean} True if valid, false otherwise
   */
  isNonNegativeInteger: (value, fieldName = 'Value') => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num !== parseFloat(value)) {
      VALIDATION.onError(`${fieldName} must be a non-negative integer. Got: ${value}`);
      return false;
    }
    return true;
  },

  /**
   * Validate that a value is not empty
   * @param {string} value - The value to validate
   * @param {string} fieldName - Name of field for error message
   * @returns {boolean} True if valid, false otherwise
   */
  isNotEmpty: (value, fieldName = 'Value') => {
    if (!value || value.trim() === '') {
      VALIDATION.onError(`${fieldName} is required and cannot be empty.`);
      return false;
    }
    return true;
  },

  /**
   * Validate categorical input - parse comma-separated labels
   * @param {string} inputString - Comma-separated labels
   * @returns {Array|null} Array of trimmed labels, or null if invalid
   */
  parseCategoricalLabels: (inputString) => {
    if (!VALIDATION.isNotEmpty(inputString, 'Labels')) return null;
    const labels = inputString.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (labels.length < 2) {
      VALIDATION.onError('Must have at least 2 labels. Please enter labels separated by commas.');
      return null;
    }
    return labels;
  },

  /**
   * Validate numeric array input - parse comma-separated numbers
   * @param {string} inputString - Comma-separated numbers
   * @param {string} fieldName - Name of field for error message
   * @returns {Array|null} Array of parsed numbers, or null if invalid
   */
  parseNumericArray: (inputString, fieldName = 'Values') => {
    if (!VALIDATION.isNotEmpty(inputString, fieldName)) return null;
    try {
      const values = inputString.split(',').map(s => {
        const num = parseFloat(s.trim());
        if (isNaN(num)) throw new Error(`"${s.trim()}" is not a valid number`);
        return num;
      });
      if (values.length === 0) {
        VALIDATION.onError(`${fieldName} cannot be empty.`);
        return null;
      }
      return values;
    } catch (e) {
      VALIDATION.onError(`${fieldName} contains invalid data: ${e.message}`);
      return null;
    }
  },

  /**
   * Validate and get numeric input value from DOM element
   * @param {string} elementId - ID of input element
   * @param {number} min - Minimum allowed value (optional)
   * @param {number} max - Maximum allowed value (optional)
   * @param {string} fieldName - Name of field for error message
   * @returns {number|null} Parsed number, or null if invalid
   */
  getNumericInput: (elementId, min, max, fieldName) => {
    const element = document.getElementById(elementId);
    if (!element) {
      VALIDATION.onError(`Element with ID "${elementId}" not found.`);
      return null;
    }
    const value = parseFloat(element.value);
    if (isNaN(value)) {
      VALIDATION.onError(`${fieldName} must be a number. Got: "${element.value}"`);
      return null;
    }
    if (min !== undefined && max !== undefined) {
      if (!VALIDATION.isInRange(value, min, max, fieldName)) return null;
    }
    return value;
  },

  /**
   * Validate and get string input value from DOM element
   * @param {string} elementId - ID of input element
   * @param {string} fieldName - Name of field for error message
   * @returns {string|null} Trimmed string, or null if invalid/empty
   */
  getStringInput: (elementId, fieldName) => {
    const element = document.getElementById(elementId);
    if (!element) {
      VALIDATION.onError(`Element with ID "${elementId}" not found.`);
      return null;
    }
    const value = element.value.trim();
    if (!VALIDATION.isNotEmpty(value, fieldName)) return null;
    return value;
  },

  /**
   * Categorical 1-variable data validation
   * Validates: labels and counts
   * @returns {object|null} {label1, label2, n1, n2} or null if invalid
   */
  validateCat1Data: () => {
    const label1 = VALIDATION.getStringInput('cat1Label1', 'First category label');
    if (!label1) return null;

    const label2 = VALIDATION.getStringInput('cat1Label2', 'Second category label');
    if (!label2) return null;

    const n1 = VALIDATION.getNumericInput('cat1N1', 0, Infinity, 'First count');
    if (n1 === null) return null;

    const n2 = VALIDATION.getNumericInput('cat1N2', 0, Infinity, 'Second count');
    if (n2 === null) return null;

    if (!VALIDATION.isPositive(n1 + n2, 'Total count')) return null;

    return { label1, label2, n1, n2 };
  },

  /**
   * Quantitative 1-variable data validation
   * Validates: label and comma-separated numeric values
   * @returns {object|null} {label, values} or null if invalid
   */
  validateQ1Data: () => {
    const label = VALIDATION.getStringInput('q1Label', 'Variable label');
    if (!label) return null;

    const valuesInput = VALIDATION.getStringInput('q1Values', 'Data values');
    if (!valuesInput) return null;

    const values = VALIDATION.parseNumericArray(valuesInput, 'Data values');
    if (!values) return null;

    if (values.length < 2) {
      VALIDATION.onError('Need at least 2 data values.');
      return null;
    }

    return { label, values };
  },

  /**
   * Confidence level validation (50-100%)
   * @param {number} confLevel - Confidence level percentage
   * @returns {boolean} True if valid
   */
  isValidConfidenceLevel: (confLevel) => {
    return VALIDATION.isInRange(
      confLevel,
      CONFIG.VALIDATION.confidenceLevelMin,
      CONFIG.VALIDATION.confidenceLevelMax,
      'Confidence Level'
    );
  },

  /**
   * Sample size validation (must be positive integer)
   * @param {number} size - Sample size
   * @returns {boolean} True if valid
   */
  isValidSampleSize: (size) => {
    return VALIDATION.isNonNegativeInteger(size, 'Sample Size') && size > 0;
  },

  /**
   * Proportion validation (0 to 1)
   * @param {number} proportion - Proportion value
   * @returns {boolean} True if valid
   */
  isValidProportion: (proportion) => {
    return VALIDATION.isInRange(proportion, 0, 1, 'Proportion');
  },

  /**
   * Mix box data validation
   * Validates: category labels and ball counts
   * @returns {object|null} {labels, counts} or null if invalid
   */
  validateMixData: () => {
    const labelsInput = VALIDATION.getStringInput('mixCats', 'Category labels');
    if (!labelsInput) return null;

    const labels = VALIDATION.parseCategoricalLabels(labelsInput);
    if (!labels) return null;

    const countsInput = VALIDATION.getStringInput('mixNs', 'Ball counts');
    if (!countsInput) return null;

    const counts = VALIDATION.parseNumericArray(countsInput, 'Ball counts');
    if (!counts) return null;

    // Check that all counts are positive
    for (let i = 0; i < counts.length; i++) {
      if (!VALIDATION.isPositive(counts[i], `Ball count for "${labels[i]}"`)) return null;
      if (counts[i] !== Math.floor(counts[i])) {
        VALIDATION.onError(`Ball count for "${labels[i]}" must be a whole number. Got: ${counts[i]}`);
        return null;
      }
    }

    // Lengths must match
    if (labels.length !== counts.length) {
      VALIDATION.onError(`Number of labels (${labels.length}) must match number of counts (${counts.length}).`);
      return null;
    }

    return { labels, counts };
  },
};

// Make VALIDATION globally available
if (typeof window !== 'undefined') {
  window.VALIDATION = VALIDATION;
}
