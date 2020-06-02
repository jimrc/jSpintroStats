// subroutine to estimate a proportion or test for a special value
// Inputs:
//     2 category labels (default = Success/Failure) and a count for each
//
//    TODO: align true proportion better with cue: 'Test: Is the true proportion ='

var
  cat1Label1,
  cat1Label2,
  cat1N1,
  cat1N2,
  c1Data = [],
  noChoice = "undefined",
  cat1Phat =0.5,
  total;

  function summarizeP1() {
    // builds summary table and plot for 1 categorical variable
    var colors = []; //240

    cat1Label1 = document.getElementById("cat1Label1").value;
    cat1Label2 = document.getElementById("cat1Label2").value;
    cat1N1 = +document.getElementById("cat1N1").value;
    cat1N2 = +document.getElementById("cat1N2").value;
    proportion = cat1Phat = cat1N1 / (cat1N1 + cat1N2);
    cat1Summ = document.getElementById("cat1SummaryText");
    document.getElementById("cat1SummarySVGgoesHere").style.display = "block";

       document.getElementById("inferenceInputs").style.display = 'block';
       document.getElementById("inferenceText").innerHTML = ' ';
       document.getElementById("moreTEsims").style.display = 'none';
       document.getElementById("testInpt").style.display = 'none';
       document.getElementById("confLvlInpt").style.display = 'none';
       d3.select("#infSVGplot_svg").remove();

    resampleC1 = [];
    sampleC1 = [];

    cat1Summ.innerHTML =
      "p&#770; =  " +
      cat1Phat.toPrecision(4) +
      " <br> se(p&#770) = " +
      (Math.sqrt(cat1Phat * (1 - cat1Phat) / (cat1N1 + cat1N2))).toPrecision(3);
    cat1Summ.style = "display: block";

    c1Data = [
      {
        label: cat1Label1,
        xx: cat1Phat
      }

      //{	'label' : cat1Label2,		'xx' : 1 - cat1Phat	}
    ];

    if (typeof cat1Bars === "function") {
      cat1Bars.data([cat1Phat]);
    } else {
      cat1Bars = propBarChart()
        .data([cat1Phat])
        .height(100);
      d3.select("#cat1SummarySVGgoesHere").call(cat1Bars);
    }

  }

function c1TestEstimate(){
  var dIn, intervalInpts, testInpts, plot, results;
  dIn =
  " 		<div class='w3-cell-row w3-mobile'>"+
  " 			 <div class='w3-cell' style='width:40%'>"+
  " 				  <h4> Enter Data</h4>"+
  " 					<table class='w3-table w3-border'>"+
  "   						<tr> <th>Label</th> <th>Count</th>		</tr>"+
  "         			<tr> <td>	<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1Label1'"+
  "         								placeholder='Success' >			</td>"+
  "         					<td><input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='cat1N1'"+
  "                         placeholder=' '   onchange= 'renewC1()'>  </td>  	</tr>"+
  "         			<tr> 	<td>	<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1Label2'"+
  "         								placeholder='Failure' >		</td>	"+
  "         							<td>		<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1N2'"+
  "        								placeholder=' '  onchange= 'renewC1()'> 	</td>		</tr> <tr></tr>"+
  "          	</table>	&nbsp; &nbsp;"+
  "        </div>        	&nbsp; &nbsp; 				&nbsp; &nbsp;"+
  " 			 <div class='w3-cell' style='width:2%'> </div>"+
  "        <div class='w3-cell' style='width:45%; display:block'>" +
  "	          <button onclick = 'summarizeP1()'>   &nbsp &nbsp  Summary</button>"+
  "        	  <div class='w3-container w3-cell w3-mobile' id='cat1SummaryText' style='display:none'>"+
  "          						p&#770; ="+
  "          						&nbsp; &nbsp;"+
  "          						se(p&#770;) ="+
  "      		  </div>"+
  "        	  <div class='w3-container w3-cell w3-mobile' id='cat1SummarySVGgoesHere'> </div>"+
  "      	    <br>"+
  "    </div>  </div>";
  dSumm = " ";
  //  		<!--  Inputs for each inference  (before plotting)  -->
  intervalInpts =
  "  			Choose a Confidence Level:"
  "  		</div>";

  testInpts=
  "<div class='w3-cell-row w3-mobile'>" +
  "  			<div class='w3-cell  w3-mobile' style='width: 55%'>"+
  "  				&nbsp; &nbsp; &nbsp; Test: Is the true proportion = &nbsp;"+
  "  			  </div>"+
  "  			<div class='w3-cell  w3-mobile' style='width: 35%'>"+
  "  				 <input class='w3-input w3-card w3-mobile w3-pale-yellow' type='text' id='cat1Null'"+
  "             placeholder='0.625' 	onchange= 'nullValue = this.value' "+
  "  			   </input>"+
  "       </div>" +
  "   </div>" +
  "  	<div id='c1TestDirection' class='w3-cell-row w3-mobile' >"+
  "  				<div class='w3-cell' >"+
  "  					Stronger evidence is a proportion"+
  "  				</div>"+
  "  				<div class='w3-cell'>"+
	"		<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow'  " +
  "  onchange='testDirection = this.value; if(sample4Test.length > 0){moreTests(0,true)} else{moreTests(100,false)}'>" +
  "  						<option value='lower'>Less Than or =</option>"+
  "  						<option value='both' selected>As or More Extreme Than</option>"+
  "  						<option value='upper'>Greater Than or =</option>"+
  "  					</select>"+
  "  				</div>"+
  "  				<div class='w3-cell' style='width: 30%'>"+
  "         	&nbsp;	&nbsp; 	p&#770; (from above)"+
  "  				</div>"+
  " 			</div>"+
  " </div>";

  plot = " ";

  results =
  "  	 ";

  return [dIn, dSumm, intervalInpts, testInpts, plot, results];
}



function renewC1 (){
      //function to remove outdated info and PlotGoesHere
       document.getElementById('cat1SummaryText').style.display = 'none';
 			 document.getElementById('cat1SummarySVGgoesHere').style.display =  'none';
    };




function resample1C4Test(nreps) {
  //function to test 'Is the true proportion  = some value?' for 'success/failure' data
  // Gather Inputs:
  cat1Label1 = document.getElementById("cat1Label1").value;
  cat1Label2 = document.getElementById("cat1Label2").value;
  cat1N1 = +document.getElementById("cat1N1").value;
  cat1N2 = +document.getElementById("cat1N2").value;
  document.getElementById("moreTEsims").style.display = 'block';

  var sC1Len,    total = cat1N1 + cat1N2;
  var sampleC1 = rbinom(total, nullValue, nreps).sort(function(a, b) {
      return a - b;
    });
  var sC1Len = sampleC1.length;
  for (i = 0; i < sC1Len; i++) {
    sampleC1[i] *= 1 / total;
  }
  return sampleC1;
}

function resample1C4CI(nreps) {
  //function to generate random draws from observed proportions
  // Gather Inputs:
  cat1N1 = +document.getElementById("cat1N1").value;
  cat1N2 = +document.getElementById("cat1N2").value;
  document.getElementById("moreTEsims").style.display = 'block';

  var sC1Len,    total = cat1N1 + cat1N2;
  resampleC1 = rbinom(total, cat1Phat, nreps).sort(function(a, b) {
    return a - b;
  });
  var sC1Len = resampleC1.length;
  for (i = 0; i < sC1Len; i++) {
    resampleC1[i] *= 1 / total;
  }
  return resampleC1;
}
