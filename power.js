// javascript function to show two distributions:
//  The standard t which holds if the null hypothesis is true
// and the noncentral t which holds for some alternative hypothesis

//Redo:  showing the plots doesn't help students see what's happening.
// Version 2.0:
// Generate data from true alternative distribution given n, sd and muAlt.
// Build a test stat to from the data and plot it as a dot
//  Plot the dot. Repeat 100 or more times.


var alfa = 0.03, nn = 10, sd = 0.5, muA = 1.0,
     aLevels = sequence(0.01, 0.0901, 0.01).concat(sequence(0.1,0.201,0.05)),
     nLevels = [4, 10, 20, 30, 40, 50],
     sdLevels = [0.1, 0.5, 0.7, 1.0,3,5,7, 9, 11,15,20],
     mnALevels = sequence(0.0, 8.0, 0.5);

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
    " 	<p>  The power of a statistical test to detect a change in a mean depends on these four inputs: <br> " +
    "   <div id='SSInpt' class='w3-container' style='display:block'>	Sample size:</div>"+
    "   <div id='sdInpt' class='w3-container' style='display:block'>Standard Deviation of the observations:	</div>"+
    "   <div id='altMnInpt' class='w3-container' style='display:block'>	Alternative Mean:</div>"+
    "   <div id='alfaInpt' class='w3-container' style='display:block'>	Significance level (&alpha;): </div>"+
      " 	</div> "

    div2 = "<div class= 'w3-container w3-mobile' id= 'tPowerPlotGoesHere'>Plot:</div>";
    div3 = "<div>     </div> ";
return [div1, div2, div3];
};

if (document.body.contains(document.getElementById('sdInpt') )) {
  // don't define these until the divs have been built
  var sdrangeslide = rangeslide('#sdInpt', {
    	       data: sdLevels,
    	       showLabels: true,
    	       startPosition: 1,
    	       showTicks: false,
    	       dataSource: 'value',
    	     labelsContent: 'key',
    	       valueIndicatorContent: 'key',
    	       thumbWidth: 20,
    	       thumbHeight: 20,
    	       handlers: { valueChanged: [sdChange] } });

    var SSrangeslide = rangeslide('#SSInpt', {
             	       data: nLevels,
             	       showLabels: true,
             	       startPosition: 5,
             	       showTicks: false,
             	       dataSource: 'value',
            	     labelsContent: 'key',
            	       valueIndicatorContent: 'key',
             	       thumbWidth: 20,
             	       thumbHeight: 20,
             	       handlers: { valueChanged: [SSChange] } });

    	var alfarangeslide = rangeslide('#alfaInpt', {
    	       data: aLevels,
    	       showLabels: true,
    	       startPosition: 6,
    	       showTicks: false,
    	       dataSource: 'value',
      	     labelsContent: 'key',
    	       valueIndicatorContent: 'key',
    	       thumbWidth: 20,
    	       thumbHeight: 20,
    	       handlers: { valueChanged: [alfaChange] } });

  var amrangeslide = rangeslide('#altMnInpt', {
    	       data: mnALevels,
    	       showLabels: true,
    	       startPosition: 2,
    	       showTicks: false,
    	       dataSource: 'value',
      	     labelsContent: 'key',
             valueIndicatorContent: 'key',
    	       thumbWidth: 20,
    	       thumbHeight: 20,
    	       handlers: { valueChanged: [altMnChange] } });
}

function alfaChange(arg) {
  if (arg.value) {
    alfa = +arg.value;
  } else {
    alfa = 0.10;
  }
  powerPlot('alfa', alfa);
    //alfa, nn, sd, muA
}

function SSChange(arg) {
  if (arg.value) {
    nn = +arg.value;
  } else {
    nn = 10;
  }
  powerPlot('nn', nn);
}

function altMnChange(arg) {
  if (arg.value) {
    muA = +arg.value;
  } else {
    muA = 0;
  }
  powerPlot('muA', muA);
}

function sdChange(arg) {
  if (arg.value) {
    sd = +arg.value;
  } else {
    sd = 1;
  }
  //console.log(sd);
  powerPlot('muA', muA);
}

function powerPlot(attrib, value){
   // plots the null distribution, then adds alpha level upper critical region
   //  shade in the power under the alternative distribution and print it output
   // Indicate which variable was most recently changed: alpha, sd, n, or altMnInpt
   var margin = {top: 10, right: 20, bottom: 30, left: 50},
    ncp = muA/sd * Math.sqrt( nn),
    probt,
    tdf = nn -1,
    tseq = sequence(-5.2, 15.2, 1/30),
    tcrit1,
    tcrit2 = jStat.studentt.inv(1 - alfa, tdf);

   var t_width = 600 - margin.left - margin.right,
       t_height = 320 - margin.top - margin.bottom;


   xtRange = d3.scaleLinear().range([0, t_width]).domain(d3.extent(tseq));
   ytRange = d3.scaleLinear().range([height, margin.top]).domain([0, jStat.studentt.pdf(0, tdf)]);
   xtAxis = d3.axisBottom(xtRange)
        .ticks(10);

    pdftline = d3.line()
      .x( d =>  xtRange(d) )
      .y(d =>  ytRange(jStat.studentt.pdf(d, tdf)))
		;

    noncentraltline = d3.line()
      .x( d =>  xtRange(d) )
      .y(d =>  ytRange(jStat.noncentralt.pdf( d -muA/sd, tdf, ncp)))
		;


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
