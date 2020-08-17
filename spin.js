
// subroutine to make a gameboard spinner in D3 javascript.
// Inputs:
//     category labels and relative probabilities
//  TODO: Clarify options.  Allow repeated of the process
// TODO:	change color on text labels of each spin
// TODO:  colors 3 and 4 are too similar. Use color brewer?
// TODO:  zap old summary plot when anything above changes.
/*eslint quotes: [2, 'single', 'avoid-escape']*/

var margin = [{ top: 50 }, { right: 20 }, { bottom: 50 }, { left: 20 }],
  swidth = Number(400), // - margin.right - margin.left,
  sheight = Number(300), // - margin.top - margin.bottom;
  r = 110, //radius
  tr = 150, //text radius
  ir = 75, //inner radius
  //circles = [],
  colors = [],
  //color = d3.scale.ordinal()
  //    .range(['#a05d56','#ff8c00','#d0743c','#98abc5', '#8a89a6',
  //            '#7b6888', '#6b486b' ]),
  //dColor = spinData.drawColor,
  hideSpins = false,
  nCat,
  nSpin,
  spacing = 10,
  spinDiv = d3.select('#spinSVGgoesHere'),
  // spinSmryDiv = d3.select('#spinSmrySVGdiv'),
  pieData = [],
  spinData = [],
  spinCumProb = [], // cumulative probabilities
  spinDuration = 400,
  spinSlideDuration = 400,
  spinGroups = [],
  spinMatch,
  spinProb = [],
  spinRepResults = [],
  spinStopRule,
  stopRuleChange = false;


  function spinDivs() {
    // set up the generic Demo divs for the spinner demo
   div1 =  "Type labels in the first box separated by commas or tabs " +
    "<br> and the same number of percentages or probability weights in the second box. " +
    "<div class='w3-cell-row w3-mobile' id='spinInputs'> " +
    "  <div class='w3-cell w3-mobile' style='width:40%'> " +
    "    Labels: " +
    "    <input class='w3-input w3-border w3-mobile w3-pale-yellow' type='text' id='spinCats'  " +
    "    style='display:block'> " +
    "  </div> " +
    "  <div class='w3-cell w3-mobile'></div> " +
    "  <div class='w3-cell w3-mobile' style='width:40%'> " +
    "    Probability weights: " +
    "    <input class='w3-input w3-border w3-mobile w3-pale-yellow' type='text' id='spinProbs'  " +
    "    style='display:block' onblur = 'drawDonut()' > " +
    "  </div> " +
    "</div> ";
 div2 =  "Stop after: " +
  "<div class='w3-cell-row w3-mobile' id='spinStops'> " +
  "  <div class='w3-cell w3-mobile' style='width:30%'> " +
  "    <input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='nSpins'  " +
  "    placeholder='This many spins: ' onchange='restartSpins(); spinNSpins();  stopRuleChange =true;' style='display:block'> " +
  "  </div>  &nbsp; or &nbsp; " +
  "  <div class='w3-cell w3-mobile' style='width:30%'> " +
  "    <input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='spin1'  " +
  "    placeholder='Getting one of this type: ' onchange='restartSpins(); spinsTill1();' style='display:block'> " +
  "  </div> &nbsp; or &nbsp;" +
  "  <div class='w3-cell w3-mobile' style='width:30%'> " +
  "<button id='spinAllButton' onclick='restartSpins(); spinsTillAll(); ' class='w3-button w3-pale-blue w3-medium  " +
      "       w3-round-xlarge'> Getting one of EACH type:  </button> " +
  "  </div> " +
  "</div> " +
  "<br> "+
  "<div class='w3-cell-row w3-mobile' style='display:block'> " +
      "<div class='w3-container w3-cell w3-mobile' id='spinSVGgoesHere' style='width:340px'> " +
      "</div> " +
          "<div class='w3-cell w3-mobile'> " +
          "  <button onclick='hideShowSpins()' class='w3-button w3-pale-green w3-medium w3-round-xlarge'> " +
          "    &nbsp; Hide / Show " +
          "  </button> " +
          "</div> " +
          "</div>";
  div3 =
   "<div id='repeatSpins' class='w3-container' style='display:none'>" +
			"	<div class='w3-cell-row'>" +
			"		<div class='w3-cell  w3-mobile' style='width: 20%'>  Show results of &nbsp;" +
			"   </div>"  +
			"		<div class='w3-cell  w3-mobile' style='width: 20%'>" +
			" 			<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='moreSpinPoints' " +
      "          placeholder='0' onclick='spinRepeat(this.value); dotChart1(spinRepResults );'" +
			" 				 onchange='spinRepeat(this.value); dotChart1(spinRepResults );'>" +
			" 		</div>" +
			" 		<div class='w3-cell  w3-mobile' style='width: 80%'>" +
			" 		&nbsp; (more)	trials" +
			" 		</div>" +
			" 	</div>" +
			" </div>" +
    "<div class='w3-container w3-cell w3-mobile' id='spinSmrySVGdiv'> " +
    "</div> " +
    "<div class='w3-container w3-mobile' id='spinSmryCount'> " +
    "</div> " +
  "</div> ";
  return [div1, div2, div3];
  };

  function restartSpins(){
      spinRepResults =[]
      if(!d3.select("#spinSmrySVGdiv_svg").empty()){
        d3.selectAll("#spinSmrySVGdiv_svg.g").remove();
      }
      document.getElementById("spinSmryCount").innerHTML = " ";
      document.getElementById("spinSmrySVGdiv").style.display = 'none';
  }

  function drawDonut() {
    // open svg canvas and draw the initial setup of the spinner
    if (d3.select("#spin_SVG").empty()) {
      svgSpin = d3.select('#spinSVGgoesHere')
         .append('svg')
         .attr("id", "spin_SVG")
         .attr("width", 330)
         .attr("height", 320);
    } else {
      svgSpin = d3.select("#spin_SVG");
      svgSpin.select("g").remove();
    }

   svgSpin = svgSpin
    .append("g")
    .attr('transform', 'translate(' + (+r + 10) + ',' + (+r + 10) + ')');
   arrowData = [
    { x: 4, y: 78 },
    { x: 0, y: 0 },
    { x: -4, y: 78 },
    { x: 0, y: 0 },
    { x: 0, y: 80 },
    { x: 0, y: 0 },
    { x: 0, y: -93 },
    { x: -4, y: -83 },
    { x: 4, y: -83 },
    { x: 0, y: -93 }
  ];
  //using this method
   lineFunction = d3
    .line()
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    }); //.interpolate('linear');
  // now draw the pointer

    var w = swidth;
    spinGroups = document.getElementById('spinCats').value.split(','); // labels of each
    spinProb = jStat.map(
      document.getElementById('spinProbs').value.split(','),  Number );
    spinNCat = spinGroups.length;
    if (spinNCat < 2) {
      alert('Must have more than one label and more than one probability');
    }

    // force group length to = prob length
    if (spinNCat > spinProb.length) {
      spinGroups.length = spinNCat = spinProb.length;
    } else if (spinProb.length < spinNCat) {
      spinProb.length = spinNCat;
    }

    arc = d3
      .arc() // create <path> elements  in arcs
      .outerRadius(r)
      .innerRadius(ir);

    var spinTotalProb = jStat.sum(spinProb),
      stdize = function(x) {
        return x / spinTotalProb;
      };
    spinProb = jStat.map(spinProb, stdize);
    spinCumProb = jStat.cumsum(spinProb);
    spinCumProb.unshift(0);

    for (i = 0; i < spinNCat; i++) {
      pieData[i] = { label: spinGroups[i], value: spinProb[i] };
      colors[i] = d3.hcl((360 * i) / spinNCat, 25, 80, 0.8);
    }
    pieData.length = spinNCat;

    spinColorFn = d3.scaleOrdinal().range(colors);

    svgSpin
      .data([pieData])
      .append('svgSpin:g')
      .attr('transform', 'translate(' + (r + 10) + ',' + (r + 35) + ')');

    var pie = d3
      .pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });
  // create arc data for us given a list of values

    arcs = svgSpin
      .selectAll('g.slice')
      .data(
        d3.pie()
        .value(function(d, i) {
          return d.value;
        })
        .sort(null)
      )
    //  .data([drawData])
      .enter()
      .append('svgSpin:g')
      .attr('class', 'slice');

    arcs
      .append('svgSpin:path')
      .attr('fill', function(d, i) {
        return colors[i];
      })
      .attr('d', arc);

    arcs
      .append('svgSpin:text') //add a label to each slice
      .attr('transform', function(d) {
        d.innerRadius = 0;
        d.outerRadius = tr;
        return 'translate(' + arc.centroid(d) + ')';
      })
      .attr('text-anchor', 'middle')
      .text(function(d, i) {
        return pieData[i].label;
      });

    svgSpin
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', 'blue')
      .attr('r', 5);

    arrow = svgSpin
      .append('path')
      .attr('d', lineFunction(arrowData))
      .attr('stroke', 'blue')
      .attr('stroke-width', 4)
      .attr('fill', 'blue');
} //end of drawDonut

// -----  Transitions --- //                     TODO: check timing to be sequential
// t1  spin it to angle
// t2  toss out the sampled circle
function tween(i) {
  arrow
    .transition()
    .delay((spinSlideDuration + spinDuration) * i)
    .duration(spinDuration)
    .ease(d3.easeCubicOut)
    .attrTween('transform', function() {
      return d3.interpolateString(
        'rotate( 0, 0, 0)',
        'rotate(' + (Number(spinData[i].angle) * 360 + 360) + ', 0, 0)'
      );
    });
};

function spin1() {
  // for testing
  var nDraws = 1;
  spinAngle = Math.random(nDraws) * 360;
  //drawColor = cut( spinAngle, spinCumProb);
  arrow
    .transition()
    //.delay((slideDuration + spinDuration) * i)
    .duration(spinDuration)
    .ease(d3.easeCubicOut)
    .attrTween('transform', function() {
      return d3.interpolateString(
        'rotate( 0, 0, 0)',
        'rotate(' + (spinAngle + 720) + ', 0, 0)'
      );
    });
  //console.log(spinAngle);
  //console.log(drawColor);
}

function xspace(i) {
  return i * spacing;
}

function spinNSpins() {
  nSpin = +document.getElementById('nSpins').value;
  spinGroups = document.getElementById('spinCats').value.split(','); // labels of each
  spinProb = jStat.map( document.getElementById('spinProbs').value.split(','), Number );
  spinNCat = spinGroups.length;

  if (spinStopRule !== 'Fixed') {
    // zap any results hanging around
    spinRepResults = [];
  }
  spinStopRule = 'Fixed';

  //clear out old arrow, arcs, circles, and text
  if (typeof arrow !== 'undefined') {
    arrow.remove();
  }

  drawDonut();
  spinMore(nSpin);
}

function spinMore(nDraws) {
  // grab a random set of n draws and plot each as a spinner outcome in showSequence()
  var angle, spinColor;
  spinData = [];

  for (i = 0; i < nDraws; i++) {
    angle = Math.random();
    spinColor = cut(angle, spinCumProb);
    spinData[i] = { angle: angle, group: spinColor };
  }
  //console.log(spinData);
  spinData.length = nDraws;
  showSpinSequence(spinData);
}
//  end of spinMore

function spinsTill1() {
  // keep spinning till we get the desired outcome
  var spinStopper = document.getElementById('spin1').value,
    angle,
    i = 0,
    spinColor = -1,
    w = swidth;
  spinData.length = 0;

  if (spinStopRule !== 'OneOfOneType') {
    // zap any results hanging around
    spinRepResults = [];
  }
  spinStopRule = 'OneOfOneType';

  spinGroups = document.getElementById('spinCats').value.split(','); // labels of each
  spinProb = jStat.map(
    document.getElementById('spinProbs').value.split(','),
    Number
  );
  spinNCat = spinGroups.length;

  //clear out old arrow, arcs, circles, and text
  if (typeof arrow !== 'undefined') {
    arrow.remove();
  }

  drawDonut();

  //console.log(spinStopper);
  //console.log(spinStopper.length);
  //if(spinStopper.length > 1){
  spinMatch = spinGroups.indexOf(spinStopper);
  if (spinMatch < 0) {
    alert('You must choose one of the labels.');
  }
  while (spinColor !== spinMatch) {
    angle = Math.random();
    spinColor = cut(angle, spinCumProb);
    spinData[i++] = { angle: angle, group: spinColor };
  }

  showSpinSequence(spinData);
  //}
}

function spinsTillAll() {
  // spin until we get one of each possible outcome
  var angle,
    error = ' ',
    i = 0,
    ndx = 0,
    spinColor,
    table = [];
  spinData = [];
  if (spinStopRule !== 'OneOfEach') {
    // zap any results hanging around
    spinRepResults = [];
  }
  spinStopRule = 'OneOfEach';

  spinGroups = document.getElementById('spinCats').value.split(','); // labels of each
  spinProb = jStat.map(
    document.getElementById('spinProbs').value.split(','),
    Number
  );
  spinNCat = spinGroups.length;

  //clear out old arrow, arcs, circles, and text
  if (typeof arrow !== 'undefined') {
    arrow.remove();
  }
  drawDonut();

  for (i = 0; i < spinNCat; i++) {
    table[i] = 0;
  }

  table.length = spinNCat;

  while (d3.min(table) < 1) {
    angle = Math.random();
    spinColor = cut(angle, spinCumProb);
    spinData[ndx] = { angle: angle, group: spinColor };
    table[spinColor] += 1;
    ndx++;
    if (ndx > 10000) {
      error = '10K';
      break;
    }
  }
  //console.log(table);
  if (error !== '10K') {
    showSpinSequence(spinData);
  }
}

function showSpinSequence(spinData) {
  var nDraws = spinData.length;
  var spacing = (swidth - 20) / (nDraws + 1); //for sampled circles
  function xspace(i) {
    return i * spacing - r + 10;
  }

  //clear out old arrow, arcs, circles, and text
  if (typeof arrow !== 'undefined') {
    arrow.remove();
  }
  if (typeof circles !== 'undefined') {
    circles.remove();
  }
  if (typeof textLabels !== 'undefined') {
    textLabels.remove();
  }
  if (typeof arcs !== 'undefined') {
    arcs.remove();
  }

  // draw new spinner
  drawDonut();
  arcs
    .append('svgSpin:text') //add a label to each slice
    .attr('transform', function(d) {
      d.innerRadius = 0;
      d.outerRadius = tr;
      return 'translate(' + arc.centroid(d) + ')';
    })
    .attr('text-anchor', 'middle')
    .text(function(d, i) {
      return pieData[i].label;
    });

  for (i = 0; i < nDraws; i++) {
    tween(i);
  }
  //spinData.length = nDraws;
  //console.log(spinData);
  // Create the sampled circles (output)
  //  but hide them with r = 0
  circles = svgSpin.selectAll('g.circle').data(spinData);
  circles
    .enter()
    .append('circle')
    .attr('fill', function(d) {
      return colors[d.group];
    })
    .attr('cx', function(d) {
      return 93 * Math.cos(((90 - +d.angle * 360) * Math.PI) / 180);
    })
    .attr('cy', function(d) {
      return -93 * Math.sin(((90 - +d.angle * 360) * Math.PI) / 180);
    })
    .attr('r', 0); // -> 20

  //console.log(spinAngle);
  //console.log(drawColor);

  textLabels = svgSpin
    .selectAll('g.text')
    .data(spinData)
    .enter()
    .append('text')
    .attr('x', function(d, i) {
      return xspace(i);
    })
    .attr('y', 140)
    .text(function(d) {
      return pieData[d.group].label;
    })
    .style('text-anchor', 'middle')
    .attr('font-family', 'sans-serif')
    .attr('opacity', 0)
    .attr('font-size', '20px');

  circles.each(function(d, i) {
    d3.select(this)
      .transition()
      // toss out circle
      .delay(spinDuration + (spinSlideDuration + spinDuration) * i)
      .duration(spinSlideDuration)
      .ease(d3.easeLinear)
      .attr('cx', xspace(i))
      .attr('cy', +r + 20)
      .attr('r', 20);
  });

  textLabels.each(function(d, i) {
    // move the selected ball out
    d3.select(this)
      .transition()
      .delay((spinSlideDuration + spinDuration) * (i + 1))
      .attr('opacity', 1);
  });
  document.getElementById('repeatSpins').style.display = 'block';
}

function hideShowSpins() {
  hideSpins = !hideSpins;  // toggle visiblity on/off
  var xDiv = document.getElementById('spinSVGgoesHere');
  xDiv.style.display = hideSpins ? 'none' : 'block';
}

function spinRepeat(times) {
  var i, thisProb;
  if (stopRuleChange){
    spinRepResults = [];
    if(!d3.select("#spinSmrySVGdiv_svg").empty()){
      d3.selectAll("#spinSmrySVGdiv_svg.g").remove();
    }
  }
  switch (spinStopRule){
    case 'Fixed' : {
      thisProb = spinProb[0];
      spinRepResults = spinRepResults.concat(rbinom(nSpin, thisProb, times));
      // track  number of first type?
      break;
    }
    case 'OneOfOneType': {
      // track number of spins needed
      thisProb = spinProb[spinMatch];
      spinRepResults[0] = spinData.length;
      for (i = 0; i < times; i++) {
        spinRepResults.push(rgeom(thisProb));
      };
      break;
    }
    case 'OneOfEach': {
      // track number of spins needed
      spinRepResults[0] = spins2get1ofEach(1);
      spinRepResults = spinRepResults.concat(spins2get1ofEach(times - 1));
      break;
    }
    default: {
      console.log('Bad option for spinStopRule');
    }
  }
  //plot spinResults as a histogram
}

function spins2get1ofEach(reps) {
  // randomly spin til we get one of each category
  // returns the numbers of spins needed for each of 'reps' trials
  var i = 0,
    j = 0,
    table = [],
    temp = [],
    draw1 = [],
    nDraws = repeat(1, reps),
    nCat = spinProb.length,
    probs = [];

  if (nCat < 2) {
    return nDraws; // with only 1 category, we get all (only one) categories right away
  } // at least 2 categories
  draw1 = sampleWOrep(sequence(0, nCat - 1, 1), reps, probs);
  for (i = 0; i < reps; i++) {
    probs = spinProb.slice(0); // need to reset for each rep
    //console.log(probs);
    probs.splice(draw1[i], 1);
    //console.log(probs);
    if (d3.sum(probs) > 0) {
      nDraws[i] = 1 + recursiveSpins(probs);
    }
    //console.log(nDraws[i]);
  }
  return nDraws;
}

function recursiveSpins(probs) {
  // to get one of each type, we draw a random geometric RV with prob of success =
  // total of the not-yet-selected categories.
  // If only one category is left, we just add that number to the existing number of spins.
  // Otherwise, we have to 'flip a coin' to see which of the remaining categories was selected.
  var sumProb = d3.sum(probs), // this needs to be less than 1 for rgeom to work
    draw,
    group,
    nCat = probs.length;
  //console.log(probs);
  if (sumProb >= 1.0) {
    console.log('Error in recursiveDraw: probs sum to one');
    return NaN;
  }
  draw = rgeom(sumProb);
  if (nCat === 1) {
    return draw;
  } else {
    // randomly select which category appeared on this spin
    group = sampleWOrep(sequence(0, nCat - 1, 1), 1, probs);
    // remove the prob of that category from the prob sequence
    probs.splice(group, 1);
    // and recurse to get the remaining categories
    return draw + recursiveSpins(probs);
  }
}

var dotChart1 = function(plotData) {
  var
    xyData = [],
    xLabel = xLab =
      spinStopRule === 'Fixed'
        ? 'Number of the first type in ' + document.getElementById('nSpins').value + ' spins'
        : spinStopRule === 'OneOfOneType'
        ? 'Spins to get a ' + spinGroups[spinMatch]
        : 'Spins to get one of each type';
  stopRuleChange = false;
  plotData = plotData.sort(function(a,b) { return(a-b);});
  xyData = stackDots(plotData);
  document.getElementById("spinSmrySVGdiv").style.display = 'block';
  makeScatterPlot(xyData, "spinSmrySVGdiv", xLabel, xLab, " ", false);
  document.getElementById("spinSmrySVGdiv").style.display = 'block';
  document.getElementById("spinSmryCount").innerHTML = "Based on " + plotData.length +" simulations";
};
