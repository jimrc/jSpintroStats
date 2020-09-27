// subroutine to draw balls randomly from a box in D3 javascript.
// Inputs:
//    category labels and relative ball counts
//    pick stopping option.
//  TODO: remove inner balls when replace = 'no'

var w =  Number(400), // - margin.right - margin.left,
    h = Number(300), // - margin.top - margin.bottom
    ballsInit =  [];
var boxData = [ { "x": w/2 -40,   "y": h/2-2 },  { "x": -w/2 +22,  "y": h/2-2},
                  { "x": -w/2+22,  "y": -h/+2}, { "x":w/2 -40 ,  "y": -h/2+2},
                  { "x": w/2 -40,  "y": h/2 - 40}],
    colors = [],
    hideMix = false,
    mixCircles =[],
    mixData = [],
    mixDraws=[],
 		mixDuration = 500,
    mixSlideDuration = 250,
    mixGroups =[],
    mixInner = [],
    mixMatch,
    mixNs = [],
    mixPicks =[],
    mixStopRule,
    mixRadius = 10,
    mixRepResults = [],
    mixSeq = [],
    mixSVG,
    nCat,
    nMix,
    nDraws,
    pickNdx,
    resultSlot,
    spacing =12,
    textLabels = [];

function mixerDivs(){
  // sets up html page for this demo
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
    "       placeholder='Getting one of this type: ' onchange='restartMix(); mixTill1();' style='display:block'> " +
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
    " 			</button>  <br>" +
    "      <div class='w3-cell w3-mobile' id = 'whichType'> </div>  "
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

      resultSlot = mixSVG
               .append('text')
               .attr('x', 200)
               .attr('y', 150)
               .attr('font-size', '18px')
               .text(" ");

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
    	colors[i] = d3.hcl(30 + i * 330/mixNCat , 50, 80, 0.8);
	  }

    var xSeq = sampleWrep(xyvalues, mixNballs, repeat(1, xyvalues.length)),
	   	ySeq = sampleWrep(xyvalues, mixNballs, repeat(1, xyvalues.length));
	  // pick locations at random on a grid of (x,y) values

	// get rid of old hanging stuff

 mixCircles = mixDraws  = ballsInit = [];
    k=0;
    for(i = 0; i < mixNCat; i++){
    	for(j=0; j < mixNs[i]; j++){
    		//check that this spot is not already taken
    	//	if(ballsInit.length > 1){
    	//		while(d3.min(Math.abs(ballsInit.x - xSeq[k]) + Math.abs(ballsInit.y -xSeq[k]) < 1)){
    	//			if(Math.random() > 0.5){  // flip a fair coin
    	//				xSeq[k] = (xSeq[k] >= grdSize)? 0 : xSeq[k] + 1;  // move to right
    	//			} else{
    	//				ySeq[k] = (ySeq[k] >= grdSize)? 0 : ySeq[k] + 1;  // move down
    	//			}
    	//		}    // when we get here, the jth ball in group i does not conflict with the kth ball
    	//	}      // no conflicts with any balls
    		ballsInit[k] = ({
          x: xSeq[k],   // add this ball to the display list
    			y: ySeq[k],
    			group : i,
          x2: w/2 + 20 ,
          y2:  h / 2 - 21,
          order: k++,
    			r: mixRadius - .75,
          selected:  false} );
    	}
     }
     mixData = ballsInit;
     mixInner = mixSVG.selectAll(".inCircle")
             .data(mixData);
        mixInner.join("circle")
            .attr("class", "inCircle")
             .attr("fill", d => colors[d.group] )
             .attr("cx",  d => d.x * mixRadius - w/5 )
             .attr("cy", d => d.y * mixRadius - h/4 )
             .attr("r",  d => d.r );

}  //end of initialMixState

function mixNtimes(n){
	// generate a fixed number of draws and pull them out of the box
  var  	k, len = ballsInit.length,
           temp,
          choices = sequence(0, len, 1);
	//initialMixState();
  mixReplace =  document.getElementById("mix_Replace").value;
	nMix =   +document.getElementById("nDraws").value;
  document.getElementById("whichType").innerHTML = "Draw " + nMix + " balls from the box.";
  mixPicks =[];
  nDraws = k = nMix;
  mixStopRule = "Fixed";

  //check replacement option. If "no" use sampleWOrep, otherwise use sampleWrep
	if(mixReplace === "no"){
		pickNdx = sampleWOrep(choices, nMix);
	} else if(mixReplace === "yes"){
		pickNdx = sampleWrep(choices, nMix,  repeat(1, len));
	} else{
		alert("error in mixReplace");
	}
  for(i=0; i < nMix; i++){
    mixPicks.push(ballsInit[pickNdx[i]]);
    mixData[pickNdx[i]].selected = true;
  }
	showmixSequence(mixData, mixPicks);
}

function mixTill1(){
	// generate a random sample of draws ending with one of the right group
	var mixStopper =  document.getElementById("mixTil").value,
    	i =0, len = ballsInit.length,
    	mixLength,
    	tempDraw;
  mixPicks =[];
  nDraws = 0;
	mixStopRule = "OneOfOneType";
	//initialMixState();
  mixReplace =  document.getElementById("mix_Replace").value;
	mixMatch = mixGroups.indexOf(mixStopper);
    if (mixMatch < 0){
    		alert("You must choose one of the labels.")
    }
    document.getElementById("whichType").innerHTML = "Draw until you get a " + mixStopper ;
    //check state of replacement. If "no" just use sampleWOrep, otherwise use sampleWrep
	if(mixReplace === "no"){
    pickNdx = sampleWOrep(ballsInit, len, repeat(1, ballsInit.length));
    //mixPicks = shuffle(ballsInit);
    for(i=0; i < len; i++){  // must draw at least the number of categories
       mixPicks.splice(i,0, ballsInit[pickNdx[i]]);
       mixData[pickNdx[i]].selected = true;
     }
		//mixPicks = shuffle(ballsInit);  // reorder all balls
    nDraws = mixPicks.findIndex(function(d) {return d.group === mixMatch;}) + 1;
    mixPicks.length = nDraws;
    pickNdx.length = nDraws;
	} else {                                // sample with replacement -- like spinner
    var prob = jStat.map(mixNs, function(x) {
                  return x / d3.sum(mixNs);    }),
         subset = [], matches =[], last;
    nDraws = rgeom(prob[mixMatch]);
    for( i =0; i< len; i++){
       if (ballsInit[i].group === mixMatch){
         matches.push(i);
       } else {
         subset.push(i)
       }
    }
    //console.log(subset);
    pickNdx = sampleWrep(subset, nDraws - 1, repeat(1, subset.length));
    for(i=0; i < nDraws -1; i++){
      pickNdx[i] = subset[pickNdx[i]] // go back to numbering of ballsInit
      mixPicks.push(ballsInit[pickNdx[i]]);
      mixData[pickNdx[i]].selected = true;
    }
    last = +sampleN(matches, 1);
    pickNdx[nDraws -1] = last;
    mixPicks.push( ballsInit[last]);
    mixData[pickNdx[nDraws - 1]].selected = true;
	}
  //console.log(nDraws);
  showmixSequence(mixData,  mixPicks);

  resultSlot
      .transition()
      .delay( 3 * mixSlideDuration + 2 * mixDuration * nDraws)
      .text(nDraws);

}

function mixTillAll(){
  // use for a single mixer sequence to see which balls are sampled until
  //  all categories have been selected at least once
	var error=" ",
		i = 0, j, k, len = ballsInit.length,
		ndxs = repeat(-1, mixNCat),
    table = repeat(0, mixNCat);
  mixPicks = [];
  mixStopRule = "OneOfEach";
  nDraws = 0;
	//initialMixState();
  mixReplace =  document.getElementById("mix_Replace").value;
  document.getElementById("whichType").innerHTML = "Draw until you get one of each. "  ;

  //check state of replacement.
	if(mixReplace === "no"){           //  No replacement
    // pick indices of balls coming out as if it will take all len draws
    pickNdx = sampleWOrep(ballsInit, len, repeat(1, ballsInit.length));
    for(i=0; i < len; i++){  // must draw at least the number of categories
       mixPicks.splice(i,0, ballsInit[pickNdx[i]]);
       mixData[pickNdx[i]].selected = true;
     } // save picked data
    for(j=0; j < mixNCat; j++){
      ndxs[j] = mixPicks.findIndex(function(d) {return (d.group == j);});
    } // look through picks to find first instance of each group
    nDraws = d3.max(ndxs) +1; // add 1 to the largest instance
    mixPicks.length = nDraws;
    pickNdx.length = nDraws;
 	} else{    // sampling with replacement --  like the spinner
    // need at least as many draws as categories
    pickNdx = sampleWrep(ballsInit, mixNCat, repeat(1, ballsInit.length));
     for(i=0; i < mixNCat; i++){  // must draw at least the number of categories
       mixPicks.splice(i,0, ballsInit[pickNdx[i]]);
       mixData[pickNdx[i]].selected = true;
       table[ballsInit[pickNdx[i]].group] += 1;
     } //  table accumulates number of each category
     nDraws = mixNCat;
   	 if(d3.min(table) > 0 ){
       console.log(nDraws);
       showmixSequence(mixData, mixPicks);
       resultSlot
           .transition()
           .delay(3 * mixSlideDuration + 2 * mixDuration * nDraws)
           .text(nDraws);
       return;
     }  // if not, we need to draw more balls with replacement
     // keep going to get one of each drawing 10 at a time -- stop if > 10K
     for(k=0; k < 100; k++){
        pickNdx = sampleWrep(ballsInit, 10, repeat(1,ballsInit.length));
   	   	for(i=0; i<10; i++){
           mixPicks.splice(nDraws, 0, ballsInit[pickNdx[i]]);
           mixData[pickNdx[i]].selected = true;
           table[mixPicks[nDraws ].group] += 1;
           nDraws++;
   	       if(d3.min(table) > 0 ){
              showmixSequence(mixData, mixPicks);
              console.log(nDraws);
              resultSlot
                    .transition()
                    .delay(3 * mixSlideDuration + 2 * mixDuration * nDraws)
                    .text(nDraws);
              return;
            }
   	  	}
        console.log(table)
  			if(nDraws > 9990){
          error="10K";
  				break;
  			}
  		}
   }
   //console.log(nDraws);
   if(error !== "10K"){
      //console.log(nDraws);
    	showmixSequence(mixData, mixPicks);

      resultSlot
          .transition()
          .delay(3 * mixSlideDuration + 2 * mixDuration * nDraws)
          .text(nDraws);
    }
}

function showmixSequence(mixData, mixPicks){
  // function to show mixing and extracting balls
  //console.log("mD length: ", mixData.length);
	var omit, spacing = (h -40) / (nDraws + 1); //for sampled balls going outside the box
	mixInner = mixSVG.selectAll(".inCircle")
         .data(mixData);
    mixInner.join("circle")
        .attr("class", "inCircle")
         .attr("fill", d => colors[d.group] )
         .attr("cx",  d => d.x * mixRadius - w/5 )
         .attr("cy", d => d.y * mixRadius - h/4 )
         .attr("r",  mixRadius );
    mixDraws = mixSVG.selectAll(".outCircle")
        .data(mixPicks);
    mixDraws.join("circle")
          .attr("class","outCircle")
           .attr("fill", d => colors[d.group] )
           .attr("cx",  d => d.x * mixRadius - w/5 )
           .attr("cy", d => d.y * mixRadius - h/4 )
           .attr("r",  1 )
           .attr("opacity", 0.0)
       .each( function(d, i){
        //if(mixReplace === "no"){
          //   omit = mixData.findIndex(d => pickNdx[i] === d.order)
          //   mixData.splice( omit, 1 )
          //}
          turn(i)
 		      d3.select(this)
			   .transition()		// move the selected ball to opening
			   .delay(mixDuration *( 1 + i) + mixSlideDuration * 3 * i)
			   .duration(mixSlideDuration/2)
			   .attr("cy", d.y2)
         .attr("r",  mixRadius )
         .attr("opacity", 1)
         .ease(d3.easeCubicIn)
         .transition()		// move the selected ball to opening
			   .delay( mixSlideDuration/2)
			   .duration(mixSlideDuration *3/4)
			   .attr("cx", d.x2  )
			   .style("stroke", "black")
			   .transition()
			   .duration(mixSlideDuration)
			   .attr("cx",   d.x2  )
			   .attr("cy",   -100 + i * spacing )
		//	  .attr("opacity", 1)
			  .style("stroke", "black");
      } );

      textLabels = mixSVG
          .selectAll('g.text')
          .data(mixPicks)
          .join('text')
          .attr('x', d => d.x2 + 30)
          .attr('y', (d, i) =>  -97 + i * spacing  )
          .text( d => mixGroups[d.group])
          .style('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
         .attr("opacity",0.0)
         .attr("font-size", "16px")
        .each(function(d, i) {
           // move the selected ball out
           d3.select(this)
             .transition()
             .delay(mixSlideDuration * 3 + mixDuration * 2*(i + .5))
             .attr('opacity', 1);
           });

        // replot in case balls were removed:

         if(mixReplace === "no"){
          // for(i =0; i < nDraws; i++){
          //    omit = mixData.findIndex(d => pickNdx[i] === d.order)
          //    mixData.splice( omit, 1 )
           //}
        //mixInner
        //  .filter( d => d.selected)
        //  .transition()
        //  .delay(mixSlideDuration * 3 + mixDuration * 2*(nDraws + .5))
        //  .attr("r", 0);

         }

   document.getElementById("repeatMixer").style.display = "block";

}

function turn(j) {// rotate the whole batch of mixCircles
  //mixSVG
  mixInner = d3.select("#mix_SVG")
        .selectAll(".inCircle")
         .data(mixData);
         //console.log("mD length: ", mixData.length)
    mixInner.join("circle")
        .attr("class", "inCircle")
         .attr("fill", d => colors[d.group] )
         .attr("cx",  d => d.x * mixRadius - w/5 )
         .attr("cy", d => d.y * mixRadius - h/4 )
         .attr("r",  mixRadius )
    .each(function(d, i) {//.filter( d => (d.cx < "200"))
          d3.select(this)
          .transition()//.filter(this.cx < 200)
          .delay( (mixDuration + 3 * mixSlideDuration) * j  )
          .duration(mixDuration )
          .ease(d3.easeCubicOut)
          .attrTween("transform", function(d,i) {
            var move =  -360 - 720 * Math.random();
            return d3.interpolateString("rotate( 0, 0, 0)",
             "rotate(" + move +", 0, 0)");
           })
      });

}

function hideShowMix() {
    hideMix = !hideMix;
    var xDiv = document.getElementById("mixSVGgoesHere");
    xDiv.style.display = hideMix ? "none" : "block";
}


function draws2get1ofEach(reps) {
	// returns the numbers of draws needed, not the sequence
  // use only when sampling with replacement
	var i = 0,
	    draw1 = [],
	    nDraws = repeat(1,reps),
	    nCat = mixGroups.length,
	    probs = [],
	    total  = d3.sum(mixNs),
 	    stdize = function(x) {
		    return x / total;
	    };

	if (mixNCat < 2) {
		return nDraws; // with only 1 category, we get all (only one) categories right away
	} // at least 2 categories
  // start by randomly drawing a category for each rep
	draw1 = sampleWrep(mixGroups, reps, mixNs);
    // whichever category was drawn does not need to get found again
	for( i=0; i < reps; i++){
		probs = jStat.map(mixNs, stdize);  // need to reset for each rep
		//console.log(probs);
		probs.splice(draw1[i],1);  // remove the first draws prob for each rep
		//console.log(probs);
		if(d3.sum(probs) > 0){
			nDraws[i] = 1 + recursiveSpins(probs );
		}
		//console.log(nDraws[i]);
	}
	return nDraws; // a vector of length reps
}



function mixRepeat(times){
  //  show results of repeatedly using the selected procedure.
	var i, j, draws = [],
      ndxs=repeat(0, mixNCat), max,
      total = d3.sum(mixNs), others,
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
      // track number of draws needed
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
        draws = sampleWrep(sequence(1, others + 1.1, 1), times, probs);
        for (i = 0; i < times; i++) {
          mixRepResults.push(draws[i] + 1);
        };
        //console.log(mixRepResults);
      }
      break;
    }
    case 'OneOfEach': {
      // track number of spins needed
    	//mixRepResults[0] = mixData.length
      if(mixReplace === "yes"){
       	mixRepResults = mixRepResults.concat(draws2get1ofEach(times));
      } else{
        for(j=0; j < times; j++){
          mixData = [];
          mixSeq = sampleWOrep(ballsInit, total);
          for(i=0; i < total; i++){
            mixData[i] = ballsInit[mixSeq[i]];
          }
          for(i=0; i < mixNCat;i++){
            ndxs[i] = mixData.findIndex(function(d) {return d.group === i;})
          }
          //console.log(ndxs);
          max = d3.max(ndxs) + 1;
          mixRepResults.push(max);
        }
      }
      break;
    }
    default: {
      console.log('Bad option for mixStopRule');
    }
  }
}

function dotChart2(plotData) {
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
}
