//  javascript to setup main index.html
//  All global state is now managed through AppState namespace

//  Functions to activate Header Choices ///
function w3Open() {
  document.getElementById("main").style.marginLeft = "25%";
  document.getElementById("mySidebar").style.width = "25%";
  document.getElementById("mySidebar").style.display = "block";
}

function w3Close() {
  // close up the menu options
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
}

function actionsFunc(actns) {
  //  to open up submenus
  var x = document.getElementById(actns);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    x.previousElementSibling.className += " w3-blue";
  } else {
    x.className = x.className.replace(" w3-show", "");
    x.previousElementSibling.className = x.previousElementSibling.className.replace(" w3-blue", "");
  }
}

function choosePage(page, vble) {
  var i,
    x = document.getElementById(page).childNodes;
  //close all pages
  closePages();
  // open this one we're focused on
  document.getElementById(page).style.display = "block";
  // display all children on this page
  x = document.getElementById(page).childNodes;
  for (i = 1; i < x.length; i += 2) {
    x[i].style.display = "block";
  }
  w3Close();
}

function closePages() {
  var i,
    x = document.getElementsByClassName("Page");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
}



function testEstFn(vble) {
  // function to customize the testEst page for a particular type of variable.
  var hdr,
    divs = [],
    estimate = "estimate",
    g = "g",
    summaryText,
    summaryPlot,
    test = "test",
    title = document.getElementById("testEstHeader"),
    block1 = document.getElementById("dataIn"),
    block2 = document.getElementById("dataSummary"),
    block3 = document.getElementById("testInpt"),
    block4 = document.getElementById("inferenceText");

  var svgInf = d3.select("#infSVG"),
      svgSum = d3.select("#sumSVG");
  // clear old output:
  d3.select("#infSVGplot_svg").remove();
  document.getElementById('inferenceText').style.display = 'none';
  document.getElementById("moreTEsims").style.display = 'none';

  // if(typeof(CIrangeslide) === "object" && typeof(CIrangeslide.getValue) === "function"){
  //       CIrangeslide.getElement().style.display = "none"
  //       CIrangeslide = 'null';
  // }

  switch (vble) {
  case 'cat1': {
    hdr = "<b>Estimate</b> a single proportion or <b>Test</b> its value.";
    divs = c1TestEstimate();
    break; // End of c1Output
  }
  case 'quant1': {
    hdr = "<b>Estimate</b>  a single mean or <b>Test</b>  its value.";
    divs = q1TestEstimate();
    break;
  }
  case 'cat2': {
    hdr = "Estimate a difference in proportions or test that the difference is zero.";
    divs = c2TestEstimate();
    break;
  }
  case 'c1q1': {
    hdr = "Estimate a difference in means or test that the difference is zero.";
    divs = c1q1TestEstimate();
    break;
  }
  case 'quant2': {
    hdr = "<b>Estimate</b> a regression slope or <b>Test</b>  slope is zero.";
    divs = q2TestEstimate();
    break;
  }
  default: {
    hdr = "Unknown Variable Type";
    divs = genericTestDivs();
  }
  };
  title.innerHTML = hdr;
  block1.innerHTML = divs[0]; // dataIn
  block2.innerHTML = divs[1]; //dataSummary
  block3.innerHTML = divs[2]; // Test Input
  //block4.innerHTML = divs[4]; // Inf Text
  document.getElementById("moreTEsims").style.display = "none";
  document.getElementById("confLvlInpt").style.display = "none";

    // CIrangeslide = rangeslide("#confLvlInpt", {
    //   data: confLevels,
    //   showLabels: true,
    //   startPosition: 0,
    //   showTicks: false,
    //   dataSource: "value",
    //   labelsContent: "key",
    //   valueIndicatorContent: "key",
    //   thumbWidth: 24,
    //   thumbHeight: 24,
    //   handlers: {
    //     valueChanged: [CLChange]
    //   }
    // });

}



function CLChange(arg) {
  // set colors for dots to illustrate confidence interval
  // new dots come from an inference-specific function
  // Get new dots, color them, and plot them.
  const inferenceSVG = d3.select("#infSVGplot_svg");

  if (arg.value) {
    AppState.cnfLvl = +arg.value;
  } else {
    AppState.cnfLvl = 0.80
  }
  var sLen = AppState.resample4CI.length,
    tempColors = [];
  if (typeof (sLen) === 'undefined' || sLen < 1) {
    return;
  }
  AppState.resample4CI = AppState.resample4CI.sort(function (a, b) {
    return a - b;
  });
  tempColors = ciColor(AppState.resample4CI);
  AppState.xLabel = "Default";
  AppState.CIData = stackDots(AppState.resample4CI);
  for (i = 0; i < sLen; i++) {
    AppState.CIData[i].color = AppState.circleColors[tempColors[i]]
  }
  if (inferenceSVG.empty()) {
    makeScatterPlot(AppState.CIData, "infSVGplot", AppState.xLabel, AppState.xLab, " ", false);
  } else {
    // update Colors
    inferenceSVG.selectAll("circle")
      .data(AppState.CIData).attr("fill", d => d.color)
  }
  document.getElementById("inferenceText").innerHTML =
    AppState.ciInftop + sLen + " Re-samples <br>" + Math.round(AppState.cnfLvl * 100) +
    "% Confidence Interval: (" + AppState.lowerBd.toPrecision(4) + ", " + AppState.upperBd.toPrecision(4) + ") </div>";
  document.getElementById("inferenceText").style.display = 'block';
  document.getElementById("moreTEsims").style.display = "block";
}



function moreCI(nreps, concat) {
  //update plot to illustrate confidence interval
  //generate or update CI resample data
  var newSample = [],
    tempColors = [],
    lowCt, check = 0;
  if (typeof (concat) == 'undefined') {
    concat = false;
  }
  if (!concat) {
    AppState.resample4CI = [];
  }
  if (nreps > 0) {
    switch (AppState.variable) {
    case 'cat1': {
      newSample = resample1C4CI(nreps);
      AppState.ciInftop = "Confidence Interval for proportion based on ";
      AppState.xLabel = "Proportions from resampled datasets";
      AppState.xLab = "Phat ";
      break;
    }
    case 'quant1': {
      newSample = resample1Q4CI(nreps);
      AppState.ciInftop = "Confidence Interval for mean based on ";
      AppState.xLabel = "Means from resampled datasets";;
      AppState.xLab = "Resampled mean ";
      break;
    }
    case 'cat2': {
      newSample = resample2C4CI(nreps);
      AppState.ciInftop = "Confidence Interval for difference in proportions based on ";
      AppState.xLabel = "Differences in proportion from resampled datasets";
      AppState.xLab = "Resampled Phat1 - Phat2 ";
      break;
    }
    case 'c1q1': {
      newSample = resample1C1Q4CI(nreps);
      AppState.ciInftop = "Confidence Interval for difference in means based on ";
      AppState.xLabel = "Differences in mean from resampled datasets";
      AppState.xLab = "Resampled Mean1 - Mean2 ";
      break;
    }
    case 'quant2': {
      newSample = resampleSlope4CI(q2Values, nreps);
      AppState.ciInftop = "Confidence Interval for slope based on ";
      AppState.xLabel = "Slopes from resampled datasets";
      AppState.xLab = "Resampled Slope";
      break;
    }
    default: {}
    };
    //combine with old sims
    for (i = 0; i < nreps; i++) {
      AppState.resample4CI.push(newSample[i]);
    }
    // sort
    AppState.resample4CI = AppState.resample4CI.sort(function (a, b) {
      return a - b;
    });
    // get colors for inside/outside of observed
    sLen = AppState.resample4CI.length;
    tempColors = ciColor(AppState.resample4CI);
    AppState.CIData = stackDots(AppState.resample4CI);
    for (i = 0; i < sLen; i++) {
      AppState.CIData[i].color = AppState.circleColors[tempColors[i]];
    }
    if (!d3.select("#infSVGplot_svg").empty()) {
      d3.select("#infSVGplot_svg").remove();
    }
    document.getElementById("infSVGplot").style.display = 'block';

    makeScatterPlot(AppState.CIData, "infSVGplot", AppState.xLabel, AppState.xLab, " ", false);
  }
  document.getElementById("inferenceText").innerHTML =
    AppState.ciInftop + sLen + " Re-samples <br>" + Math.round(AppState.cnfLvl * 100) +
    "% Confidence Interval: (" + AppState.lowerBd.toPrecision(4) + ", " + AppState.upperBd.toPrecision(4) + ") </div>";
  document.getElementById("inferenceText").style.display = 'block';
}

function moreTests(nreps, concat) {
  //generate or update test resmaple data
  var newSample = [],
    testColor = [],
    lowV, lowCt, hiV, check = 0,
    extCount = 0;
  if (typeof (concat) == 'undefined') {
    concat = false;
  }
  if (!concat) {
    AppState.sample4Test = [];
  }
  if (nreps > 0) {
    switch (AppState.variable) {
    case 'cat1': {
      if (AppState.nullValue > 0.00 & AppState.nullValue < 1.00) {
        newSample = resample1C4Test(nreps);
      } else {
        console.log("null probability not in (0,1)")
      }
      AppState.observed = AppState.proportion;
      AppState.xLabel = "Proportions " + AppState.cat1Label1 + " from resamples under the null ";
      AppState.xLab = "Phat ";
      break;
    }
    case 'quant1':{
      newSample = resample1Q4Test(nreps);
      AppState.observed = AppState.q1Xbar;
      AppState.xLabel = "Means from resamples under the null  ";
      AppState.xLab = "Resampled mean ";
      break;
    }
    case 'cat2': {
      newSample = resample2C4Test(nreps);
      AppState.nullValue = 0.0;
      AppState.observed = AppState.difference;
      AppState.xLabel = "Differences in proportions from resamples under the null ";
      AppState.xLab = "Phat1 - Phat2 ";
      break;
    }
    case 'c1q1': {
      newSample = resample1C1Q4Test(nreps);
      AppState.nullValue = 0.0;
      AppState.observed = AppState.diff;
      AppState.xLabel = "Differences in means from resamples under the null ";
      AppState.xLab = "Resampled Mean1 - Mean2 ";
      break;
    }
    case 'quant2': {
      newSample = resampleSlope4Test(q2Values, nreps);
      AppState.xLabel = "Slopes from resampled data under the null ";
      AppState.xLab = "Resampled Slope";
      AppState.nullValue = 0.0;
      AppState.observed = AppState.slope;
      break;
    }
    default: {}
  };
  //combine with old sims
  for (i = 0; i < nreps; i++) {
    AppState.sample4Test.push(newSample[i]);
  }
}
// sort
AppState.sample4Test = AppState.sample4Test.sort(function (a, b) {
  return a - b;
});
// get colors for inside/outside of observed
sLen = AppState.sample4Test.length;
testColor = sameVector(0, sLen); // set all to zero
if (typeof (AppState.testDirection) === 'undefined') {
  AppState.testDirection = 'both'
}
switch (AppState.testDirection) {
case "lower": {
  for (i = 0; i < sLen; i++) {
    check = 0 + (AppState.sample4Test[i] <= AppState.observed);
    extCount += check;
    testColor[i] = check;
    if (check == 0) {
      break;
    }
  }
  break;
}
case "upper": {
  for (i = sLen - 1; i > -1; i--) {
    check = 0 + (AppState.sample4Test[i] >= AppState.observed);
    extCount += check;
    testColor[i] = check;
    if (check == 0) {
      break;
    }
  }
  break;
}
case "both": {
  lowV = AppState.observed * (AppState.observed <= AppState.nullValue) +
    (2 * AppState.nullValue - AppState.observed) * (AppState.observed > AppState.nullValue) +
    1 / 1000000;
  hiV = AppState.observed * (AppState.observed >= AppState.nullValue) +
    (2 * AppState.nullValue - AppState.observed) * (AppState.observed < AppState.nullValue) -
    1 / 1000000;
  for (i = 0; i < sLen; i++) {
    check = 0.0 + (AppState.sample4Test[i] <= lowV)
    if (check == 0.0 & AppState.sample4Test[i] >= hiV) {
      check = 1.0
    };
    extCount += check;
    testColor[i] = check;
  }
  break;
}
default: {}
}
// plot
AppState.testData = stackDots(AppState.sample4Test);
for (i = 0; i < sLen; i++) {
  AppState.testData[i].color = AppState.circleColors[testColor[i]];
}
if (!d3.select("#infSVGplot_svg").empty()) {
  d3.select("#infSVGplot_svg").remove();
}
document.getElementById("infSVGplot").style.display = 'block';
document.getElementById("moreTEsims").style.display = 'block';
makeScatterPlot(AppState.testData, "infSVGplot", AppState.xLabel, AppState.xLab, " ", false);

//find p-value
document.getElementById("inferenceText").innerHTML =
  "P-value: " + formatPvalue(extCount, sLen) + "  based on " + sLen + " resamples.";
document.getElementById("inferenceText").style.display = 'block';
}

function demoFn(demo) {
  var hdr,
    demoDivs = [],
    title = document.getElementById("demoHeader"),
    block1 = document.getElementById("demoDiv1"),
    block2 = document.getElementById("demoDiv2"),
    block3 = document.getElementById("demoDiv3");
  switch (demo) {
  case 'Spinner': {
    hdr = 'Random sampling via a spinner';
    demoDivs = spinDivs();
    break;
  }
  case 'Mixer': {
    hdr = 'Random sampling by drawing balls from a box';
    demoDivs = mixerDivs();
    break;
  }
  case 'propCIdemo': {
    hdr = "What is our 'Confidence' in a Confidence Interval?";
    demoDivs = propCIDivs(); //CI_demo_Divs();
    break;
  }
  case 'lurkingC1': {
    hdr = 'Demo of the effects of a categorical lurking variable on proportion estimates.'
    demoDivs = lurkingC1Divs();
    break;
  }
  case 'lurkingQ1': {
    hdr = 'Demo of the effects of a quantitative lurking variable on mean estimates.'
    demoDivs = ["  ", "  ", "  "];
    break; // power  bootstrap sampling regression
  }
  case 'power': {
    hdr = 'Visual assessment of the power of a  test to find a shift in mean.'
    demoDivs = powerDivs();
    break;
  }
  case 'bootstrap': {
    hdr = 'Demo of the process of bootstrapping a mean.'
    demoDivs = ["  ", "  ", "  "];
    break;
  }
  case 'sampling': {
    hdr = 'Demo of sampling.'
    demoDivs = ["  ", "  ", "  "];
    break;
  }
  case 'regression': {
    hdr = 'Demo of how regression might be influenced by changing one point.'
    demoDivs = ["  ", "  ", "  "];
    break; // power  bootstrap sampling regression
  }
  default: {
    hdr = "Unknown Demo";
  }
  }
  title.innerHTML = hdr;
  block1.innerHTML = demoDivs[0];
  block2.innerHTML = demoDivs[1];
  block3.innerHTML = demoDivs[2];

}


function genericDemoDivs() {
  // set up a demo page
  var div1, div2, div3;
  return [div1, div2, div3];
}
