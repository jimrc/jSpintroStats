// subroutine to estimate a difference in means or test for no difference

  function c1q1TestEstimate(){
    var dIn, testInpts, results;
    dIn =
    "	<div class='w3-container' id='C1Q1DataIn-Summary'>"	+
		"	<div class='w3-cell-row w3-mobile' id='C1Q1Data'>"	+
		"			<div class='w3-cell' style='width:20%'>"	+
		"				<h4> Choose Data</h4>"	+
		"			</div>"	+
		"				<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='C1Q1DataName'"	+
    "	          onchange='c1q1DataChange()'>"	+
		"			<div class='w3-cell'>"	+
		"					<option value='SATprep' selected>SAT prep</option>"	+
		"					<option value='smoker'>Smoking - Birthweight</option>"	+
		"					<option value='music1'>Music vs Silence</option>"	+
		"					<option value='REDAvsCntrl'>REDA vs Control</option>"	+
		"					<option value='REDvsREDA'>RED vs REDA</option>"	+
		"					<option value='other'>Other</option>"	+
		"				</select>"	+
		"			</div>"	+
		"		</div> "	;


    dSumm =
    "	<div class='flex-container' style='display:flex; wrap:nowrap;' >"+
		"		  <div  id='C1Q1SummaryText' style='width:300px; display: none'>"	+
		"		  </div>"	+
    //" 	  <div  style='width:310px' id='C1Q1SummarySVGgoesHere'>"	+
		"				<svg id='C1Q1SumSVG' height='200px' width='200px'></svg>"	+
		//"		  </div>"	+
		"	</div>"	;
    testInpts =
    "<div> <br> </div>" +
    "<div class='w3-cell-row w3-mobile' style = 'text-align: left'>" +
    "  			<div class='w3-cell' style='width:250px'>"+
    "  				Test: Are the two means equal?"+
    "  			</div>"+
    "   </div>" +
    "<div> <br> </div>" +
    " <div class='w3-cell-row w3-mobile'>" +
     "    <div class='w3-cell' style='width: 250px' >	Stronger evidence is a difference	</div>" +
  		" 	<div class='w3-cell' style='width: 30%'>" +
  		"		  <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='q2testDirection' " +
     	"  onchange='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
  	  "  onClick='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
  			"		<option value='lower'>Less Than or =</option>" +
  		"			<option value='both' selected>As or More Extreme Than</option>" +
  		"			<option value='upper'>Greater Than or =</option>" +
  		"		  </select>" +
  		"	  </div>" +
  		"	  <div class='w3-cell' style='width: 40%' id='q2Obsd'>" +
      "		  &nbsp;&nbsp; the observed difference = " + observed +
    "     </div>" +
  	"	</div>" ;

    results = "";
    return [dIn, dSumm, testInpts, results];
  }

  function c1q1DataChange(){
       sample4Test = sample4CI = [];
       document.getElementById('infSVGplot').style.display = 'none'
       document.getElementById('inferenceText').style.display = 'none'
       document.getElementById("confLvlInpt").style.display = 'none'
       document.getElementById("testInpt").style.display = 'none'
       document.getElementById("moreTEsims").style.display = 'none'
       summarizeDiff()
  }
// Inputs:
//     Select an appropriate dataset from those available (working nicely)
//       OR:  Load one from csv
// TODO:  parse a csv file
// TODO:  Label  categories in summary
// TODO: when clicking a point in the inference plot, show the resample in 2 colors
//   -- need to save the sampled indices

var c1q1SummDiv = d3.select("#C1Q1Inference"),
	c1q1Tstdata,
	c1q1CIdata,
	c1q1Label,
	c1q1Values,
	c1q1ftr,
	c1q1hdr,
	c1q1CnfLvl = 0.80,
	c1q1CLvl,
	c1q1Colors = [],
	c1q1Groups = [],
	c1q1lowerBd,
	c1q1upperBd,
	c1q1N1,
	c1q1N2,
	c1q1ObsdDiff,
	c1q1Pval,
	c1q1TestDirection,
	c1q1Data = [],
	c1q1RawData = [],
	c1q1DataName,
	c1q1Keys = [],
	//c1q1InfOutput,
	c1q1Shifted = [],
	c1q1SumPlot,
	dataLength,
	diff,
	targetQuantile,
	x = [],
	x1 = [],
	x2 = [],
	xbar1,
	x1Var,
	xbar2,
	x2Var,
	upperBd,
	upperCI,
	sampleCIc1q1,
	sampleTstc1q1,
	shift;

function summarizeDiff() {
	// builds summary table and dot plot for a quantitative variable split by a categorical variable
	var	c1q1Response;

    c1q1SumPlot= document.getElementById("C1Q1SumSVG")
		x1 = [];
		x2 = [];
		document.getElementById("C1Q1Results").style.display = "none";
		document.getElementById("C1Q1Output").style.display = "none";
	//} else{
    //c1q1SumPlot= document.getElementById("C1Q1SumSVG")
  //}

	c1q1DataName = document.getElementById("C1Q1DataName").value;
	c1q1RawData = (c1q1DataName === "SATprep") ? SATprep :
                (c1q1DataName === "smoker") ? smoker :
                (c1q1DataName === "music1") ? musicVSsilence1 :
                (c1q1DataName === "REDvsREDA") ? REDvsREDA :
                (c1q1DataName === "REDAvsCntrl") ? REDAvsCntrl :
                "undefined";

	dataLength = c1q1RawData.length;
	c1q1Response = Object.keys(c1q1RawData[0])[1];
	c1q1Keys = d3.map(c1q1RawData, function (d) {
		return d.group;
	}).keys();

	for (i = 0; i < dataLength; i++) {
		if (c1q1RawData[i].group === c1q1Keys[0]) {
			x1.push(c1q1RawData[i][c1q1Response])
		} else {
			x2.push(c1q1RawData[i][c1q1Response]);
		}
	}

	xbar1 = d3.mean(x1);
	x1Var = d3.variance(x1);
	c1q1N1 = x1.length;
	xbar2 = d3.mean(x2);
	x2Var = d3.variance(x2);
	c1q1N2 = x2.length;
	observed = diff = xbar1 - xbar2;
  nullValue = 0.0;

  document.getElementById('q2Obsd').innerHTML = " &nbsp;&nbsp; the observed difference = " + observed.toPrecision(4)

	x1 = x1.sort(function (a, b) {
		return (a - b);
	});
	x2 = x2.sort(function (a, b) {
		return (a - b);
	});

	c1q1Groups = repeat(0, c1q1N2).concat(repeat(1, c1q1N1));
	x = x2.concat(x1);

	c1q1Summ = document.getElementById("C1Q1SummaryText");
	c1q1Data = [{
		"label": "Mean1",
		"xx": xbar1
  }, {
		"label": "Mean2",
		"xx": xbar2
  }, {
		"label": "Diff",
		"xx": diff
  }];
	c1q1Summ.innerHTML = "<br> <b> Summary</b> <br>  <br> <br>" +
		c1q1Keys[0] + "   Mean: " + xbar1.toPrecision(4) +
		"<br> SD: " + Math.sqrt(x1Var).toPrecision(4) +
		"&nbsp;&nbsp; n: " + c1q1N1 + "<br>" +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br> <br> <br>" +
		c1q1Keys[1] + "   Mean: " + xbar2.toPrecision(4) +
		"<br> SD: " + Math.sqrt(x2Var).toPrecision(4) +
		"&nbsp;&nbsp; n: " + c1q1N2 +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
		"<br><br> Difference in Means: " + diff.toPrecision(4);
	c1q1Summ.style = "display: block";
	// display next step: select inference

    c1q1SumPlot.style.display = "block";
    c1q1SumPlot = dbl_histodot(x, c1q1Groups, c1q1Keys, c1q1SumPlot, c1q1CIinteract);

}


    function resample1C1Q4CI(nreps) {
      //function to generate random resamples, compute means, and return differences in means
      //
      var indices = sequence(0, nreps, 1);
      sampleCIc1q1 = resampleDiffMeans(x1, x2, nreps);
      	// Now sort the indices by order of the first element which is diff
      	//console.log(sampleCIc1q1);
      	indices.sort(function (a, b) {
      		return sampleCIc1q1.diff[a] - sampleCIc1q1.diff[b];
      	});
      	//sampleCIc1q1.diff  = indices.map( function (ndx) {return sampleCIc1q1.diff[ndx];});
      	sampleCIc1q1.mean1 = indices.map(function (ndx) {
      		return sampleCIc1q1.mean1[ndx];
      	});
      	sampleCIc1q1.mean2 = indices.map(function (ndx) {
      		return sampleCIc1q1.mean2[ndx];
      	});
      	for (i = 0; i < nreps; i++) {
      		sampleCIc1q1.diff[i] = sampleCIc1q1.mean1[i] - sampleCIc1q1.mean2[i];
      	}

      document.getElementById("moreTEsims").style.display = 'block';
      return sampleCIc1q1.diff;
    }



    function resample1C1Q4Test(nreps) {
      //function to generate random resamples and compute means
      //
      observed = diff
      var c1q1N2 = x2.length,
          shift = observed - nullValue,
          c1q1Shifted = [];

	    for (i = 0; i < c1q1N2; i++) {
		    c1q1Shifted.push(x2[i] + shift);
      }
      sampleTstc1q1 = resampleDiffMeans(x1, c1q1Shifted, nreps);
  		indices = sequence(0, nreps, 1);
  		// Now sort the indices by order of the first element which is diff
  		//console.log(sampleTstc1q1);
  		indices.sort(function (a, b) {
  			return sampleTstc1q1.diff[a] - sampleTstc1q1.diff[b];
  		});
  		sampleTstc1q1.diff = indices.map(function (ndx) {
  			return sampleTstc1q1.diff[ndx];
  		});
  		sampleTstc1q1.mean1 = indices.map(function (ndx) {
  			return sampleTstc1q1.mean1[ndx];
  		});
  		sampleTstc1q1.mean2 = indices.map(function (ndx) {
  			return sampleTstc1q1.mean2[ndx];
  		});

      document.getElementById("moreTEsims").style.display = 'block';
      return sampleTstc1q1.diff;
    }

function c1q1CIinteract(d, i) {
	// open modal box to show diff in means in the selected resample;
	//console.log(d.x);
	var c1q1InfModal = document.getElementById("C1Q1WhichDot"),
		c1q1InfModalContent = document.getElementById("C1Q1SelectedSample");
	c1q1InfModal.style.display = "block";
	c1q1InfModalContent.style.display = "block";
	c1q1InfModalContent.innerHTML = c1q1Keys[0] + "\t Mean: " + sampleCIc1q1.mean1[i].toPrecision(4) +
		"<br>" + c1q1Keys[1] + "\t Mean: " + sampleCIc1q1.mean2[i].toPrecision(4) +
		"<br> Difference: " + sampleCIc1q1.diff[i].x.toPrecision(4) +
		"<br> Click to Close";
	//window.onclick = function(event) {
	//	if (event.target == c1q1InfModal) {
	//		c1q1InfModal.style.display = "none";
	//	}
	//}
}

function c1q1TestInteract(d, i) {
	// open modal box to show diff in means in the selected resample;
	//console.log(d.x);
	var c1q1InfModal = document.getElementById("C1Q1WhichDot"),
		c1q1InfModalContent = document.getElementById("C1Q1SelectedSample");
	c1q1InfModal.style.display = "block";
	c1q1InfModalContent.style.display = "block";
	c1q1InfModalContent.innerHTML = c1q1Keys[0] + "\t Mean: " + sampleTstc1q1.mean1[i].toPrecision(4) +
		"<br>" + c1q1Keys[1] + "\t Mean: " + sampleTstc1q1.mean2[i].toPrecision(4) +
		"<br> Difference: " + sampleTstc1q1.diff[i].x.toPrecision(4) +
		"<br> Click to Close";
	//window.onclick = function(event) {
	//	if (event.target == c1q1InfModal) {
	//		c1q1InfModal.style.display = "none";
	//	}
	//}
}
