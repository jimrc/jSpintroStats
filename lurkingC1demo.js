// javascript function to demonstrate the meaning of 'confidence' in
// a Confidence Interval
// TODO: changing either of the last 2 inputs removes interval lines
//        changing Conf level brings them back. Is z value missing?

var  ciDemoLines = [],  ciOutput,
  confLvl = 90, nn = 40, nSpins = 20, trueP = 0.75,
     ciColors = ["red", "steelblue"], hwidth,
     lurkingP = 0.5, // survival rate for lurking group
     lurkingProp = 0.25, // size of lurking group in population
   nLevels = [4, 10, 20, 30, 40, 50], phat, pHats,
   pwidth = 400, pheight = 300, pCIs = [],
   margin = {top: 10, right: 20, bottom: 30, left: 50},
   observdCL, plsvg, radius = 6,
   xpRange, ypRange;


function lurkingC1Divs(){
  // sets up html page for this demo
  var div1, div2, div3;
  div1 =
    " <p> Suppose that we care about a variable which takes two values." +
    " For example, we follow people for five years and record survival as 'lived' or 'died'."+
    " Other variables have an effect on survival, for example: did they smoke?."+
    " It makes sense that smokers might have a different survival rate than non-smokers."+
    " What might happen to our estimate of the proportion surviving if we didn't record people's smoking status?"+
    " <br>In that case 'smoking' is a lurking variable."+
    " <table class='w3-container' style='width: 60% border-collapse: collapse'> " +
    "   <tr class='w3-border'> "+
    "   <tr class='w3-border'> "+
    "          <td id='confInpt' class='w3-cell' >"+
    "           Number of intervals to create: 	</td>"+
    "   	     <td><input class='w3-input  w3-cell w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='nRepsInpt' value='10'"+
    "						 onchange='nn= +this.value; pLCIPlot(nn)'> </td></tr>"+
    "     <tr class='w3-border'>"+
    "          <td  class='w3-cell' style='width: 60% display:block'>"+
    "	           General survival rate: </td>" +
    "   	     <td><input class='w3-input  w3-cell  w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='truePInpt' value=0.75"+
    "						 onchange='trueP = +this.value; pLCIPlot(nn)'> </td></tr> "+
    "   <tr class='w3-border'> "+
    "         <td  class='w3-cell' >"+
    "           Sample Size:	</td>"+
    "        	<td><input class='w3-input  w3-cell w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='nSpinsInpt' value='20'"+
    "						 onchange='nSpins= +this.value; pLCIPlot(nn)'> </td></tr>"+
    "   <tr class='w3-border'> <td id='confInpt' class='w3-cell' >"+
    "           Confidence Level % (between 50 and 100):	</td>"+
    "   	    <td><input class='w3-input  w3-cell w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='clInpt' value='90'"+
    "            onchange='confLvl= +this.value; changeLCL(confLvl)'>"+
    "          </td></tr>"+
    "   <tr class='w3-border'> <td id='confInpt' class='w3-cell' >"+
    "           Smokers survival rate:	</td>"+
    "   	    <td><input class='w3-input  w3-cell w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='lurkingPInpt' value='0.50'"+
    "            onchange='lurkingP= +this.value; pLCIPlot(nn)'>"+
    "     </td></tr>"+
    "   <tr class='w3-border'> <td id='confInpt' class='w3-cell' >"+
    "           Proportion of smokers:	</td>"+
    "   	<td><input class='w3-input  w3-cell w3-mobile w3-padding-large' "+
    "            style='width:40%' type='text' id='lurkingPropInpt' value='0.25'"+
    "            onchange='lurkingProp= +this.value; pLCIPlot(nn)'>"+
    "     </td></tr>"+
      "</table> "

    div2 = "<div id = 'lurkC1PlotGoesHere'> </div>";
    div3 = "<div id = 'lurkC1DemoResults' > Results    </div> ";
return [div1, div2, div3];
};

function changeLCL(cl){
  // assumes only confidence level has changed
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
  if(typeof(plsvg) === "object"){
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
    pCIs = plsvg.selectAll("line")
              .data(ciDemoLines)
              .join("line")
              .attr("class","line")
               .attr("x1", d => xpRange(d.lower))
               .attr("y1", d => ypRange(d.y * radius))
               .attr("x2", d => xpRange(d.upper))
               .attr("y2", d => ypRange(d.y * radius))
               .attr("stroke", d => ciColors[d.color])
               .attr("stroke-width", 2);

         plsvg.append("line")
              .attr("x1", d => xpRange(trueP))
              .attr("x2", d => xpRange(trueP))
              .attr("y1", 0)
              .attr("y2", pheight + margin.top)
              .style("stroke-width",2)
              .style("stroke","lightblue");

       document.getElementById('lurkC1DemoResults').innerHTML =
         "Bias: " + (d3.mean(ciDemoLines, d => d.center) - trueP).toPrecision(3) + "<br>"+
        "Observed " +  countr + " blue and " + (nreps - countr) +" red intervals. "+
        "Coverage: " +  Math.round(countr / nreps * 1000)/10 + "%";

  } else {
    pLCIPlot(nn);
  }

}

function pLCIPlot(nreps){
  // takes binomial samples and creates a normal-based confidence interval
  // for each.  Plots each interval to show if the true value is included.
  // TODO: consider adding options for bootstrap intervals and Wilson's plus 4'
  var  alfa = (100 - confLvl)/200, countr = 0,
     sample , nLurkers,  lurkSample ,
     z = 5;
     // make sure other inputs are current
     nSpins = +document.getElementById("nSpinsInpt").value;
     trueP = +document.getElementById("truePInpt").value;
     lurkingProp = +document.getElementById("lurkingPropInpt").value;
     lurkingP = +document.getElementById("lurkingPInpt").value;
     confLvl = +document.getElementById("clInpt").value;
     //  draw samples
     sample = rbinom(nSpins, trueP, nreps);
     nLurkers = rbinom(nSpins, lurkingProp, nreps);
     lurkSample = rbinom(nSpins, lurkingP, nreps);

     xpRange = d3.scaleLinear().range([margin.left, pwidth + margin.left]).domain([0,1.01]);
     ypRange = d3.scaleLinear().range([pheight, margin.top]).domain([0, nreps * radius]);

     xpAxis = d3.axisBottom(xpRange) .ticks(8);
   if (alfa > 0.0000001){
     z = jStat.normal.inv(1.0 - alfa, 0 , 1);
     //console.log("multiplier:", z);
   }
   for(i =0; i< nreps; i++){
      // replace some of the 'regular' sample with lurkers
      sample[i] = ( lurkSample[i] * nLurkers[i] + sample[i] * (nSpins - nLurkers[i]))/nSpins;
      if(sample[i] === 0){
        // use 'rule of 3' since variance will be zero
        ciDemoLines[i] = {center: 0, y: i, lower: 0,
          upper: -Math.log(2 * alfa)/nSpins, color: 0 }
      } else if(sample[i] === nSpins){
        ciDemoLines[i] = {center: 1, y: i, lower: 1  + Math.log(2 * alfa)/nSpins ,
          upper: 1, color: 0 }
      } else {
        phat = sample[i]/nSpins;
        hwidth = z * Math.sqrt(phat *(1-phat) / nSpins);
        ciDemoLines[i] = {center: phat, y: i, lower: Math.max(0, phat - hwidth),
          upper: Math.min(1, phat + hwidth), color: 0 }
      }
      if (ciDemoLines[i].lower <= trueP && ciDemoLines[i].upper >= trueP ){
          ciDemoLines[i].color = 1 ;
          countr++;
        }
        //console.log(ciDemoLines[i]);
   }
   if(typeof(plsvg) === "object"){
	    d3.selectAll("path").remove();
	   } else{
  	   plsvg = d3.select("#lurkC1PlotGoesHere")
        .append("svg")
        .attr("width",  pwidth + margin.left + margin.right)
        .attr("height", pheight + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
      }

   pHats = plsvg.selectAll("circle")
             .data(ciDemoLines);
   pHats.join("circle")
            .attr("class", "circle")
             .attr("stroke", d => ciColors[d.color])
             .attr("fill", d => ciColors[d.color] )
             .attr("cx",  d => xpRange(d.center) )
             .attr("cy", d => ypRange(d.y* radius)  )
             .attr("r",  d => radius );
   pCIs = plsvg.selectAll("line")
             .data(ciDemoLines);
   pCIs.join("line")
             .attr("class","line")
              .attr("x1", d => xpRange(d.lower))
              .attr("y1", d => ypRange(d.y * radius))
              .attr("x2", d => xpRange(d.upper))
              .attr("y2", d => ypRange(d.y * radius))
              .attr("stroke", d => ciColors[d.color])
              .attr("stroke-width", 2);

      plsvg.append("line")
               .attr("x1", d => xpRange(trueP))
               .attr("x2", d => xpRange(trueP))
               .attr("y1", 0)
               .attr("y2", pheight + margin.top)
               .style("stroke-width",2)
               .style("stroke","lightblue");

           plsvg.append("g")			// Add the X Axis
               .attr("class", "x axis")
               .attr("transform", "translate(0 ," + (pheight + margin.top) + ")")
               .call(xpAxis);
     // update Results
     document.getElementById('lurkC1DemoResults').innerHTML =
         "Bias: " + (d3.mean(ciDemoLines, d => d.center) - trueP).toPrecision(3) + "<br>"+
        "Observed " +  countr + " blue and " + (nreps - countr) +" red intervals. "+
        "Coverage: " +  Math.round(countr / nreps * 1000)/10 + "%";
 }
