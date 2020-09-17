// subroutine to draw balls randomly from a box in D3 javascript.
// Inputs:
//    category labels and relative ball counts
//    pick stopping option.
// TODO:  'get one of each' is not counting first group. like some color index shifted.
// TODO:  fine tune balls mixing and removal. Too many turns now
// TODO:  Show labels and # draws needed
// TODO:  transitions are not sequencing well
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
    mixSlideDuration = 400,
    mixGroups =[],
    mixMatch,
    mixNs = [],
    mixStopRule,
    mixRadius = 10,
    mixRepResults = [],
    mixSeq = [],
    mixSVG,
    mixText = [],
    nCat,
    nMix,
    nDraws,
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

     if(mixCircles.length > 0){
     	  mixCircles.exit().remove();
        mixText.exit().remove();
        mixDraws.exit().remove();
     }
     mixCircles = mixText =  mixDraws  = ballsInit = [];
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
          x2: w/2 +40 ,
          y2:  h / 2 - 21,
          selected: false,
          order: k++,
    			r: mixRadius - .75} );
    	}
     }
     mixData = ballsInit;
     mixCircles = mixSVG.selectAll("circle")
        .data(mixData);
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


function mixTest(draws) {
	// for testing
	var i ;
	for (i = 0; i < draws.length; i++) {
		turn(i);
	}
	draws.each(function(d, i) {
		turn(i);  // need to NOT turn the ones we've already selected
		d3.select(this)
      .filter(d.selected)
			.transition()		// move the selected ball to opening
			.delay(mixDuration * 2 * (i + 1.1))
			.attr("cx", d.x2  )
			.attr("cy", d.y2)
			.style("stroke", "black")
			.transition()       // moveover to line up at right
			.delay(mixDuration * 2 * (i + 1.4))
			.duration(mixDuration)
		    //.ease(d3.easeCubicIn)
			.attr("cx", d.x2 + mixRadius  )
			.transition()       // move up to its row
		    .delay( mixDuration * 2 * (i + 1.6) )
			.duration(mixDuration)
//			.ease(d3.easeCubicOut)
			.attr("cy",  i * 2*spacing - h/2 + mixRadius);
		if(mixReplace === "no")  {
		      mixData.splice(mixData.length -1, 1);
			mixCircles.exit().remove();
		}
	});
}

function mixNtimes(n){
	// generate a fixed number of draws and pull them out of the box
  var  	len = ballsInit.length,
           temp,
          choices = sequence(0, len, 1);
  nDraws = n;
	//initialMixState();
  mixReplace =  document.getElementById("mix_Replace").value;
	nMix =   +document.getElementById("nDraws").value;
  mixStopRule = "Fixed";
 	mixData = ballsInit;

	//check state of replacement. If "no" use sampleWOrep, otherwise use sampleWrep
	if(mixReplace === "no"){
		mixSeq = sampleWOrep(choices, nMix);
    for(i=0; i < nMix; i++){
      temp = mixData[i];
      mixData[i] = mixData[mixSeq[i]];
      mixData[i].selected = true;
      mixData[mixSeq[i]] = temp;
    }
	} else if(mixReplace === "yes"){
		mixSeq = sampleWrep(choices, nMix,  repeat(1, len));
    for(i=0; i < nMix; i++){
      temp = mixData[i];
      mixData[i] = mixData[mixSeq[i]];
      mixData[i].selected = true;
      temp.selected = false;
      mixData.push( temp);       // replace the selected ball with a new unselected one
    }
	} else{
		alert("error in mixReplace");
	}
	//console.log(mixData);
  for(i = nMix; i < mixData.length; i++){
    mixData[i].order = mixData.length;
  }
  mixData = mixData.sort(function(a,b) { return (a.order - b.order);});
  // TODO:  test this change.  carry it over to other stopping rules
	showmixSequence(mixData);
}

function mixTill1(){
	// generate a random sample of draws ending with one of the right group
	var mixStopper =  document.getElementById("mixTil").value,
    	i =0, len = ballsInit.length,
    	mixLength, newDraws =[],
    	tempDraw;
  mixData = ballsInit;
  nDraws = 0;
	mixStopRule = "OneOfOneType";
	//initialMixState();
  mixReplace =  document.getElementById("mix_Replace").value;
	mixMatch = mixGroups.indexOf(mixStopper);
    if (mixMatch < 0){
    		alert("You must choose one of the labels.")
    }
    //check state of replacement. If "no" just use sampleWOrep, otherwise use sampleWrep
	if(mixReplace === "no"){
		mixData = shuffle(ballsInit);  // reorder all balls
    nDraws = mixData.findIndex(function(d) {return d.group === mixMatch;}) + 1;
    for(i=0; i < nDraws ; i++){
      mixData[i].order = i;
      mixData[i].selected = true;
    }
    for(i = nDraws; i < len; i++){
      mixData[i].order = len;
    }
	} else{  // with replacement -- like spinner
    var possibleStop = len / mixNs[mixMatch] * d3.sum(mixNs), found = false;
    newDraws = sampleWrep(ballsInit, possibleStop, repeat(1,len));
    for(i=0; i < possibleStop; i++){
      tempDraw = ballsInit[newDraws[i]];
      mixData.push(tempDraw)
      mixData[newDraws[i]].selected = true;
      mixData[newDraws[i]].order = i;
      if(tempDraw.group === mixMatch){
        nDraws = i+1;
        found = true;
        break;
      }
		}
    if(!found){
      newDraws = sampleWrep(ballsInit, possibleStop, repeat(1,len));
      for(i=0; i < possibleStop; i++){
        tempDraw = ballsInit[newDraws[i]];
        mixData.push(tempDraw)
        mixData[newDraws[i]].selected = true;
        mixData[newDraws[i]].order = i;
        if(tempDraw.group === mixMatch){
          nDraws = i + possibleStop + 1;
          found = true;
          break;
        }
    }
    if(!found){
      console.log("No match found after" + (2*possibleStop) + "draws")
    }
	}
}
  //console.log(nDraws);
  mixData = mixData.sort(function(a, b) {return (a.order - b.order);} )
  showmixSequence(mixData);

  resultSlot
      .transition()
      .delay( mixSlideDuration + mixDuration * mixData.length)
      .text(nDraws);

}

function mixTillAll(){
  // use for a single mixer sequence to see which balls are sampled until
  //  all categories have been selected at least once
	var newNdx =[],
		error=" ",
		i = 0, j, k,
		ndxs = repeat(-1, mixNCat),
    table = repeat(0, mixNCat);
  mixStopRule = "OneOfEach";
  nDraws = 0;
	//initialMixState();
  mixReplace =  document.getElementById("mix_Replace").value;
  //check state of replacement. If "no" just use shuffle.
	if(mixReplace === "no"){
		mixData = shuffle(ballsInit);
    for(j=0; j < mixNCat; j++){
      ndxs[j] = mixData.findIndex(function(d) {return (d.group == j);});
    }
    nDraws = d3.max(ndxs) +1;
    for(i = 0; i < nDraws; i++){
      mixData[i].order = i;
      mixData[i].selected = true;
    }
    for(i = nDraws; i < mixData.length; i++){
      mixData[i].order = i;
      mixData[i].selected = false;
    }
    console.log(nDraws);
 	} else{    // sampling with replacement --  like the spinner
    mixData = [];
    for(i=0; i < mixNballs; i++){
      mixData.push(ballsInit[i])
    }  // dont know why I can't just assign mixData to be a copy of ballsInit,
       // but if I do, ballsInit grows in length with mixData
    newNdx = sampleWrep(ballsInit, mixNCat, repeat(1, ballsInit.length));
     for(i=0; i < mixNCat; i++){  // must draw at least the number of categories
       mixData[i] = ballsInit[newNdx[i]];
       mixData[i].order = i;
       // add this ball back into the mix
       mixData.push(mixData[i])
       mixData[i].selected = true;
       table[ballsInit[newNdx[i]].group] += 1;
     }
     nDraws = mixNCat;
     console.log("Length 1 of mixData: ", mixData.length)
     //for(j = 0; j < mixNCat; j++){
      //  ndxs[j] = mixData.findIndex(function(d) {return d.group == j;})
     //}
   	 if(d3.min(table) > 0 ){
       console.log(nDraws);
       showmixSequence(mixData);
       return;
     }
     // keep going to get one of each drawing 10 at a time -- stop if > 10K
     for(k=0; k < 100; k++){
        newNdx = sampleWrep(ballsInit, 10, repeat(1,ballsInit.length));
   	   	for(i=0; i<10; i++){
           nDraws++;
           mixData[nDraws -1] = ballsInit[newNdx[i]];
           //  now add this ball back into the mix
           mixData.push(mixData[nDraws -1])
           mixData[nDraws -1].order = nDraws;
           mixData[nDraws -1].selected = true;
            table[mixData[nDraws -1].group] += 1;
   	        if(d3.min(table) > 0 ){
              showmixSequence(mixData);
              console.log(nDraws);
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
   //console.log(table);
   //console.log(mixData[0], mixData[1]);
   if(error !== "10K"){
      //console.log(nDraws);
    	showmixSequence(mixData);

      resultSlot
          .transition()
          .delay(mixSlideDuration + mixDuration * mixData.length)
          .text(nDraws);
    }
}

function showmixSequence(mixData){
  // function to show mixing and extracting balls

	var nDraws = mixData.length, //sampled balls
	    spacing = (h -40) / (nDraws + 1); //for sampled balls going outside the box
	 //console.log(mixSeq);

	// create new circles for the selected sample.
	// hide them by setting radius to zero
	mixDraws = mixSVG.selectAll("circle")
         .data(mixData);
    mixDraws.join("circle")
         .attr("fill", d => colors[d.group] )
         .attr("cx",  d => d.x * mixRadius - w/5 )
         .attr("cy", d => d.y * mixRadius - h/4 )
         .attr("r",  mixRadius )
      .each(function(d, i) {
		    if (d.selected === true){
          turn(i);
 		    d3.select(this)
          //.filter(d.selected === true)
			   .transition()		// move the selected ball to opening
			   .delay(mixDuration * 2 * (i + 1.2))
			   .duration(mixSlideDuration)
			   .attr("cy", (d.selected === true) ? d.y2 : this.cy )
         //.attr("r",  mixRadius )
         .transition()		// move the selected ball to opening
			   .delay( mixSlideDuration)
			   .duration(mixSlideDuration)
			   .attr("cx", (d.selected === true) ? d.x2 : this.cx )
         //.attr("r",  mixRadius )
			   .style("stroke", "black")
			   .transition()       // move ball up into queue
			   .delay( mixSlideDuration)
			   .duration(mixSlideDuration)
		//  .ease(d3.easeCubicIn)
			   .attr("cx",  (d.selected === true) ? d.x2 : this.cx )
			   .attr("cy",  (d.selected === true) ? -100 + i * spacing : this.cy )
		//	  .transition()       // move up to its row
		 //   .delay( mixDuration * 2 * (i + 1.23) )
		//	  .duration(mixDuration)
//			.ease(d3.easeCubicOut)
		//	  .attr("cy",  i *spacing - h/2 + mixRadius)
		//	  .attr("opacity", 1)
			  .style("stroke", "black");
      }
		})
		if(mixReplace === "no")  {
			// note:  the number of circles in the box will decrease with each draw.
      // but I move them out, so no need to remove them
			//mixCircles.filter(d => d.selected).each(function(d,i){
			//	d3.select(this).transition()
      //  		.delay(mixDuration * 2 * (mixSeq[i] + 1.4))
      //  		.attr("opacity", 0)
      //  		.remove;
    	//	} );
    	//for(i=0;i<nDraws;i++){
  		//    ballsInit.splice(mixSeq[i], 1); //remove from the list
		  //}
    }
      textLabels = mixSVG
          .selectAll('g.text')
          .data(mixData)
          .join('text')
          .filter(d => (d.selected === true) )
          .attr('x', d => d.x2 - 30)
          .attr('y', (d, i) => (d.selected === true) ? -97 + i * spacing : d.y )
          .text( d => mixGroups[d.group])
          .style('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
         .attr("opacity",0)
         .attr("font-size", "16px")
        .each(function(d, i) {
           // move the selected ball out
           d3.select(this)
             .transition()
             .delay(mixSlideDuration * 5 + mixDuration * 2*(i + 1.2))
             .attr('opacity', 1);
           });
  // mixText.each(function(d,i){
	// show the label
  //      d3.select(this)
  //        .transition()
  //         .delay( 100+ ( mixSlideDuration + mixDuration) * (i + 1.3) )
  //        .attr("opacity", 1)
  //     ;
  // });
   document.getElementById("repeatMixer").style.display = "block";

}

function turn(j) {// rotate the whole batch of mixCircles
  //mixSVG
  d3.select("#mix_SVG")
    .selectAll("circle")
    .filter( d => (this.cx < 200))
    .transition()
    .delay(mixDuration * (j + (j > 0)* 1.4) *2 )
    .duration(mixDuration )
    .ease(d3.easeCubicOut)
    .attrTween("transform", function(d,i) {
      return d3.interpolateString("rotate( 0, 0, 0)", "rotate(-720, 0, 0)");
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
 	    stdize = function(x) {
		    return x / totalProb;
	    },
	    totalProb = d3.sum(mixNs);

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
        draws = sampleWrep(sequence(1, others + 1.1, 1), times, probs);
        for (i = 0; i < times; i++) {
          mixRepResults.push(draws[i]);
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
          mixSeq = sampleWOrep(ballsInit, mixNballs);
          for(i=0; i < mixNballs; i++){
            mixData[i] = ballsInit[mixSeq[i]];
          }
          for(i=0; i < mixNCat;i++){
            ndxs[i] = mixData.findIndex(function(d) {return d.group == i;})
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
  // TODO   transition more smoothly to outside box, then up
  // TODO  Last draw is not showing
  // TODO  move drawn ball labels to right side. Make sure they work for all methods
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
