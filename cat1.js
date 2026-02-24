// subroutine to estimate a proportion or test for a special value
// All global state is now managed through AppState namespace

  function summarizeP1() {
    // builds summary table and plot for 1 categorical variable
    var colors = [];

    AppState.cat1Label1 = document.getElementById("cat1Label1").value;
    AppState.cat1Label2 = document.getElementById("cat1Label2").value;
    AppState.cat1N1 = +document.getElementById("cat1N1").value;
    AppState.cat1N2 = +document.getElementById("cat1N2").value;
    AppState.proportion = AppState.cat1Phat = AppState.cat1N1 / (AppState.cat1N1 + AppState.cat1N2);
    AppState.cat1Summ = document.getElementById("cat1SummaryText");
    document.getElementById("cat1SummarySVGgoesHere").style.display = "block";

       document.getElementById("inferenceInputs").style.display = 'block';
       document.getElementById("inferenceText").innerHTML = ' ';
       document.getElementById("moreTEsims").style.display = 'none';
       document.getElementById("testInpt").style.display = 'none';
       document.getElementById("confLvlInpt").style.display = 'none';
       d3.select("#infSVGplot_svg").remove();

    AppState.resampleC1 = [];
    AppState.sampleC1 = [];

    AppState.cat1Summ.innerHTML =
      `p&#770; =  ${AppState.cat1Phat.toPrecision(4)} <br> se(p&#770) = ${(Math.sqrt(AppState.cat1Phat * (1 - AppState.cat1Phat) / (AppState.cat1N1 + AppState.cat1N2))).toPrecision(3)}`;
    AppState.cat1Summ.style = "display: block";

    AppState.c1Data = [
      {
        label: AppState.cat1Label1,
        xx: AppState.cat1Phat
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
       document.getElementById('cat1SummaryText').style.display = 'none';
 			 document.getElementById('cat1SummarySVGgoesHere').style.display =  'none';
       document.getElementById("moreTEsims").style.display = 'none';
       document.getElementById("inferenceText").style.display = 'none';
       document.getElementById("inferenceInputs").style.display = 'none';
       document.getElementById("infSVGplot").style.display = 'none';
    };

function changeNullC1 (){
      //function to remove outdated info and Plot
      AppState.sample4Test = AppState.testData = [];
       document.getElementById("infSVGplot").style.display = 'none';
       document.getElementById("moreTEsims").style.display = 'none';
       document.getElementById("inferenceText").style.display = 'none';
    };



function resample1C4Test(nreps) {
  //function to test 'Is the true proportion  = some value?' for 'success/failure' data
  // Gather Inputs:
  AppState.cat1Label1 = document.getElementById("cat1Label1").value;
  AppState.cat1Label2 = document.getElementById("cat1Label2").value;
  AppState.cat1N1 = +document.getElementById("cat1N1").value;
  AppState.cat1N2 = +document.getElementById("cat1N2").value;
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
