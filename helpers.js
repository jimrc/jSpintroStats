
/*eslint quotes: [2, "double", "avoid-escape"]*/
// Turning pages and elements on or off

function toggleContent1() {
  // Get the DOM reference
  var contentId = document.getElementById("getcat1Data");

  // Toggle
  contentId.style.display == "block"
    ? (contentId.style.display = "none")
    : (contentId.style.display = "block");
}

// functions to provide same utilities as R does

function cut(input, dividers) {
  var i;
  dividers = dividers.sort(function(a, b) {
    return a - b;
  });
  if ((input < dividers[0]) | (input > dividers[dividers.length - 1])) {
    return NaN;
  }
  for (i = 1; i < dividers.length; i++) {
    if (input <= dividers[i]) {
      return i - 1;
      break;
    }
  }
  return i - 1; // index to the category split by dividers
}

function rle(x) {
  var i,
    current = 0,
    label = [],
    run = [];
  label[0] = x[0];
  run[0] = 1;
  for (i = 1; i < x.length; i++) {
    if (x[i] === x[i - 1]) {
      run[current] += 1;
    } else {
      current += 1;
      label[current] = x[i];
      run[current] = 1;
    }
  }
  return [
    {
      runs: run
    },
    {
      labels: label
    }
  ];
}

function rgeom(prob) {
  return Math.ceil(Math.log(Math.random()) / Math.log(1 - prob));
}

function rbern(reps, prob) {
  var i,
    results = [];
  for (i = 0; i < reps; i++) {
    results.push(Math.random() > prob ? 0 : 1);
  }
  return results;
}

function rbinom(n, prob, times) {
  //return a random count of number of successes in n trials with prob = prob of success for each
  // make a matrix of Bernoullis with n rows, times columns, ans sum over rows
  var i,
    results = [];
  for (i = 0; i < times; i++) {
    results.push(d3.sum(rbern(n, prob)));
  }
  return results;
}

function repeat(x, n) {
  var out = [];
  for (i = 0; i < n; i++) {
    out.push(x);
  }
  return out;
}

function sequence(start, stop, inc) {
  var i,
    out = [];
  for (i = start; i < stop; i += inc) {
    out.push(i);
  }
  return out;
}

function resample1Mean(values, nreps) {
  //take resamples of values with replacement (nreps times), return the mean of each
  var cumProb = [],
    nVals = values.length,
    prob = repeat(1 / nVals, nVals),
    i,
    j,
    k,
    out = [],
    resamples = [],
    totalProb = 1;
  cumProb = jStat.cumsum(prob);
  cumProb.unshift(0);
  for (i = 0; i < nreps; i++) {
    resamples = [];
    for (j = 0; j < nVals; j++) {
      k = cut(Math.random(), cumProb);
      resamples.push(values[k]);
    }
    out[i] = d3.mean(resamples);
  }
  //console.log(out);
  // return the vector of means
  return out;
}

function resampleDiffMeans(values1, values2, nreps) {
  //take resamples of each set of values with replacement (nreps times),
  // returns a 3-item object: means1, means2 and the difference in means
  // each of length nreps
  var cumProb1 = [],
    cumProb2 = [],
    diff = [],
    i,
    j,
    k,
    mean1 = [],
    mean2 = [],
    out = [],
    nVals1 = values1.length,
    prob1 = repeat(1 / nVals1, nVals1),
    nVals2 = values2.length,
    prob2 = repeat(1 / nVals2, nVals2),
    resamples = [],
    totalProb = 1;

  cumProb1 = jStat.cumsum(prob1);
  cumProb1.unshift(0);
  cumProb2 = jStat.cumsum(prob2);
  cumProb2.unshift(0);
  for (i = 0; i < nreps; i++) {
    resamples = [];
    for (j = 0; j < nVals1; j++) {
      k = cut(Math.random(), cumProb1);
      resamples.push(values1[k]);
    }
    mean1.push(d3.mean(resamples));
    resamples = [];
    for (j = 0; j < nVals2; j++) {
      k = cut(Math.random(), cumProb2);
      resamples.push(values2[k]);
    }
    mean2.push(d3.mean(resamples));
    diff.push(mean1[i] - mean2[i]);
  }
  out = { diff: diff, mean1: mean1, mean2: mean2 };
  //console.log(out);
  // return the vector of mean diffs and means
  return out;
}

function sample1(nItems) {
  // draw  one value assuming each is equally likely
  return Math.floor(Math.random() * nItems);
}

function sampleWOrep(values, nreps) {
  var i,
    k,
    len = values.length,
    ids = [],
    out = [];
  var seq1 = sequence(0, len - 1, 1);
  nreps = Math.min(nreps, len); // can't draw more than the number of values
  for (i = 0; i < nreps; i++) {
    k = sample1(seq1.length);
    //console.log(k, seq1[k]);
    ids.push(seq1[k]);
    out.push(values[seq1[k]]);
    seq1.splice(k, 1); // remove kth element and repeat as needed
    //console.log(seq1);
  }
  //console.log(out);
  // return the values in sampled order and their ids or positions in the original list
  return [out, ids];
}

function sampleN(values, nreps) {
  // sample nreps with replacement from values assuming equal weights
  var i,
    k,
    len = values.length,
    out = [];

  for (i = 0; i < nreps; i++) {
    k = Math.floor(Math.random() * len);
    out.push(values[k]);
  }
  //console.log(out);
  return out;
}

function sampleWrep(values, nreps, prob) {
  // draw  values  (with replacement) at random using probs as weights
  var cumProb = [],
    nCat = prob.length,
    totalProb = jStat.sum(prob),
    i,
    k,
    ids = [],
    out = [];
  stdize = function(x) {
    return x / totalProb;
  };
  prob = jStat.map(prob, stdize);
  cumProb = jStat.cumsum(prob);
  cumProb.unshift(0);
  //console.log(cumProb);
  for (i = 0; i < nreps; i++) {
    k = cut(Math.random(), cumProb);
    out.push(values[k]);
    ids.push(k);
  }
  //console.log(out);
  // return the values in sampled order and their ids or positions in the original list
  return [out, ids];
}

function inArray(array, value) {
  var i = array.length;
  while (i--) {
    if (array[i] === value) {
      return true;
    }
  }
  return false;
}

function indexOfXY(array, X, Y) {
  var xIndx = [],
    yIndx = [];
  xIndx = array.findIndex(i => i.x === X);
  yIndx = array.findIndex(i => i.y === Y);
  if (xIndx.length == 1) {
    return xIndx;
  } else if (yIndx.length == 1) {
    return yIndx;
  } // X,Y pairs are unique
  return yIndx.filter(function(d) {
    return inArray(xIndx, d);
  });
}

function sturgesFormula(arr) {
  // number of bins for a histogram
  var n = arr.length;
  var k = Math.ceil(Math.log(n) / Math.log(2) + 1);
  var h = (d3.max(arr) - d3.min(arr)) / k; // length of each bin
  return { binCount: k, binLength: h };
}

function formatPvalue(extremeCount, reps) {
  if (extremeCount === 0) {
    return "Less than 1/" + reps;
  } else {
    return (extremeCount / reps).toPrecision(4);
  }
}
//
//  Need a generic plotting function for dotcharts.
//

function dbl_histodot(sample, colors, labels, svgObject, interactFunction) {
  // stacks dots up creating integer y values (1, 2, 3,...) for x value within a "bin" of similar values
  // builds a d3 svg plot in the svg object which will respond to a mouse-click by calling
  //  interactFunction on that point
  // input: sample is of length 2 containing (1) x values and (2) color indices
  //         or it could just be the data -- and color will default to black
  // returns: Dots (svg objects) and the original sample
  var circleColors = ["steelblue", "red"],
    i = 0,
    j = 0,
    leftX1,
    leftX2,
    margin = 40,
    myArray = sample,
    nN = sample.length,
    nN1,
    nN2,
    ordering = [],
    radii,
    xbinWidth,
    xmin,
    xmax,
    ypos = 0,
    ypos2 = 0,
    wdth = 440 - margin * 2,
    hght = 320 - margin * 2;
  nN2 = d3.sum(colors);
  nN1 = nN - nN2;
  //console.log(nN1, nN2, sample);

  if (svgObject.getAttribute("width") > 50) {
    wdth = svgObject.getAttribute("width") - margin * 2;
    hght = svgObject.getAttribute("height") - margin * 2;
  }
  if (colors === undefined) {
    colors = repeat(0, nN);
  }
  // need to keep colors aligned with sample values

  //myArray.sort(function(a, b){return a.x - b.x}) ;
  // numeric sort to build bins for y values
  // start on left with smallest x.

  xmin = d3.min(sample);
  xmin *= xmin <= 0 ? 1.01 : 0.99;
  xmax = d3.max(sample);
  xmax *= xmax >= 0 ? 1.01 : 0.99;

  var radii = nN < 101 ? 10 : nN < 501 ? 7 : nN < 1001 ? 5 : nN < 5001 ? 4 : 3; // perhaps this should relate to width/height of svg]
  var gees = d3.select(svgObject).selectAll("g");
  if (typeof gees === "object") {
    gees.remove();
  }
  xbinWidth = (xmax - xmin) / (wdth / radii); //sturgesFormula(myArray).binLength;
  // console.log(xbinWidth);
  //  first dot goes at y=1, then add one to each from there
  j = 0;
  ypos = 1; // y value is a count starting at 1
  leftX1 = leftX2 = d3.min(sample);
  sampMax = 1;
  // assume first nN1 and last nN-nN1 are sorted in sample order
  // run through the first batch, setting yposition values in the stack of dots
  while (j < nN - nN2) {
    if (Math.abs(sample[j] - leftX1) > xbinWidth) {
      leftX1 = sample[j]; // start a fresh bin with left edge at sample[j] xvalue
      if (ypos > sampMax) {
        sampMax = ypos;
      } // only check max y height at right edge of each bin
      ypos = 1;
    }
    myArray[j] = { x: sample[j], y: ypos++, color: colors[j++] };
  }
  // run through the remaining samples from group 2. ypos should be stepped up

  ypos2 = sampMax + 2; // y value for a 2nd tier  all should all be > those above
  ypos = ypos2;
  j = nN1;
  while (j < nN) {
    if (Math.abs(sample[j] - leftX2) > xbinWidth) {
      //console.log(xbinWidth, ypos);
      leftX2 = sample[j]; // start a fresh bin with left edge at sample[j] xvalue
      if (sampMax < ypos) {
        sampMax = ypos;
      } // only check max y height at right edge of each bin
      ypos = ypos2;
    }
    myArray[j] = { x: sample[j], y: ypos++, color: colors[j++] };
  }
  //console.log(myArray);
  sampMax = d3.max(myArray, function(d) {
    return d.y;
  });

  var DCyScale = d3
    .scaleLinear()
    .range([hght, 0])
    .domain([1, sampMax + 0.5]);

  var DCxScale = d3
    .scaleLinear()
    .range([margin, wdth - margin / 2])
    .domain([xmin, xmax]);

  // change scales to hold all x, all y
  var DCxAxis = d3.axisBottom(DCxScale).ticks(5);

  // var DCyAxis = d3.axisLeft(DCyScale)
  //  .ticks(0);

  var graph = d3
    .select(svgObject)
    .attr("width", wdth + margin * 2)
    .attr("height", hght + margin * 2)
    .append("g")
    .attr("transform", "translate(" + 2 * margin + "," + margin + ")");

  //graph.append("g")
  //.attr("class", "y axis")
  //.call(DCyAxis);

  graph
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (radii + hght) + ")")
    .call(DCxAxis);

  graph
    .append("g")
    .attr("class", "x axis")
    .attr(
      "transform",
      "translate(0," + DCyScale(myArray[nN1].y - 0.5) + radii + ")"
    )
    .call(DCxAxis);

  Dots = graph.selectAll("g.circle").data(myArray);
  Dots.enter()
    .append("circle")
    .attr("cx", function(d) {
      return DCxScale(d.x);
    })
    .attr("r", radii)
    .attr("cy", function(d) {
      return DCyScale(d.y);
    })
    .style("fill", function(d) {
      return circleColors[d.color];
    })
    .style("fill-opacity", 0.6)
    .on("click", interactFunction);

  return [Dots, myArray];
}

function histodot(sample, colors, svgObject, interactFunction) {
  // stacks dots up creating integer y values (1, 2, 3,...) for x value within a "bin" of similar values
  // builds a d3 svg plot in the svg object which will respond to a mouse-click by calling
  //  interactFunction on that point
  // input: sample is the x values. If color is missing, color will default to black
  // returns: Dots (svg objects) and the original sample
  var circleColors = ["steelblue", "red"],
    i = 0,
    j = 0,
    leftX,
    margin = 40,
    myArray = sample,
    nN = sample.length,
    ordering = [],
    radii,
    xbinWidth,
    xmin,
    xmax,
    ypos = 0,
    wdth = 440 - margin * 2,
    hght = 320 - margin * 2;

  if (svgObject.getAttribute("width") > 50) {
    wdth = svgObject.getAttribute("width") - margin * 2;
    hght = svgObject.getAttribute("height") - margin * 2;
  }
  if (colors === undefined) {
    colors = repeat(0, nN);
  }
  // need to keep colors aligned with sample values

  xmin = d3.min(sample);
  xmin *= xmin <= 0 ? 1.01 : 0.99;
  xmax = d3.max(sample);
  xmax *= xmax >= 0 ? 1.01 : 0.99;

  var radii = nN < 101 ? 10 : nN < 501 ? 7 : nN < 1001 ? 5 : nN < 5001 ? 4 : 3; // perhaps this should relate to width/height of svg]
  var gees = d3.select(svgObject).selectAll("g");
  if (typeof gees === "object") {
    gees.remove();
  }
  xbinWidth = (xmax - xmin) / (wdth / radii); //sturgesFormula(myArray).binLength;
  // console.log(xbinWidth);
  //  first dot goes at y=1, then add one to each from there
  j = 0;
  ypos = 1; // y value is a count starting at 1
  leftX = xmin;
  sampMax = 1;
  // assume sample is sorted
  while (j < nN) {
    if (Math.abs(sample[j] - leftX) > xbinWidth) {
      leftX = sample[j]; // start a fresh bin with left edge at sample[j] xvalue
      if (ypos > sampMax) {
        sampMax = ypos;
      } // only check max y height at right edge of each bin
      ypos = 1;
    }
    myArray[j] = { x: sample[j], y: ypos++, color: colors[j++] };
  }
  sampMax = d3.max(myArray, function(d) {
    return d.y;
  });

  var DCyScale = d3
    .scaleLinear()
    .range([hght, 0])
    .domain([1, sampMax + 0.5]);

  var DCxScale = d3
    .scaleLinear()
    .range([margin, wdth - margin / 2])
    .domain([xmin, xmax]);

  // change scales to hold all x, all y
  var DCxAxis = d3.axisBottom(DCxScale).ticks(5);

  var DCyAxis = d3.axisLeft(DCyScale).ticks(0);

  var graph = d3
    .select(svgObject)
    .attr("width", wdth + margin * 2)
    .attr("height", hght + margin * 2)
    .append("g")
    .attr("transform", "translate(" + 2 * margin + "," + margin + ")");

  graph
    .append("g")
    .attr("class", "y axis")
    .call(DCyAxis);

  graph
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (radii + hght) + ")")
    .call(DCxAxis);

  Dots = graph.selectAll("g.circle").data(myArray);
  Dots.enter()
    .append("circle")
    .attr("cx", function(d) {
      return DCxScale(d.x);
    })
    .attr("r", radii)
    .attr("cy", function(d) {
      return DCyScale(d.y);
    })
    .style("fill", function(d) {
      return circleColors[d.color];
    })
    .style("fill-opacity", 0.6)
    .on("click", interactFunction);

  //return [Dots, sample];
}

function discreteChart(sample, svgObject, interactFunction) {
  // stacks dots up creating integer y values (1, 2, 3,...) for each unique x value
  // builds a d3 svg plot in the svg object which will respond to a mouse-click by calling
  //  interactFunction on that point
  // returns: Dots (svg objects) and the original sample
  var circleColors = ["steelblue", "red"],
    color = [],
    margin = 40,
    myArray = [],
    nN = sample.length,
    plotX,
    ypos = 1,
    xmin,
    xmax,
    wdth = 440 - margin * 2,
    hght = 320 - margin * 2;
  if (svgObject.getAttribute("width") > 50) {
    wdth = svgObject.getAttribute("width") - margin * 2;
    hght = svgObject.getAttribute("height") - margin * 2;
  }
  if (nN === 2) {
    color = sample[1];
    sample = sample[0];
    nN = sample.length;
  }

  sample.sort(function(a, b) {
    return a - b;
  });
  // numeric sort to build bins for y values
  // start on left with smallest x.

  xmin = sample[0];
  xmin *= sample[0] <= 0 ? 1.01 : 0.99;
  xmax = sample[nN - 1];
  xmax *= sample[nN - 1] >= 0 ? 1.01 : 0.99;
  // console.log([xmin,sample[0], sample[nN-1], xmax])

  var radii = nN < 101 ? 10 : nN < 501 ? 7 : nN < 1001 ? 5 : nN < 5001 ? 4 : 3; // perhaps this should relate to width/height of svg]
  var gees = d3.select(svgObject).selectAll("g");
  if (typeof gees === "object") {
    gees.remove();
  }
  //  first dot goes at y=0, then add one to each from there
  var j = 0;
  while (j < nN) {
    plotX = sample[j]; // start a fresh bin with left edge at sample[j]
    ypos = 1; // bin y starts at 1
    myArray[j] = { x: sample[j], y: ypos++, color: circleColors[color[j++]] };
    while ((sample[j] === sample[j - 1]) & (j <= nN)) {
      //stay in same bin -- increment yposition
      myArray[j] = { x: sample[j], y: ypos++, color: circleColors[color[j++]] };
    }
    // console.log(x(plotX));
  }
  //myArray[nN-1].color = circleColors[1];

  sampMax = d3.max(myArray, function(d) {
    return d.y;
  });

  var DCyScale = d3
    .scaleLinear()
    .range([hght, 0])
    .domain([0, sampMax + 0.5]);

  var DCxScale = d3
    .scaleLinear()
    .range([margin, wdth - margin / 2])
    .domain([xmin, xmax]);

  // change scales to hold all x, all y
  var DCxAxis = d3.axisBottom(DCxScale).ticks(5);

  //   d3.selectAll(".xAxis>.tick>text")
  //	.each(function(d, i){
  //  	d3.select(this).style("font-size","10px");
  //	});

  var DCyAxis = d3.axisLeft(DCyScale);

  var graph = d3
    .select(svgObject)
    .attr("width", wdth + margin * 2)
    .attr("height", hght + margin * 2)
    .append("g")
    .attr("transform", "translate(" + 2 * margin + "," + margin + ")");

  graph
    .append("g")
    .attr("class", "y axis")
    .call(DCyAxis);

  graph
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (radii + hght) + ")")
    .call(DCxAxis);

  //  graph.append("g")
  //  	.attr("class", "text")
  //  	.attr("x", 20)
  //  	.attr("y", hght + 5)
  //  	.text(xlegend);

  Dots = graph.selectAll("g.circle").data(myArray);
  Dots.enter()
    .append("circle")
    .attr("cx", function(d) {
      return DCxScale(d.x);
    })
    .attr("r", radii)
    .attr("cy", function(d) {
      return DCyScale(d.y);
    })
    .style("fill", function(d) {
      return d.color;
    })
    .style("fill-opacity", 0.6)
    .on("click", interactFunction);
  return [Dots, sample];
}

function ciColor(resample, cnfLvl) {
  // changes colors for CI illustration
  var color = [],
    lowerBd,
    upperBd,
    quantile,
    twoTail,
    sLen = resample.length;
  resample = resample.sort(function(a, b) {
    return a - b;
  });
  if (sLen > 0) {
    twoTail = Math.round((1 - cnfLvl) * sLen);
    quantile = Math.floor(twoTail / 2);
    if (twoTail % 2) {
      // check for odd number
      cnfLvl = (sLen - twoTail - 1) / sLen;
      quantile += 1;
      // reduce to lower confidence
    }

    for (i = quantile; i < sLen - quantile; i++) {
      color[i] = 0;
      // color for middle circles
    }
    for (i = 0; i < quantile; i++) {
      color[i] = 1;
      // color lower tail
      color[sLen - i - 1] = 1;
      // color upper tail
      lowerBd = resample[i];
      // move lowerBd up
      upperBd = resample[sLen - i - 1];
      // move upperBd down
    }
  } else {
    console.log("No Data for CI");
  }
  return [color, lowerBd, upperBd, cnfLvl];
}

function propBarChart() {
  // updatable chart to show proportion bars
  //TODO:  add text labels (y axis?) for multiple bars
  // thanks to Rob Moore https://www.toptal.com/d3-js/towards-reusable-d3-js-charts
  // All options that should be accessible to caller
  var data = [];
  var width = 400;
  var height = 100;
  var fillColor = "steelblue";
  //var updateData;

  var barPadding = 1,
    margin = 10;
  var xScale = d3
    .scaleLinear()
    .range([0, width - 2 * margin])
    .domain([0, 1]);

  function chart(selection) {
    selection.each(function() {
      var barSpacing = height / (data.length + 1);
      var barHeight = barSpacing - barPadding;

      var myDiv = d3.select(this);
      var svg = myDiv
        .append("svg")
        .attr("class", "bar-chart")
        .attr("height", height + margin)
        .attr("width", width)
        .style("fill", fillColor);

      var bars = svg
        .append("g")
        .attr("transform", "translate(" + margin + ", 0)")
        .selectAll("rect.display-bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "display-bar")
        .attr("y", function(d, i) {
          return i * barSpacing;
        })
        .attr("height", barHeight)
        //.attr("transform", "translate(" +margin +",0)")
        .attr("x", margin)
        .attr("width", function(d) {
          return xScale(d);
        });

      var xAxis = d3.axisBottom(xScale).ticks(5);

      svg
        .append("g")
        .attr("class", "xaxis")
        .attr(
          "transform",
          "translate(" + 2 * margin + "," + (barSpacing * data.length + 2) + ")"
        )
        .call(xAxis);

      // update functions
      updateWidth = function() {
        //xScale.range([0, width-margin]);
        //widthScale = width;
        bars
          .transition()
          .duration(1000)
          .attr("width", function(d) {
            return xScale(d);
          });
        svg
          .transition()
          .duration(1000)
          .attr("width", width);
      };

      updateHeight = function() {
        barSpacing = height / (data.length + 1);
        barHeight = barSpacing - barPadding;
        bars
          .transition()
          .duration(1000)
          .attr("y", function(d, i) {
            return i * barSpacing;
          })
          .attr("height", barHeight);
        svg
          .transition()
          .duration(1000)
          .attr("height", height);
        //svg.selectAll('xaxis')
        //.transition().duration(1000).attr('y', barSpacing * data.length + 2);
      };

      updateFillColor = function() {
        svg
          .transition()
          .duration(1000)
          .style("fill", fillColor);
      };

      updateData = function() {
        barSpacing = height / (data.length + 1);
        barHeight = barSpacing - barPadding;

        var update = svg.selectAll("rect.display-bar").data(data);

        update
          .transition()
          .duration(500)
          .attr("y", function(d, i) {
            return i * barSpacing;
          })
          .attr("height", barHeight)
          .attr("x", margin)
          .attr("width", function(d) {
            return xScale(d);
          });

        update
          .enter()
          .append("rect")
          .attr("class", "display-bar")
          .attr("y", function(d, i) {
            return i * barSpacing;
          })
          .attr("height", barHeight)
          .attr("x", margin)
          .attr("width", 0)
          .style("opacity", 0)
          .transition()
          .duration(500)
          .delay(function(d, i) {
            return (data.length - i) * 40;
          })
          .attr("width", function(d) {
            return xScale(d);
          })
          .style("opacity", 1);

        update
          .exit()
          .transition()
          .duration(350)
          .delay(function(d, i) {
            return (data.length - i) * 20;
          })
          .style("opacity", 0)
          .attr("height", 0)
          .attr("x", margin)
          .attr("width", 0)
          .remove();
      };
    });
  }
  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    if (typeof updateWidth === "function") updateWidth();
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    if (typeof updateHeight === "function") updateHeight();
    return chart;
  };

  chart.fillColor = function(value) {
    if (!arguments.length) return fillColor;
    fillColor = value;
    if (typeof updateFillColor === "function") updateFillColor();
    return chart;
  };

  chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    if (typeof updateData === "function") updateData();
    return chart;
  };

  return chart;
}

//  var dataA = [.45,1], dataB = [.06,1],
//      updatableChart = propBarChart().data(dataA);
//        d3.select('#cat1SummarySVGgoesHere').call(updatableChart);
// updatableChart.data(dataB);

/* global d3 */

function scatterPlot(data, svgObject, interactFunction, intercept, slope) {
  // not updateable
  var circleColors = ["steelblue", "red"],
    color = [],
    margin = 40,
    myArray = [],
    nN = data.length,
    ordering = [],
    plotX,
    regLine,
    xmin = d3.min(data, function(d) {
      return d.x;
    }),
    xmax = d3.max(data, function(d) {
      return d.x;
    }),
    yhat1,
    yhat2,
    wdth = 440 - margin * 2,
    hght = 320 - margin * 2;
  if (svgObject.getAttribute("width") > 50) {
    wdth = svgObject.getAttribute("width") - margin * 2;
    hght = svgObject.getAttribute("height") - margin * 2;
  }
  if (nN === 2) {
    color = data[1];
    sample = data[0];
    nN = data.length;
  }
  ordering = sequence(0, nN - 1, 1); // used if we need colors in the scatterplot -- matched to points

  var xScale = d3
      .scaleLinear()
      .range([margin, width - 3 * margin])
      .domain([xmin, xmax]),
    yScale = d3
      .scaleLinear()
      .range([margin, height - 2 * margin])
      .domain([
        d3.max(data, function(d) {
          return d.y;
        }),
        d3.min(data, function(d) {
          return d.y;
        })
      ]);

  var radii = nN < 101 ? 10 : nN < 501 ? 7 : nN < 1001 ? 5 : nN < 5001 ? 4 : 3; // perhaps this should relate to width/height of svg]
  var gees = d3.select(svgObject).selectAll("g");
  if (typeof gees === "object") {
    gees.remove();
  }
  var SPxAxis = d3.axisBottom(xScale).ticks(5);

  var SPyAxis = d3.axisLeft(yScale);

  var graph = d3
    .select(svgObject)
    .attr("width", wdth + margin * 2)
    .attr("height", hght + margin * 2)
    .append("g")
    .attr("transform", "translate(" + 2 * margin + "," + margin + ")");

  graph
    .append("g")
    .attr("class", "y axis")
    .call(SPyAxis);

  graph
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (radii + hght) + ")")
    .call(SPxAxis);

  if (intercept !== "undefined") {
    //console.log(intercept, slope);
    yhat1 = intercept + slope * xmin;
    yhat2 = intercept + slope * xmax;
    regLine = graph
      .append("svg:line")
      .attr("x1", xScale(xmin))
      .attr("y1", yScale(yhat1))
      .attr("x2", xScale(xmax))
      .attr("y2", yScale(yhat2))
      .style("stroke", "black")
      .attr("class", "regression line");
  }

  //  graph.append("g")
  //  	.attr("class", "text")
  //  	.attr("x", 20)
  //  	.attr("y", hght + 5)
  //  	.text(xlegend);

  Dots = graph.selectAll("g.circle").data(data);
  Dots.enter()
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d.x);
    })
    .attr("r", radii)
    .attr("cy", function(d) {
      return yScale(d.y);
    })
    .style("fill", function(d) {
      return "blue";
    })
    .style("fill-opacity", 0.6)
    .on("click", interactFunction);
  //return [Dots, sample];
}

function xyChart() {
  // updatable chart to show scatterplot
  // thanks to Rob Moore https://www.toptal.com/d3-js/towards-reusable-d3-js-charts
  // All options that should be accessible to caller
  //TODO:
  // yaxis has no labels, xaxis is at top instead of bottom,
  // need update function to transition axes
  // data update not working for plot, but consolelog prints it fine
  var data = [],
    width = 200,
    height = 200,
    margin = 40,
    radius = 5,
    fillColor = [];
  //var updateData;

  function chart(selection) {
    selection.each(function() {
      var myDiv = d3.select(this);
      var svg = myDiv
        .append("svg")
        .attr("class", "xyChart")
        .attr("height", height + margin)
        .attr("width", width + margin);
      var xScale = d3
          .scaleLinear()
          .range([margin, width - 2 * margin])
          .domain([
            d3.min(data, function(d) {
              return d.x;
            }),
            d3.max(data, function(d) {
              return d.x;
            })
          ]),
        yScale = d3
          .scaleLinear()
          .range([margin, height - 2 * margin])
          .domain([
            d3.max(data, function(d) {
              return d.y;
            }),
            d3.min(data, function(d) {
              return d.y;
            })
          ]);

      var dots = svg
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", radius)
        .attr("cx", function(d) {
          return xScale(d.x);
        })
        .attr("cy", function(d) {
          return yScale(d.y);
        });

      //var dots = svg.append('g')
      //	.attr('transform', 'translate(' + margin + ', 0)')
      //	.selectAll('circle')
      //   .data(data)
      //	.enter()
      //    .append('circle')
      //.attr('class', 'display-dot')
      //     .style('fill', 'lightblue')//function (d,i) { return fillColor[i];})
      //     .attr('cy', function (d) {  return  d.y ;  })
      //     .attr('cx', function (d) {  return  d.x ;  })
      //     .attr('r', radius);

      var xAxis = d3.axisBottom(xScale).ticks(5);
      var yAxis = d3.axisLeft(yScale).ticks(5);

      svg
        .append("g")
        .attr("class", "xaxis")
        .call(xAxis);
      svg
        .append("g")
        .attr("class", "yaxis")
        .call(yAxis);

      // update functions
      updateWidth = function() {
        svg
          .transition()
          .duration(1000)
          .attr("width", width);
      };

      updateHeight = function() {
        svg
          .transition()
          .duration(1000)
          .attr("height", height);
      };

      updateFillColor = function() {
        svg
          .transition()
          .duration(1000)
          .style("fill", function(d, i) {
            return fillColor[i];
          });
      };

      updateData = function() {
        var update = svg.selectAll("dot").data(data);
        (xScale = d3
          .scaleLinear()
          .range([0, width - 2 * margin])
          .domain([
            d3.min(data, function(d) {
              return d.x;
            }),
            d3.max(data, function(d) {
              return d.x;
            })
          ])),
          (yScale = d3
            .scaleLinear()
            .range([margin, height - 2 * margin])
            .domain([
              d3.max(data, function(d) {
                return d.y;
              }),
              d3.min(data, function(d) {
                return d.y;
              })
            ]));
        xAxis = d3.axisBottom(xScale).ticks(5);
        yAxis = d3.axisLeft(yScale).ticks(5);

        svg
          .append("g")
          .attr("class", "xaxis")
          .call(xAxis);
        svg
          .append("g")
          .attr("class", "yaxis")
          .call(yAxis);

        update
          .transition()
          .duration(500)
          .style("fill", function(d, i) {
            return fillColor[i];
          })
          .attr("y", function(d) {
            return yScale(d.y);
          })
          .attr("x", function(d) {
            return xScale(d.x);
          })
          .attr("r", radius);

        update
          .enter()
          .append("circle")
          .attr("class", "dot")
          .style("fill", function(d, i) {
            return fillColor[i];
          })
          .attr("y", 0)
          .attr("x", function(d) {
            return xScale(d.x);
          })
          .attr("r", radius)
          .style("opacity", 0)
          .transition()
          .duration(500)
          .delay(function(d, i) {
            return (data.length - i) * 40;
          })
          .style("fill", function(d, i) {
            return fillColor[i];
          })
          .attr("y", function(d) {
            return yScale(d.y);
          })
          .attr("x", function(d) {
            return xScale(d.x);
          })
          .attr("r", radius);

        update
          .exit()
          .transition()
          .duration(350)
          .delay(function(d, i) {
            return (data.length - i) * 20;
          })
          .style("opacity", 0)
          .remove();
        //console.log(data[0], d3.min(data, function(d) { return d.x; }));
      };
    });
  }
  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    if (typeof updateWidth === "function") updateWidth();
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    if (typeof updateHeight === "function") updateHeight();
    return chart;
  };

  chart.fillColor = function(value) {
    if (!arguments.length) return fillColor;
    if (Array.isArray(value)) {
      fillColor = value;
    } else {
      for (i = 0; i < data.length; i++) {
        fillColor[i] = value;
      }
    }
    if (typeof updateFillColor === "function") updateFillColor();
    return chart;
  };

  chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    if (typeof updateData === "function") updateData();
    return chart;
  };

  return chart;
}
var dataA = [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 5 }],
  dataB = [{ x: 2, y: 2 }, { x: 1, y: 4 }, { x: 0, y: 6 }],
  updatableChart = xyChart().data(dataA);
//        d3.select('#quant2SummarySVGgoesHere').call(updatableChart);
// updatableChart.data(dataB);

var lnFactorial = [
  0.0,
  0.0,
  0.693147180559945,
  1.791759469228055,
  3.178053830347946,
  4.787491742782046,
  6.579251212010101,
  8.525161361065415,
  10.604602902745251,
  12.801827480081469,
  15.104412573075516,
  17.502307845873887,
  19.987214495661885,
  22.552163853123421,
  25.191221182738683,
  27.899271383840894,
  30.671860106080675,
  33.505073450136891,
  36.395445208033053,
  39.339884187199495,
  42.335616460753485,
  45.380138898476908,
  48.471181351835227,
  51.606675567764377,
  54.784729398112319,
  58.003605222980518,
  61.261701761002001,
  64.557538627006323,
  67.889743137181526,
  71.257038967168,
  74.658236348830158,
  78.092223553315307,
  81.557959456115029,
  85.054467017581516,
  88.580827542197682,
  92.136175603687079,
  95.719694542143202,
  99.330612454787428,
  102.96819861451381,
  106.63176026064345,
  110.32063971475739,
  114.03421178146169,
  117.77188139974506,
  121.53308151543864,
  125.31727114935688,
  129.12393363912724,
  132.95257503561629,
  136.80272263732635,
  140.67392364823425,
  144.5657439463449,
  148.47776695177302,
  152.40959258449735,
  156.3608363030788,
  160.33112821663093,
  164.32011226319517,
  168.32744544842765,
  172.35279713916282,
  176.39584840699737,
  180.45629141754378,
  184.53382886144951,
  188.6281734236716,
  192.7390472878449,
  196.86618167288998,
  201.00931639928157,
  205.1681994826412,
  209.34258675253682,
  213.53224149456327,
  217.73693411395425,
  221.95644181913036,
  226.19054832372757,
  230.43904356577693,
  234.70172344281826,
  238.97838956183435,
  243.26884900298273,
  247.57291409618691,
  251.89040220972319,
  256.22113555000948,
  260.56494097186322,
  264.92164979855278,
  269.29109765101981,
  273.67312428569369,
  278.06757344036612,
  282.4742926876304,
  286.89313329542699,
  291.32395009427029,
  295.7666013507606,
  300.2209486470141,
  304.68685676566872,
  309.1641935801469,
  313.65282994987899,
  318.1526396202093,
  322.66349912672621,
  327.1852877037752,
  331.71788719692847,
  336.26118197919845,
  340.81505887079896,
  345.37940706226686,
  349.95411804077025,
  354.53908551944079,
  359.13420536957534,
  363.73937555556347,
  368.35449607240469,
  372.97946888568902,
  377.61419787391867,
  382.25858877306001,
  386.91254912321756,
  391.57598821732961,
  396.24881705179149,
  400.93094827891576,
  405.6222961611449,
  410.32277652693728,
  415.03230672824958,
  419.75080559954478,
  424.47819341825709,
  429.21439186665157,
  433.95932399501487,
  438.71291418612117,
  443.47508812091894,
  448.24577274538461,
  453.02489623849613,
  457.81238798127811,
  462.60817852687489,
  467.41219957160808,
  472.22438392698052,
  477.04466549258558,
  481.8729792298879,
  486.70926113683936,
  491.55344822329801,
  496.40547848721758,
  501.26529089157924,
  506.13282534203483,
  511.00802266523607,
  515.89082458782252,
  520.78117371604424,
  525.67901351599505,
  530.58428829443358,
  535.49694318016952,
  540.41692410599774,
  545.34417779115495,
  550.27865172428562,
  555.22029414689496,
  560.1690540372731,
  565.12488109487435,
  570.08772572513419,
  575.0575390247102,
  580.0342727671308,
  585.01787938883922,
  590.00831197561786,
  595.00552424938201,
  600.00947055532743,
  605.02010584942377,
  610.03738568623874,
  615.06126620708494,
  620.09170412847743,
  625.12865673089107,
  630.1720818478102,
  635.22193785505976,
  640.2781836604081,
  645.34077869343503,
  650.40968289565524,
  655.48485671088906,
  660.56626107587351,
  665.65385741110595,
  670.74760761191271,
  675.84747403973688,
  680.95341951363753,
  686.06540730199401,
  691.1834011144108,
  696.30736509381404,
  701.43726380873716,
  706.57306224578747,
  711.71472580228999,
  716.86222027910344,
  722.01551187360133,
  727.17456717281584,
  732.33935314673931,
  737.50983714177744,
  742.68598687435122,
  747.86777042464337,
  753.05515623048416,
  758.2481130813743,
  763.4466101126402,
  768.650616799717,
  773.86010295255846,
  779.07503871016741,
  784.29539453524569,
  789.52114120895897,
  794.75224982581346,
  799.98869178864345,
  805.23043880370312,
  810.47746287586358,
  815.72973630391016,
  820.98723167593789,
  826.2499218648428,
  831.51778002390631,
  836.7907795824699,
  842.06889424170049,
  847.35209797043842,
  852.64036500113309,
  857.93366982585746,
  863.23198719240543,
  868.53529210046463,
  873.84355979786574,
  879.1567657769076,
  884.47488577075183,
  889.79789574989024,
  895.1257719186799,
  900.45849071194527,
  905.79602879164634,
  911.13836304361121,
  916.48547057432882,
  921.83732870780489,
  927.19391498247671,
  932.55520714818624,
  937.92118316320807,
  943.29182119133566,
  948.66709959901982,
  954.04699695256045,
  959.43149201534948,
  964.82056374516594,
  970.21419129151832,
  975.61235399303621,
  981.0150313749084,
  986.42220314636859,
  991.83384919822345,
  997.24994960042784,
  1002.6704845997003,
  1008.0954346171817,
  1013.5247802461362,
  1018.9585022496902,
  1024.3965815586134,
  1029.8389992691355,
  1035.2857366408016,
  1040.7367750943674,
  1046.1920962097249,
  1051.6516817238692,
  1057.115513528895,
  1062.5835736700301,
  1068.0558443437014,
  1073.5323078956328,
  1079.012946818975,
  1084.4977437524656,
  1089.9866814786224,
  1095.4797429219627,
  1100.976911147256,
  1106.4781693578009,
  1111.983500893733,
  1117.492889230361,
  1123.0063179765261,
  1128.5237708729908,
  1134.045231790853,
  1139.5706847299848,
  1145.1001138174961,
  1150.6335033062237,
  1156.1708375732424
];

factorialln = function(x) {
  // assumes x is an integer. returns ln(factorial(x))
  if (x < 0) {
    return NaN;
  }
  if (x <= 256) {
    return lnFactorial[x];
  } else {
    x++;
    return (
      (x - 0.5) * Math.log(x) - x + 0.5 * Math.log(2 * Math.PI) + 1 / (12 * x)
    );
  }
};

function hypergeomPMF(n, m, k) {
  //computes hypergeometric probabilities of all possible values  (0 or k-m) <= x <= (k or n)
  // from hypergeometric distribution with n of type of interest, m others, sample size k
  var i,
    x,
    flk = factorialln(k),
    fln = factorialln(n),
    flm = factorialln(m),
    flnPlusm = factorialln(n + m),
    flnPlusMlessK = factorialln(m + n - k),
    out = [],
    sample = [],
    lower = Math.max(0, k - m),
    upper = Math.min(k, n),
    range = upper - lower + 1,
    fixedpart =
      factorialln(n) +
      factorialln(m) +
      factorialln(k) +
      factorialln(n + m - k) -
      factorialln(n + m);

  for (i = 0; i < range; i++) {
    x = lower + i;
    out[i] = Math.exp(
      fixedpart -
        factorialln(x) -
        factorialln(k - x) -
        factorialln(n - x) -
        factorialln(m + x - k)
    );
    sample[i] = x;
  }
  return [sample, out];
}
