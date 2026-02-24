// javascript function to show two distributions:
//  The standard t which holds if the null hypothesis is true
// and the noncentral t which holds for some alternative hypothesis
// All global state is now managed through AppState namespace

//Redo:  showing the plots doesn't help students see what's happening.
// Version 2.0:
// Generate data from true alternative distribution given n, sd and muAlt.
// Build a test stat to from the data and plot it as a dot
//  Plot the dot. Repeat 100 or more times.


var alfa = 0.03, nn = 10, sd = 0.5, muAlt = 1.0,
     aLevels = sequence(0.01, 0.0901, 0.01).concat(sequence(0.1,0.201,0.05)),
     nLevels = [4, 10, 20, 30, 40, 50],
     sdLevels = [0.1, 0.5, 0.7, 1.0,3,5,7, 9, 11,15,20],
     mnALevels = sequence(0.0, 8.0, 0.5)
     reps = 100,
     sampleMeans = [];

for (i=0; i < aLevels.length; i++){
    aLevels[i]   = { key:aLevels[i].toPrecision(2), value: aLevels[i]};
}

for (i=0; i < sdLevels.length; i++){
  if(sdLevels[i] < 1){
    sdLevels[i]  = { key:sdLevels[i].toPrecision(1), value: sdLevels[i]};
  } else if(sdLevels[i] < 10){
    sdLevels[i]  = { key:sdLevels[i].toPrecision(2), value: sdLevels[i]};
  } else{
    sdLevels[i]  = { key:sdLevels[i].toPrecision(3), value: sdLevels[i]};
  }
}

for (i=0; i < mnALevels.length; i++){
  mnALevels[i] = { key:mnALevels[i].toPrecision(2), value:mnALevels[i]} ;
}

for (i=0; i < nLevels.length; i++){
  nLevels[i]   = { key: nLevels[i],                 value: nLevels[i]};
}

function powerDivs(){
  // sets up html page for this demo
  var div1, div2, div3;
  div1 =
    " <p> This page looks at two tests to evaluate a potential sample mean. <br> " +
    "  <b>Choose either</b> &nbsp; "+
    "   <input type='radio' id='boot' name='testType' checked = true value='boot'>"+
    "     <label for='boot'>Bootstrap Test</label> &nbsp;  <b> OR </b>  &nbsp; "+
    "   <input type='radio' id='tTest' name='testType' value='tTest'>"+
    "     <label for='tTest'>t-Test</label> <br> " +
    "  <b>Choose either</b> &nbsp; "+
    "    <input type='radio' id='two' name='sideType' checked = true value='two'>"+
    "      <label for='two'>Two-sided</label> &nbsp;  <b> OR </b>  &nbsp; "+
    "    <input type='radio' id='upper' name='sideType' value='upper'>"+
    "      <label for='upper'>Upper tail</label> rejection region <br> "+
    "  In either case, data will be generated under the null hypothesis assuming "+
    "    an underlying normal distribution centered at zero with these four inputs: <br> " +
    " <table class='w3-container' style='width: 60% border-collapse: collapse'> " +
    "   <tr class='w3-border'> <td id='SSInpt' class='w3-cell' style='width: 60% display:block'>	Sample size:"+
    "   	  </td><td><input class='w3-input  w3-cell  w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='nnInpt' value='20'"+
    "						 onchange='powerPlot(0)'> </td></tr> "+
    "   <tr class='w3-border'> <td id='sdInpt' class='w3-cell' >"+
    "           Standard Deviation of the observations:	</td>"+
    "   	<td><input class='w3-input  w3-cell w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='sdInpt' value='0.50'"+
    "						 onchange='powerPlot(1)'> </td></tr>"+
    "   <tr class='w3-border'><td id='altMnInpt' class='w3-cell' style='width: 50%display:block' >	"+
    "           Alternative Mean: (greater than 0) </td>"+
    "   	<td><input class='w3-input  w3-cell  w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='muAltInpt' value='1.0'"+
    "						 onchange='powerPlot(2)'></td></tr>"+
    "   <tr class='w3-border'><td id='alfaInpt' class='w3-cell' >"+
    "           	Significance level (&alpha;): </td>"+
    "   	<td><input class='w3-input  w3-cell  w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='alfaInpt' value='0.03'"+
    "						 onchange='powerPlot(3)'></td></tr>"+
      "</table> "

    div2 = "<div class= 'w3-container w3-mobile' id= 'tPowerPlotGoesHere'>"+
    " Each dot in the plot is found by generating new data based on the above inputs"+
    " and running a test to see if the true mean is <b> zero</b>.</div>";
    div3 = "<div>     </div> ";
return [div1, div2, div3];
};

// Not happy with range inputs for these values.  Try text input instead.
// if (false && document.body.contains(document.getElementById('sdInpt') )) {
//   // don't define these until the divs have been built
//   var sdrangeslide = rangeslide('#sdInpt', {
//     	       data: sdLevels,
//     	       showLabels: true,
//     	       startPosition: 1,
//     	       showTicks: false,
//     	       dataSource: 'value',
//     	     labelsContent: 'key',
//     	       valueIndicatorContent: 'key',
//     	       thumbWidth: 20,
//     	       thumbHeight: 20,
//     	       handlers: { valueChanged: [sdChange] } });
//
//     var SSrangeslide = rangeslide('#SSInpt', {
//              	       data: nLevels,
//              	       showLabels: true,
//              	       startPosition: 5,
//              	       showTicks: false,
//              	       dataSource: 'value',
//             	     labelsContent: 'key',
//             	       valueIndicatorContent: 'key',
//              	       thumbWidth: 20,
//              	       thumbHeight: 20,
//              	       handlers: { valueChanged: [SSChange] } });
//
//     	var alfarangeslide = rangeslide('#alfaInpt', {
//     	       data: aLevels,
//     	       showLabels: true,
//     	       startPosition: 6,
//     	       showTicks: false,
//     	       dataSource: 'value',
//       	     labelsContent: 'key',
//     	       valueIndicatorContent: 'key',
//     	       thumbWidth: 20,
//     	       thumbHeight: 20,
//     	       handlers: { valueChanged: [alfaChange] } });
//
//   var amrangeslide = rangeslide('#altMnInpt', {
//     	       data: mnALevels,
//     	       showLabels: true,
//     	       startPosition: 2,
//     	       showTicks: false,
//     	       dataSource: 'value',
//       	     labelsContent: 'key',
//              valueIndicatorContent: 'key',
//     	       thumbWidth: 20,
//     	       thumbHeight: 20,
//     	       handlers: { valueChanged: [altMnChange] } });
// }

function tTestFn(sample, twotailed){
  // takes a sample and runs t test for mean === 0.00
  // returns upper tail p-value if mean is positive, else lower tail.
  // twotailed ==true doubles the formatPvalue
  var
     mn = d3.mean(sample), pvalue,
     sd = Math.sqrt(d3.variance(sample) / nn),
     tstat;
     tstat = mn/sd;
     //pvalue = (mn < 0.00)? jStat.studentt.cdf(mn/sd , nn -1) : 1 -  jStat.studentt.cdf(mn/sd , nn -1);
     //if(twotailed){ pvalue = 2 * pvalue;};
    return(tstat); //pvalue);
}

function powerPlot(option){
  // plots the sample means from each of many samples
  var pValue = [],
      reps = 500,
      tStats = [],
      samples = [];
  // make sure all inputs are current
      nn = +document.getElementById("nnInpt").value;
      muAlt = +document.getElementById("muAltInpt").value;
      sd = +document.getElementById("sdInpt").value;
      alfa = +document.getElementById("alfaInpt").value;
  if(option == 3){
    //alpha level changed, no need to recollect samples
    //  sample size changed
  } else if (option == 0) {
    // sample size changed
    samples = jStat.randn(reps, nn )
  } else if (option == 1) {
    // sd changed
  } else if (option ==2){
    // alt mean shifted
  }  else {
    // error -- no other options
  }
  for (i=0; i < reps; i++){
    thisSample = jStat.randn(reps,nn);
  }
}

function tpowerPlot(attrib, value){
   // plots the null t distribution, then adds alpha level upper critical region
   //  shade in the power under the alternative distribution and print it output
   // Indicate which variable was most recently changed: 0=nn, 1 = sd, 2 = muAlt, 3=alpha
   var bootReps = 500,
    margin = {top: 10, right: 20, bottom: 30, left: 50},
    ncp = muAlt/sd * Math.sqrt( nn),
    probt,
    powerReps = 500,
    power = 0,
    results = [],
    tdf = nn -1,
    tseq = sequence(-5.2, 15.2, 1/30),
    tcrit1,
    tcrit2 = jStat.studentt.inv(1 - alfa, tdf);

   var t_width = 600 - margin.left - margin.right,
       t_height = 320 - margin.top - margin.bottom;

   for(i=0; i < powerReps; i++){
     var pvalue,
         sample = jStat.randn(powerReps, nn) ;
     for(i=0; i < powerReps; i++){
        for(j=0; j < nn; j++){
          sample[i][j] = sample[i][j] * sd + muAlt;
        }
        results[i] = tTestFn(sample[i], false);
        if (results[i] <= alfa) {
           power++;
        }
     }
     console.log("Power: ", power/powerReps);
   }
   // xtRange = d3.scaleLinear().range([0, t_width]).domain(d3.extent(tseq));
   // ytRange = d3.scaleLinear().range([height, margin.top]).domain([0, jStat.studentt.pdf(0, tdf)]);
   // xtAxis = d3.axisBottom(xtRange)
   //      .ticks(10);
   //
   //  pdftline = d3.line()
   //    .x( d =>  xtRange(d) )
   //    .y(d =>  ytRange(jStat.studentt.pdf(d, tdf)))
		// ;
   //
   //  noncentraltline = d3.line()
   //    .x( d =>  xtRange(d) )
   //    .y(d =>  ytRange(jStat.noncentralt.pdf( d -muAlt/sd, tdf, ncp)))
		// ;


   if(typeof(tpsvg) === "object"){
	    d3.selectAll("path").remove();
	   } else{
  	    tpsvg = d3.select("#tPowerPlotGoesHere")
        .append("svg")
        .attr("width", t_width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
      }
  tpsvg.append("g")			// Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xtAxis);

  nullLine = tpsvg.append("path")
                      .attr("d", pdftline(tseq))
                      .attr("stroke", "blue")
                      .attr("stroke-width", 2)
                      .attr("fill", "none");
  altLine = tpsvg.append("path")
                      .attr("d", noncentraltline(tseq))
                      .attr("stroke", "red")
                      .attr("stroke-width", 2)
                      .attr("fill", "none");

 }
