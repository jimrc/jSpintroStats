//  javascript to setup main index.html
var circleColors = ["steelblue", "red"],
    demo,
    vbleChoice,
    confLevels = [
      { key: "80%", value: "0.80" },
      { key: "90%", value: "0.90" },
      { key: "95%", value: "0.95" },
      { key: "99%", value: "0.99" }
    ],
    inference,
    samples4Test = [],
    samples4CI = [];

  //  Functions to activate Header Choices ///
function w3Open() {
  document.getElementById("main").style.marginLeft = "25%";
	document.getElementById("mySidebar").style.width = "25%";
	document.getElementById("mySidebar").style.display = "block";
	//document.getElementById("openNav").style.display = 'none';
}

function w3Close() {
  // close up the menu options
	document.getElementById("main").style.marginLeft = "0%";
	document.getElementById("mySidebar").style.display = "none";

	//document.getElementById("openNav").style.display = "inline-block";
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

//function openVble(vbleName) {
  // perhaps this is no longer needed?
	//var i,
	//		y = document.getElementsByClassName("Page"),
	//		x = document.getElementsByClassName("vType");
	//for (i = 0; i < x.length; i++) {
	//			x[i].style.display = "none";
	//}
	//for (i = 0; i < y.length; i++) {
	//		y[i].style.display = "none";
	//}
	//document.getElementById(vbleName).style.display = "block";
	//w3Close();
//}

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


function CLChange(arg) {
  // set colors for dots to illustrate confidence interval
  // needs to adjust for type of inference, but inference shouldnt be a global variables
  // new dots come from an inference specific functions
  // Get new dots, color them, and plot them.
  var cnfLvl = cat1CnfLvl,
    sC1Len,
    tempColors;
  if (arg.value) {
    cnfLvl = +arg.value;
  }
  if (CIdata) {
    CILen = CIdata[0].length;
    tempColors = ciColor(CIdata[0], cnfLvl);
    if (tempColors[1]) {
      lowerBd = tempColors[1].toPrecision(4);
      upperBd = tempColors[2].toPrecision(4);
      cnfLvl = tempColors[3];
      CIdata = [c1CIdata[0], tempColors[0]];
    } else {
      CIdata = [CIdata[0], tempColors];
    }
    cat1InfOutput = discreteChart(c1CIdata, cat1InfSVG, cat1CIinteract);
    sC1Len = CIdata[0].length;
  } //else {
  //  console.log('No resampled data for CI');
  //}
  ftr = document.getElementById("cat1Results");
  ftr.innerHTML = //'<div style = 'height = 10'> </div>' +
    '<div style = "width:360px"> Proportion ' +
    cat1Label1 +
    " in  " +
    sC1Len +
    " Re-samples" +
    "<br> <br>" +
    Math.round(cnfLvl * 100) +
    "% Confidence Interval: (" +
    cat1lowerBd +
    ", " +
    cat1upperBd +
    " )</div> ";
  ftr.style.display = "block";
  document.getElementById("moreSims").style.display = "block";
}

function renew (){
      //function to remove outdated info and PlotGoesHere
       document.getElementById('cat1SummaryText').style.display = 'none';
 			 document.getElementById('cat1SummarySVGgoesHere').style.display =  'none';
    };

function  changeC1Dots(){
       svgCat1.selectAll("g" ).remove();
      document.getElementById('cat1Output').style.display = 'none';
      testP1(noChoice)
    };


function testEstFn(vble){
  // function to customize the testEst page for a particular type of variable.
  var hdr,
    divs = [],
    estimate = "estimate", g = "g",
    summaryText,
    summaryPlot,
    test = "test",
    clvlInpt = document.getElementById("confLvlInpt"),
    testInpt = document.getElementById("testInpt"),
    title = document.getElementById("testEstHeader"),
    block1 = document.getElementById("dataInSummary"),
    block2 = document.getElementById("confLvlInpt"),
    block3 = document.getElementById("testInpt"),
    block4 = document.getElementById("inferencePlot"),
    block5 = document.getElementById("inferenceText");

    var svgInf = d3.select("#infSVG"),
        svgSum = d3.select("#sumSVG");

  switch(vble){
      case 'cat1' : {
        hdr = "<b>Estimate</b> a single proportion or <b>Test</b> its value.";
        divs = c1TestEstimate();
        break;   // End of c1Output
      }
      case 'quant1' :  {
        hdr = "Estimate a single mean or test its value.";
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
   block1.innerHTML = divs[0];
   block2.innerHTML = divs[1];
   block3.innerHTML = divs[2];
   block4.innerHTML = divs[3];
   block5.innerHTML = divs[4];


function c1TestEstimate(){
  var dIn, intervalInpts, testInpts, plot, results;
  dIn =
  " 		<div class='w3-cell-row w3-mobile'>"+
  " 			<div class='w3-cell' style='width:40%'>"+
  " 				<h4> Enter Data</h4>"+
  " 					<table class='w3-table w3-border'>"+
  "   						<tr> <th>Label</th> <th>Count</th>		</tr>"+
  "         			<tr> <td>	<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1Label1'"+
  "         								placeholder='Success' >			</td>"+
  "         					<td><input class='w3-input  w3-mobile w3-pale-yellow' type='text' id='cat1N1'"+
  "                         placeholder=' '   onchange= 'renew()'>  </td>  	</tr>"+
  "         			<tr> 	<td>	<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1Label2'"+
  "         								placeholder='Failure' >		</td>	"+
  "         							<td>		<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1N2'"+
  "        								placeholder=' '  onchange= 'renew()'> 	</td>		</tr> <tr></tr>"+
  "          					</table>	&nbsp; &nbsp;"+
  "        </div>        	&nbsp; &nbsp; 				&nbsp; &nbsp;"+
  " 			<div class='w3-cell' style='width:2%'> </div>"+
  "        <div class='w3-cell' style='width:45%; display:block'>"+
  "        			<button onclick = 'summarizeP1()'>   &nbsp &nbsp  Summary</button>"+
  "        			<div class='w3-container w3-cell w3-mobile' id='cat1SummaryText' style='display:none'>"+
  "          						p&#770; ="+
  "          						&nbsp; &nbsp;"+
  "          						se(p&#770;) ="+
  "      		</div>"+
  "        	<div class='w3-container w3-cell w3-mobile' id='cat1SummarySVGgoesHere'></div>"+
  "      	<br>"+
  "    </div>";
  //  		<!--  Inputs for each inference  (before plotting)  -->
  intervalInpts =
  "  					<h4>Estimate True Proportion with a Confidence Interval</h4>"+
  "  			Choose a Confidence Level:"
  "  		</div>";

  testInpts=
  "  			<div class='w3-cell  w3-mobile' style='width: 35%'>"+
  "  				&nbsp; &nbsp; &nbsp; Test: Is the true proportion = &nbsp;"+
  "  			</div>"+
  "  			<div class='w3-cell  w3-mobile' style='width: 20%'>"+
  "  				<input class='w3-input w3-card w3-mobile w3-pale-yellow' type='text' id='cat1trueP'"+
  "           placeholder='0.625' 		onchange= 'changeC1Dots()' "+
  "  			</div>"+
  "  			<div class='w3-cell  w3-mobile' style='width: 30%'>"+
  "  			</div>" +
  "  			<div id='cat1TestInpt2' class='w3-cell-row w3-mobile' style=' display: none'>"+
  "  				<div class='w3-cell' style='width: 30%'>"+
  "  					Stronger evidence is a proportion"+
  "  				</div>"+
  "  				<div class='w3-cell' style='width: 40%'>"+
  "  					<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='cat1Extreme'"+
  "  					     onchange='cat1TestUpdate()'>"+
  "  						<option value='lower'>Less Than or =</option>"+
  "  						<option value='both' selected>As or More Extreme Than</option>"+
  "  						<option value='upper'>Greater Than or =</option>"+
  "  					</select>"+
  "  				</div>"+
  "  				<div class='w3-cell' style='width: 20%'>"+
  "  					&nbsp;&nbsp; p&#770; (from above)"+
  "  				</div>"+
  "  		</div>";

  plot =
  "  		<div id='cat1Output' style='display: none'>"+
  "  			<!--  Show Inference Plot -->"+
  "  			<div class='w3-container w3-cell w3-mobile' id='cat1Inference' style='width:420px'>"+
  "   					<!--  Inference plot goes here for CI or Test of 1 proportion -->"+
  "  					<svg id='cat1InfSVG' height='300px' width='400px'></svg>"+
  "  			</div>";

  results =
  "  			<div id='cat1MoreSims' style='width:360px; display:none'>"+
  "  				<div class='w3-cell-row'>"+
  "  					<div class='w3-cell  w3-mobile' style='width: 20%'>			Add		</div>"+
  "  					<div class='w3-cell  w3-mobile' style='width: 20%'>"+
  "  						<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='cat1More'"+
  "               placeholder='0' onchange='cat1MoreSimFn()'>"+
  "  					</div>"  +
  "  					<div class='w3-cell  w3-mobile' style='width: 40%'>"+
  "  						&nbsp; simulated points"+
  "  					</div>"+
  "  			</div>"+
  "  		</div>  ";

  return [dIn, intervalInpts, testInpts, plot, results];
}


   function q1TestEstimate(){
    var dIn, intervalInpts, testInpts, plot, results;
    dIn = "1 Quantitative Data Input";
    choice = "Estimate or Test Mean";
    plot = "";
      results = "";
      return [dIn, intervalInpts, testInpts, plot, results];
  }

function q2TestEstimate(){
  var dIn, intervalInpts, testInpts, plot, results;
  dIn =
  	" 			<div class='w3-cell' style='width:50%'>" +
  	" 				<h4> Choose Data</h4>" +
  	" 				<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='quant2DataName'" +
  	" 				   onchange='summarizeSlope()'>" +
  	" 					<option value='shuttle' selected>Shuttle</option>" +
  	" 					<option value='women'>Women rate men</option>" +
  	" 					<option value='men'>Men rate women</option>" +
  	" 					<option value='dental'>Dental distance</option>" +
  	" 					<option value='other'>Other</option>" +
  	" 				</select>" +
  	" 			</div>" +
  	" 			<div class='w3-cell' style='display:block' id='quant2Summry'>" +
  	" 				<h4> &nbsp; &nbsp;Summary</h4>" +
  	" 				<div class='w3-container w3-cell w3-mobile' id='quant2SummaryText' style='display:none'>" +
  	" 				</div>" +
  	" 				<div class='w3-container w3-cell w3-mobile' id='quant2SummarySVGgoesHere'>" +
  	" 					</div>" +
  	" 					<svg id='quant2SumSVG' height='400px' width='400px'></svg >" +
  	" 			</div>" ;
  intervalInpts= "Estimate Slope";
  testInpts = "Test Slope";
  plot =
		" <div id='quant2Output' style='display:none'>" +
		" </div>" +
		" <div class='w3-container w3-cell w3-mobile' id='quant2Inference' style='width:420px; display:none'>" +
		" 		<svg id='quant2InfSVG' height='400px' width='400px'></svg>" +
		" </div>" ;

    results =
		  " <div id='quant2Results' class='w3-display-container' style='width:100%; display:none'></div>" +
		  " <!--  Increase simulation size -->" +
		  " <div id='quant2MoreSims' style='width:360px; display:none'>" +
		  " 	<div class='w3-cell-row'>" +
		  " 		<div class='w3-cell  w3-mobile' style='width: 20%'>" +
		  " 			Add" +
		  " 		</div>" +
		  " 		<div class='w3-cell  w3-mobile' style='width: 20%'>" +
	  		" 		<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='quant2More' placeholder='0'" +
  			" 		onchange='quant2MoreSimFn()'>" +
			  " 	</div>" +
		  	" 	<div class='w3-cell  w3-mobile' style='width: 40%'>" +
	  		" 		&nbsp;simulated slopes" +
		  	" 	</div>" +
	  	" 	</div>" +
	  " 	</div>";
    return [dIn, intervalInpts, testInpts, plot, results];
  }

  function c2TestEstimate(){
    var dIn, intervalInpts, testInpts, plot, results;
    dIn = "2 Categorical Data Input";
    choice = "Estimate or Test Difference in Proportions";
    plot = "";
    results = "";
    return [dIn, intervalInpts, testInpts, plot, results];
  }

  function c1q1TestEstimate(){
    var dIn, intervalInpts, testInpts, plot, results;
    dIn = "1 Categorical, 1 Quantitative Data Input";
    choice = "Estimate or Test Difference in Means";
    plot = "";
    results = "";
    return [dIn, intervalInpts, testInpts, plot, results];
  }
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


function spinDivs() {
 div1 =  "Type labels in the first box separated by commas or tabs " +
"<br> and the same number of percentages or probability weights in the second box. " +
"<div class='w3-form w3-cell-row w3-mobile' id='spinInputs'> " +
"  <div class='w3-cell w3-mobile' style='width:40%'> " +
"    Labels: " +
"    <input class='w3-input w3-border w3-mobile w3-pale-yellow' type='text' id='spinCats'  " +
"    style='display:block'> " +
"  </div> " +
"  <div class='w3-cell w3-mobile'></div> " +
"  <div class='w3-cell w3-mobile' style='width:40%'> " +
"    Probability weights: " +
"    <input class='w3-input w3-border w3-mobile w3-pale-yellow' type='text' id='spinProbs'  " +
"    style='display:block'> " +
"  </div> " +
"</div> ";
 div2 =  "Stop after: " +
"<div class='w3-form w3-cell-row w3-mobile' id='spinStops'> " +
"  <div class='w3-cell w3-mobile' style='width:30%'> " +
"    <input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='nSpins'  " +
"    placeholder='This many spins: ' onchange='spinNSpins();' style='display:block'> " +
"  </div>  &nbsp; or &nbsp; " +
"  <div class='w3-cell w3-mobile' style='width:30%'> " +
"    <input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='spin1'  " +
"    placeholder='Getting one of this type: ' onchange='spinsTill1();' style='display:block'> " +
"  </div> &nbsp; or &nbsp;" +
"  <div class='w3-cell w3-mobile' style='width:30%'> " +
"<button id='spinAllButton' onclick='spinsTillAll()' class='w3-button w3-pale-blue w3-medium  " +
    "       w3-round-xlarge'> Getting one of EACH type:  </button> " +
"  </div> " +
"</div> " +
"<br> ";
div3 =    "<div class='w3-form w3-cell-row w3-mobile' style='display:block'> " +
    "<div class='w3-container w3-cell w3-mobile' id='spinSVGgoesHere'> " +
    "<svg  id='spinSVG' height=300 width=440></svg> " +
    "</div> " +
    "<div class='w3-cell w3-mobile'> " +
    "  <button onclick='hideShowSpins()' class='w3-button w3-pale-green w3-medium w3-round-xlarge'> " +
    "    &nbsp; Hide / Show " +
    "  </button> " +
    "</div> " +
  "<div class='w3-form w3-cell-row w3-mobile' style='display:none' id='repeatSpins'> " +
    "<div class='w3-btn w3-cell'></div> " +
    "<form class='w3-cell w3-card'> " +
      "<h4>Repeat Process:</h4> " +
      "<div class='w3-bar'> " +
        "<input class='w3-radio' value=100 type='radio' name='spinReps'  " +
        "onClick='spinRepeat(100);  dotChart1(spinRepResults );' /> " +
        "<label>100</label> " +
        "<input class='w3-radio' value=1000 type='radio' name='spinReps'  " +
        "onClick='spinRepeat(1000); dotChart1(spinRepResults);' checked='checked' /> " +
        "<label>1000</label> " +
      "  <input class='w3-radio' value=5000 type='radio' name='spinReps'  " +
        "onClick='spinRepeat(5000); dotChart1(spinRepResults);' /> " +
      "  <label>5000</label> " +
      "</div> " +
    "</form> " +
  "</div> " +
  "<div class='w3-container w3-cell w3-mobile' id='spinSmrySVGdiv'> " +
  "  <svg id='spinSmrySVG'></svg> " +
  "</div> " +
"</div> ";
return [div1, div2, div3];
};

function mixerDivs(){
  var div1, div2, div3;
  div1 =
    " 	<p>	Setup: Type as many labels in the first box, separated by commas, " +
    " 		and numbers of balls for each label in the second box.	</p> " +
    " 	<div class='w3-form w3-cell-row w3-mobile' id='mixInputs'> " +
    " 		<div class='w3-cell w3-mobile' style='width:30%'> " +
    " 			Labels: " +
    " 			<input class='w3-input w3-border w3-mobile w3-pale-yellow' type='text' id='mixCats'  " +
    "       style='display:block'> " +
    " 		</div> " +
    " 		<div class='w3-cell w3-mobile'></div> " +
    " 		<div class='w3-cell w3-mobile' style='width:30%'> " +
    " 			Numbers of balls: " +
    " 			<input class='w3-input w3-border w3-mobile w3-pale-yellow' type='text' id='mixNs'  " +
    "       style='display:block'> " +
    " 		</div> " +
    " 		<div class='w3-cell w3-mobile' style='width:40%'> " +
    " 			Replace drawn balls? " +
    " 			<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='mix_Replace'> " +
    " 				<option value='yes'>Yes</option> " +
    " 				<option value='no'>No</option> " +
    " 			</select> " +
    " 		</div> " +
    " 	</div> "

    div2 = " 	Stop after: " +
    " 	<div class='w3-form w3-cell-row w3-mobile' id='mixStops'> " +
    " 		<div class='w3-cell w3-mobile' style='width:30%'> " +
    " 			<input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='nDraws'  " +
    "       placeholder='This many draws:' onchange='mixNtimes()' style='display:block'> " +
    " 		</div> " +
    " 		&nbsp; or&nbsp; " +
    " 		<div class='w3-cell w3-mobile' style='width:30%'> " +
    "  			<input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='mixTil'  " +
    "       placeholder='getting one of this type:' onchange='mixTill1()' style='display:block'> " +
    " 		</div> " +
    " 		<div class='w3-cell w3-mobile' style='width:30%'> " +
    " 			<button id='mixAllButton' onclick='mixTillAll()' class='w3-button w3-pale-blue w3-medium  " +
    "       w3-round-xlarge'> " +
    " 				&nbsp; OR getting one of each type. " +
    " 			</button> " +
    " 		</div> " +
    " 	</div> " +
    " 	<br> " +
    " 	<div class='w3-form w3-cell-row w3-mobile' style='display:block'> " +
    " 		<div class='w3-container w3-cell w3-mobile' id='mixSVGgoesHere'></div> " +
    "       <svg  id='mixSVG' height=300 width=440></svg> " +
    " 		<div class='w3-cell w3-mobile'> " +
    " 			<button onclick='hideShowMix()' class='w3-button w3-pale-green w3-medium w3-round-xlarge'> " +
    " 				&nbsp; Hide / Show " +
    " 			</button> " +
    " 		</div> " +
    " 	</div> " +
    " 	<div class='w3-form w3-cell-row w3-mobile' style='display:none' id='repeatMix'> " +
      " 	<div class='w3-btn w3-cell'></div> " +
      " 	<form class='w3-cell w3-card'> " +
      " 		<h4>Repeat Process:</h4> " +
      " 		<div class='w3-bar'> " +
      " 			<input class='w3-radio' value=100 type='radio' name='mixReps'  " +
       "        onClick='mixRepeat(100);   dotChart1(mixRepResults, mixSmrySVG);' /> " +
      " 			<label>100</label> " +
      "    <input class='w3-radio' value=1000 type='radio' name='mixReps' " +
      "        onClick='mixRepeat(1000); dotChart1(mixRepResults, mixSmrySVG);' checked='checked' /> " +
      " 			<label>1000</label> " +
      " 	<input class='w3-radio' value=5000 type='radio' name='mixReps'  " +
      "       onClick='mixRepeat(5000); dotChart1(mixRepResults, mixSmrySVG);' /> " +
      " 			<label>5000</label> " +
      " 		</div> " +
    " 		</form> " +
    " 	</div> "
    div3 = " 	<div class='w3-container w3-cell w3-mobile' id='mixSmrySVGdiv'> " +
    " 		<svg id='mixSmrySVG' height=300 width=400></svg> " +
    " 	</div> " +
  " 	</div>";
return [div1, div2, div3];
};

function CI_demo_Divs(){
  var div1, div2, div3;
  div1 = 	"<div class=w3-container> "+
     " 	<form class='w3-cell w3-card w3-padding-small'>" +
       " 	<h4>Confidence Level</h4>" +
       " 	<div class='w3-bar'>" +
       " 		<input class='w3-radio' type='radio' name='CIdemo_conf' value='80%' " +
       "     onClick='confidence = .80; drawCI(BootCount);'>" +
         " 	<label>80%</label>" +
         " 	<input class='w3-radio' type='radio' name='CIdemo_conf' value='90%' " +
         "   onClick='confidence = .90; drawCI(BootCount);'>" +
       " 		<label>90%</label>" +
       " 		<br>" +
         " 	<input class='w3-radio' type='radio' name='CIdemo_conf' value='95%' " +
         "   onClick='confidence = .95; drawCI(BootCount);' checked='checked'>" +
       " 		<label>95%</label>" +
         " 	<input class='w3-radio' type='radio' name='CIdemo_conf' value='99%' " +
         "   onClick='confidence = .99; drawCI(BootCount);'>" +
         " 	<label>99%</label>" +
         " </div>" +
       " </form>" +
       " <div class='w3-btn w3-cell '></div>" +
       " <form class='w3-cell w3-card w3-padding-small' oninput='nn.value=parseInt(CIdemo_n.value)'>" +
       " 	Sample Size: (number of spins)" +
       " 	<div class='w3-bar'>" +
       " 		20" +
       " 		<input id='slide_CI_n' type='range' name='CIdemo_n' min='20' max='100' step='5' value='50' " +
       "     onchange='updateCIdemo_n(this.value);' />" +
       " 		100" +
       " 		<br>" +
       " 		n = <output name='nn' for='CIdemo_n'></output>" +
       " 	</div>" +
     " 	</form>" +
     " 	<div class='w3-btn w3-cell'></div>" +
     " 	<form class='w3-cell w3-card w3-padding-small' oninput='pp.value=CIdemo_p.value'>"  +
     " 		<h4>True Proportion Successes:</h4>" +
     " 		<div class='w3-bar'>" +
     " 			0" +
       " 		<input id='slide_CI_p' type='range' name='CIdemo_p' min='0' max='1' step='.05' value='.5' " +
       "     onchange='updateCIdemo_p(this.value);' />" +
       " 		1" +
       " 		<br>" +
       " 		p = <output name='pp' for='CIdemo_p'></output>" +
       " 	</div>" +
       " </form>" +
     " </div>";
     div2 = " ";
     div3 = " ";
return [div1, div2, div3];
}

function genericDemoDivs(){
  var div1, div2, div3;
  return [div1, div2, div3];
}

function moreSims(more) {
  // function to add more points to an estimate or test plot
  switch(variable){
      case 'cat1' : {
        cat1MoreSimFn(more);
        break;   // End of c1Output
      }
      case 'quant1' :  {
        quant1MoreSimFn(more);
         break;
       }
      case 'cat2' :  {
        cat2MoreSimFn(more);
        break;
      }
      case 'c1q1':  {
        c1q1MoreSimFn(more);
        break;
      }
      case 'quant2' :  {
        quant2MoreSimFn(more);
        break;
      }
      default: {   }
    };
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


function CLChange(arg) {
  //update plot to illustrate confidence interval
  var cnfLvl;
  if (arg.value) {
    cnfLvl =  +arg.value;
  }
  switch(variable){
      case 'cat1' : {
        cat1CLChange(arg);
        break;   // End of c1Output
      }
      case 'quant1' :  {
        quant1CLChange(arg);
         break;
       }
      case 'cat2' :  {
        cat2CLChange(arg);
        break;
      }
      case 'c1q1':  {
        c1q1CLChange(arg);
        break;
      }
      case 'quant2' :  {
        q2CLChange(arg);
        break;
      }
      default: {   }
    };
  }
function moreCI(nreps) {
  //update plot to illustrate confidence interval
  switch(variable){
      case 'cat1' : {
        cat1CLChange(arg);
        break;   // End of c1Output
      }
      case 'quant1' :  {
        quant1CLChange(arg);
         break;
       }
      case 'cat2' :  {
        cat2CLChange(arg);
        break;
      }
      case 'c1q1':  {
        c1q1CLChange(arg);
        break;
      }
      case 'quant2' :  {
        q2CLChange(arg);
        break;
      }
      default: {   }
    };
  }

function moreTests(nreps, concat) {
  //generate or update test resmaple data
  var newSample =[];
  if (typeof(concat) == 'undefined'){
    concat = false;
  }
  if( ! concat){
    samples4Test = [];
  }
  switch(variable){
      case 'cat1' : {
        newSample = moreCat1Sims(nreps);
        break;   // End of c1Output
      }
      case 'quant1' :  {
        newSample = moreQuant1TSims(nreps);
         break;
       }
      case 'cat2' :  {
        newSample = moreCat2TSims(nreps);
        break;
      }
      case 'c1q1':  {
        newSample = moreC1Q1TSims(nreps);
        break;
      }
      case 'quant2' :  {
        newSample = moreQuant2TSims(q2Data, nreps);
        break;
      }
      default: {   }
    };
  }


function moreQuant2TSims(data, reps) {
  var coVar,
    correlations = [],
    dataLength = data.length,
    seq = [],
    slopes = [],
    sample = [],
    xBar,
    yBar,
    xVar,
    yVar,
    ysample = [];
  seq = sequence(0, dataLength - 1, 1);
  xBar = d3.mean(data[x]);
  xVar = d3.variance(data[x]);
  for (i = 0; i < reps; i++) {
    coVar = 0;
    yBar = 0;
    // could resample these as well as y's, but then we could get all x values equal
    // instead, we'll assume it's a designed experiment with set (fixed) x levels
    sample = sampleN(seq, dataLength);
    for (j = 0; j < dataLength; j++) {
      ysample[j] = y[sample[j]]; // set y values
      coVar += x[j] * ysample[j]; // add up cross product
    }
    // console.log(ysample);
    // console.log(coVar);
    // xBar = d3.mean(xsample);
    // xVar = d3.variance(xsample);
    yBar = d3.mean(ysample);
    yVar = d3.variance(ysample);
    coVar = (coVar - dataLength * xBar * yBar) / (dataLength - 1);
    slopes[i] = coVar / xVar;
    correlations[i] = coVar / Math.sqrt(yVar * xVar);
  }
  return slopes;
}
