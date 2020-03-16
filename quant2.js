// subroutine to estimate a slope or correlation or test for slope of zero
// Inputs:   choose a prebuilt data set
//  TODO:  allow input of csv file and parse it.
//   clicking a point shows resampled slope (and correlation?)
// TODO:  Test plot is making error -- doesn't show
//         CI 's are cutof
//         CI plot has no colors -- am I passing them wrong?

var circleColors = ["steelblue", "red"],
  correlation,
  drawq2Inf = false,
  intercept,
  i,
  j,
  noChoice = "undefined",
  q2SummDiv = d3.select("#q2Inference"),
  q2Tstdata = [],
  q2CIdata = [],
  q2Label,
  q2Values = [],
  q2ftr = document.getElementById("quant2Results"),
  q2hdr = document.getElementById("quant2Output"),
  q2CnfLvl = 0.8,
  q2CLvl,
  q2lowerBd,
  q2upperBd,
  q2Null = 0,
  q2N,
  q2Pval,
  q2TestDirection,
  q2SumData = [],
  q2RawData = [],
  q2DataName,
  q2Color = [],
  confLevels = [
    { key: "80%", value: "0.80" },
    { key: "90%", value: "0.90" },
    { key: "95%", value: "0.95" },
    { key: "99%", value: "0.99" }
  ],
  q2Inference,
  q2InfOutput,
  q2SmryPlot,
  slope,
  resampleq2 = [],
  sampleq2 = [],
  sq2Len,
  targetQuantile,
  upperBd,
  upperCI,
  x = [],
  y = [];

var svgq2 = d3.select("#quant2InfSVG"),
  svgSumq2 = d3.select("#quant2SumSVG");
document.getElementById("quant2MoreSims").style.display = "none";
document.getElementById("quant2Results").style.display = "none";
document.getElementById("quant2Output").style.display = "none";
document.getElementById("quant2Inference").style.display = "none";

function summarizeSlope() {
  // builds summary table and dot plot for 2 quantitative variables
  var margin = 20,  dataLength,  q2Keys,
    xbar,    xVar,    ybar,    yVar,    coVar = 0,
    x = [],
    y = [];
  sampleq2 = resampleq2 = [];

  q2DataName = document.getElementById("quant2DataName").value;
  q2RawData =
    q2DataName === "shuttle"
      ? shuttle
      : q2DataName === "women"
      ? womenJudgingMen
      : q2DataName === "men"
      ? menJudgeWomen
      : q2DataName === "dental"
      ? dental
      : undefined; //(q2DataName === "other")
  if (q2RawData != undefined) {
    dataLength = q2RawData.length;
    q2Keys = Object.keys(q2RawData[0]);
    q2Values = [];

    for (i = 0; i < dataLength; i++) {
      x.push(+q2RawData[i][q2Keys[0]]);
      y.push(+q2RawData[i][q2Keys[1]]);
      coVar += x[i] * y[i]; // add up cross product
      q2Values.push({ x: x[i], y: y[i], color: circleColors[0] });
    }
    xbar = d3.mean(x);
    xVar = d3.variance(x);
    ybar = d3.mean(y);
    yVar = d3.variance(y);
    coVar = (coVar - dataLength * xbar * ybar) / (dataLength - 1);
    slope = coVar / xVar;
    intercept = ybar - slope * xbar;
    correlation = coVar / Math.sqrt(yVar * xVar);

    q2Summ = document.getElementById("quant2SummaryText");
    q2SumData = [
      { label: "Xbar", xx: xbar },
      { label: "Ybar", xx: ybar },
      { label: "Slope", xx: slope },
      { label: "Intercept", xx: intercept }
      //{"label": "SD from line", "xx": }
    ];
    q2Summ.innerHTML =
      "<br> x&#773; =  " +
      xbar.toPrecision(5) +
      "\t  y&#773; =  " +
      ybar.toPrecision(5) +
      "\t Sample Size = " +
      dataLength +
      "<br> Slope of Least Squares Regression Line = " +
      slope.toPrecision(4) +
      "<br> Correlation = " +
      correlation.toPrecision(4) +
      "<br> Least Squares Line: <br>   &nbsp; &nbsp; &nbsp; &nbsp; " +
      q2Keys[1] +" = " + intercept.toPrecision(4) + " + " + slope.toPrecision(4) + " * " + q2Keys[0];
    q2Summ.style = "display: block";

    //check for any old output plots. If present, erase them due to change in data
    if (q2InfOutput) {
      q2CIdata = q2Tstdata = [];
      document.getElementById("quant2Results").style.display = "none";
      document.getElementById("quant2Output").style.display = "none";
      document.getElementById("quant2MoreSims").style.display = "none";
      document.getElementById("quant2ConfLvl").style.display = "none";
      document.getElementById("quant2Test").style.display = "none";
      document.getElementById("quant2Inference").style.display = "none";
      document.getElementById("quant2WhichSlope").style.display = "none";
    }
    if (q2Values) {
      document.getElementById("quant2Summry").style.display = "block";
      document.getElementById("quant2SumSVG").style.display = "block";
      makeRegressionPlot(q2Values, "quant2SumSVG", q2Keys[0], q2Keys[1]);
    }

    document.getElementById("quant2SelectInf").style.display = "block";
    document.getElementById("quant2ObsdSlope").innerHTML =
      "&nbsp;&nbsp;" + slope.toPrecision(4) + " from above.";
  }
}


var q2CIrangeslide = rangeslide("#quant2ConfLvl", {
  data: confLevels,
  showLabels: true,
  startPosition: 0,
  showTicks: false,
  dataSource: "value",
  labelsContent: "key",
  valueIndicatorContent: "key",
  thumbWidth: 24,
  thumbHeight: 24,
  handlers: {
    valueChanged: [q2CLChange]
  }
});

function q2CLChange(arg) {
  //update plot to illustrate confidence interval
  // Note: if only colors are changing, we just transition to the new colors.

  var sq2Len,
    cnfLvl = q2CnfLvl,
    tempColors = [],
    twoTail,
    xydata;
  if(q2Values.length < 1){
    return;
  }
  if (arg.value) {
    cnfLvl = q2CnfLvl = +arg.value;
  }
  if (resampleq2.length < 1.0) {
    resampleq2 = resampleSlope4CI(q2Values, 100);
  }
  //sort the resmaples
  resampleq2 = resampleq2.sort(function(a, b) {
    return a - b;
  });
  sq2Len = resampleq2.length;
  q2CIdata = stackDots(resampleq2);
  tempColors = ciColor(resampleq2, cnfLvl);
    //console.log(tempColors);
  q2lowerBd = tempColors[1].toPrecision(4);
  q2upperBd = tempColors[2].toPrecision(4);
  cnfLvl = tempColors[3];
  for (i = 0; i < sq2Len; i++) {
    q2CIdata[i].color = circleColors[tempColors[0][i]];
  }
  if (drawq2Inf & (q2Inference === "estimate")) {
    document.getElementById("quant2Inference").style.display = "block";
    document.getElementById("quant2InfSVG").style.display = "block";


    //var scatter_group = d3.select("#quant2InfSVG")
    //  .selectAll("g.quant2InfSVG_svg_scatter_group")
      //.transition()
    //  .attr("fill", function(d){ return d.color;});

    xydata = makeScatterPlot(q2CIdata, "quant2InfSVG", "Slope", "Count");
  }
  //q2ftr.style.display = 'block';
  q2ftr.innerHTML = //"<div style = 'height = 10'> </div>" +
    "<div style = 'width:500px'> Plot shows slopes of Best Fit Lines in  " +
    sq2Len +
    " Re-samples" +
    "<br> <br>" +
    Math.round(cnfLvl * 100) +
    "% Confidence Interval: (" +
    q2lowerBd +
    ", " +
    q2upperBd +
    " )</div>";
  //document.getElementById("quant2MoreSims").style.display = 'block';
}

function estimateSlope(nReps) {
  //function to estimate the true slope based on resamples of original (x, y) data
  var cnfLvl = q2CnfLvl,
    tempColors = [];
  // combine new and old slope estimates
  // sort them, run thru ciColor to get CI and colors,
  // run through stackDots and plot using makeScatterPlot.

  // Gather Inputs for CI, turn off test inputs:
  q2hdr.innerHTML = "<h4>Estimate True Slope with a Confidence Interval</h4>";
  document.getElementById("quant2ConfLvl").style.display = "block";
  document.getElementById("quant2Test").style.display = "none";
  // grab nReps more samples
  resampleq2 = resampleSlope4CI(q2Values, nReps).sort(function(a, b) {
    return a - b;
  });
  //convert to (x,y) data, stacking up similar x values.
  q2CIdata = stackDots(resampleq2);
  // set colors based on ciColor function
  sq2Len = resampleq2.length;
  tempColors = ciColor(resampleq2, cnfLvl);
    //console.log(tempColors);
  q2lowerBd = tempColors[1].toPrecision(4);
  q2upperBd = tempColors[2].toPrecision(4);
  cnfLvl = tempColors[3]; // might have changed for large conf level with few points in tail
  for (i = 0; i < sq2Len; i++) {
    q2CIdata[i].color = circleColors[tempColors[0][i]];
  }

  if (drawq2Inf) {
    document.getElementById("quant2InfSVG").style.display = "block";
    makeScatterPlot(q2CIdata, "quant2InfSVG", "Slope", " ");
  }

  q2ftr.style.display = "block";
  q2ftr.innerHTML =
    "<div style='width=50px'></div>" +
    "<div style = 'width:500px'> Plot shows slopes of Best Fit Lines in  " +
    sq2Len +
    " Re-samples" +
    "<br> <br>" +
    Math.round(cnfLvl * 100) +
    "% Confidence Interval: (" +
    q2lowerBd +
    ", " +
    q2upperBd +
    " )</div>";
  document.getElementById("quant2MoreSims").style.display = "block";

  //console.log(q2lowerBd, q2upperBd);

  return q2InfOutput;
}

function testSlope(tailChoice) {
  //function to test 'Is the true slope  = 0?' for 2 quantitative variables
  // to force the null hypothesis to be true, we resample from y independent of x
  // Gather Inputs:

  q2CLvl = document.getElementById("quant2ConfLvl");
  q2CLvl.style.display = "none";

  q2Tst = document.getElementById("quant2Test");
  q2Tst.style.display = "block";
  //q2Pval = undefined;

  if (tailChoice === "undefined") {
    q2hdr.innerHTML =
      "<div class = 'w3-cell-row'> <div class = 'w3-cell' style = 'width:50%'> " +
      " Stronger evidence is sample slope </div>" +
      "<div class = 'w3-cell' style='width:40%'>" +
      "<select class = 'w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='q2Extreme'" +
      " onchange = 'q2TestUpdate()' >" +
      "<option value='lower'>Less Than or =</option>" +
      "<option value='both' selected >As or More Extreme Than</option>" +
      "<option value='upper'>Greater Than or =</option>" +
      "</select> </div>  <div class ='w3-cell' style = 'width:30%'> &nbsp;&nbsp;" +
      slope.toPrecision(4) +
      "</div> </div> ";
    q2ftr.innerHTML =
      "<div  style = 'width:500px'> Plot shows slopes of Best Fit lines in  " +
      sq2Len +
      " Resamples from H<sub>0</sub>";
    sampleq2 = resampleSlope4Test(q2Values, 100);
    sq2Len = sampleq2.length;
    //console.log(d3.mean(sampleq2), sq2Len);
  } else {
  }

  return sampleq2;
}

function resampleSlope4Test(data, reps) {
  var coVar,
    correlations = [],
    dataLength = data.length,
    seq = [],
    slopes = [],
    sample = [],
    xBar,
    yBar,
    xVar,
    yVar,
    ysample = [];
  seq = sequence(0, dataLength - 1, 1);

  xBar = d3.mean(x);
  xVar = d3.variance(x);
  //console.log(xVar);

  for (i = 0; i < reps; i++) {
    coVar = 0;
    yBar = 0;
    //xsample = sampleN(x, dataLength));
    // could resample these as well as y's, but then we could get all x values equal
    // instead, we'll assume it's a designed experiment with set (fixed) x levels

    sample = sampleN(seq, dataLength);
    for (j = 0; j < dataLength; j++) {
      ysample[j] = y[sample[j]]; // set y values
      coVar += x[j] * ysample[j]; // add up cross product
    }
    // console.log(ysample);
    // console.log(coVar);
    // xBar = d3.mean(xsample);
    // xVar = d3.variance(xsample);
    yBar = d3.mean(ysample);
    yVar = d3.variance(ysample);
    coVar = (coVar - dataLength * xBar * yBar) / (dataLength - 1);
    slopes[i] = coVar / xVar;
    correlations[i] = coVar / Math.sqrt(yVar * xVar);
  }
  return slopes;
}

function resampleSlope4CI(data, reps) {
  var coVar,
    correlations = [],
    dataLength = data.length,
    sample = [],
    seq = [],
    slopes = [],
    xsample = [],
    ysample = [],
    xBar,
    yBar,
    xVar,
    yVar;
  seq = sequence(0, dataLength - 1, 1);

  for (i = 0; i < reps; i++) {
    coVar = 0;
    sample = sampleN(seq, dataLength);
    // resample from (x,y) pairs, keeping the connection between the two variables
    for (j = 0; j < dataLength; j++) {
      xsample[j] = data[sample[j]].x;
      ysample[j] = data[sample[j]].y;
      coVar += xsample[j] * ysample[j]; // add up cross product
    }
    xBar = d3.mean(xsample);
    xVar = d3.variance(xsample);
    yBar = d3.mean(ysample);
    yVar = d3.variance(ysample);
    coVar = (coVar - dataLength * xBar * yBar) / (dataLength - 1);
    slopes[i] = { x: coVar / xVar };
    correlations[i] = coVar / Math.sqrt(yVar * xVar);
  }
  return slopes;
}

function q2TestUpdate() {
  var check,
    extCount = 0,
    lowP,
    hiP,
    sq2Len;
  q2Inference = "test";
  // get direction of evidence:
  q2TestDirection = document.getElementById("quant2Extreme").value;

  if (!sampleq2) {
    sampleq2 = testSlope();
  }
  sample2 = sample2.sort(function(a, b) {
    return a - b;
  });
  sq2Len = sampleq2.length;
  if (q2TestDirection === "lower") {
    for (i = 0; i < sq2Len; i++) {
      check = 0 + (sampleq2[i] <= slope);
      extCount += check;
      q2Color[i] = check;
    }
  } else if (q2TestDirection === "upper") {
    for (i = 0; i < sq2Len; i++) {
      check = 0 + (sampleq2[i] >= slope);
      extCount += check;
      q2Color[i] = check;
    }
  } else {
    lowP =
      slope * (slope <= q2Null) +
      (2 * q2Null - slope) * (slope > q2Null) +
      1 / 1000000;
    hiP =
      slope * (slope >= q2Null) +
      (2 * q2Null - slope) * (slope < q2Null) -
      1 / 1000000;
    for (i = 0; i < sq2Len; i++) {
      check = 0 + ((sampleq2[i] <= lowP) | (sampleq2[i] >= hiP));
      extCount += check;
      q2Color[i] = check;
    }
  }
  //console.log(d3.sum(q2Color));
  q2Pval = extCount / sq2Len;
  if (sampleq2) {
    q2Tstdata = stackDots(sampleq2);
    for (i = 0; i < sq2Len; i++) {
      q2Tstdata[i].color = circleColors[q2Color[i]];
    }
    document.getElementById("quant2InfSVG").style.display = "block";
    makeScatterPlot(q2Tstdata, "quant2InfSVG", "Slope", " ");
  }
  //q2ftr.style.display = 'block';
  q2ftr.innerHTML =
    "<div  style = 'width:320px'> Slopes in " +
    sq2Len +
    " Resamples from H<sub>0</sub> <br>" +
    "p-value (strength of evidence): " +
    formatPvalue(extCount, sq2Len) +
    "</div>";
  //document.getElementById("quant2MoreSims").style.display = 'block';
}

function q2CIinteract(d, i) {
  console.log(d.x, i);
  var q2modal = document.getElementById("quant2SelectedSample");
  //q2modal.style.display = "block";
  q2modal.innerHTML = "Slope: " + q2CIdata[0][i];
  // open modal box to show slopes in the selected resample;
  window.onclick = function(event) {
    if (event.target == q2modal) {
      q2modal.style.display = "none";
    }
  };
}

function q2TestInteract(d, i) {
  // open modal box to show slope in the selected sample;
  console.log(d.x, i);
  var q2modal = document.getElementById("quant2SelectedSample");
  //q2modal.style.display = "block";
  q2modal.innerHTML = "Slope: " + q2Tstdata[0][i];
  // open modal box to show slope in the selected resample;
  window.onclick = function(event) {
    if (event.target == q2modal) {
      q2modal.style.display = "none";
    }
  };
}

function quant2MoreSimFn() {
  // function to add more points to an estimate or test of slope
  // estimates are stored in  resampleq2,  tests slopes in sampleq2
  var sq2Len,
    more = +document.getElementById("quant2More").value,
    newValues = [];
  if (more > 0) {
    if (q2Inference === "test") {
      // assume slope is zero, generate samples of x and of y independently
      // fit new line to each
      newValues = resampleSlope4Test(q2Values, more);
      for (i = 0; i < more; i++) {
        sampleq2.push(newValues[i]);
      }
      sampleq2 = sampleq2.sort(function(a, b) {
        return a - b;
      });
      //console.log(d3.mean(sampleq2), sampleq2.length);
      q2TestUpdate();
      return sampleq2;
    } else {
      // Estimating slope, so generate data using same (x,y) pairs
      newValues = resampleSlope4CI(q2Values, more);

      for (i = 0; i < more; i++) {
        resampleq2.push(newValues[i]);
      }
      resampleq2 = resampleq2.sort(function(a, b) {
        return a - b;
      });
      
      //  Need to add more (x, y) points and transition in the colors.
      q2CLChange({ value: q2CnfLvl });
      return resampleq2;
    }
  }
}
