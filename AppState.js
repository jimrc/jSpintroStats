/**
 * AppState.js
 * Central namespace for all global application state
 * Replaces scattered global variables across the application
 */

const AppState = {
  // Main configuration
  circleColors: ["steelblue", "red"],
  cnfLvl: 0.80,
  confLevels: [
    { key: "80%", value: "0.80" },
    { key: "90%", value: "0.90" },
    { key: "95%", value: "0.95" },
    { key: "99%", value: "0.99" }
  ],

  // Statistical parameters
  mean: 0,
  proportion: 0.5,
  difference: 0,
  slope: 0,
  nullValue: undefined,
  observed: undefined,
  lowerBd: undefined,
  upperBd: undefined,
  inference: undefined,
  testDirection: 'both',

  // Inference arrays
  sample4Test: [],
  resample4CI: [],
  CIData: [],
  testData: [],
  xLabel: '',
  xLab: '',
  ciInftop: '',

  // UI references
  ciInftop: '',
  CIrangeslide: [],
  demo: undefined,
  variable: undefined,
  vbleChoice: undefined,

  // Categorical 1 variables
  cat1Label1: '',
  cat1Label2: '',
  cat1N1: 0,
  cat1N2: 0,
  cat1Phat: 0.5,
  c1Data: [],
  cat1Bars: undefined,
  cat1Summ: undefined,
  resampleC1: [],
  sampleC1: [],

  // Categorical 2 variables
  cat2Label1: '',
  cat2Label2: '',
  cat2N11: 0,
  cat2N12: 0,
  cat2N21: 0,
  cat2N22: 0,
  c2Data: [],
  cat2Bars: undefined,
  proportions: [],
  phat1: 0,
  phat2: 0,

  // Quantitative 1 variables
  q1Label: '',
  q1Values: [],
  q1Xbar: 0,
  q1SD: 0,
  q1N: 0,
  q1Data: [],
  resampleQ1: [],
  sampleQ1: [],

  // Quantitative 2 variables
  q2Label1: '',
  q2Label2: '',
  q2Values: [],
  q2Data: [],
  slope: 0,
  intercept: 0,
  q2Xbar: 0,
  q2Ybar: 0,
  q2SD: 0,
  q2N: 0,

  // Categorical + Quantitative variables
  c1q1Data: [],
  diff: 0,
  diffMeans: [],
  resampleDiff: [],
  sampleDiff: [],

  // Spinner demo state
  swidth: 400,
  sheight: 300,
  spinRadius: 110,
  spinTextRadius: 150,
  spinInnerRadius: 75,
  spinMargin: { top: 50, right: 20, bottom: 50, left: 20 },
  spinSpacing: 10,
  spinColors: [],
  spinGroups: [],
  spinProb: [],
  spinCumProb: [],
  spinNCat: 0,
  spinDuration: 400,
  spinSlideDuration: 400,
  spinRepResults: [],
  spinStopRule: undefined,
  stopRuleChange: false,
  hideSpins: false,
  nCat: 0,
  nSpin: 0,

  // Mixer state
  mixColors: [],
  mixN: 0,
  mixProb: [],
  mixRepResults: [],
  mixNBalls: 0,

  // Lurking variable states
  lurkingCat: undefined,
  lurkingQuant: undefined,
  lurkerData: [],

  // Power analysis state
  powerShift: 0,
  powerN: 0,
  powerSD: 0,
  powerReps: 0,

  // Plot references
  currentPlot: undefined,
  currentSVG: undefined,

  // Helper variables
  noChoice: "undefined"
};

// Freeze the top level to prevent accidental property additions
Object.freeze(Object.keys(AppState));
