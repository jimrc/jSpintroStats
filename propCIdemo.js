// javascript function to demonstrate the meaning of 'confidence' in
// a Confidence Interval
// All global state is now managed through AppState namespace

const ciDemoLines = [];
let ciOutput, confLvl = CONFIG.DEFAULTS.defaultConfidenceLevelPercent, nn = CONFIG.DEFAULTS.defaultSampleSize, nSpins = CONFIG.DEFAULTS.defaultNumSpins, trueP = CONFIG.DEFAULTS.defaultTrueP,
     ciColors = CONFIG.COLORS.propCIColors, hwidth,
   nLevels = CONFIG.DEFAULTS.nLevels, phat, pHats,
   pwidth = CONFIG.UI.propCIWidth, pheight = CONFIG.UI.propCIHeight, pCIs = [],
   margin = CONFIG.UI.propCIMargin,
   observdCL, psvg, radius = CONFIG.UI.propCIRadius,
   xpRange, ypRange;


function propCIDivs(){
  // sets up html page for this demo
  const div1 = TEMPLATES.propCIDemoExplanation() + TEMPLATES.propCIDemoInputs();
  const div2 = TEMPLATES.plotPlaceholder('propCIPlotGoesHere');
  const div3 = TEMPLATES.resultsPlaceholder('ciDemoResults');
  return [div1, div2, div3];
};

function changeCL(cl){
  if(confLvl >= CONFIG.VALIDATION.confidenceLevelMax || confLvl < CONFIG.VALIDATION.confidenceLevelMin){
    alert('Enter a number less than 100 and greater than 50');
    return;
  };
  let  alfa = (100 - confLvl)/200, countr = 0,
       z = 5;
  const nreps = ciDemoLines.length;

  if (alfa > CONFIG.VALIDATION.alphaThreshold){
     z = jStat.normal.inv(1.0 - alfa, 0 , 1);
   }
  if(typeof(psvg) === "object"){
    //check to see if intervals already exist.  If if so, change widths
    ciDemoLines.forEach((line, i) => {
      const phat = line.center;
      const hwidth = Utilities.calculateProportionCIHalfWidth(z, phat, nSpins);
      ciDemoLines[i] = {center: phat, y: i, lower: Math.max(0, phat - hwidth),
        upper: Math.min(1, phat + hwidth), color: (phat - hwidth <= trueP && phat + hwidth >= trueP) ? 1 : 0};
      if (ciDemoLines[i].color === 1) countr++;
    });
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
        `Observed ${countr} blue and ${nreps - countr} red intervals. Coverage: ${Math.round(countr / nreps * 1000)/10}%`;

  } else {
    pCIPlot(nn);
  }

}

function pCIPlot(nreps){
  // takes binomial samples and creates a normal-based confidence interval
  // for each.  Plots each interval to show if the true value is included.
  // TODO: consider adding options for bootstrap intervals and Wilson's plus 4'
  let alfa = (100 - confLvl)/200, countr = 0,
     sample = rbinom(nSpins, trueP, nreps),
     z = 5;
  // make sure other inputs are current
  nSpins = +document.getElementById("nSpinsInpt").value;
  trueP = +document.getElementById("truePInpt").value;
  confLvl = +document.getElementById("clInpt").value;
        //  draw samples
        sample = rbinom(nSpins, trueP, nreps);

     xpRange = d3.scaleLinear().range([margin.left, pwidth + margin.left]).domain([0,1.01]);
     ypRange = d3.scaleLinear().range([pheight, margin.top]).domain([0, nreps * radius]);

     xpAxis = d3.axisBottom(xpRange) .ticks(8);
   if (alfa > CONFIG.VALIDATION.alphaThreshold){
     z = jStat.normal.inv(1.0 - alfa, 0 , 1);
     //console.log("multiplier:", z);
   }
   sample.forEach((val, i) => {
      let ciLine;
      if (val === 0) {
        // use 'rule of 3' since variance will be zero
        ciLine = {center: 0, y: i, lower: 0,
          upper: -Math.log(2 * alfa) / nSpins, color: 0};
      } else if (val === nSpins) {
        ciLine = {center: 1, y: i, lower: 1 + Math.log(2 * alfa) / nSpins,
          upper: 1, color: 0};
      } else {
        const phat = val / nSpins;
        const hwidth = Utilities.calculateProportionCIHalfWidth(z, phat, nSpins);
        ciLine = {center: phat, y: i, lower: Math.max(0, phat - hwidth),
          upper: Math.min(1, phat + hwidth), color: 0};
      }
      if (ciLine.lower <= trueP && ciLine.upper >= trueP) {
        ciLine.color = 1;
        countr++;
      }
      ciDemoLines[i] = ciLine;
   });
   if(typeof(psvg) === "object"){
	    d3.selectAll("path").remove();
	   } else{
  	   psvg = d3.select("#propCIPlotGoesHere")
        .append("svg")
        .attr("width",  pwidth + margin.left + margin.right)
        .attr("height", pheight + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              `translate(${margin.left},${margin.top})` );
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
               .attr("transform", `translate(0 ,${pheight + margin.top})`)
               .call(xpAxis);
     // update Results
      document.getElementById('ciDemoResults').innerHTML =
      `Observed ${countr} blue and ${nreps - countr} red intervals. Coverage: ${Math.round(countr / nreps * 1000)/10}%`;
 }
