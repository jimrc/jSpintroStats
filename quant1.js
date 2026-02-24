// subroutine to estimate a mean or test for a special value
// All global state is now managed through AppState namespace


function q1TestEstimate(){
    let dIn, dSumm, infText, testInpts, intervalInpts;
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
    "             placeholder='0.0' 	onchange= 'AppState.nullValue = +this.value; changeNullQ1();' "+
    "  			   </input>"+
    "       </div>" +
    "   </div>" +
    "<div> <br> </div>" +
    " <div class='w3-cell-row w3-mobile'>" +
     "    <div class='w3-cell' style='width: 250px' >	Stronger evidence is a mean 	</div>" +
  		" 	<div class='w3-cell' style='width: 30%'>" +
  		"		  <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='q1testDirection' " +
     	"  onmouseup ='AppState.testDirection = this.value; if(AppState.sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
  	  "  onselect  ='AppState.testDirection = this.value; if(AppState.sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
      "         <option value='lower'>Less Than or =</option>" +
  		"			    <option value='both' selected >As or More Extreme Than</option>" +
  		"			    <option value='upper'>Greater Than or =</option>" +
      "     </select>" +
  		"	  </div>" +
  		"	  <div class='w3-cell' style='width: 40%' id='q1ObsdMean'>" +
      "		  &nbsp;&nbsp; the observed mean = " + AppState.observed +
    "     </div>" +
  	"	</div>" ;

    infText =
  		" <div>  </div>" ;

      return [dIn, dSumm,  testInpts, infText];
  }

function q1DataChange(){
     AppState.sample4Test = AppState.sample4CI = [];
     document.getElementById("q1Summary").style.display = 'none'
     document.getElementById('infSVGplot').style.display = 'none'
     document.getElementById('inferenceText').style.display = 'none'
     document.getElementById("confLvlInpt").style.display = 'none'
     document.getElementById("testInpt").style.display = 'none'
     document.getElementById("moreTEsims").style.display = 'none'
}

function changeNullQ1 (){
      //function to remove outdated info and Plot
      AppState.sample4Test = AppState.testData = [];
       document.getElementById("infSVGplot").style.display = 'none';
       document.getElementById("moreTEsims").style.display = 'none';
       document.getElementById("inferenceText").style.display = 'none';
    };



function resample1Q4Test(nreps) {
      //function to test 'Is the true mean  = some value?'
      AppState.nullValue = +document.getElementById('q1trueMu').value;
      AppState.q1N = AppState.q1Values.length;
      document.getElementById("moreTEsims").style.display = 'block';
      const shift = AppState.q1Xbar - AppState.nullValue;
      const q1Shifted = AppState.q1Values.map(val => val - shift);
      const resampleq1 = resample1Mean(q1Shifted, nreps).sort(function(a, b) {
          return a - b;
        });
      return resampleq1;
    }

function resample1Q4CI(nreps) {
      //function to generate random resamples and compute means
      const resampleq1 = resample1Mean(AppState.q1Values, nreps).sort(function(a, b) {
          return a - b;
        });
      document.getElementById("moreTEsims").style.display = 'block';
      return resampleq1;
    }

// All global state is now in AppState object (see AppState.js)

function summarizeMu1() {
  // builds summary table and dot plot for 1 quantitative variable
  const margin = 30,
    barHeight = 20,
    colors = [],
    w = 300,
    h = 60;

  AppState.q1Label = document.getElementById('q1Label').value;
  AppState.q1Values = document.getElementById('q1Values').value.split(',');
  document.getElementById("q1Summary").style.display = "block";
  AppState.q1N = AppState.q1Values.length;
  AppState.q1Values = AppState.q1Values.map(val => +val);  // convert to numeric

  AppState.observed = AppState.q1Xbar = d3.mean(AppState.q1Values);
  AppState.q1SD = d3.deviation(AppState.q1Values);
  AppState.q1SEXbar = AppState.q1SD / Math.sqrt(AppState.q1N);
  const q1Summ = document.getElementById('q1SummaryText');
  AppState.q1Data = [
    { label: 'Xbar', xx: AppState.q1Xbar },
    { label: 'SE', xx: AppState.q1SEXbar },
    { label: 'Sample Size', xx: AppState.q1N },
  ];
  q1Summ.innerHTML =
    'x&#773; =  ' +
    AppState.q1Xbar.toPrecision(5) +
    ', &nbsp; &nbsp; s = ' +
    AppState.q1SD.toPrecision(5) +
    '<br> Sample Size = ' +
    AppState.q1N;
  q1Summ.style = 'display: block';
  document.getElementById('q1ObsdMean').innerHTML =
      "		&nbsp;&nbsp; the observed mean = " + AppState.observed.toPrecision(4);

  discreteChart(AppState.q1Values, document.getElementById('q1SmrySVG'));
}
