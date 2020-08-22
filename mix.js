// subroutine to draw balls randomly from a box in D3 javascript.
// Inputs:
//    category labels and relative ball counts
//    pick stopping option.
// TODO:  balls are not coming out, only labels for 'one of each'
// TODO:  fix duration of transitions
// TODO:  zap old summary plot when anything above changes.
var w =  Number(400), // - margin.right - margin.left,
    h = Number(300), // - margin.top - margin.bottom
    balls = [];
var boxData = [ { "x": w/2 -40,   "y": h/2-2 },  { "x": -w/2 +22,  "y": h/2-2},
                  { "x": -w/2+22,  "y": -h/+2}, { "x":w/2 -40 ,  "y": -h/2+2},
                  { "x": w/2 -40,  "y": h/2 - 40}],
    colors = [],
    hideMix = false,
    mixCircles =[],
    mixData = [],
    mixDraws=[],     // cumulative probabilities
 		mixDuration = 400,
    mixSlideDuration = 400,
    mixGroups =[],
    mixMatch,
    mixNs = [],
    mixStopRule,
    mixRadius = 10,
    mixRepResults = [],
    mixSVG,
    mixText = [],
    nCat,
    nMix,
    spacing =12;

function mixerDivs(){
  var div1, div2, div3;
  div1 =
    " 	<p>	Setup: In the first box, type labels separated by commas. " +
    " 		In the second box, type a number of balls for each label, again, separated by commas.	</p> " +
    " 	<div class=' w3-cell-row w3-mobile' id='mixInputs'> " +
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
    " 			<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='mix_Replace' onblur = 'initialMixState()'> " +
    " 				<option value='yes'>Yes</option> " +
    " 				<option value='no'>No</option> " +
    " 			</select> " +
    " 		</div> " +
    " 	</div> "

    div2 = " 	Stop after: " +
    " 	<div class='w3-cell-row w3-mobile' id='mixStops'> " +
    " 		<div class='w3-cell w3-mobile' style='width:30%'> " +
    " 			<input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='nDraws'  " +
    "       placeholder='This many draws:' onchange='restartMix(); mixNtimes(this.value)' style='display:block'> " +
    " 		</div> " +
    " 		&nbsp; or&nbsp; " +
    " 		<div class='w3-cell w3-mobile' style='width:30%'> " +
    "  			<input class='w3-input w3-border w3-mobile w3-pale-blue ' type='text' id='mixTil'  " +
    "       placeholder='Getting one of this type: ' onchange='restartMix(); mixTill1()' style='display:block'> " +
    " 		</div> &nbsp; or &nbsp; " +
    " 		<div class='w3-cell w3-mobile' style='width:30%'> " +
    " 			<button id='mixAllButton' onclick='restartMix(); mixTillAll()' class='w3-button w3-pale-blue w3-medium  " +
    "       w3-round-xlarge'> " +
    " 				&nbsp;  Getting one of EACH type. " +
    " 			</button> " +
    " 		</div> " +
    " 	</div> " +
    " 	<br> " +
    " 	<div class='w3-cell-row w3-mobile' style='display:block'> " +
    " 		<div class='w3-container w3-cell w3-mobile' id='mixSVGgoesHere' style = 'width = 550px'> </div>" +
    " 		<div class='w3-cell w3-mobile'> " +
    " 			<button onclick='hideShowMix()' class='w3-button w3-pale-green w3-medium w3-round-xlarge'> " +
    " 				&nbsp; Hide / Show " +
    " 			</button> " +
    " 	</div> " ;
    div3 =
    "<div id='repeatMixer' class='w3-container' style='display:none'>" +
			"	<div class='w3-cell-row'>" +
      "	  	<div class='w3-cell  w3-mobile' style='width: 20%'>  Show results of &nbsp;" +
			"     </div>"  +
			"		<div class='w3-cell  w3-mobile' style='width: 20%'>" +
			" 			<input class='w3-input w3-mobile w3-pale-yellow' type='text' id='moreMixPoints' " +
      "          placeholder='0' onclick='mixRepeat(this.value); dotChart2(mixRepResults );'" +
			" 				 onchange='mixRepeat(this.value); dotChart2(mixRepResults );'>" +
			" 		</div>" +
			" 		<div class='w3-cell  w3-mobile' style='width: 80%'>" +
			" 		&nbsp; (more)	trials" +
			" 		</div>" +
    " 	</div> " +
			" </div>" +
    "<div class='w3-container w3-cell w3-mobile' id='mixSmrySVGdiv'> " +
    "</div> " +
    "<div class='w3-container w3-mobile' id='mixSmryCount'> " +
    "</div> " +
  "</div> ";
return [div1, div2, div3];
};


  function restartMix(){
      mixRepResults =[];
      if(!d3.select("#mixSmrySVGdiv_svg").empty()){
        d3.selectAll("#mixSmrySVGdiv_svg.g").remove();
      }
      document.getElementById("mixSmryCount").innerHTML = " ";
      document.getElementById("mixSmrySVGdiv").style.display = 'none';
  }


function initialMixState(){
	//setup the original batch of balls in the box -- mixCircles with data: balls
    if (d3.select("#mix_SVG").empty()) {
      mixSVG = d3.select('#mixSVGgoesHere')
         .append('svg')
         .attr("id", "mix_SVG")
         .attr("width", 500)
         .attr("height", 330);
    } else {
      mixSVG = d3.select("#mix_SVG");
      mixSVG.selectAll("circle").remove();
      mixSVG.selectAll("text").remove();
    }
    mixSVG = mixSVG
      .append("g")
      .attr("transform", "translate(" +  (w/2 -20) + "," + (h/2 ) +")");

     var lineFunction = d3.line()
           .x(function(d) { return d.x; })
           .y(function(d) { return d.y; })
           ;//.interpolate("linear");
         // now draw the container
     var box = mixSVG.append("path")
           .attr("d", lineFunction(boxData))
           .attr("stroke", "blue")
           .attr("stroke-width", 2)
           .attr("fill", "white");

	var	colorSeq = [],
		k = 0,
		grdSize = Math.floor(Math.min(w,h)/( mixRadius*2)),
		xyvalues = sequence(0, grdSize, 1); // integer values for a lattice

    mixGroups =  document.getElementById("mixCats").value.split(","); // labels of each group
    mixNs =   jStat.map(document.getElementById("mixNs").value.split(","), Number); // ball counts
    mixNCat = mixGroups.length;  // number of categories

    if(mixNCat < 2){
    	alert("Must have more than one label and more than one ball count");
    }

    // force group length to = length of ball counts
    if( mixNCat > mixNs.length){
    	mixGroups.length = mixNCat = mixNs.length;
    } else if(mixNs.length < mixNCat){
    	mixNs.length = mixNCat;
    }
    mixNballs = d3.sum(mixNs);
    colorSeq = sequence(10, 351, 360/mixNCat)

    for ( i=0; i < mixNCat; i++)  {
            mixData[i]  = { "label": mixGroups[i] ,
 			                      "value": mixNs[i]
						};
    	colors[i] = d3.hcl(colorSeq[i] , 50, 80, 0.8);
	}

    var x = sampleWrep(xyvalues, mixNballs, repeat(1, xyvalues.length))[0],
	   	y = sampleWrep(xyvalues, mixNballs, repeat(1, xyvalues.length))[0];
	// pick locations at random on a grid of (x,y) values

	// get rid of old hanging stuff

     if(mixCircles.length > 0){
     	  mixCircles.exit().remove();
        mixText.exit().remove();
        mixDraws.exit().remove();
     }
     mixCircles = mixText =  mixDraws = balls = [];

    k=0;
    for(i = 0; i < mixNCat; i++){
    	for(j=0; j < mixNs[i]; j++){
    		//check that this spot is not already taken
    		if(balls.length > 1){
    			while(d3.min(Math.abs(balls.x - x[k]) + Math.abs(balls.y -x[k]) < 1)){
    				if(Math.random() > 0.5){  // flip a fair coin
    					x[k] = (x[k] >= grdSize)? 0 : x[k] + 1;  // move to right
    				} else{
    					y[k] = (y[k] >= grdSize)? 0 : y[k] + 1;  // move down
    				}
    			}    // when we get here, the jth ball in group i does not conflict with the kth ball
    		}      // no conflicts with any balls
    		balls.push({x: x[k],   // add this ball to the display list
    					y: y[k++],       //  and increment k
    					group : i,
    					r: mixRadius - .75} );
    	}
     }
     mixCircles = mixSVG.selectAll("circle")
        .data(balls);
     mixCircles.enter()
     	.append("circle")
         .attr("fill", function(d, i){ return colors[d.group]; } )
         .attr("cx", function(d){ return d.x * mixRadius - w/5;} ) //
         .attr("cy", function(d){ return d.y * mixRadius - h/4;} )  //
         .attr("r",  function(d){ return d.r;} )
         //.attr("text",function(d){return mixGroups[d.group];})  //
         ;//.attr("class", "circle")
         console.log(mixCircles);
      //mixCircles.exit().remove();
}  //end of initialMixState

    // Transitions and timers

function turn(i) {// rotate the whole batch of mixCircles
	mixCircles.transition()
		.delay(mixDuration * (i + (i > 0)* 1.4) *2 )
		.duration(mixDuration )
		.ease(d3.easeCubicOut)
		.attrTween("transform", function() {
			return d3.interpolateString("rotate( 0, 0, 0)", "rotate(-720, 0, 0)");
		});
}

function mixTest(draws) {
	// for testing
	var i ;
	for (i = 0; i < draws.length; i++) {
		turn(i);
	}
	draws.each(function(d, i) {
		turn(i);  // need to NOT turn the ones we've already used
		d3.select(this)
			.transition()		// move the selected ball to opening
			.delay(mixDuration * 2 * (i + 1.1))
			.attr("cx", w/2 -40  )
			.attr("cy", h / 2 - 21)
			.style("stroke", "black")
			.transition()       // moveover to line up at right
			.delay(mixDuration * 2 * (i + 1.4))
			.duration(mixDuration)
		    //.ease(d3.easeCubicIn)
			.attr("cx", w / 2 + 3 * mixRadius  )
			.transition()       // move up to its row
		    .delay( mixDuration * 2 * (i + 1.6) )
			.duration(mixDuration)
//			.ease(d3.easeCubicOut)
			.attr("cy",  i * 2*spacing - h/2 + mixRadius);
		if(mixReplace === "no")  {
		      balls.splice(balls.length -1, 1);
			mixCircles.exit().remove();
		}
	});
}

function mixNtimes(n){
	// generate a fixed number of draws
    var  	mixSeq = [];
	//initialMixState();
  mixReplace =  document.getElementById("mix_Replace").value;
	nMix =   +document.getElementById("nDraws").value;
    //if(mixStopRule !== "Fixed"){
    	// zap any results hanging around
    //	mixData = [];
    //}
    mixStopRule = "Fixed";
   	mixData = [];

	//check state of replacement. If "no" use sampleWOrep, otherwise use sampleWrep
	if(mixReplace === "no"){
		mixData = sampleWOrep(balls, nMix);
	} else if(mixReplace === "yes"){
		mixData = sampleWrep(balls, nMix,  repeat(1, balls.length));
	} else{
		alert("error in mixReplace");
	}
	//console.log(mixData[0]);

	showmixSequence(mixData);
}

function mixTill1(){
	// generate a random sample of draws ending with one of the right color
	var mixStopper =  document.getElementById("mixTil").value,
    	i =0,
    	mixLength,
    	otherBalls =[],
    	theseBalls = [],
    	tempDraw;
    mixData = [[],[]];

//     if(mixStopRule !== "OneOfOneType"){
    	// zap any results hanging around
  //  	mixRepResults = [];
    //}
	mixStopRule = "OneOfOneType";


	//initialMixState();
    mixReplace =  document.getElementById("mix_Replace").value;
	mixMatch = mixGroups.indexOf(mixStopper);
    if (mixMatch < 0){
    		alert("You must choose one of the labels.")
    }
    //check state of replacement. If "no" just use sampleWOrep, otherwise use sampleWrep
	if(mixReplace === "no"){
		mixData = sampleWOrep(balls, mixNballs);
		for (i=0; i < mixNballs; i++){
			if(mixMatch === mixData[0][i].group){
				mixData[0].length = i+1;
				mixData[1].length = i+1;
				nDraws = i+1;
				break;
			}
		}
	} else{
		nDraws = rgeom(mixNs[mixMatch]/mixNballs);
		otherBalls = balls.filter(function(d) {return d.group !== mixMatch;} ); // other colors
		theseBalls = balls.filter(function(d) {return d.group === mixMatch;} ); // target color
		if(nDraws > 1){
			mixData = sampleWrep(otherBalls, nDraws-1,  repeat(1, otherBalls.length));
		}
		// last ball is of right color to give the right random geometric.
		tempDraw = sample1(theseBalls.length);
		mixData[0][nDraws -1] = theseBalls[tempDraw];
		// trouble finding the index number of the ball of drawn, but then why do I need it?
		mixData[1][nDraws -1] = mixNballs; // indexOfXY(balls, theseBalls[tempDraw].x, theseBalls[tempDraw].y);
	}
	//console.log(nDraws);

	//console.log(mixData[0], mixData[1]);
	showmixSequence(mixData);
	//}
}

function mixTillAll(){
	var newBall,
		error=" ",
		i = 0,
		ndx=0,
		mixColor,
		table = [];
    mixData = [[],[]];
    //if(mixStopRule !== "OneOfEach"){
    	// zap any results hanging around
    //	mixRepResults = [];
    //}
	mixStopRule = "OneOfEach";

	//initialMixState();

    mixReplace =  document.getElementById("mix_Replace").value;

    for(i=0; i < mixNCat; i++){
    	table[i] = 0;
    }
    table.length = mixNCat;

    //check state of replacement. If "no" just use sampleWOrep once.
	if(mixReplace === "no"){
		mixData = sampleWOrep(balls, mixNballs);
    ndx = 0;
    	while (d3.min(table) < 1){
		     mixColor =  	mixData[0][ndx].group;
  		   table[mixColor] += 1;
  		   ndx++;
  		  }
  		mixData[0].length = ndx;
  		mixData[1].length = ndx;
 	} else{    // sampling with replacement
   	    mixData = sampleWrep(balls, nCat, repeat(1,balls.length));
   	    for(ndx=0; ndx< nCat; ndx++){
  			mixColor = mixData[0][ndx].group;
   	    	table[mixColor] += 1;
   	    }
   	    newBall = sampleWrep(balls, 10, repeat(1,balls.length));
   	    while(d3.min(table) < 1){
   	    	for(i=0; i<10; i++){
  				  mixData[0][ndx] = newBall[0][i];
  				  mixData[1][ndx] = newBall[1][i];
  				  ndx++;
		   		  mixColor = newBall[0][i].group;
   	    		table[mixColor] += 1;
   	    		if(d3.min(table) >= 1){
   	    			break;
   	    		}
   	    	}
  			//console.log(newBall[0][0].group);
  			if(ndx > 10000){ error="10K";
  				break;
  				}
  			newBall = sampleWrep(balls, 10, repeat(1, balls.length));
  		}
   }
   //console.log(table);
   console.log(mixData[0], mixData[1]);
   if(error !== "10K"){
    	showmixSequence(mixData);
    }
}

function showmixSequence(mixData){
	var nDraws = mixData[0].length, //sampled balls
		mixSeq = mixData[1];        // indices of those sampled
	var spacing = (h -20) / (nDraws + 1); //for sampled balls going outside the box
	 console.log(mixSeq);
	// create new circles for the selected sample.
	// hide them by setting radius to zero
	mixDraws = mixSVG.selectAll("circle")
         .data(mixData[0]);
    mixDraws.enter().append("circle")
         .attr("fill", function(d, i){ return colors[d.group]; } )
         .attr("cx", function(d){ return d.x * mixRadius - w/5;} ) //
         .attr("cy", function(d){ return d.y * mixRadius - h/4;} )  //
         .attr("r",  0 )
         .attr("text",function(d,i){return mixGroups[mixSeq[i]];})  //
         ;//.attr("class", "circle") ;


  	function isDrawn(d, i) {
      return  inArray(mixSeq, i);
  	}

	  mixDraws.each(function(d, i) {
		  turn(i);
		  d3.select(this)
			  .transition()		// move the selected ball to opening
			  .delay(mixDuration * 2 * (i + 1.1))
			  .attr("cx", w/2 -40  )
			  .attr("cy", h / 2 - 21)
        .attr("r",  mixRadius )
			  .style("stroke", "black")
			  .transition()       // move ball over to queue at right
			  .delay(mixDuration * 2 * (i + 1.4))
			  .duration(mixDuration)
		//  .ease(d3.easeCubicIn)
			  .attr("cx", w / 2 + 3 * mixRadius  )
			  .transition()       // move up to its row
		    .delay( mixDuration * 2 * (i + 1.6) )
			  .duration(mixDuration)
//			.ease(d3.easeCubicOut)
			  .attr("cy",  i *spacing - h/2 + mixRadius)
			  .attr("opacity", 1)
			  .style("stroke", "black");
		})
		if(mixReplace === "no")  {
			// note: if replace =="no", the number of circles decreases with each draw.
			mixCircles.filter(isDrawn).each(function(d,i){
				d3.select(this).transition()
        		.delay(mixDuration * 2 * (mixSeq[i] + 1.4))
        		.attr("opacity", 0)
        		.remove;
    		} );
    	for(i=0;i<nDraws;i++){
  		    balls.splice(mixSeq[i], 1); //remove from the list
		  }
	  };

     mixText = mixSVG.selectAll("text")
         .data(mixData[0]);
     mixText.enter().append("text")
         .attr("x", w/2 - 2*mixRadius ) //
         .attr("y", function(d, i){ return i * spacing - h/2 + 1.2 * mixRadius;} )
         .text( function(d){return mixGroups[d.group];})  //
         .style("text-anchor", "middle")
         .attr("font-family", "sans-serif")
         .attr("opacity",0)
         .attr("font-size", "20px");

   mixText.each(function(d,i){
	// show the label
        d3.select(this)
          .transition()
           .delay( 200+ ( mixSlideDuration + mixDuration) * (i + 1.6) )
          .attr("opacity", 1)
       ;
   });
   document.getElementById("repeatMixer").style.display = "block";
 }

function hideShowMix() {
    hideMix = !hideMix;
    var xDiv = document.getElementById("mixSVGgoesHere");
    xDiv.style.display = hideMix ? "none" : "block";
}


function draws2get1ofEach(reps) {
	// randomly draw til we get one of each category
	// returns the number of mixs needed
	var i = 0,
	    j = 0,
	    table = [],
	    temp = [],
	    draw1 = [],
	    nDraws = repeat(1,reps),
	    nCat = mixGroups.length,
	    probs = [],
 	    stdize = function(x) {
		  return x / totalProb;
	    },
	    totalProb = d3.sum(mixNs);

	if (nCat < 2) {
		return nDraws; // with only 1 category, we get all (only one) categories right away
	} // at least 2 categories
	draw1 = sampleWrep(sequence(0,nCat-1,1), reps, probs);
	for( i=0; i < reps; i++){
		probs = jStat.map(mixNs, stdize);  // need to reset for each rep
		//console.log(probs);
		probs.splice(draw1[i],1);  // remove the first draws prob for each rep
		//console.log(probs);
		if(d3.sum(probs) > 0){
			nDraws[i] = 1 + recursiveDraws(probs );
		}
		//console.log(nDraws[i]);
	}
	return nDraws;
}

function recursiveDraws(probs){
	// returns the (random) number of draws needed to get one of each type
	// probs are the relative probabilities of catgories not yet selected
	 var sumProb = d3.sum(probs), // this needs to be less than 1 for rgeom to work
	     draw,
	     group,
	     nCat = probs.length;
	 //console.log(probs);
	 if(sumProb >= 1.00){
	 	console.log("Error in recursiveDraw: probs sum to one");
	 	return(NaN);
	 }
	 draw = rgeom(sumProb);  // draws to get the next new type
	 if(nCat === 1){
	 	return draw;
	 } else{                 // assign the new draw a category
	 	group = sampleWrep(sequence(0,nCat-1,1), 1, probs ) ;
	 	probs.splice(group, 1); // remove the observed probability
	 	return draw + recursiveDraws(probs);
	 }
}

function mixRepeat(times){
  //  show results of repeatedly using the selected procedure.
	var i,
		thisProb;

    if(mixStopRule === "Fixed"){
    	thisProb = mixNs[0]/ d3.sum(mixNs);
    	mixRepResults = mixRepResults.concat(rbinom(nMix, thisProb, times));
    	// track  number of first type?

    } else if(mixStopRule === "OneOfOneType"){
    	// track number of mixs needed
    	thisProb = mixNs[mixMatch]/ d3.sum(mixNs);
    	mixRepResults[0] = mixData[0].length;
    	for(i=0; i<times; i++ ){
    		mixRepResults.push(rgeom(thisProb));
    	}
    } else if(mixStopRule === "OneOfEach"){
    	// track number of mixs needed
    	mixRepResults[0] = mixData[0].length;
    	mixRepResults = mixRepResults.concat(draws2get1ofEach(times));
    } else {
    	console.log("Bad option for mixStopRule");
    }
}

var dotChart2 = function(plotData) {
  // TODO:  make turn function work
  // TODO   transition more smoothly to outside box, then up
  // TODO  Last draw is not showing
  // TODO  move drawn ball labels to right side. Make sure they work for all methods
  //  TODO  Move balls is sequence randomly selected. It's now moving first created to last
  var
    xyData = [],
    xLabel = xLab =
      mixStopRule === 'Fixed'
        ? 'Number of the first type in ' + document.getElementById('nDraws').value + ' draws'
        : mixStopRule === 'OneOfOneType'
        ? 'Draws to get a ' + mixGroups[mixMatch]
        : 'Draws to get one of each type';
  stopRuleChange = false;
  plotData = plotData.sort(function(a,b) { return(a-b);});
  xyData = stackDots(plotData);
  document.getElementById("mixSmrySVGdiv").style.display = 'block';
  makeScatterPlot(xyData, "mixSmrySVGdiv", xLabel, xLab, " ", false);
  document.getElementById("mixSmrySVGdiv").style.display = 'block';
  document.getElementById("mixSmryCount").innerHTML = "Based on " + plotData.length +" simulations";
};
