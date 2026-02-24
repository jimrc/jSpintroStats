// subroutine to estimate a proportion or test for a special value
// All global state is now managed through AppState namespace

  function summarizeP1() {
    // builds summary table and plot for 1 categorical variable
    var colors = [];

    AppState.cat1Label1 = document.getElementById("cat1Label1").value;
    AppState.cat1Label2 = document.getElementById("cat1Label2").value;
    AppState.cat1N1 = +document.getElementById("cat1N1").value;
    AppState.cat1N2 = +document.getElementById("cat1N2").value;
    AppState.proportion = AppState.cat1Phat = AppState.cat1N1 / (AppState.cat1N1 + AppState.cat1N2);
    AppState.cat1Summ = document.getElementById("cat1SummaryText");
    document.getElementById("cat1SummarySVGgoesHere").style.display = "block";

       document.getElementById("inferenceInputs").style.display = 'block';
       document.getElementById("inferenceText").innerHTML = ' ';
       document.getElementById("moreTEsims").style.display = 'none';
       document.getElementById("testInpt").style.display = 'none';
       document.getElementById("confLvlInpt").style.display = 'none';
       d3.select("#infSVGplot_svg").remove();

    AppState.resampleC1 = [];
    AppState.sampleC1 = [];

    AppState.cat1Summ.innerHTML =
      `p&#770; =  ${AppState.cat1Phat.toPrecision(4)} <br> se(p&#770) = ${(Math.sqrt(AppState.cat1Phat * (1 - AppState.cat1Phat) / (AppState.cat1N1 + AppState.cat1N2))).toPrecision(3)}`;
    AppState.cat1Summ.style = "display: block";

    AppState.c1Data = [
      {
        label: AppState.cat1Label1,
        xx: AppState.cat1Phat
      }
    ];

    if (typeof AppState.cat1Bars === "function") {
      AppState.cat1Bars.data([AppState.cat1Phat]);
    } else {
      AppState.cat1Bars = propBarChart(AppState.c1Data, `Proportion ${AppState.cat1Label1}`)
        .data([AppState.cat1Phat])
        .height(100);
      d3.select("#cat1SummarySVGgoesHere").call(AppState.cat1Bars);
    }

  }

function c1TestEstimate(){
  var dIn, dSumm, infText, testInpts;
  dIn =
  `<div class='w3-cell-row w3-mobile'>
     <div class='w3-cell' style='width:40%'>
       <h4> Enter Data</h4>
       <table class='w3-table w3-border'>
         <tr> <th>Label</th> <th>Count</th></tr>
         <tr> <td>	<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1Label1'
           placeholder='Success' ></td>
           <td><input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='cat1N1'
             placeholder=' '   onchange= 'renewC1()'>  </td>  </tr>
         <tr> 	<td>	<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1Label2'
           placeholder='Failure' ></td>	
           <td><input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1N2'
             placeholder=' '  onchange= 'renewC1()'> 	</td></tr> <tr></tr>
       </table>	&nbsp; &nbsp;
     </div>        	&nbsp; &nbsp; 				&nbsp; &nbsp;
     <div class='w3-cell' style='width:2%'> </div>
     <div class='w3-cell' style='width:45%; display:block'>
       <button onclick = 'summarizeP1()'>   &nbsp &nbsp  Summary</button>
       <div class='w3-container w3-cell w3-mobile' id='cat1SummaryText' style='display:none'>
         p&#770; =
         &nbsp; &nbsp;
         se(p&#770;) =
       </div>
       <div class='w3-container w3-cell w3-mobile' id='cat1SummarySVGgoesHere'> </div>
       <br>
     </div>  </div>`;
  dSumm = " ";
  //  		<!--  Inputs for each inference  (before plotting)  -->

  testInpts=
  `<div class='w3-cell-row w3-mobile'>
    <div class='w3-cell  w3-mobile' style='width: 55%'>
      &nbsp; &nbsp; &nbsp; Test: Is the true proportion = &nbsp;
    </div>
    <div class='w3-cell  w3-mobile' style='width: 35%'>
      <input class='w3-input w3-card w3-mobile w3-pale-yellow' type='text' id='cat1Null'
        placeholder='0.625' 	onchange= 'nullValue = this.value; changeNullC1();' 
      ></input>
     </div>
   </div>
   <div id='c1TestDirection' class='w3-cell-row w3-mobile' >
     <div class='w3-cell' >
       Stronger evidence is a proportion
     </div>
     <div class='w3-cell'>
       <select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow'  onchange='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>
         <option value='lower'>Less Than or =</option>
         <option value='both' selected>As or More Extreme Than</option>
         <option value='upper'>Greater Than or =</option>
       </select>
     </div>
     <div class='w3-cell' style='width: 30%'>
       &nbsp;	&nbsp; 	p&#770; (from above)
     </div>
   </div>
 </div>`;

  infText = " ";


  return [dIn, dSumm, testInpts, infText];
}



function renewC1 (){
      //function to remove outdated info and Plot
      AppState.sample4CI = AppState.resample4CI = AppState.testData = AppState.CIData = [];
       document.getElementById('cat1SummaryText').style.display = 'none';
 			 document.getElementById('cat1SummarySVGgoesHere').style.display =  'none';
       document.getElementById("moreTEsims").style.display = 'none';
       document.getElementById("inferenceText").style.display = 'none';
       document.getElementById("inferenceInputs").style.display = 'none';
       document.getElementById("infSVGplot").style.display = 'none';
    };

function changeNullC1 (){
      //function to remove outdated info and Plot
      AppState.sample4Test = AppState.testData = [];
       document.getElementById("infSVGplot").style.display = 'none';
       document.getElementById("moreTEsims").style.display = 'none';
       document.getElementById("inferenceText").style.display = 'none';
    };



function resample1C4Test(nreps) {
  //function to test 'Is the true proportion  = some value?' for 'success/failure' data
  // Gather Inputs:
  AppState.cat1Label1 = document.getElementById("cat1Label1").value;
  AppState.cat1Label2 = document.getElementById("cat1Label2").value;
  AppState.cat1N1 = +document.getElementById("cat1N1").value;
  AppState.cat1N2 = +document.getElementById("cat1N2").value;
  document.getElementById("moreTEsims").style.display = 'block';

  var sC1Len,    total = AppState.cat1N1 + AppState.cat1N2;
  var sampleC1 = rbinom(total, AppState.nullValue, nreps).sort(function(a, b) {
      return a - b;
    });
  var sC1Len = sampleC1.length;
  sampleC1 = sampleC1.map(val => val * (1 / total));
  return sampleC1;
}

function resample1C4CI(nreps) {
  //function to generate random draws from observed proportions
  // Gather Inputs:
  AppState.cat1N1 = +document.getElementById("cat1N1").value;
  AppState.cat1N2 = +document.getElementById("cat1N2").value;
  document.getElementById("moreTEsims").style.display = 'block';

  var sC1Len,    total = AppState.cat1N1 + AppState.cat1N2;
  AppState.resampleC1 = rbinom(total, AppState.cat1Phat, nreps).sort(function(a, b) {
    return a - b;
  });
  AppState.resampleC1 = AppState.resampleC1.map(val => val * (1 / total));
  return AppState.resampleC1;
}
