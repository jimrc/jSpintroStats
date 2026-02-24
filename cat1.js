// subroutine to estimate a proportion or test for a special value
// All global state is now managed through AppState namespace

  function summarizeP1() {
    // builds summary table and plot for 1 categorical variable
    const data = VALIDATION.validateCat1Data();
    if (!data) return; // Validation failed, error already shown

    var colors = [];

    AppState.cat1Label1 = data.label1;
    AppState.cat1Label2 = data.label2;
    AppState.cat1N1 = data.n1;
    AppState.cat1N2 = data.n2;
    AppState.proportion = AppState.cat1Phat = AppState.cat1N1 / (AppState.cat1N1 + AppState.cat1N2);
    AppState.cat1Summ = DOM.getElement("cat1SummaryText");
    DOM.show('cat1SummarySVGgoesHere');

    // Show the choice between CI and Test
    DOM.setState({
      inferenceInputs: 'show',
      moreTEsims: 'hide',
      testInpt: 'show',
      confLvlInpt: 'hide'
    });
    d3.select("#infSVGplot_svg").remove();

    AppState.resampleC1 = [];
    AppState.sampleC1 = [];
    AppState.nullValue = 0.5;  // Initialize null value

    AppState.cat1Summ.innerHTML =
      `p&#770; =  ${AppState.cat1Phat.toPrecision(4)} <br> se(p&#770) = ${(Utilities.calculateProportionSE(AppState.cat1Phat, AppState.cat1N1 + AppState.cat1N2)).toPrecision(3)}`;
    AppState.cat1Summ.style = "display: block";

    AppState.c1Data = [
      {
        label: AppState.cat1Label1,
        prop: AppState.cat1Phat
      }
    ];

    if (typeof AppState.cat1Bars === "function") {
      AppState.cat1Bars.data([AppState.cat1Phat]);
    } else {
      AppState.cat1Bars = propBarChart(AppState.c1Data, `Proportion ${AppState.cat1Label1}`)
        .data([AppState.cat1Phat])
        .height(100);
      d3.select("#cat1SummarySVGgoesHere").call(AppState.cat1Bars);
    }

  }

function c1TestEstimate(){
  let dIn, dSumm, infText, testInpts;
  dIn = TEMPLATES.cat1DataInput();
  dSumm = " ";
  //  		<!--  Inputs for each inference  (before plotting)  -->

  testInpts = TEMPLATES.cat1TestInputs();

  infText = " ";


  return [dIn, dSumm, testInpts, infText];
}



function renewC1 (){
      //function to remove outdated info and Plot
      AppState.sample4CI = AppState.resample4CI = AppState.testData = AppState.CIData = [];
      DOM.hide(['cat1SummaryText', 'cat1SummarySVGgoesHere', 'moreTEsims', 'inferenceText', 'inferenceInputs', 'infSVGplot']);
    };

function changeNullC1 (){
      //function to remove outdated info and Plot
      Utilities.clearAnalysis(['infSVGplot', 'moreTEsims', 'inferenceText']);
    };



function resample1C4Test(nreps) {
  //function to test 'Is the true proportion  = some value?' for 'success/failure' data
  // Gather and validate inputs:
  const data = VALIDATION.validateCat1Data();
  if (!data) return []; // Validation failed, error already shown

  AppState.cat1Label1 = data.label1;
  AppState.cat1Label2 = data.label2;
  AppState.cat1N1 = data.n1;
  AppState.cat1N2 = data.n2;
  document.getElementById("moreTEsims").style.display = 'block';

  const total = AppState.cat1N1 + AppState.cat1N2;
  const sampleC1 = rbinom(total, AppState.nullValue, nreps).sort(function(a, b) {
      return a - b;
    });
  const sC1Len = sampleC1.length;
  sampleC1 = sampleC1.map(val => val * (1 / total));
  return sampleC1;
}

function resample1C4CI(nreps) {
  //function to generate random draws from observed proportions
  // Gather Inputs:
  AppState.cat1N1 = +document.getElementById("cat1N1").value;
  AppState.cat1N2 = +document.getElementById("cat1N2").value;
  document.getElementById("moreTEsims").style.display = 'block';

  const total = AppState.cat1N1 + AppState.cat1N2;
  AppState.resampleC1 = rbinom(total, AppState.cat1Phat, nreps).sort(function(a, b) {
    return a - b;
  });
  AppState.resampleC1 = AppState.resampleC1.map(val => val * (1 / total));
  return AppState.resampleC1;
}
