// subroutine to estimate a mean or test for a special value
// All global state is now managed through AppState namespace


function q1TestEstimate(){
    let dIn, dSumm, infText, testInpts, intervalInpts;
    dIn = TEMPLATES.q1DataInput();
    dSumm = " ";
    intervalInpts = "Estimate Mean";
    testInpts = TEMPLATES.q1TestInputs();

    infText = TEMPLATES.empty();

      return [dIn, dSumm,  testInpts, infText];
  }

function q1DataChange(){
     AppState.sample4Test = AppState.sample4CI = [];
     Utilities.resetQuant1UI();
}

function changeNullQ1 (){
      //function to remove outdated info and Plot
      Utilities.clearAnalysis(['infSVGplot', 'moreTEsims', 'inferenceText']);
    };



function resample1Q4Test(nreps) {
      //function to test 'Is the true mean  = some value?'
      AppState.nullValue = +document.getElementById('q1trueMu').value;
      AppState.q1N = AppState.q1Values.length;
      document.getElementById("moreTEsims").style.display = 'block';
      const shift = AppState.q1Xbar - AppState.nullValue;
      const q1Shifted = AppState.q1Values.map(val => val - shift);
      const resampleq1 = resample1Mean(q1Shifted, nreps).sort(function(a, b) {
          return a - b;
        });
      return resampleq1;
    }

function resample1Q4CI(nreps) {
      //function to generate random resamples and compute means
      const resampleq1 = resample1Mean(AppState.q1Values, nreps).sort(function(a, b) {
          return a - b;
        });
      document.getElementById("moreTEsims").style.display = 'block';
      return resampleq1;
    }

// All global state is now in AppState object (see AppState.js)

function summarizeMu1() {
  // builds summary table and dot plot for 1 quantitative variable
  const data = VALIDATION.validateQ1Data();
  if (!data) return; // Validation failed, error already shown

  const margin = 30,
    barHeight = 20,
    colors = [],
    w = 300,
    h = 60;

  AppState.q1Label = data.label;
  AppState.q1Values = data.values;
  AppState.q1N = AppState.q1Values.length;

  AppState.observed = AppState.q1Xbar = d3.mean(AppState.q1Values);
  AppState.q1SD = d3.deviation(AppState.q1Values);
  AppState.q1SEXbar = Utilities.calculateMeanSE(AppState.q1SD, AppState.q1N);
  
  // Show the choice between CI and Test (confLvlInpt hidden until user clicks Estimate)
  DOM.setState({
    inferenceInputs: 'show',
    moreTEsims: 'hide',
    testInpt: 'hide',
    confLvlInpt: 'hide'
  });
  d3.select("#infSVGplot_svg").remove();
  AppState.nullValue = AppState.q1Xbar;  // Initialize null value to observed mean
  AppState.inference = "estimate";  // Initialize to estimate mode
  
  document.getElementById("q1Summary").style.display = "block";
  const q1Summ = document.getElementById('q1SummaryText');
  AppState.q1Data = [
    { label: 'Xbar', xx: AppState.q1Xbar },
    { label: 'SE', xx: AppState.q1SEXbar },
    { label: 'Sample Size', xx: AppState.q1N },
  ];
  q1Summ.innerHTML =
    'x&#773; =  ' +
    AppState.q1Xbar.toPrecision(5) +
    ', &nbsp; &nbsp; s = ' +
    AppState.q1SD.toPrecision(5) +
    '<br> Sample Size = ' +
    AppState.q1N;
  q1Summ.style = 'display: block';
  document.getElementById('q1ObsdMean').innerHTML =
      "		&nbsp;&nbsp; the observed mean = " + AppState.observed.toPrecision(4);

  discreteChart(AppState.q1Values, document.getElementById('q1SmrySVG'));
}
