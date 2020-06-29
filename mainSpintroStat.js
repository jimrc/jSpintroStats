//  javascript to setup main index.html

//ToDo:  if data, type of inference, or variable changes, erase inference plot and CI bars

var circleColors = ["steelblue", "red"],
    cnfLvl = 0.80, ciInftop,
    demo, mean = 0, proportion = 0.5, difference = 0, slope = 0,
    vbleChoice,
    confLevels = [
      { key: "80%", value: "0.80" },
      { key: "90%", value: "0.90" },
      { key: "95%", value: "0.95" },
      { key: "99%", value: "0.99" }
    ],
    inference,
    nullValue,
    observed,
    lowerBd,
    upperBd,
    sample4Test = [],
    resample4CI = [],
    CIData =[],
    testData = [];

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

var CIrangeslide = rangeslide("#confLvlInpt", {
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
    valueChanged: [CLChange]
  }
});




function testEstFn(vble){
  // function to customize the testEst page for a particular type of variable.
  var hdr,
    divs = [],
    estimate = "estimate", g = "g",
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

  switch(vble){
      case 'cat1' : {
        hdr = "<b>Estimate</b> a single proportion or <b>Test</b> its value.";
        divs = c1TestEstimate();
        break;   // End of c1Output
      }
      case 'quant1' :  {
        hdr = "<b>Estimate</b>  a single mean or <b>Test</b>  its value.";
        divs = q1TestEstimate();
         break;
       }
      case 'cat2' :  {
        hdr = "Estimate a difference in proportions or test that the difference is zero.";
        divs = c2TestEstimate();
        break;
      }
      case 'c1q1':  {
        hdr = "Estimate a difference in means or test that the difference is zero.";
        divs = c1q1TestEstimate();
        break;
      }
      case 'quant2' :  {
        hdr = "<b>Estimate</b> a regression slope or <b>Test</b>  slope is zero.";
        divs = q2TestEstimate();
        break;
      }
      default: { hdr = "Unknown Variable Type";
        divs = genericTestDivs();      }
    };
   title.innerHTML = hdr;
   block1.innerHTML = divs[0];  // dataIn
   block2.innerHTML = divs[1];  //dataSummary
   block3.innerHTML = divs[2];   // Test Input
   //block4.innerHTML = divs[4]; // Inf Text
   document.getElementById("moreTEsims").style.display = "block";
}

function CLChange(arg) {
  // set colors for dots to illustrate confidence interval
  // new dots come from an inference-specific function
  // Get new dots, color them, and plot them.
  const inferenceSVG = d3.select("#infSVGplot_svg");

  if (arg.value) {
    cnfLvl = +arg.value;
  } else {
    cnfLvl = 0.80
  }
  var sLen = resample4CI.length,
    tempColors =[];
  if (typeof(sLen) === 'undefined' || sLen < 1) {
    return ;
  }
  resample4CI = resample4CI.sort(function(a, b) {
        return a - b;
    });
  tempColors = ciColor(resample4CI);
  xLabel = "Default";
  CIData = stackDots(resample4CI);
  for(i =0; i < sLen; i++){
    CIData[i].color = circleColors[tempColors[i]]
  }
  if(inferenceSVG.empty()){
    makeScatterPlot(CIData, "infSVGplot", xLabel, " ", false);
  } else{
    // update Colors
     inferenceSVG.selectAll("circle")
      .data(CIData).attr("fill", d => d.color)
  }
  //console.log("CLchange", CIData[0], lowerBd, upperBd);
  //makeScatterPlot(CIData, "infSVG", xLabel, " ", false);
  document.getElementById("inferenceText").innerHTML =
         ciInftop +  sLen + " Re-samples <br>" +  Math.round(cnfLvl * 100) +
    "% Confidence Interval: (" + lowerBd.toPrecision(4) + ", " + upperBd.toPrecision(4) +  ") </div>";
    document.getElementById("inferenceText").style.display = 'block';
    document.getElementById("moreTEsims").style.display = "block";
}



function moreCI(nreps, concat) {
  //update plot to illustrate confidence interval
    //generate or update CI resample data
  var newSample =[], tempColors = [],
       lowCt, check = 0 ;
  if (typeof(concat) == 'undefined'){
    concat = false;
  }
  if( ! concat){
    resample4CI = [];
  }
  if(nreps>0){
    switch(variable){
      case 'cat1' : {
        newSample = resample1C4CI( nreps);
          ciInftop = "Confidence Interval for proportion based on ";
          xLabel = "Proportions from resampled datasets";
        break;   // End of c1Output
      }
      case 'quant1' :  {
        newSample = resample1Q4CI( nreps);
          ciInftop = "Confidence Interval for mean based on ";
          xLabel = "Means from resampled datasets";
         break;
       }
      case 'cat2' :  {
        newSample = resample2C4CI( nreps);
          ciInftop = "Confidence Interval for difference in proportions based on ";
          xLabel = "Differences in proportion from resampled datasets";
        break;
      }
      case 'c1q1':  {
         newSample = resample1C1Q4CI( nreps);
         ciInftop = "Confidence Interval for difference in means based on ";
         xLabel = "Differences in mean from resampled datasets";
        break;
      }
      case 'quant2' :  {
          newSample = resampleSlope4CI(q2Values, nreps);
          ciInftop = "Confidence Interval for slope based on ";
          xLabel = "Slopes from resampled datasets";
        break;
      }
      default: {   }
    };
      //combine with old sims
    for (i = 0; i < nreps; i++) {
          resample4CI.push(newSample[i]);
      }
    }
    // sort
    resample4CI = resample4CI.sort(function(a, b) {
        return a - b;
      });
      // get colors for inside/outside of observed
      sLen = resample4CI.length;
      // console.log("moreCIS", resample4CI[0], resample4CI[50], resample4CI[90]);
     tempColors = ciColor(resample4CI);
     CIData = stackDots(resample4CI);
      for (i = 0; i < sLen; i++) {
        CIData[i].color = circleColors[tempColors[i]];
      }
      if(!d3.select("#infSVGplot_svg").empty()){
        d3.select("#infSVGplot_svg").remove();
      }
      //console.log("moreCIS", CIData[0], lowerBd, upperBd);
      document.getElementById("infSVGplot").style.display = 'block';

      makeScatterPlot(CIData, "infSVGplot", xLabel, " ", false);
      document.getElementById("inferenceText").innerHTML =
            ciInftop +  sLen + " Re-samples <br>" +  Math.round(cnfLvl * 100) +
        "% Confidence Interval: (" + lowerBd.toPrecision(4) + ", " + upperBd.toPrecision(4) +  ") </div>";
        document.getElementById("inferenceText").style.display = 'block';
  }

function moreTests(nreps, concat) {
  //generate or update test resmaple data
  var newSample =[], testColor = [],
       lowV, lowCt, hiV, check = 0, extCount =0;
  if (typeof(concat) == 'undefined'){
    concat = false;
  }
  if( ! concat){
    sample4Test = [];
  }
  if(nreps>0){
    switch(variable){
        case 'cat1' : {
          if( nullValue > 0.00 & nullValue < 1.00){
            newSample = resample1C4Test(nreps);
          } else {
            console.log("null probability not in (0,1)")
          }
          observed = proportion;
          xLabel = "Proportions " + cat1Label1 +" from resampled datasets under the null hypothesis ";
          break;
        }
        case 'quant1' :  {
          newSample = resample1Q4Test(nreps);
          observed = q1Xbar;
          xLabel = "Means from resampled datasets under the null hypothesis ";
          break;
        }
        case 'cat2' :  {
          newSample = resample2C4Test(nreps);
          nullValue = 0.0;
          observed = difference;
          xLabel = "Differences in proportions from resampled datasets under the null hypothesis ";
          break;
        }
        case 'c1q1':  {
          newSample = resample1C1Q4Test(nreps);
          nullValue = 0.0;
          observed = difference;
          xLabel = "Differences in means from resampled datasets under the null hypothesis ";
          break;
        }
        case 'quant2' :  {
          newSample = resampleSlope4Test(q2Values, nreps);
          xLabel = "Slopes from resampled datasets under the null hypothesis ";
          nullValue = 0.0;
          observed = slope;
          break;
        }
        default: {   }
      };
      //combine with old sims
      for (i = 0; i < nreps; i++) {
          sample4Test.push(newSample[i]);
      }
    }
    // sort
    sample4Test = sample4Test.sort(function(a, b) {
        return a - b;
      });
      // get colors for inside/outside of observed
      sLen = sample4Test.length;
      testColor = sameVector(0, sLen);  // set all to zero
      if(typeof(testDirection) === 'undefined'){
        testDirection = 'both'
      }
      switch (testDirection) {
        case "lower": {
          for (i = 0; i < sLen; i++) {
            check = 0 + (sample4Test[i] <= observed);
            extCount += check;
            testColor[i] = check;
            if(check == 0) {
              break;
            }
          }
          break;
        }
        case "upper": {
          for (i = sLen-1; i >-1; i--) {
            check = 0 + (sample4Test[i] >= observed);
            extCount += check;
            testColor[i] = check;
            if(check ==0){
              break;
            }
          }
          break;
        }
        case "both": {
          lowV =  observed * (observed <= nullValue) +
              (2 * nullValue - observed) * (observed > nullValue) +
              1 / 1000000;
          hiV =   observed * (observed >= nullValue) +
              (2 * nullValue - observed) * (observed < nullValue) -
              1 / 1000000;
          //console.log(lowV, hiV)
          for (i = 0; i < sLen; i++) {
            check = 0 + (sample4Test[i] <= lowV)+ (sample4Test[i] >= hiV);
            extCount += check;
            testColor[i] = check;
          }
          break;
        }
        default: {  }
      }
      //console.log(testColor);
      // plot
      testData = stackDots(sample4Test);
      for (i = 0; i < sLen; i++) {
        testData[i].color = circleColors[testColor[i]];
      }
      if(!d3.select("#infSVGplot_svg").empty()){
        d3.select("#infSVGplot_svg").remove();
      }
      //ToDo:  Colors do not change when we change direction of test, but P-value does.
      document.getElementById("infSVGplot").style.display = 'block';
        document.getElementById("moreTEsims").style.display = 'block';
      //document.getElementById("infSVGplot_svg").style.display = 'block';
    makeScatterPlot(testData, "infSVGplot", xLabel, " ", false);

      //find p-value
      //  console.log(testData);
      document.getElementById("inferenceText").innerHTML =
        "P-value: " + formatPvalue(extCount, sLen) + "  based on " +sLen +" resamples.";
      document.getElementById("inferenceText").style.display = 'block';
}

function demoFn(demo){
  var hdr,
    demoDivs =[],
    title = document.getElementById("demoHeader"),
    block1 = document.getElementById("demoDiv1"),
    block2 = document.getElementById("demoDiv2"),
    block3 = document.getElementById("demoDiv3");
 switch(demo){
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
   case 'CIdemo': {
     hdr = "Demonstrate 'Confidence' in a Confidence Interval";
     demoDivs = CI_demo_Divs();
    break;
   }
   case 'lurkingC1': {
     	hdr = 'Demo of the effects of a categorical lurking variable on proportion estimates.'
      demoDivs = ["  ", "  ", "  "];
      break;
   }
   case 'lurkingQ1': {
     	hdr = 'Demo of the effects of a quantitative lurking variable on mean estimates.'
      demoDivs = ["  ", "  ", "  "];
      break;  // power  bootstrap sampling regression
   }
   case 'power': {
     	hdr = 'Visual assessment of the power of a T test to find a difference in means.'
      demoDivs = ["  ", "  ", "  "];
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
      break;  // power  bootstrap sampling regression
   }
   default : {
     hdr = "Unknown Demo";
   }
 }
 title.innerHTML = hdr;
 block1.innerHTML = demoDivs[0];
 block2.innerHTML = demoDivs[1];
 block3.innerHTML = demoDivs[2];
}


function genericDemoDivs(){
    // set up a demo page
  var div1, div2, div3;
  return [div1, div2, div3];
}
