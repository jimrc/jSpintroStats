// subroutine to estimate a mean or test for a special value
// TODO: cleanup plot, remove unused variables
// Fix testing inputs to take null value


function q1TestEstimate(){
    var dIn, dSumm, infText, testInpts;
    dIn =
    " <div class='w3-container' id='quant1DataIn-Summary'>"+
		" 	  <div class='w3-cell-row w3-mobile'>"+
		" 		  <div class='w3-cell' style='width:60%'>"+
		" 			  <h4> Enter Data</h4>"+
   	" 				<table class='w3-table w3-border'>"+
		" 				<tr>"+
		" 					<th>Label</th>"+
		" 					<th>Separate values with commas</th>"+
		" 				</tr>"+
		" 				<tr>"+
		" 					<td>"+
		" 						<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='q1Label' "+
    "      placeholder='y'>"+
		" 					</td>"+
		" 					<td>"+
		" 						<input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='q1Values'"+
		" 						  onchange = 'q1DataChange();' >"+
		" 					</td>"+
		" 				</tr>"+
		" 			</table>"+
		" 		</div>"+
		" 		<div class='w3-cell'> &nbsp;"+
		" 			<button onclick = 'summarizeMu1()'>  &nbsp; &nbsp; Summary</button>"+
		" 		  <div class='w3-cell' style=' display:block' id='q1Summary'>"+
		" 			  <div class='w3-container w3-cell w3-mobile' id='q1SummaryText' style='width:70%'>"+
		" 			  </div>"+
	  " 				<div class='w3-container w3-cell w3-mobile' id='q1SummarySVGgoesHere'>"+
		"   				<svg id='q1SmrySVG' height=160 width=300></svg>"+
		" 	  		</div>"+
		" 		  	<div class='w3-container w3-modal w3-mobile'>"+
		" 			  	<div class='w3-modal-content w3-card-4' id='q1SelectedSampleA' style=' display:none'>"+
		" 				  </div>"+
		" 			  </div>"+
		" 		  </div>"+
		" 		</div>"+
		" 	</div> "+
		" </div>";
      dSumm =
    	" 				<div class='w3-container w3-cell w3-mobile' id='q1Summary' style='display:none'>" +
    	" 				</div>"
    intervalInpts= "Estimate Mean";
    testInpts =
    "<div> <br> </div>" +
    "<div class='w3-cell-row w3-mobile' style = 'text-align: left'>" +
    "  			<div class='w3-cell' style='width:250px'>"+
    "  				Test: Is the true mean = &nbsp;"+
    "  			</div>"+
    "  			<div class='w3-cell' style='width: 30%'>"+
    "  				 <input class='w3-input w3-card w3-mobile w3-pale-yellow' type='text' id='q1trueMu'"+
    "             placeholder='0.0' 	onchange= 'nullValue = +this.value; changeNullQ1();' "+
    "  			   </input>"+
    "       </div>" +
    "   </div>" +
    "<div> <br> </div>" +
    " <div class='w3-cell-row w3-mobile'>" +
     "    <div class='w3-cell' style='width: 250px' >	Stronger evidence is a mean 	</div>" +
  		" 	<div class='w3-cell' style='width: 30%'>" +
  		"		  <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='q1testDirection' " +
     	"  onmouseup ='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
  	  "  onselect  ='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
      "         <option value='lower'>Less Than or =</option>" +
  		"			    <option value='both' selected >As or More Extreme Than</option>" +
  		"			    <option value='upper'>Greater Than or =</option>" +
      "     </select>" +
  		"	  </div>" +
  		"	  <div class='w3-cell' style='width: 40%' id='q1ObsdMean'>" +
      "		  &nbsp;&nbsp; the observed mean = " + observed +
    "     </div>" +
  	"	</div>" ;

    infText =
  		" <div>  </div>" ;

      return [dIn, dSumm,  testInpts, infText];
  }

function q1DataChange(){
     sample4Test = sample4CI = [];
     document.getElementById("q1Summary").style.display = 'none'
     document.getElementById('infSVGplot').style.display = 'none'
     document.getElementById('inferenceText').style.display = 'none'
     document.getElementById("confLvlInpt").style.display = 'none'
     document.getElementById("testInpt").style.display = 'none'
     document.getElementById("moreTEsims").style.display = 'none'
}

function changeNullQ1 (){
      //function to remove outdated info and Plot
      sample4Test = testData = [];
       document.getElementById("infSVGplot").style.display = 'none';
       document.getElementById("moreTEsims").style.display = 'none';
       document.getElementById("inferenceText").style.display = 'none';
    };



function resample1Q4Test(nreps) {
      //function to test 'Is the true mean  = some value?'
      // Inputs were created by summarizeMu1
      nullValue = +document.getElementById('q1trueMu').value;
      q1N = q1Values.length;
      //document.getElementById('q1ConfLvl').style.display = 'none';
      //document.getElementById('q1Test1').style.display = 'block';
      document.getElementById("moreTEsims").style.display = 'block';
     var shift = q1Xbar - nullValue, resampleq1 = [];
      for (i = 0; i < q1N; i++) {
        q1Shifted[i] = q1Values[i] - shift;
      }
      resampleq1 = resample1Mean(q1Shifted, nreps).sort(function(a, b) {
          return a - b;
        });
      return resampleq1;
    }

function resample1Q4CI(nreps) {
      //function to generate random resamples and compute means
      //
      resampleq1 = resample1Mean(q1Values, nreps).sort(function(a, b) {
          return a - b;
        });

      document.getElementById("moreTEsims").style.display = 'block';
      return resampleq1;
    }


// Inputs:
//     a string of numbers separated by commas
//  TODO: allow user to choose a csv data file
//  TODO: clicking a point in inference plot should show the sample & its mean as a tooltip

var q1SummDiv = d3.select('#q1Inference'),
  q1Tstdata,
  q1CIdata,
  q1Label,
  q1Values,
  q1hdr,
  q1CnfLvl = 0.8,
  q1CLvl,
  q1lowerBd,
  q1upperBd,
  q1MuNull,
  q1N,
  q1Pval,
  q1Shifted = [],
  q1SD,
  q1SEXbar,
  q1Xbar,
  q1Test1,
  q1TestDirection,
  q1Data = [],
  chartq1,
  q1Color = [],
  confLevels = [
    { key: '80%', value: '0.80' },
    { key: '90%', value: '0.90' },
    { key: '95%', value: '0.95' },
    { key: '99%', value: '0.99', }
  ],
  q1Inference,
  q1InfOutput,
  noChoice = 'undefined',
  targetQuantile,
  upperBd,
  upperCI,
  resampleq1,
  sampleq1;

var svgQ1 = d3.select('#q1InfSVG');

function summarizeMu1() {
  // builds summary table and dot plot for 1 quantitative variable
  var margin = 30,
    barHeight = 20,
    colors = [],
    w = 300,
    h = 60;

  q1Label = document.getElementById('q1Label').value;
  q1Values = document.getElementById('q1Values').value.split(',');
  document.getElementById("q1Summary").style.display = "block";
  //console.log(q1Values);
  q1N = q1Values.length;
  for (i = 0; i < q1N; i++) {
    q1Values[i] = +q1Values[i];  // convert to numeric
  }

  observed = q1Xbar = d3.mean(q1Values);
  q1SD = d3.deviation(q1Values);
  q1SEXbar = q1SD / Math.sqrt(q1N);
  q1Summ = document.getElementById('q1SummaryText');
  q1Data = [
    { label: 'Xbar', xx: q1Xbar },
    { label: 'SE', xx: q1SEXbar },
    { label: 'Sample Size', xx: q1N },
  ];
  q1Summ.innerHTML =
    'x&#773; =  ' +
    q1Xbar.toPrecision(5) +
    ', &nbsp; &nbsp; s = ' +
    q1SD.toPrecision(5) +
    '<br> Sample Size = ' +
    q1N;
  q1Summ.style = 'display: block';
  document.getElementById('q1ObsdMean').innerHTML =
      "		&nbsp;&nbsp; the observed mean = " + observed.toPrecision(4);

  //check for any old output plots. If present, erase them due to change in data
  if (q1InfOutput) {
    q1CIdata = q1TestData = [];
    document.getElementById('allQ1Inference').style.display = 'none';
    document.getElementById('q1Output').style.display = 'none';
    document.getElementById('q1MoreSims').style.display = 'none';
    document.getElementById('q1ConfLvl').style.display = 'none';
    document.getElementById('q1Inference').style.display = 'none';
    document.getElementById('q1Test1').style.display = 'none';
    document.getElementById('q1SelectedSample').style.display = 'none';
    document.getElementById('q1WhichDot').style.display = 'none';
  }

  discreteChart(q1Values, q1SmrySVG, q1SumInteract);
}

function q1SumInteract(d, i) {
  var q1SumModal = document.getElementById('q1SelectedSampleA');
  q1SumModal.style.display = 'block';
  q1SumModal.innerHTML = q1Values[i];

  // open modal box to show data value
  window.onclick = function(event) {
    if (event.target == q1SumModal) {
      q1SumModal.style.display = 'none';
    };
  };
};
