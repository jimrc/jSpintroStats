/**
 * DOM Utilities - Consolidated helper functions for common DOM operations
 * Centralizes repetitive element manipulation, display toggling, and styling
 * Updated: February 2026
 */

const DOM = {
  /**
   * Get element by ID with error checking
   * @param {string} elementId - ID of element to retrieve
   * @returns {HTMLElement|null} Element or null if not found
   */
  getElement: (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`DOM.getElement: Element with ID "${elementId}" not found`);
    }
    return element;
  },

  /**
   * Set element display style
   * @param {string} elementId - ID of element
   * @param {string} displayValue - 'block', 'none', 'flex', etc.
   */
  setDisplay: (elementId, displayValue) => {
    const element = DOM.getElement(elementId);
    if (element) {
      element.style.display = displayValue;
    }
  },

  /**
   * Show element (set display to 'block')
   * @param {string|Array<string>} elementIds - Single ID or array of IDs
   */
  show: (elementIds) => {
    const ids = Array.isArray(elementIds) ? elementIds : [elementIds];
    ids.forEach(id => DOM.setDisplay(id, 'block'));
  },

  /**
   * Hide element (set display to 'none')
   * @param {string|Array<string>} elementIds - Single ID or array of IDs
   */
  hide: (elementIds) => {
    const ids = Array.isArray(elementIds) ? elementIds : [elementIds];
    ids.forEach(id => DOM.setDisplay(id, 'none'));
  },

  /**
   * Toggle element visibility
   * @param {string} elementId - ID of element
   * @param {string} showValue - Display value when visible (default: 'block')
   */
  toggle: (elementId, showValue = 'block') => {
    const element = DOM.getElement(elementId);
    if (element) {
      element.style.display = element.style.display === 'none' ? showValue : 'none';
    }
  },

  /**
   * Set element HTML content
   * @param {string} elementId - ID of element
   * @param {string} htmlContent - HTML content to set
   */
  setHTML: (elementId, htmlContent) => {
    const element = DOM.getElement(elementId);
    if (element) {
      element.innerHTML = htmlContent;
    }
  },

  /**
   * Get element value (for inputs, selects, etc.)
   * @param {string} elementId - ID of element
   * @returns {string|null} Element value or null if not found
   */
  getValue: (elementId) => {
    const element = DOM.getElement(elementId);
    return element ? element.value : null;
  },

  /**
   * Set element value
   * @param {string} elementId - ID of element
   * @param {string} value - Value to set
   */
  setValue: (elementId, value) => {
    const element = DOM.getElement(elementId);
    if (element) {
      element.value = value;
    }
  },

  /**
   * Clear element (empty innerHTML and value)
   * @param {string} elementId - ID of element
   */
  clear: (elementId) => {
    const element = DOM.getElement(elementId);
    if (element) {
      element.innerHTML = '';
      if ('value' in element) {
        element.value = '';
      }
    }
  },

  /**
   * Add class to element
   * @param {string} elementId - ID of element
   * @param {string} className - Class name to add
   */
  addClass: (elementId, className) => {
    const element = DOM.getElement(elementId);
    if (element) {
      element.classList.add(className);
    }
  },

  /**
   * Remove class from element
   * @param {string} elementId - ID of element
   * @param {string} className - Class name to remove
   */
  removeClass: (elementId, className) => {
    const element = DOM.getElement(elementId);
    if (element) {
      element.classList.remove(className);
    }
  },

  /**
   * Show summary/results UI state
   * Shows: summary, plot, inference inputs
   * Hides: other UI elements (assumes standard naming)
   */
  showSummary: () => {
    DOM.show(['inferenceInputs']);
    DOM.setHTML('inferenceText', ' ');
    DOM.hide(['moreTEsims', 'testInpt', 'confLvlInpt']);
  },

  /**
   * Show inference/test results UI state
   * Shows: results area, simulation button
   * Hides: other UI elements
   */
  showInferenceResults: () => {
    DOM.show(['inferenceText', 'moreTEsims', 'infSVGplot']);
  },

  /**
   * Hide inference/test UI
   * Hides: all inference-related elements
   */
  hideInferenceUI: () => {
    DOM.hide(['infSVGplot', 'moreTEsims', 'inferenceText']);
  },

  /**
   * Reset inference controls
   * Clears data and hides test controls
   */
  resetInferenceUI: () => {
    DOM.hide(['cat1SummaryText', 'cat1SummarySVGgoesHere', 'moreTEsims', 'inferenceText', 'inferenceInputs', 'infSVGplot']);
  },

  /**
   * Generic element state manager
   * Sets multiple elements to show/hide at once
   * @param {Object} states - {elementId: 'show'|'hide'|'block'|'none', ...}
   */
  setState: (states) => {
    Object.entries(states).forEach(([elementId, state]) => {
      if (state === 'show' || state === 'block') {
        DOM.show(elementId);
      } else if (state === 'hide' || state === 'none') {
        DOM.hide(elementId);
      } else {
        DOM.setDisplay(elementId, state);
      }
    });
  },

  /**
   * Append element to parent
   * @param {string} parentId - ID of parent element
   * @param {HTMLElement} childElement - Child element to append
   */
  append: (parentId, childElement) => {
    const parent = DOM.getElement(parentId);
    if (parent) {
      parent.appendChild(childElement);
    }
  },

  /**
   * Remove all children from element
   * @param {string} elementId - ID of element
   */
  removeChildren: (elementId) => {
    const element = DOM.getElement(elementId);
    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  },

  /**
   * Remove element from DOM
   * @param {string|Array<string>} elementIds - Single ID or array of IDs
   */
  remove: (elementIds) => {
    const ids = Array.isArray(elementIds) ? elementIds : [elementIds];
    ids.forEach(id => {
      const element = DOM.getElement(id);
      if (element) {
        element.remove();
      }
    });
  },

  /**
   * Set CSS style properties on element
   * @param {string} elementId - ID of element
   * @param {Object} styles - {propertyName: value, ...}
   */
  setStyle: (elementId, styles) => {
    const element = DOM.getElement(elementId);
    if (element) {
      Object.entries(styles).forEach(([prop, value]) => {
        element.style[prop] = value;
      });
    }
  },
};

// Make DOM utilities globally available
if (typeof window !== 'undefined') {
  window.DOM = DOM;
}
