// subroutine to estimate a slope or correlation or test for slope of zero
// Inputs:   choose a prebuilt data set
//  TODO:  allow input of csv file and parse it.
//   clicking a point shows resampled slope (and correlation?)
// TODO:  Test plot is making error -- doesn't show
//         CI 's are cutoff
//         CI plot has no colors -- am I passing them wrong?

var correlation,
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
  q2Color = [],
  q2Inference,
  q2InfOutput,
  q2SmryPlot,
  resampleq2 = [],
  sampleq2 = [],
  sq2Len,
  targetQuantile,
  upperBd,
  upperCI,
  x = [],
  y = [];

//var svgq2 = d3.select("#quant2InfSVG"),
  //svgSumq2 = d3.select("#quant2SumSVG");
//document.getElementById("quant2MoreSims").style.display = "none";
//document.getElementById("quant2Results").style.display = "none";
//document.getElementById("quant2Output").style.display = "none";
//document.getElementById("quant2Inference").style.display = "none";


function q2TestEstimate(){
  // function to modify the generic test-estimate page to suit 2 quantitative variables
  var dIn, intervalInpts, testInpts, plot, results;
  dIn =
  	" 			<div class='w3-cell' style='width:50%'>" +
  	" 				<h4> Choose Data: </h4>" +
  	" 				<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='quant2DataName'" +
  	" 				   onchange='sample4Test = []; summarizeSlope(this.value)'>" +
  	" 					<option value='none' selected>Choose Data</option>" +
  	" 					<option value='shuttle' selected>Shuttle</option>" +
  	" 					<option value='women'>Women rate men</option>" +
  	" 					<option value='men'>Men rate women</option>" +
  	" 					<option value='dental'>Dental distance</option>" +
  	" 					<option value='other'>Other</option>" +
  	" 				</select>" +
  	" 			</div>"
    dSumm =
  	" 				<div class='w3-container w3-cell w3-mobile' id='q2Summary' style='display:none'>" +
  	" 				</div>"
  intervalInpts= "Estimate Slope";
  testInpts = 	"<div class='w3-cell' >	Stronger evidence is a slope 	</div>" +
		"	<div class='w3-cell' style='width: 30%'>" +
		"		<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='q2testDirection' " +
   	"  onchange='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
	  "  onClick='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
			"		<option value='lower'>Less Than or =</option>" +
		"			<option value='both' selected>As or More Extreme Than</option>" +
		"			<option value='upper'>Greater Than or =</option>" +
		"		</select>" +
		"	</div>" +
		"	<div class='w3-cell' style='width: 30%' id='q2ObsdSlope'>" +
    "		&nbsp;&nbsp; observed &beta;&#770;<sub>1</sub> = " + slope +
		"	</div>" ;

  plot =
		" <div id='quant2Output' style='display:none'>" +
		" </div>" +
		" <div class='w3-container w3-cell w3-mobile' id='quant2Inference' style='width:420px; display:none'>" +
		" 		<svg id='quant2InfSVG' height='400px' width='400px'></svg>" +
		" </div>" ;

    return [dIn, dSumm, intervalInpts, testInpts, plot];
  }


function summarizeSlope(q2DataName) {
  // builds summary table and dot plot for 2 quantitative variables
  var margin = 20,  dataLength,  q2Keys,
    xbar,    xVar,    ybar,    yVar,    coVar = 0;

    // clear out old copies of data
    x = [];
    y = [];
    CIData = [];
    testData = [];
    sampleq2 = resampleq2 = [];

   document.getElementById("inferenceInputs").style.display = 'block';
   document.getElementById("inferenceText").innerHTML = ' ';
   document.getElementById("moreTEsims").style.display = 'none';
   document.getElementById("testInpt").style.display = 'none';
   document.getElementById("confLvlInpt").style.display = 'none';
   d3.select("#infSVGplot_svg").remove();
  //q2DataName = document.getElementById("quant2DataName").value;
  q2RawData =
    q2DataName === "shuttle"    ? shuttle
      : q2DataName === "women"  ? womenJudgingMen
      : q2DataName === "men"    ? menJudgeWomen
      : q2DataName === "dental" ? dental
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

    q2Summ = document.getElementById("dataSummary");
    q2SumData = [
      { label: "Xbar", xx: xbar },
      { label: "Ybar", xx: ybar },
      { label: "Slope", xx: slope },
      { label: "Intercept", xx: intercept }
      //{"label": "SD from line", "xx": }
    ];
    q2Summ.innerHTML =
      " x&#773; =  " +
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
      q2Keys[1] +" = " + intercept.toPrecision(4) + " + " + slope.toPrecision(4) + " * " + q2Keys[0] +
      "<br>";
    q2Summ.style = "display: block";

    //check for any old output plots. If present, erase them due to change in data

    if (q2Values) {
      document.getElementById("dataIn").style.display = "block";
      document.getElementById("dataSummary").style.display = "block";

      makeScatterPlot(q2Values, "dataSummary", q2Keys[0], q2Keys[1], true);
    }

    document.getElementById("moreTEsims").style.display = "none";
    //document.getElementById("inferenceChoices").style.display = "block";
    document.getElementById("q2ObsdSlope").innerHTML =
      "&nbsp;&nbsp;" + slope.toPrecision(4) + " from above.";
  }
}




function resampleSlope4Test(data, reps) {
  var coVar,    correlations = [],
    dataLength = data.length,
    seq = [],    slopes = [],    sample = [],
    xBar,    yBar,    xVar,    yVar,    ysample = [];

  seq = sequence(0, dataLength - 1, 1);
  xBar = d3.mean(x);
  xVar = d3.variance(x);

  for (i = 0; i < reps; i++) {
    coVar = 0;
    // could resample these as well as y's, but then we could get all x values equal
    // instead, we'll assume it's a designed experiment with set (fixed) x levels
    sample = sampleN(seq, dataLength);
    for (j = 0; j < dataLength; j++) {
      ysample[j] = y[sample[j]]; // set y values
      coVar += x[j] * ysample[j]; // add up cross product
    }
    yBar = d3.mean(ysample);
    yVar = d3.variance(ysample);
    coVar = (coVar - dataLength * xBar * yBar) / (dataLength - 1);
    slopes[i] = coVar / xVar;
    correlations[i] = coVar / Math.sqrt(yVar * xVar);
  }
  return slopes;
}

function resampleSlope4CI(data, reps) {
  var coVar,    correlations = [],
    dataLength = data.length,
    sample = [],    seq = [],    slopes = [],
    xsample = [],    ysample = [],
    xBar,    yBar,    xVar,    yVar;

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
    slopes[i] =  coVar / xVar ;
    correlations[i] = coVar / Math.sqrt(yVar * xVar);
  }
  return slopes;
}
