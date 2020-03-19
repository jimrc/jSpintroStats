//  javascript to setup main index.html closePages
var circleColors = ["steelblue", "red"],
    demo,
    table,
    vbleChoice,
    inference;
//    jsinput = 'spin.js',
var  script = document.createElement('script');
//    script.src = jsinput;
//    script.addEventListener('load', function() {
        // at this moment MyItemData variable is accessible as MyItemData or window.MyItemData
//    });



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

function openVble(vbleName) {
  // perhaps this is no longer needed?
	var i,
			y = document.getElementsByClassName("Page"),
			x = document.getElementsByClassName("vType");
	for (i = 0; i < x.length; i++) {
				x[i].style.display = "none";
	}
	for (i = 0; i < y.length; i++) {
			y[i].style.display = "none";
	}
	document.getElementById(vbleName).style.display = "block";
	w3Close();
}

function choosePage(page, vble) {
	//close all pages but this one
	var i,
			x = document.getElementsByClassName("Page");
	for (i = 0; i < x.length; i++) {
			x[i].style.display = "none";
	}
	document.getElementById(page).style.display = "block";
      // display al children on this page
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

function testEstFn(vble){
  // function to customize the testEst page for a particular type of variable.
  var hdr,
    dataInput,
    summaryText,
    summaryPlot,
    infChoice,
    infPlot,
    results,
    title = document.getElementById("testEstHeader"),
    block1 = document.getElementById("dataInSummary"),
    block2 = document.getElementById("inferenceChoices"),
    block3 = document.getElementById("inferenceOutput");

  switch(vble){
      case 'cat1' : {
        hdr = "Estimate a single proportion or test its value.";
        dataInput = "1 Categorical Data Input";
        infChoice = "Estimate or Test Proportion";
        infPlot = "";
        results = "";
        break;
      }
      case 'quant1' :  {
        hdr = "Estimate a single mean or test its value.";
        dataInput = "1 Quantitative Data Input";
        infChoice = "Estimate or Test Mean";
        infPlot = "";
        results = "";
         break;
       }
      case 'cat2' :  {
        hdr = "Estimate a difference in proportions or test that the difference is zero.";
        dataInput = "Two Categorical Data Input";
        infChoice = "Estimate or Test Diff in Proportions";
        infPlot = "";
        results = "";
        break;
      }
      case 'c1q1':  {
        hdr = "Estimate a difference in means or test that the difference is zero.";
        dataInput = "Two Means Data Input";
        infChoice = "Estimate or Test Diff in Means";
        infPlot = "";
        results = "";
        break;
      }
      case 'quant2' :  {
        hdr = "Estimate a regression slope or test its value.";
        dataInput = "Regression Data Input";
        infChoice = "Estimate or Test Slope";
        infPlot = "";
        results = "";
        break;
      }
      default: { hdr = "Unknown Variable Type";}
    };
   title.innerHTML = hdr;
   block1.innerHTML = dataInput;
   block2.innerHTML = infChoice;
   block3.innerHTML = infPlot;
}




function demoFn(demo){
  var hdr,
    div1,
    div2,
    div3,
    title = document.getElementById("demoHeader"),
    block1 = document.getElementById("demoDiv1"),
    block2 = document.getElementById("demoDiv2"),
    block3 = document.getElementById("demoDiv3");
 switch(demo){
   case 'Spinner': {
     hdr = 'Spinner Setup:';
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
   "    <input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='spinTil'  " +
   "    placeholder='Getting one of this type: ' onchange='spinsTill1();' style='display:block'> " +
   "  </div> &nbsp; or &nbsp;" +
   "  <div class='w3-cell w3-mobile' style='width:30%'> " +
    "    <input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='spinTil'  " +
   "    placeholder='Getting one of EACH type: ' onclick='spinsTillAll();' style='display:block'> " +
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
    "</div> "
     break;
   }
   case 'Mixer': {
     hdr = 'Mixer';
     break;
   }
   default : {
     hdr = "Unknown Demo";
   }
 }
 title.innerHTML = hdr;
 block1.innerHTML = div1;
 block2.innerHTML = div2;
 block3.innerHTML = div3;
}


function tableFn(distn){

}
