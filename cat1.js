// subroutine to estimate a proportion or test for a special value
// Inputs:
//     2 category labels (default = Success/Failure) and a count for each
//
//    TODO: align true proportion better with cue: 'Test: Is the true proportion ='
//    TODO: Using modal div for info is too jumpy. Switch to tooltip

var c1SummDiv = d3.select("#cat1Inference"),
  c1Tstdata,
  c1CIdata,
  cat1Label1,
  cat1Label2,
  cat1ftr,
  cat1hdr,
  cat1CnfLvl = 0.8,
  cat1CLvl,
  cat1lowerBd,
  cat1upperBd,
  cat1N1,
  cat1N2,
  cat1Pval,
  cat1TestDirection,
  cat1TestInpt2,
  c1Data = [],
  c1bars,
  chartC1,
  cat1Bars,
  cat1Color = [],
  confLevels = [
    {
      key: "80%",
      value: "0.80"
    },
    {
      key: "90%",
      value: "0.90"
    },
    {
      key: "95%",
      value: "0.95"
    },
    {
      key: "99%",
      value: "0.99"
    }
  ],
  cat1Inference,
  cat1InfOutput,
  noChoice = "undefined",
  targetQuantile,
  upperBd,
  upperCI,
  cat1Phat,
  resampleC1 = [],
  sampleC1 = [],
  margin = 30,
  padding = 40,
  barHeight = 20,
  w = 300,
  h = 50,
  total;

var svgCat1 = d3.select("#cat1InfSVG");
var cat1SmryUpDiv = d3.select("#cat1SummarySVGgoesHere");

// var cat1BarSvg = cat1SmryUpDiv.append('svg')
//		.attr('width', w + margin * 2)
//		.attr('height', h + margin),
//	  c1x = d3.scaleLinear()
//	   	.domain([0, 1])
//	   	.range([0, w - margin * 2]);

const width = 600;
let dimensions = {
  width: width,
  height: width * 0.5,
  margin: {
    top: 35,
    right: 10,
    bottom: 50,
    left: 50
  }
};
dimensions.boundedWidth =
  dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight =
  dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

function summarizeP1() {
  // builds summary table and plot for 1 categorical variable
  var colors = []; //240

  cat1Label1 = document.getElementById("cat1Label1").value;
  cat1Label2 = document.getElementById("cat1Label2").value;
  cat1N1 = +document.getElementById("cat1N1").value;
  cat1N2 = +document.getElementById("cat1N2").value;
  cat1Phat = cat1N1 / (cat1N1 + cat1N2);
  cat1Summ = document.getElementById("cat1SummaryText");
  document.getElementById("cat1SummarySVGgoesHere").style.display = "block";

  resampleC1 = [];
  sampleC1 = [];

  cat1Summ.innerHTML =
    "p&#770; =  " +
    cat1Phat.toPrecision(4) +
    " <br> se(p&#770) = " +
    (Math.sqrt(cat1Phat * (1 - cat1Phat)) / (cat1N1 + cat1N2)).toPrecision(3);
  cat1Summ.style = "display: block";

  c1Data = [
    {
      label: cat1Label1,
      xx: cat1Phat
    }

    //{	'label' : cat1Label2,		'xx' : 1 - cat1Phat	}
  ];

  if (typeof cat1Bars === "function") {
    cat1Bars.data([cat1Phat]);
  } else {
    cat1Bars = propBarChart()
      .data([cat1Phat])
      .height(100);
    d3.select("#cat1SummarySVGgoesHere").call(cat1Bars);
  }

  //check for any old output plots. If present, erase them due to change in data
  if (cat1InfOutput) {
    c1CIdata = [];

    //cat1BarSvg.selectAll('g').remove();
    document.getElementById("cat1Output").style.display = "none";
    document.getElementById("cat1MoreSims").style.display = "none";
    document.getElementById("cat1ConfLvlInpt").style.display = "none";
    document.getElementById("cat1TestInpt1").style.display = "none";
    document.getElementById("cat1TestInpt2").style.display = "none";
    //document.getElementById("cat1WhichDot").style.display = "none";
  }
}

function cat1CLChange(arg) {
  // set colors for dots to illustrate confidence interval
  var cnfLvl = cat1CnfLvl,
    sC1Len,
    tempColors,
    twoTail;
  if (arg.value) {
    cnfLvl = +arg.value;
  }
  if (c1CIdata) {
    sC1Len = c1CIdata[0].length;
    tempColors = ciColor(c1CIdata[0], cnfLvl);
    if (tempColors[1]) {
      cat1lowerBd = tempColors[1].toPrecision(4);
      cat1upperBd = tempColors[2].toPrecision(4);
      cnfLvl = tempColors[3];
      c1CIdata = [c1CIdata[0], tempColors[0]];
    } else {
      c1CIdata = [c1CIdata[0], tempColors];
    }
    cat1InfOutput = discreteChart(c1CIdata, cat1InfSVG, cat1CIinteract);
    sC1Len = c1CIdata[0].length;
  } //else {
  //  console.log('No resampled data for CI');
  //}
  cat1ftr = document.getElementById("cat1Results");
  cat1ftr.innerHTML = //'<div style = 'height = 10'> </div>' +
    '<div style = "width:360px"> Proportion ' +
    cat1Label1 +
    " in  " +
    sC1Len +
    " Re-samples" +
    "<br> <br>" +
    Math.round(cnfLvl * 100) +
    "% Confidence Interval: (" +
    cat1lowerBd +
    ", " +
    cat1upperBd +
    " )</div> ";
  cat1ftr.style.display = "block";
  document.getElementById("cat1MoreSims").style.display = "block";
}

var cat1CIrangeslide = rangeslide("#cat1ConfLvlInpt", {
  data: confLevels,
  showLabels: true,
  startPosition: 0,
  showTicks: false,
  dataSource: "value",
  labelsContent: "key",
  valueIndicatorContent: "key",
  thumbWidth: 24,
  thumbHeight: 24,
  handlers: {
    valueChanged: [cat1CLChange]
  }
});

function estimateP1() {
  //function to estimate the true proportion based on a sample of 'success/failure' data
  summarizeP1();
  cat1Inference = "estimate";
  // Gather Inputs:
  cat1Label1 = document.getElementById("cat1Label1").value;
  cat1Label2 = document.getElementById("cat1Label2").value;
  cat1N1 = +document.getElementById("cat1N1").value;
  cat1N2 = +document.getElementById("cat1N2").value;
  var CI = [],
    cnfLvl = cat1CnfLvl,
    sC1Len,
    total = cat1N1 + cat1N2;
  cat1Phat = cat1N1 / total;

  cat1hdr = document.getElementById("cat1ConfLvlInpt");
  document.getElementById("cat1TestInpt1").style.display = "none";
  //document.getElementById("cat1WhichDot").style.display = "none";
  cat1hdr.style.display = "block";

  resampleC1 = rbinom(total, cat1Phat, 100).sort(function(a, b) {
    return a - b;
  });
  sC1Len = resampleC1.length;
  for (i = 0; i < sC1Len; i++) {
    resampleC1[i] *= 1 / total;
  }

  CI = ciColor(resampleC1, cat1CnfLvl);
  cat1Color = CI[0];

  c1CIdata = [resampleC1, cat1Color];
  //cat1InfOutput = discreteChart(c1CIdata, cat1InfSVG, cat1CIinteract);

  cat1lowerBd = CI[1].toPrecision(4);
  cat1upperBd = CI[2].toPrecision(4);
  cnfLvl = CI[3];
  cat1ftr = document.getElementById("cat1Results");
  cat1ftr.innerHTML =
    "<div style='width=50px'></div>" +
    "<div style = 'width:360px'> Proportion " +
    cat1Label1 +
    " in  " +
    sC1Len +
    " Re-samples" +
    "<br> <br>" +
    Math.round(cnfLvl * 100) +
    "% Confidence Interval: (" +
    cat1lowerBd +
    ", " +
    cat1upperBd +
    " )</div>";

  cat1ftr.style.display = "block";
  document.getElementById("cat1Output").style.display = "block";
  document.getElementById("cat1MoreSims").style.display = "block";
  //console.log(cat1lowerBd, cat1upperBd);

  return c1CIdata;
}

function testP1(tailChoice) {
  //function to test 'Is the true proportion  = some value?' for 'success/failure' data
  // Gather Inputs:
  cat1Label1 = document.getElementById("cat1Label1").value;
  cat1Label2 = document.getElementById("cat1Label2").value;
  cat1N1 = +document.getElementById("cat1N1").value;
  cat1N2 = +document.getElementById("cat1N2").value;
  summarizeP1();

  cat1hdr = document.getElementById("cat1TestInpt1");
  cat1hdr.style.display = "block";
  cat1ftr = document.getElementById("cat1Results");

  cat1Pnull = +document.getElementById("cat1trueP").value;
  // turn off Confidence interval, turn on test inputs
  document.getElementById("cat1ConfLvlInpt").style.display = "none";
  //document.getElementById("cat1WhichDot").style.display = "none";

  var sC1Len,
    total = cat1N1 + cat1N2;

  cat1TestInpt2 = document.getElementById("cat1TestInpt2");
  cat1TestInpt2.style.display = "block";
  cat1TestInpt2.innerhtml =
    "  <div class = 'w3-cell' style = 'width:50%'> Stronger evidence is a proportion </div>" +
    " <div class = 'w3-cell' > " +
    " <select class = 'w3-select w3-card w3-border w3-mobile w3-pale-yellow' id='cat1Extreme'" +
    "    onchange = 'cat1TestUpdate()' >" +
    " 	<option value='lower'>Less Than or =</option>" +
    " 	<option value='both' selected >As or More Extreme Than</option>" +
    " 	<option value='upper'>Greater Than or =</option>" +
    " </select> </div>  <div class ='w3-cell'> &nbsp;&nbsp;" +
    cat1Phat.toPrecision(4) +
    " (from above)	   	</div>";

  if (tailChoice === "undefined") {
    cat1ftr = document.getElementById("cat1Results");
    cat1ftr.innerHTML =
      "<div  style = 'width:320px'> Proportion " +
      cat1Label1 +
      " in samples from H<sub>0</sub>";
    sampleC1 = rbinom(total, cat1Pnull, 100).sort(function(a, b) {
      return a - b;
    });
    sC1Len = sampleC1.length;
    for (i = 0; i < sC1Len; i++) {
      sampleC1[i] *= 1 / total;
    }
  } else {
  }
  cat1ftr.style.display = "block";
  document.getElementById("cat1Output").style.display = "block";
  document.getElementById("cat1MoreSims").style.display = "block";
  // TODO: clicking a point changes a table to show that proportion
  return sampleC1;
}

function cat1TestUpdate() {
  // run whenever tail direction changes
  var check,
    extCount = 0,
    lowP,
    hiP,
    sC1Len;
  cat1Inference = "test";
  // get direction of evidence:
  cat1TestDirection = document.getElementById("cat1Extreme").value;

  if (!sampleC1) {
    sampleC1 = testP1();
  }
  sC1Len = sampleC1.length;
  if (cat1TestDirection === "lower") {
    for (i = 0; i < sC1Len; i++) {
      check = 0 + (sampleC1[i] <= cat1Phat);
      extCount += check;
      cat1Color[i] = check;
    }
  } else if (cat1TestDirection === "upper") {
    for (i = 0; i < sC1Len; i++) {
      check = 0 + (sampleC1[i] >= cat1Phat);
      extCount += check;
      cat1Color[i] = check;
    }
  } else {
    lowP =
      cat1Phat * (cat1Phat <= cat1Pnull) +
      (2 * cat1Pnull - cat1Phat) * (cat1Phat > cat1Pnull) +
      1 / 1000000;
    hiP =
      cat1Phat * (cat1Phat >= cat1Pnull) +
      (2 * cat1Pnull - cat1Phat) * (cat1Phat < cat1Pnull) -
      1 / 1000000;
    for (i = 0; i < sC1Len; i++) {
      check = 0 + ((sampleC1[i] <= lowP) | (sampleC1[i] >= hiP));
      extCount += check;
      cat1Color[i] = check;
    }
  }
  //console.log(d3.sum(cat1Color));
  cat1Pval = extCount / sC1Len;
  c1Tstdata = [sampleC1, cat1Color];
  cat1InfOutput = discreteChart(c1Tstdata, cat1InfSVG, cat1TestInteract);

  cat1ftr = document.getElementById("cat1Results");
  cat1ftr.innerHTML =
    "<div  style = 'width:320px'> Proportion " +
    cat1Label1 +
    " in " +
    sC1Len +
    " Samples from H<sub>0</sub> <br>" +
    "p-value (strength of evidence): " +
    formatPvalue(extCount, sC1Len) +
    "</div>";
  //
  //cat1ftr.style.display = 'block';
  document.getElementById("cat1MoreSims").style.display = "block";
}

function cat1CIinteract(d, i) {
  // function (passed to graphical elements) to
  // open tooltip to show success and failure counts in the selected sample;

  //var cat1Tooltip = document.getElementById("cat1WhichDot");
  var cat1TooltipContent = document.getElementById("cat1SelectedSample");
  cat1TooltipContent.innerHTML =
    "Proportion " +
    c1Data[0].label +
    ":  p&#770; =  " +
    c1CIdata[0][i].toPrecision(4);
}

function cat1TestInteract(d, i) {
  // open Tooltip box to show success and failure counts in the selected sample;
  //var cat1Tooltip = document.getElementById("cat1WhichDot"),
  var  cat1TooltipContent = document.getElementById("cat1SelectedSample"),
    prop;
  cat1Tooltip.style.display = "block";
  if (c1Tstdata.length === 2) {
    prop = c1Tstdata[0][i];
  } else {
    prop = c1Tstdata[i];
  }
  cat1TooltipContent.innerHTML =
    "Proportion " +
    c1Data[0].label +
    ":  p&#770; =  " +
    prop.toPrecision(4) +
    "<br> Click to Close";
  // open box to show success and failure counts in the selected resample;
}

//-------------------------------------------------------------------//
//                                                                   //
//                          MAKE TOOLTIP                             //
//                                                                   //
//  from https://riptutorial.com/d3-js/example/30311/scatter-plot    //
//-------------------------------------------------------------------//
function make_tooltip(obj, text_array, chart_group, canvas, margins) {
  // get the x and y coordinates of the object to apply tooltip too
  var x = obj.node().transform.baseVal.consolidate().matrix.e
  var y = obj.node().transform.baseVal.consolidate().matrix.f

  // for convenience
  var tooltip_config =charts_config.plot_attributes.tooltip
  var sep = tooltip_config.default_seperation_from_object

  // Add the tooltip to the chart and as a child - the text group
  var tooltip = chart_group.append("g").attr("class", "tooltip_group")
  var text_group = tooltip.append("g").attr("class", "tooltip_text_group")

  // Add text in reverse order placing low to high
  text_array.reverse()
  for (var i = 0; i < text_array.length; i++) {
    var text = text_group.append("text")
                        .text(text_array[i])
                        .attr("font-size", tooltip_config.size)
                        .attr("text-anchor", "middle")
                        .attr("x", x)
                        .attr("y", y - sep - tooltip_config.curve - (i * tooltip_config.size))
                        .attr("class", "tooltipText")
                        .attr("fill", tooltip_config.emphasis)
                        .attr("font-family", tooltip_config.family)
                        .attr("font-weight", "normal")

    // The first line in the tooltip gets different coloration
    if (i < text_array.length - 1) {
        text.attr("fill", tooltip_config.text)
            .attr("font-family", tooltip_config.family)
            .attr("font-weight", "normal")
    }
  }

  // Make the bubble around the text
  var bubble = tooltip.append("path")
                      .attr("d", make_tooltip_bubble(text_group))
                      .attr("fill", tooltip_config.fill)
                      .attr("stroke", tooltip_config.stroke)
                      .attr("opacity", tooltip_config.opacity)

  // Text goes in front of the box
  text_group.raise()

  // Get the bounding box of the bubble
  var bubble_box = bubble.node().getBBox()

  // Calculate the limits to contain the tooltip
  var limits = {
    "top": margins.y.top + margins.buttons + margins.title,
    "bottom": canvas.y - margins.axes.x - margins.y.bottom,
    "left": margins.x.left + margins.axes.y,
    "right": canvas.x - margins.x.right
  }

  // Get the boundaries of the object
  var object_boundaries = {
    "left": x,
    "right": x + obj.node().getBBox().width,
    "top": y,
    "bottom": y + obj.node().getBBox().height
  }

  // Calculate putative tooltip placements
  var tooltip_placements = {
    "upper_left": {"x": object_boundaries.left - bubble_box.width - sep, "y":object_boundaries.top - bubble_box.height - sep},
    "upper_right": {"x":object_boundaries.right + sep, "y": object_boundaries.top - bubble_box.height - sep},
    "lower_left": {"x":object_boundaries.left - bubble_box.width - sep, "y": object_boundaries.bottom + sep},
    "lower_right": {"x":object_boundaries.right + sep, "y":object_boundaries.bottom + sep}
  }

  // Figure out which placements fall within the limits
  var valid_placments = {
    "upper_left": {"x": tooltip_placements.upper_left.x > limits.left, "y":  tooltip_placements.upper_left.y > limits.top},
    "upper_right": {"x": tooltip_placements.upper_right.x + bubble_box.width < limits.right, "y": tooltip_placements.upper_right.y > limits.top},
    "lower_left": {"x": tooltip_placements.lower_left.x > limits.left, "y": tooltip_placements.lower_left.y + bubble_box.height < limits.bottom},
    "lower_right": {"x": tooltip_placements.lower_right.x + bubble_box.width < limits.right, "y": tooltip_placements.lower_right.y + bubble_box.height < limits.bottom}
  }

  var placements = keys(valid_placments)
  var tooltip_placement
  for (var i = 0; i < placements.length; i++) {
    var current_placement = valid_placments[placements[i]]
    if (current_placement.x && current_placement.y) {
      tooltip_placement = tooltip_placements[placements[i]]
      break
    }
  }

  // Reposition the tooltip to its correct location
  tooltip.attr("transform", "translate("+(tooltip_placement.x - bubble_box.x)+","+(tooltip_placement.y - bubble_box.y)+")")
}

function transform_values(selection) {
  return {
    "x": selection.node().transform.baseVal.consolidate().matrix.e,
    "y": selection.node().transform.baseVal.consolidate().matrix.f
  }
}

function make_tooltip_bubble(text_group) {
  var textBox = text_group.node().getBBox()
  var x = textBox.x
  var y = textBox.y
  var width = textBox.width
  var height = textBox.height

  var point = charts_config.plot_attributes.tooltip.point
  var curve = charts_config.plot_attributes.tooltip.curve

  // Start at bottom center and work around left - up - right - down - close
  d = "M " + (x + width / 2) + " " + (y + height + curve)
  // go left
  d += "l -" + (width / 2) + " 0 "
  // curve left and up
  d += "q -" + curve + " 0 -" + curve + " -" + curve + " "
  // go up
  d += "l 0 -" + (height) + " "
  // curve up and right
  d += "q 0 -" + curve + " " + curve + " -" + curve + " "
  // go right
  d += "l " + (width) + " 0 "
  // curve right and down
  d += "q " + curve + " 0 " + curve + " " + curve + " "
  // go down
  d += "l 0 " + (height) + " "
  //  curve down and left
  d += "q 0 " + curve + " -" + curve + " " + curve + " "
  // go left
  d += "l -" + (width / 2) + " 0 "
  // close
  d += " z"
  return d
}

// ***************************************************************//
//  End of code from riptutorial.com                              //
//                                                                //
//  **************************************************************//

function cat1MoreSimFn() {
  // function to add more points to an estimate or test of one proportion
  var sC1Len,
    more = +document.getElementById("cat1More").value,
    newValues = [];
  //document.getElementById("cat1WhichDot").style.display = "none";
  if (more > 0) {
    total = cat1N1 + cat1N2;
    cat1Phat = cat1N1 / total;

    if (cat1Inference === "test") {
      newValues = rbinom(total, cat1Pnull, more);
      for (i = 0; i < more; i++) {
        sampleC1.push(newValues[i] / total);
      }
      sampleC1 = sampleC1.sort(function(a, b) {
        return a - b;
      });
      cat1TestUpdate();
      //cat1InfOutput = discreteChart(sampleC1, cat1InfSVG, cat1TestInteract );
      return sampleC1;
    } else {
      newValues = rbinom(total, cat1Phat, more);
      for (i = 0; i < more; i++) {
        resampleC1.push(newValues[i] / total);
      }
      resampleC1 = resampleC1.sort(function(a, b) {
        return a - b;
      });
      cat1CLChange({
        value: cat1CnfLvl
      });

      return resampleC1;
    }
  }
}
