// javascript function to demonstrate the meaning of 'confidence' in
// a Confidence Interval


var  ciDemoLines = [],  ciOutput,
  confLvl = 90, nn = 40, nSpins = 20, trueP = 0.45,
     ciColors = ["red", "steelblue"], hwidth,
   nLevels = [4, 10, 20, 30, 40, 50], phat, pHats,
   pwidth = 400, pheight = 300, pCIs = [],
   margin = {top: 10, right: 20, bottom: 30, left: 50},
   observdCL, psvg, radius = 6,
   xpRange, ypRange;


function propCIDivs(){
  // sets up html page for this demo
  var div1, div2, div3;
  div1 =
    " <p> On this page we pretend that we know the true proportion, <b>p</b>. <br> " +
    "   If we know <b>p</b>, we can generate random data using a spinner with probability <b>p</b> "+
    "   of getting an '<b>a</b>' and probability <b>1 - p</b> of getting a '<b>z</b>'."+
    "  You can choose how times to spin, then we estimate <b>p</b> as the proportion of '<b>a</b>'s."+
    "   <br>A confidence interval for true <b>p</b> is made"+
    "    and plotted as a horizontal line. If the interval contains the true <b>p</b> "+
    "    then it intersects the vertical line at <b>p</b>."+
    "   <br> When analyzing data (real world), we only build a single confidence interval, but in this fantasy land"+
    "    where <b>p</b> is known, we can repeat the process and get another interval, and another and another...."+
    "   <br> By changing inputs, you will see that these methods may succeed or fail to include the true value."+
    "   <br> Higher confidence comes with a price -- longer intervals which are less useful. "+
    "    The 'Confidence Level' is the proportion of all such intervals which capture "+
    "    the true value in the long run." +
    " <table class='w3-container' style='width: 60% border-collapse: collapse'> " +
    "   <tr class='w3-border'> "+
    "   <tr class='w3-border'> <td id='confInpt' class='w3-cell' >"+
    "           Number of intervals to create: 	</td>"+
    "   	<td><input class='w3-input  w3-cell w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='nRepsInput' value='10'"+
    "						 onchange='nn= +this.value; pCIPlot(nn)'> </td></tr>"+
    "     <td id='truePInpt' class='w3-cell' style='width: 60% display:block'>"+
    "	           True Proportion: </td>" +
    "   	<td><input class='w3-input  w3-cell  w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='trueProp' value=0.45"+
    "						 onchange='trueP = +this.value; pCIPlot(nn)'> </td></tr> "+
    "   <tr class='w3-border'> "+
    "     <td id='nSpinsInpt' class='w3-cell' >"+
    "           Number of spins:	</td>"+
    "   	<td><input class='w3-input  w3-cell w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='nSpinsInput' value='20'"+
    "						 onchange='nSpins= +this.value; pCIPlot(nn)'> </td></tr>"+
    "   <tr class='w3-border'> <td id='confInpt' class='w3-cell' >"+
    "           Confidence Level % (between 50 and 100):	</td>"+
    "   	<td><input class='w3-input  w3-cell w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='clInput' value='90'"+
    "            onchange='confLvl= +this.value; changeCL(confLvl)'>"+
    "     </td></tr>"+
      "</table> "

    div2 = "<div id = 'propCIPlotGoesHere'> </div>";
    div3 = "<div id = 'ciDemoResults' > Results    </div> ";
return [div1, div2, div3];
};

function changeCL(cl){
  if(confLvl >= 100 || confLvl < 50){
    alert('Enter a number less than 100 and greater than 50');
    return;
  };
  let  alfa = (100 - confLvl)/200, countr = 0,
       z = 5;
  const nreps = ciDemoLines.length;

  if (alfa > 0.0000001){
     z = jStat.normal.inv(1.0 - alfa, 0 , 1);
   }
  if(typeof(psvg) === "object"){
    //check to see if intervals already exist.  If if so, change widths
    for(i = 0; i < nreps; i++){
      phat = ciDemoLines[i].center ;
      hwidth = z * Math.sqrt(phat *(1-phat) / nSpins);
      ciDemoLines[i] = {center: phat, y: i, lower: Math.max(0, phat - hwidth),
        upper: Math.min(1, phat + hwidth), color: 0 }
      if (ciDemoLines[i].lower <= trueP && ciDemoLines[i].upper >= trueP ){
          ciDemoLines[i].color = 1 ;
          countr++;
      }
    }
    pCIs = psvg.selectAll("line")
              .data(ciDemoLines)
              .join("line")
              .attr("class","line")
               .attr("x1", d => xpRange(d.lower))
               .attr("y1", d => ypRange(d.y * radius))
               .attr("x2", d => xpRange(d.upper))
               .attr("y2", d => ypRange(d.y * radius))
               .attr("stroke", d => ciColors[d.color])
               .attr("stroke-width", 2);

         psvg.append("line")
              .attr("x1", d => xpRange(trueP))
              .attr("x2", d => xpRange(trueP))
              .attr("y1", 0)
              .attr("y2", pheight + margin.top)
              .style("stroke-width",2)
              .style("stroke","lightblue");

       document.getElementById('ciDemoResults').innerHTML =
        "Observed " +  countr + " blue and " + (nreps - countr) +" red intervals. "+
        "Coverage: " +  Math.round(countr / nreps * 1000)/10 + "%";

  } else {
    pCIPlot(nn);
  }

}

function pCIPlot(nreps){
  // takes binomial samples and creates a normal-based confidence interval
  // for each.  Plots each interval to show if the true value is included.
  var  alfa = (100 - confLvl)/200, countr = 0,
     sample = rbinom(nSpins, trueP, nreps),
     z = 5;

     xpRange = d3.scaleLinear().range([margin.left, pwidth + margin.left]).domain([0,1.01]);
     ypRange = d3.scaleLinear().range([pheight, margin.top]).domain([0, nreps * radius]);

     xpAxis = d3.axisBottom(xpRange) .ticks(8);
   if (alfa > 0.0000001){
     z = jStat.normal.inv(1.0 - alfa, 0 , 1);
     //console.log("multiplier:", z);
   }
   for(i =0; i< nreps; i++){
      phat = sample[i]/nSpins;
      hwidth = z * Math.sqrt(phat *(1-phat) / nSpins);
      ciDemoLines[i] = {center: phat, y: i, lower: Math.max(0, phat - hwidth),
        upper: Math.min(1, phat + hwidth), color: 0 }
      if (ciDemoLines[i].lower <= trueP && ciDemoLines[i].upper >= trueP ){
          ciDemoLines[i].color = 1 ;
          countr++;
        }
        //console.log(ciDemoLines[i]);
   }
   if(typeof(psvg) === "object"){
	    d3.selectAll("path").remove();
	   } else{
  	   psvg = d3.select("#propCIPlotGoesHere")
        .append("svg")
        .attr("width",  pwidth + margin.left + margin.right)
        .attr("height", pheight + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
      }

   pHats = psvg.selectAll("circle")
             .data(ciDemoLines);
   pHats.join("circle")
            .attr("class", "circle")
             .attr("stroke", d => ciColors[d.color])
             .attr("fill", d => ciColors[d.color] )
             .attr("cx",  d => xpRange(d.center) )
             .attr("cy", d => ypRange(d.y* radius)  )
             .attr("r",  d => radius );
   pCIs = psvg.selectAll("line")
             .data(ciDemoLines);
   pCIs.join("line")
             .attr("class","line")
              .attr("x1", d => xpRange(d.lower))
              .attr("y1", d => ypRange(d.y * radius))
              .attr("x2", d => xpRange(d.upper))
              .attr("y2", d => ypRange(d.y * radius))
              .attr("stroke", d => ciColors[d.color])
              .attr("stroke-width", 2);

      psvg.append("line")
               .attr("x1", d => xpRange(trueP))
               .attr("x2", d => xpRange(trueP))
               .attr("y1", 0)
               .attr("y2", pheight + margin.top)
               .style("stroke-width",2)
               .style("stroke","lightblue");

           psvg.append("g")			// Add the X Axis
               .attr("class", "x axis")
               .attr("transform", "translate(0 ," + (pheight + margin.top) + ")")
               .call(xpAxis);
     // update Results
      document.getElementById('ciDemoResults').innerHTML =
      "Observed " +  countr + " blue and " + (nreps - countr) +" red intervals. "+
      "Coverage: " + Math.round(countr / nreps * 1000)/10 + "%";
 }
