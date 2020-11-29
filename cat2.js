// subroutine to estimate a proportion or test for a special value

  function c2TestEstimate(){
    var dIn,  dSumm, testInpts, infText;
    dIn =
    " <div class='w3-container' id='cat2DataIn-Summary'> "+
    "   <div class='w3-cell-row w3-mobile'>"+
    "     <div class='w3-cell' style='width:50%'>"+
    "       <h4> Enter Data as counts, then click [Summary]. </h4>"+
    "       <table class='w3-table w3-border'>"+
    "         <tr>"+
    "           <th>Labels:</th>"+
    "           <th>"+
    "             <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2LabelPop1' "+
    "               placeholder='Group A'  onchange='cat2LabelPop1 = this.value; renewC2()'>"+
    "           </th>"+
    "           <th>"+
    "             <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2LabelPop2'"+
    "                placeholder='Group B'  onchange='cat2LabelPop2 = this.value; renewC2()'>"+
    "           </th>"+
    "         </tr>"+
    "         <tr>"+
    "           <td>"+
    "             <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2LabelOut1' "+
    "                        placeholder='Success'  onchange='cat2LabelOut1 = this.value; renewC2()'>"+
    "           </td>"+
    "           <td>"+
    "           <input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='cat2N11' "+
    "           placeholder='1' onchange='renewC2()'>"+
    "           </td>"+
    "           <td>"+
    "             <input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='cat2N12'"+
    "              placeholder='1' onchange='renewC2()'>"+
    "           </td>"+
    "         </tr>"+
    "         <tr>"+
    "           <td>"+
    "             <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2LabelOut2'"+
    "              placeholder='Failure'  onchange='cat2LabelOut2 = this.value; renewC2()'>"+
    "           </td>"+
    "           <td>"+
    "             <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2N21'"+
    "              placeholder='1' onchange='renewC2()'>"+
    "           </td>"+
    "           <td>"+
    "             <input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat2N22' "+
    "             placeholder='1' onchange='renewC2()'>"+
    "           </td>"+
    "         </tr>"+
    "       </table>"+
    "     </div>"+
    "     &nbsp;&nbsp;"+
    "     <div class='w3-cell' style='display:block'>"+
    "         <button id='cat2RawSumm' class='w3-button w3-pale-blue w3-medium w3-round-xlarge'"+
    "           onclick =	'CIdata = testData = []; summarizeP2(); '> "+
    "            &nbsp; &nbsp;Summary"+
    "            </button>"+
    "       <div class='w3-container w3-cell w3-mobile' id='cat2SummarySVGgoesHere' "+
    "       style = 'display:none'></div>"+
    "       <div class='w3-container w3-cell w3-mobile' id='cat2SummaryText' "+
    "       style='width:310px; display:none'></div>"+
    "     </div>"+
    "   </div>"+
    "   <br>"+
    " </div>";
    dSumm = " ";

      testInpts=
      "<div class='w3-cell-row w3-mobile'>" +
      "  			<div class='w3-cell  w3-mobile' style='width: 55%'>"+
      "  				&nbsp; &nbsp; &nbsp; Test H <sub>0</sub>: The true proportions are equal."+
      "  			  </div>"+
      "   </div>" +
      "  	<div id='c2TestDirection' class='w3-cell-row w3-mobile' >"+
      "  				<div class='w3-cell' >"+
      "  					Stronger evidence is a difference in proportions"+
      "  				</div>"+
      "  				<div class='w3-cell'>"+
    	"		<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow'  " +
      "  onchange='testDirection = this.value; nullValue = 0.0; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
      "  						<option value='lower'>Less Than or =</option>"+
      "  						<option value='both' selected>As or More Extreme Than</option>"+
      "  						<option value='upper'>Greater Than or =</option>"+
      "  					</select>"+
      "  				</div>"+
      "  			<div class='w3-cell' id='cat2ObsdDiff'>"+
      "  			  &nbsp;&nbsp;"+
      "  			  the p&#770;<sub>1</sub> - p&#770;<sub>2</sub> observed above."+
      "  			</div>"+
      " 		</div>"+
      " </div>";

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
         document.getElementById('cat2SummaryText').style.display = 'none';
   			 document.getElementById('cat2SummarySVGgoesHere').style.display =  'none';
         document.getElementById("moreTEsims").style.display = 'none';
         document.getElementById("inferenceText").style.display = 'none';
         document.getElementById("inferenceInputs").style.display = 'none';
         document.getElementById("infSVGplot").style.display = 'none';
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

	cat2LabelOut1 = document.getElementById("cat2LabelOut1").value;
	cat2LabelOut2 = document.getElementById("cat2LabelOut2").value;
	cat2LabelPop1 = document.getElementById("cat2LabelPop1").value;
	cat2LabelPop2 = document.getElementById("cat2LabelPop2").value;
	cat2N11 = +document.getElementById("cat2N11").value;
	cat2N12 = +document.getElementById("cat2N12").value;
	cat2N21 = +document.getElementById("cat2N21").value;
	cat2N22 = +document.getElementById("cat2N22").value;
	total1 = cat2N11 + cat2N21;
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
