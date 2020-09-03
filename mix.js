// subroutine to draw balls randomly from a box in D3 javascript.
// Inputs:
//    category labels and relative ball counts
//    pick stopping option.
// TODO:  balls are not coming out, only labels for 'one of each'
// TODO:  fix duration of transitions
var w =  Number(400), // - margin.right - margin.left,
    h = Number(300), // - margin.top - margin.bottom
    balls1 =  [];
var boxData = [ { "x": w/2 -40,   "y": h/2-2 },  { "x": -w/2 +22,  "y": h/2-2},
                  { "x": -w/2+22,  "y": -h/+2}, { "x":w/2 -40 ,  "y": -h/2+2},
                  { "x": w/2 -40,  "y": h/2 - 40}],
    colors = [],
    hideMix = false,
    mixCircles =[],
    mixData = [],
    mixDraws=[],     // cumulative probabilities
 		mixDuration = 200,
    mixSlideDuration = 200,
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
    "       style='display:block' onchange='restartMix();' > " +
    " 		</div> " +
    " 		<div class='w3-cell w3-mobile'></div> " +
    " 		<div class='w3-cell w3-mobile' style='width:30%'> " +
    " 			Numbers of balls: " +
    " 			<input class='w3-input w3-border w3-mobile w3-pale-yellow' type='text' id='mixNs'  " +
    "       style='display:block' onchange='restartMix();' > " +
    " 		</div> " +
    " 		<div class='w3-cell w3-mobile' style='width:40%'> " +
    " 			Replace drawn balls? " +
    " 			<select class='w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='mix_Replace' onblur = 'restartMix(); initialMixState()'> " +
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
    "       placeholder='Getting one of this type: ' onchange='restartMix(); mixTill1(); showmixSequence(mixData);' style='display:block'> " +
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

	var	k = 0,
		grdSize = Math.floor(Math.min(w,h)/( mixRadius*2)),
		xyvalues = sequence(0, grdSize, 1); // integer values for a lattice

    mixGroups =  document.getElementById("mixCats").value.split(","); // labels of each group
    mixNs =   jStat.map(document.getElementById("mixNs").value.split(","), Number); // ball counts
    mixNCat = mixGroups.length;  // number of categories

    if(d3.min(mixNs) < 1){
    	alert("Must have a positive number of balls for each label.");
    }

    if(mixNCat < 2){
    	alert("Must have more than one label.");
    }

    // force group length to = length of ball counts
    if( mixNCat > mixNs.length){
    	mixGroups.length = mixNCat = mixNs.length;
    } else if(mixNs.length < mixNCat){
    	mixNs.length = mixNCat;
    }
    mixNballs = d3.sum(mixNs);

    for ( i=0; i < mixNCat; i++)  {
            mixData[i]  = { "label": mixGroups[i] ,
 			                      "value": mixNs[i]
						};
    	colors[i] = d3.hcl(10 + i * 360/mixNCat , 50, 80, 0.8);
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
     mixCircles = mixText =  mixDraws = balls1 =  [];

    k=0;
    for(i = 0; i < mixNCat; i++){
    	for(j=0; j < mixNs[i]; j++){
    		//check that this spot is not already taken
    		if(balls1.length > 1){
    			while(d3.min(Math.abs(balls1.x - x[k]) + Math.abs(balls1.y -x[k]) < 1)){
    				if(Math.random() > 0.5){  // flip a fair coin
    					x[k] = (x[k] >= grdSize)? 0 : x[k] + 1;  // move to right
    				} else{
    					y[k] = (y[k] >= grdSize)? 0 : y[k] + 1;  // move down
    				}
    			}    // when we get here, the jth ball in group i does not conflict with the kth ball
    		}      // no conflicts with any balls
    		balls1.push({x: x[k],   // add this ball to the display list
    					y: y[k++],       //  and increment k
    					group : i,
    					r: mixRadius - .75} );
    	}
     }
     mixCircles = mixSVG.selectAll("circle")
        .data(balls1);
     mixCircles.join("circle")
         .attr("fill", function(d, i){ return colors[d.group]; } )
         .attr("cx", function(d){ return d.x * mixRadius - w/5;} ) //
         .attr("cy", function(d){ return d.y * mixRadius - h/4;} )  //
         .attr("r",  function(d){ return d.r;} )
         //.attr("text",function(d){return mixGroups[d.group];})  //
         ;//.attr("class", "circle")
         //console.log(mixCircles);
      //mixCircles.exit().remove();
}  //end of initialMixState

    // Transitions and timers

function turn(i) {// rotate the whole batch of mixCircles
	//mixSVG
  d3.select("#mix_SVG").selectAll("circle")
    .transition()
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
		      balls1.splice(balls1.length -1, 1);
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
  mixStopRule = "Fixed";
 	mixData = [];

	//check state of replacement. If "no" use sampleWOrep, otherwise use sampleWrep
	if(mixReplace === "no"){
		mixData = sampleWOrep(balls1, nMix);
	} else if(mixReplace === "yes"){
		mixData = sampleWrep(balls1, nMix,  repeat(1, balls1.length));
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
		mixData = sampleWOrep(balls1, mixNballs);
    nDraws = mixData[0].findIndex(function(d) {return d.group === mixMatch;})
    mixData[0].length = nDraws + 1;
    mixData[1].length = nDraws + 1;
	} else{  // with replacement -- same as spinner
		nDraws = rgeom(mixNs[mixMatch]/mixNballs);
		otherBalls = balls1.filter(function(d) {return d.group !== mixMatch;} ); // other colors
		theseBalls = balls1.filter(function(d) {return d.group === mixMatch;} ); // target color
		if(nDraws > 1){
			mixData = sampleWrep(otherBalls, nDraws-1,  repeat(1, otherBalls.length));
		}
		// last ball is of right color to give the right random geometric.
		tempDraw = sample1(theseBalls.length);
		mixData[0][nDraws -1] = theseBalls[tempDraw];
		// trouble finding the index number of the ball of drawn, but then why do I need it?
		mixData[1][nDraws -1] = mixNballs; // indexOfXY(balls, theseBalls[tempDraw].x, theseBalls[tempDraw].y);
	}
  return( mixData);
}

function mixTillAll(){
  // use for a single mixer sequence to see which balls are sampled until
  //  all categories have been selected at least once
	var newBall,
		error=" ",
		i = 0,
		drawLength ,
		mixColor,
		ndxs = table = repeat(0, mixNCat);
    mixData = [[],[]];
  mixStopRule = "OneOfEach";
	//initialMixState();
  mixReplace =  document.getElementById("mix_Replace").value;
  //check state of replacement. If "no" just use sampleWOrep once.
	if(mixReplace === "no"){
		mixData = sampleWOrep(balls1, mixNballs);
    for(i=0; i < nCat;i++){
      ndxs[i] = mixData[0].findIndex(function(d) {return d.group === i;})
    }
    drawLength = d3.max(ndxs) + 1;
  	mixData[0].length = drawLength;
  	mixData[1].length = drawLength;
 	} else{    // sampling with replacement -- just like the spinner
   	 mixData = sampleWrep(balls1, nCat, repeat(1, balls1.length));
   	 for(drawLength=0; drawLength< nCat; drawLength++){
  			mixColor = mixData[0][drawLength].group;
   	    table[mixColor] += 1;
   	  }
   	  newBall = sampleWrep(balls1, 10, repeat(1,balls1.length));
   	  while(d3.min(table) < 1){
   	   	for(i=0; i<10; i++){
  				  mixData[0][drawLength] = newBall[0][i];
  				  mixData[1][drawLength] = newBall[1][i];
  				  drawLength++;
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
  			newBall = sampleWrep(balls1, 10, repeat(1, balls1.length));
  		}
   }
   //console.log(table);
   //console.log(mixData[0], mixData[1]);
   if(error !== "10K"){
    	showmixSequence(mixData);
    }
}

function showmixSequence(mixData){
	var nDraws = mixData[0].length, //sampled balls
		  mixSeq = mixData[1];        // indices of those sampled
	var spacing = (h -40) / (nDraws + 1); //for sampled balls going outside the box
	 //console.log(mixSeq);
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
			  .delay(mixDuration * 2 * (i + 1.2))
			  .duration(mixDuration)
		//  .ease(d3.easeCubicIn)
			  .attr("cx", w / 2 + 3 * mixRadius  )
			  .transition()       // move up to its row
		    .delay( mixDuration * 2 * (i + 1.3) )
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
  		    balls1.splice(mixSeq[i], 1); //remove from the list
		  }
	  };

     mixText = mixSVG.selectAll("text")
         .data(mixData[0]);
     mixText.enter().append("text")
         .attr("x", w/2 - mixRadius ) //
         .attr("y", function(d, i){ return i * spacing - h/2 + 1.2 * mixRadius;} )
         .text( function(d) {return mixCats[d.group];} )  //
         .style("text-anchor", "middle")
         .attr("font-family", "sans-serif")
         .attr("opacity",0)
         .attr("font-size", "16px");

   mixText.each(function(d,i){
	// show the label
        d3.select(this)
          .transition()
           .delay( 100+ ( mixSlideDuration + mixDuration) * (i + 1.3) )
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
	// returns the numbers of draws needed, not the sequence
  // use only when sampling with replacement
	var i = 0,
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
  // start by taking a random draw for each rep
	draw1 = sampleWrep(sequence(0,nCat-1,1), reps, mixNs);
    // whichever category was drawn does not need to get found again
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
	return nDraws; // a vector of length reps
}

function recursiveDraws(probs){
	// returns the (random) number of draws needed to get one of each type
	// probs are the relative probabilities of catgories not yet selected
	 var sumProb = d3.sum(probs), // this needs to be less than 1 for rgeom to work
	     draw,
	     group,
	     nCat = probs.length; // reduces by 1 with each recursion
	 //console.log(probs);
	 if(sumProb >= 1.00){
	 	console.log("Error in recursiveDraw: probs sum to one");
	 	return(NaN);
	 }
	 draw = rgeom(sumProb);  // draws to get the next new type
	 if(nCat === 1){
	 	return draw;
  } else{                 // assign the new draw a category based on probs of unobserved categories
	 	group = sampleWrep(sequence(0,nCat-1,1), 1, probs ) ;
	 	probs.splice(group, 1); // remove the observed probability
	 	return draw + recursiveDraws(probs);
	 }
}

function mixRepeat(times){
  //  show results of repeatedly using the selected procedure.
	var i, j, draws = [], ndxs=repeat(0, mixNCat), max, total = d3.sum(mixNs), others,
      probs=[],	thisProb;
  switch (mixStopRule){
    case 'Fixed' : {
      thisProb = mixNs[0]/ total;
      draws = document.getElementById("nDraws").value;
      mixRepResults = mixRepResults.concat(rbinom(draws, thisProb, times));
      // track  number of first type?
      break;
    }
    case 'OneOfOneType': {
      // track number of spins needed
    	//mixRepResults[0] = mixData[0].length;
      thisProb = mixNs[mixMatch]/ total;
      if(mixReplace === "yes"){
        for (i = 0; i < times; i++) {
          mixRepResults.push(rgeom(thisProb));
        };
      } else {
        // using simulation here is messy. Instead am going to compute probs
        // and sample from true distribution
        probs[0] = thisProb;
        others = total - mixNs[mixMatch];
    	  for(i=1; i <= others; i++ ){
          probs[i] = probs[i-1] * (others +1-i)/(total -i);
        }
        //console.log(probs);
        draws = sampleWrep(sequence(1, others + 1.1, 1), times, probs)[0];
        for (i = 0; i < times; i++) {
          mixRepResults.push(draws[i]);
        };
        //console.log(mixRepResults);
      }
      break;
    }
    case 'OneOfEach': {
      // track number of spins needed
    	//mixRepResults[0] = mixData[0].length;
      // TODO:  not limited properly when replace = 'no';
      if(mixReplace === "yes"){
       	mixRepResults = mixRepResults.concat(draws2get1ofEach(times));
      } else{
        for(j=0; j < times; j++){
          mixData = sampleWOrep(balls1, mixNballs);
          for(i=0; i < nCat;i++){
            ndxs[i] = mixData[0].findIndex(function(d) {return d.group === i;})
          }
          console.log(ndxs);
          max = d3.max(ndxs) + 1;
          mixRepResults.push( max);
        }
      }
      break;
    }
    default: {
      console.log('Bad option for mixStopRule');
    }
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
