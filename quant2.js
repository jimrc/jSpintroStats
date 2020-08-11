// subroutine to estimate a slope or correlation or test for slope of zero
// Inputs:   choose a prebuilt data set
//  TODO:  allow input of csv file and parse it.

var correlation,
  drawq2Inf = false,
  intercept, slope,
  i,  j,
  noChoice = "undefined",
  q2Label,
  q2Values = [],
  q2SumData = [],
  q2RawData = [],
  sq2Len,
  x = [],
  y = [];

function q2TestEstimate(){
  // function to modify the generic test-estimate page to suit 2 quantitative variables
  var dIn, dSumm, infText, testInpts;
  dIn =
  	" 			<div class='w3-cell' style='width:50%'>" +
  	" 				<h4> Choose Data: </h4>" +
  	" 				<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='quant2DataName'" +
  	" 				   onselect ='q2DataChange()'  onmouseup='q2DataChange()'>" +
  	" 					<option value='shuttle' selected>Shuttle</option>" +
  	" 					<option value='women'>Women rate men</option>" +
  	" 					<option value='men'>Men rate women</option>" +
  	" 					<option value='dental'>Dental distance</option>" +
  	" 					<option value='other'>Other</option>" +
  	" 				</select>" +
  	" 			</div>"
    dSumm =
    "	<div class='flex-container' style='display:flex; wrap:nowrap;' >"+
		"		  <div  id='Q2SumText' style='width:300px; display: none'>"	+
		"		  </div>"	+
		"				<svg id='Q2SumSVG' height='400px' width='400px'></svg>"	+
		"	</div>"	;
  testInpts =
    "<div class='w3-cell-row w3-mobile' style = 'text-align: left'>" +
    "  			<div class='w3-cell' style='width:250px'>"+
    "  				Test: Is the true slope zero?"+
    "  			</div>"+
    "   </div>" +	"<div class='w3-cell' >	Stronger evidence is a slope 	</div>" +
		"	<div class='w3-cell' style='width: 30%'>" +
		"		<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='q2testDirection' " +
   	"  onmouseup='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
	  "  onselect='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
			"		<option value='lower'>Less Than or =</option>" +
		"			<option value='both' selected>As or More Extreme Than</option>" +
		"			<option value='upper'>Greater Than or =</option>" +
		"		</select>" +
		"	</div>" +
		"	<div class='w3-cell' style='width: 30%' id='q2ObsdSlope'>" +
    "		&nbsp;&nbsp; observed &beta;&#770;<sub>1</sub> =  value above" +
		"	</div>" ;


    infText =
  		" <div id='quant2Output' style='display:none'>" +
  		" </div>" ;

    return [dIn, dSumm, testInpts, infText];
  }


  function q2DataChange(){
       sample4Test = sample4CI = [];
       document.getElementById('infSVGplot').style.display = 'none'
       document.getElementById('inferenceText').style.display = 'none'
       document.getElementById("confLvlInpt").style.display = 'none'
       document.getElementById("testInpt").style.display = 'none'
       document.getElementById("moreTEsims").style.display = 'none'
       summarizeSlope()
  }

function summarizeSlope() {
  // builds summary table and dot plot for 2 quantitative variables
  var margin = 20,  dataLength,  q2Keys,
    xbar,    xVar,    ybar,    yVar,    coVar = 0,
    q2DataName = document.getElementById("quant2DataName").value;

    // clear out old copies of data
    x = [];
    y = [];
    CIData = [];
    testData = [];
    sampleq2 = resampleq2 = [];

   document.getElementById("dataSummary").style.display = 'block';
   document.getElementById("inferenceInputs").style.display = 'block';
   document.getElementById("inferenceText").innerHTML = ' ';
   document.getElementById("moreTEsims").style.display = 'none';
   document.getElementById("testInpt").style.display = 'none';
   document.getElementById("confLvlInpt").style.display = 'none';
   d3.select("#infSVGplot_svg").remove();
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

    q2Summ = document.getElementById("Q2SumText");
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
      document.getElementById("Q2SumText").style.display = "block";

      makeScatterPlot(q2Values, "Q2SumSVG", q2Keys[0], q2Keys[0], q2Keys[1], true);
    }

    //document.getElementById("moreTEsims").style.display = "none";
    //document.getElementById("inferenceChoices").style.display = "block";
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

  document.getElementById("q2ObsdSlope").innerHTML =  "&nbsp;&nbsp;" + slope.toPrecision(4) + " from above.";
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
