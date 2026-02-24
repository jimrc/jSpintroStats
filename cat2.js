// subroutine to estimate a proportion or test for a special value
// All global state is now managed through AppState namespace

  function c2TestEstimate(){
    var dIn, dSumm, testInpts, infText;
    dIn = TEMPLATES.cat2DataInput();
    dSumm = " ";
    testInpts = TEMPLATES.cat2TestInputs();
    infText = " ";

    return [dIn, dSumm, testInpts, infText];
  }


  function resample2C4Test(nreps) {
    //function to test 'Is the true proportion  = some value?' for 'success/failure' data
    // Inputs were created by summarizeP2
    var diff = [],
      sampleC21 = [],
      sampleC22 = [];
    document.getElementById("moreTEsims").style.display = 'block';
    hyperGeom = hypergeomPMF(total1, total2, cat2N11 + cat2N12);
    // ^ gives possible values and probabilities of each for the hypergeometric
  	sampleC21 = sampleWrep(hyperGeom[0],nreps, hyperGeom[1]).sort(function(a, b) {return a - b;});
  	sC2Len = sampleC21.length;
  	for ( i = 0; i < sC2Len; i++) {
  		sampleC22[i] =  cat2N11 + cat2N12 - sampleC21[i];
  		diff[i] = sampleC21[i] / total1 - sampleC22[i] / total2;
  	}
  	return (diff);
  }

  function resample2C4CI(nreps) {
    //function to generate random draws from observed proportions
    //
    document.getElementById("moreTEsims").style.display = 'block';

    var diff = [];

    resampleC21 = rbinom(total1, cat2Phat1, nreps);
  	resampleC22 = rbinom(total2, cat2Phat2, nreps);
  	sC2Len = resampleC21.length;

  	for ( i = 0; i < sC2Len; i++) {
  		diff[i] = resampleC21[i] / total1 - resampleC22[i] / total2;
  	}
  	diff = diff.sort(function(a, b) {return a - b;});

    return diff;
  }

  function renewC2 (){
        //function to remove outdated info and Plot
        sample4CI = resample4CI = testData = CIData = [];
        Utilities.resetCat1UI();
      };

// Inputs:
//     2 sets of category labels (default = Success/Failure) and a count for each of 4 outcomes
// TODO: for sample/resample store an array of 3 vectors: sample1, sample2, and diff in proportions
// TODO: then use d3.sort to order the array by difference

var
    cat2LabelOut1,
    cat2LabelOut2,
    cat2LabelPop1,
    cat2LabelPop2,
    cat2hdr,
    cat2Diff,
    cat2N11,
    cat2N21,
    cat2N12,
    cat2N22,
    cat2Phat1,
    cat2Phat2,
    c2Data = [],
    chartC2,
    hyperGeom =[],
    total1,
    total2;


function summarizeP2() {
	// builds summary table and plot for 2 categorical variables
	var margin = 20,
	    barHeight = 20,
	    colors = [],
	    padding = 25,
	    w = 180,
	    h = 60;

	// Initialize AppState with labels
	AppState.cat2Label1 = document.getElementById("cat2LabelPop1").value || "Group A";
	AppState.cat2Label2 = document.getElementById("cat2LabelPop2").value || "Group B";
	AppState.cat2LabelOut1 = document.getElementById("cat2LabelOut1").value || "Success";
	AppState.cat2LabelOut2 = document.getElementById("cat2LabelOut2").value || "Failure";
	
	cat2LabelOut1 = AppState.cat2LabelOut1;
	cat2LabelOut2 = AppState.cat2LabelOut2;
	cat2LabelPop1 = AppState.cat2Label1;
	cat2LabelPop2 = AppState.cat2Label2;
	cat2N11 = +document.getElementById("cat2N11").value;
	cat2N12 = +document.getElementById("cat2N12").value;
	cat2N21 = +document.getElementById("cat2N21").value;
	cat2N22 = +document.getElementById("cat2N22").value;
	total1 = cat2N11 + cat2N21;
	
	// Show inference controls and initialize state (confLvlInpt hidden until user clicks Estimate)
	d3.select("#infSVGplot_svg").remove();
	DOM.setState({
		inferenceInputs: 'show',
		moreTEsims: 'hide',
		testInpt: 'hide',
		confLvlInpt: 'hide'
	});
	
	// Initialize AppState for estimation
	AppState.nullValue = 0;
	AppState.inference = "estimate";
	total2 = cat2N12 + cat2N22;
	cat2Phat1 = cat2N11 / total1;
	cat2Phat2 = cat2N12 / total2;
	difference = cat2Diff = cat2Phat1 - cat2Phat2;

	c2Data = [{	"label" : cat2LabelPop1,	"prop" : cat2Phat1},
	          {	"label" : cat2LabelPop2,	"prop" : cat2Phat2}];
	cat2Summ = document.getElementById("cat2SummaryText");
	cat2Summ.innerHTML = "p&#770;<sub>1</sub> =  " + cat2Phat1.toPrecision(4) +
	   "&nbsp; &nbsp; p&#770;<sub>2</sub> =  " + cat2Phat2.toPrecision(4) +
	   " <br> p&#770;<sub>1</sub> - p&#770;<sub>2</sub> = " + cat2Diff.toPrecision(5);
	cat2Summ.style = "display: block";
  document.getElementById("cat2SummarySVGgoesHere").style = "display: block";
	//document.getElementById("cat2ObsdDiff").innerHTML = "&nbsp;&nbsp;" +
	//	   		cat2Diff.toPrecision(4) +" from above."

	var c2xScale = d3.scaleLinear().domain([0, 1]).range([0, w - 3 * margin]);

	var c2xAxis = d3.axisBottom(c2xScale)
					.ticks(3);
	if(typeof(chartC2) ==='function'){
		chartC2.data([cat2Phat1,cat2Phat2])
	} else{
		chartC2 = propBarChart(c2Data, "Proportion "+ cat2LabelOut1).height(140);
		d3.select('#cat2SummarySVGgoesHere').call(chartC2);
    }

}
