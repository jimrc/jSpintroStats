function makeRegressionPlot(data, plot, xlabel, ylabel) {
  // draw scatterplot of 2 quantitative variables and add regression line
  var svg, chart_group, data_extent, canvas, margins, max_draw_space;

  if (document.getElementById(plot).style.display === "none") {
    document.getElementById(plot).style.display = "block";
  }
  // calculate slope and intercept *** //
  var crossprod = 0.0,
    dataLength = data.length,
    i,
    x = [],
    y = [],
    xydata = [],
    keys = Object.keys(data[0]);
  //console.log(data[0]);
  // console.log(keys)
  for (i = 0; i < dataLength; i++) {
    x.push(+data[i][keys[0]]);
    y.push(+data[i][keys[1]]);
    crossprod += x[i] * y[i]; // add up cross product
    xydata.push({ x: x[i], y: y[i], color: "blue" });
  }

  var xbar = d3.mean(x),
    xVar = d3.variance(x),
    ybar = d3.mean(y),
    yVar = d3.variance(y),
    coVar = (crossprod - dataLength * xbar * ybar) / (dataLength - 1),
    slope = coVar / xVar,
    intercept = ybar - slope * xbar,
    correlation = coVar / Math.sqrt(yVar * xVar);

  svg = make_chart_svg(plot);
  if (svg.select("g." + plot + "_group").empty()) {
    chart_group = svg.append("g").attr("class", plot + "_group");
  } else {
    chart_group = svg.select("g." + plot + "_group");
  }
  chart_group.data(xydata);

  data_extent = {
    max: {
      x: d3.max(x) * 1.01,
      y: d3.max(y) * 1.01
    },
    min: {
      x: d3.min(x) * 0.99,
      y: d3.min(y) * 0.99
    }
  };
  //
  // add padding to keep dots away from axes //
  const xrange = 1.1 * (data_extent.max.x - data_extent.min.x);
  const yrange = 1.1 * (data_extent.max.y - data_extent.min.y);
  data_extent.max.x = (data_extent.max.x + data_extent.min.x + xrange) / 2;
  data_extent.max.y = (data_extent.max.y + data_extent.min.y + yrange) / 2;
  data_extent.min.x = (data_extent.max.x + data_extent.min.x - xrange) / 2;
  data_extent.min.y = (data_extent.max.y + data_extent.min.y - yrange) / 2;
  var xmin = data_extent.min.x,
    xmax = data_extent.max.x;

  canvas = extract_canvas_from_svg(svg);
  margins = make_margins(chart_group, canvas, data_extent);

  var max_draw_space = {
    x: canvas.x - margins.x.left - margins.x.right - margins.axes.y,
    y: canvas.y - margins.y.top -  margins.y.bottom - margins.axes.x - margins.title
  };

  //  max_draw_space = calculate_maximum_drawing_space(canvas, margins)
  //make_title(chart_group, ["Scatterplot"], margins, canvas, max_draw_space)
  var x_scale = d3
    .scaleLinear()
    .domain([data_extent.min.x, data_extent.max.x])
    .range([0, max_draw_space.x]);
  var y_scale = d3
    .scaleLinear()
    .domain([data_extent.max.y, data_extent.min.y])
    .range([0, max_draw_space.y]);

  var x_axis_label = xlabel;
  var y_axis_label = ylabel;
  //console.log(max_draw_space);
  make_axes(
    chart_group,
    x_scale,
    y_scale,
    canvas,
    margins,
    max_draw_space,
    x_axis_label,
    y_axis_label
  );

    //  Add regression line *********************************//
    var regLine;
    if ((regLine = d3.select("line.regression"))) {
      regLine.remove();
    }
    if (slope){
      var regLine = chart_group
        .append("line")
        .attr("class", "regression")
        .attr("x1", x_scale(xmin) + margins.x.left + margins.axes.y)
        .attr(
          "y1",
          y_scale(xmin * slope + intercept) + margins.y.top + margins.title
        )
        .attr("x2", x_scale(xmax) + margins.x.left + margins.axes.y)
        .attr(
          "y2",
          y_scale(xmax * slope + intercept) + margins.y.top + margins.title
        )
        .style("stroke", "black");
    }

  var scatter_group = chart_group
    .selectAll("g." + plot + "_scatter_group")
    .data(xydata);
  chart_group
    .selectAll("g." + plot + "_scatter_group")
    .data(xydata)
    .enter()
    .append("g")
    .attr("class", plot + "_scatter_group")
    .append("circle")
    .attr("r", charts_config.point.radius)
    .style("fill", function(d){ return(d.color);})
    .style("opacity", charts_config.point.opacity);

  scatter_group = d3.selectAll("g." + plot + "_scatter_group");
  scatter_group.attr("transform", function(d, i) {
    return (
      "translate(" +
      (x_scale(d.x) + margins.x.left + margins.axes.y) +
      "," +
      (y_scale(d.y) + margins.y.top + margins.title) +
      ")"
    );
  });
  //************* Add tooltips ********************************//
  scatter_group.on("click", mouseClickFunction);
  scatter_group.on("mouseleave", mouseOutFunction);

  function mouseClickFunction(d, i) {
    var d = d3.select(this).datum();
    make_tooltip(
      d3.select(this),
      [xlabel + " : " + d.x, ylabel + ": " + d.y],
      chart_group,
      canvas,
      margins
    );
  }

  function mouseOutFunction(d, i) {
    chart_group.select("g.tooltip_group").remove();
  }

  chart_group.select("g.axes").raise();
}


// ***************************************************************//
//     Function to plot dots without regression line                          //
//                                                                //
//  **************************************************************//

function makeScatterPlot(data, plot, xlabel, ylabel) {
  // draw scatterplot of 2 quantitative variables of given color
  // input array with x, y, and colors
  var svg,
    chart_group,
    data_extent,
    canvas,
    margins,
    max_draw_space,
    colors = [],
    xydata = [];
    //console.log(data[0]);
  if (document.getElementById(plot).style.display === "none") {
      document.getElementById(plot).style.display = "block";
  }
  //var xydata =[];
  // calculate slope and intercept *** //
  var crossprod = 0.0,
    dataLength = data.length,
    i,
    x = [],
    y = [];
  for(i =0; i< dataLength; i++){
  	x.push( +data[i].x);
    y.push( +data[i].y);
    xydata.push( {x: x[i], y: y[i], color: data[i].color})
  }

  svg = make_chart_svg(plot);
  if (svg.select("g." + plot + "_group").empty()) {
    chart_group = svg.append("g").attr("class", plot + "_group");
  } else {
    chart_group = svg.select("g." + plot + "_group");
  }
  chart_group.data(data);

  data_extent = {
    max: {
      x: d3.max(x) * 1.01,
      y: d3.max(y) * 1.01
    },
    min: {
      x: d3.min(x) * 0.99,
      y: d3.min(y) * 0.99
    }
  };
  //
  // add padding to keep dots away from axes //
  const xrange = 1.1 * (data_extent.max.x - data_extent.min.x);
  const yrange = 1.1 * (data_extent.max.y - data_extent.min.y);
  data_extent.max.x = (data_extent.max.x + data_extent.min.x + xrange) / 2;
  data_extent.max.y = (data_extent.max.y + data_extent.min.y + yrange) / 2;
  data_extent.min.x = (data_extent.max.x + data_extent.min.x - xrange) / 2;
  data_extent.min.y = (data_extent.max.y + data_extent.min.y - yrange) / 2;
  var xmin = data_extent.min.x,
    xmax = data_extent.max.x;
  canvas = extract_canvas_from_svg(svg);
  margins = make_margins(chart_group, canvas, data_extent);
  // console.log(data_extent);

  var max_draw_space = {
    x: canvas.x - margins.x.left - margins.x.right - margins.axes.y,
    y:
      canvas.y -
      margins.y.top -
      margins.y.bottom -
      margins.axes.x -
      margins.title
  };

  //  max_draw_space = calculate_maximum_drawing_space(canvas, margins)
  //make_title(chart_group, ["Scatterplot"], margins, canvas, max_draw_space)
  var x_scale = d3
    .scaleLinear()
    .domain([data_extent.min.x, data_extent.max.x])
    .range([0, max_draw_space.x]);
  var y_scale = d3
    .scaleLinear()
    .domain([data_extent.max.y, data_extent.min.y])
    .range([0, max_draw_space.y]);

  var x_axis_label = xlabel;
  var y_axis_label = ylabel;
  make_axes(
    chart_group,
    x_scale,
    y_scale,
    canvas,
    margins,
    max_draw_space,
    x_axis_label,
    y_axis_label
  );

  var scatter_group = chart_group
    .selectAll("g." + plot + "_scatter_group")
    .data(data);
  chart_group
    .selectAll("g." + plot + "_scatter_group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", plot + "_scatter_group")
    .append("circle")
    .attr("r", charts_config.point.radius)
    .style("fill", function(d){ return (d.color);})
    .style("opacity", charts_config.point.opacity);

  scatter_group = d3.selectAll("g." + plot + "_scatter_group");
  scatter_group.attr("transform", function(d, i) {
    return (
      "translate(" +
      (x_scale(d.x) + margins.x.left + margins.axes.y) +
      "," +
      (y_scale(d.y) + margins.y.top + margins.title) +
      ")"
    );
  });
  //************* Add tooltips ********************************//
  scatter_group.on("click", mouseClickFunction);
  scatter_group.on("mouseleave", mouseOutFunction);

  function mouseClickFunction(d, i) {
    //ToDo:  Prettify output by rounding appropriately
    var d = d3.select(this).datum();
    make_tooltip(
      d3.select(this),
      [xlabel + ": " + d.x.toPrecision(3)],
      chart_group,
      canvas,
      margins
    );
  }

  function mouseOutFunction(d, i) {
    chart_group.select("g.tooltip_group").remove();
  }

  chart_group.select("g.axes").raise();
  return xydata;
}

/**************************************************************************
 *                                                                         *
 *                          HELPER FUNCTIONS                               *
 *                                                                         *
 **************************************************************************/

function parseNumber(number) {
  var number_string = number.toString();
  if (number_string.includes("%")) {
    number_string = number_string.slice(0, number_string.length - 1);
    if (number_string.length == 3) {
      return 1.0;
    } else {
      return parseFloat("." + number_string);
    }
  } else if (number_string.includes(".")) {
    return parseFloat(number_string);
  } else {
    return parseInt(number_string);
  }
}

function typeofNumber(number) {
  number = number.toString();
  if (number.includes("%")) {
    return "percent";
  } else if (number.includes(".")) {
    return "float";
  } else if (number.includes("e") || number.includes("+")) {
    return "scientific";
  } else {
    return "integer";
  }
}

//-------------------------------------------------------------------//
//                                                                   //
//                            MAKE AXES                              //
//                                                                   //
//-------------------------------------------------------------------//
function calculate_space_needed_by_axes(chart_group, data_extent, margins) {
  // Temporary SVG group element to calculate size of dummy axes then be removed
  var temp = chart_group.append("g").attr("class", "temp");

  // Dummy scales. Use max and min to get accurate measurement for length of ticks
  var x_scale = d3
    .scaleLinear()
    .domain([data_extent.min.x, data_extent.max.x])
    .range([0, 1]);
  var y_scale = d3
    .scaleLinear()
    .domain([data_extent.min.y, data_extent.max.y])
    .range([0, 1]);

  // Make the axes
  var x_axis_scaled = d3
    .axisBottom(x_scale)
    .tickSize(charts_config.axes.tickssize)
    .ticks(6);
  var y_axis_scaled = d3
    .axisLeft(y_scale)
    .tickSize(charts_config.axes.tickssize)
    .ticks(6);

  // Place and maintain the axis as an SVG object
  try{
  var x_axis = temp
    .append("g")
    .attr("class", "temp")
    .call(x_axis_scaled)
    .attr("font-size", charts_config.axes.size)
    .attr("font-family", charts_config.axes.family);
  var y_axis = temp
    .append("g")
    .attr("class", "temp")
    .call(y_axis_scaled)
    .attr("font-size", charts_config.axes.size)
    .attr("font-family", charts_config.axes.family);
} catch(err) {

}
  // Add the axes labels. y-axis is rotated
  var x_axis_label = temp
    .append("text")
    .text("temp")
    .attr("font-family", charts_config.axes.labelsfamily)
    .attr("font-size", charts_config.axes.labelsize);
  var y_axis_label = temp
    .append("text")
    .text("temp")
    .attr("font-family", charts_config.axes.labelsfamily)
    .attr("font-size", charts_config.axes.labelsize)
    .attr("transform", "rotate(-90)");
    //console.log(x_axis_label.node().getBBox());
  // Retrieve the rectangle encapsulating the text labels and the axes
  var x_axis_label_box = x_axis_label.node().getBBox();
  var y_axis_label_box = y_axis_label.node().getBBox();
  var x_axis_box = x_axis.node().getBBox();
  var y_axis_box = y_axis.node().getBBox();

  // Calculate the total space consumed by these items
  var x_axis_space_consumed =
    x_axis_label_box.height + x_axis_box.height + margins.axes.label_space;
  var y_axis_space_consumed =
    y_axis_label_box.height + y_axis_box.width + margins.axes.label_space;

  // Remove these SVG elements
  temp.remove();
  //console.log(x_axis_space_consumed, y_axis_space_consumed);
  return { x: x_axis_space_consumed, y: y_axis_space_consumed };
}

function make_axes(
  chart_group,
  x_scale,
  y_scale,
  canvas,
  margins,
  maximum_drawing_space,
  x_label,
  y_label,
  custom_ticks = false
) {
  var axes, x_axis_label, y_axis_label, x_axis, y_axis;
  // If first call make all groups needed
  if (chart_group.select("g.axes").empty()) {
    axes = chart_group.append("g").attr("class", "axes");
    x_axis_label = axes.append("text").attr("class", "x_axis_label");
    y_axis_label = axes.append("text").attr("class", "y_axis_label");
    x_axis = axes.append("g").attr("class", "x_axis");
    y_axis = axes.append("g").attr("class", "y_axis");
  }

  axes = chart_group.select("g.axes");
  var x_axis_scaled = d3
    .axisBottom()
    .scale(x_scale)
    .tickSize(charts_config.axes.ticks.size)
    .ticks(6);
  var y_axis_scaled = d3
    .axisLeft()
    .scale(y_scale)
    .tickSize(charts_config.axes.ticks.size)
    .ticks(6);
  var center = {
    x: margins.x.left + margins.axes.y + maximum_drawing_space.x / 2,
    y: margins.y.top + margins.title + maximum_drawing_space.y / 2
  };

  if (custom_ticks != false) {
    x_axis_scaled
      .tickFormat(function(d, i) {
        return custom_ticks[i];
      })
      .ticks(custom_ticks.length);
  }

  x_axis_label = axes
    .select("text.x_axis_label")
    .text(x_label)
    .attr("font-family", charts_config.axes.labels.family)
    .attr("font-size", charts_config.axes.labels.size)
    .attr(
      "transform",
      "translate(" + center.x + "," + (canvas.y - margins.y.bottom) + ")"
    )
    .attr("text-anchor", "middle");
  y_axis_label = axes
    .select("text.y_axis_label")
    .text(y_label)
    .attr("font-family", charts_config.axes.labels.family)
    .attr("font-size", charts_config.axes.labels.size)
    .attr(
      "transform",
      "translate(" + margins.x.left + "," + center.y + ") rotate(-90)"
    )
    .attr("text-anchor", "middle");

  var x_axis_label_box = x_axis_label.node().getBBox();
  var y_axis_label_box = y_axis_label.node().getBBox();

  var x_axis_y = margins.axes.x + margins.y.bottom;
  var y_axis_x = margins.axes.y + margins.x.left;
  x_axis = axes
    .select("g.x_axis")
    .transition()
    .duration(500)
    .call(x_axis_scaled)
    .attr(
      "transform",
      "translate(" +
        (margins.x.left + margins.axes.y) +
        "," +
        (canvas.y - x_axis_y) +
        ")"
    )
    .attr("font-size", charts_config.axes.size)
    .attr("font-family", charts_config.axes.family);

  y_axis = axes
    .select("g.y_axis")
    .transition()
    .duration(500)
    .call(y_axis_scaled)
    .attr("font-size", charts_config.axes.size)
    .attr("font-family", charts_config.axes.family)
    .attr(
      "transform",
      "translate(" +
        y_axis_x +
        "," +
        (center.y - maximum_drawing_space.y / 2) +
        ")"
    );
}

function make_margins(chart_group, canvas, data_extent) {
  var margins = {
    x: {
      left: canvas.x * 0.04,
      right: canvas.x * 0.04
    },
    y: {
      top: canvas.x * 0.04,
      bottom: canvas.x * 0.04
    },
    title: charts_config.title.size * 2, // space consumed by title
    axes: {
      x: charts_config.axes.size * 4, // space consumed by x axes
      y: charts_config.axes.size * 4, // space consumed by y axes
      label_space: 10 // space between axis label and axis, included in axes.x / axes.y respectively
    }
  };
  // Update axes margins based off space used by their rendered SVG elements
  // console.log(data_extent, margins)
  axes_margins = calculate_space_needed_by_axes(
    chart_group,
    data_extent,
    margins
  );
  //console.log(axes_margins);
  margins.axes.x = axes_margins.x;
  margins.axes.y = axes_margins.y;
  //console.log(margins);

  return margins;
}

function extract_canvas_from_svg(svg) {
  var width = svg.attr("width");
  var height = svg.attr("height");
  var canvas = {
    x: parseNumber(width),
    y: parseNumber(height)
  };
  return canvas;
}

function make_chart_svg(plot) {
  // create an svg within this document at section id "plot"
  var section = d3.select("#" + plot);
  var chart_width = parseNumber(charts_config.svg.width);
  var chart_height = parseNumber(charts_config.svg.height);

  var chart_width_string, chart_height_string;
  //if (typeofNumber(chart_width) == "float") {
  //chart_width_string = (chart_width * section.node().clientWidth ) + "px"
  //} else {
  chart_width_string = chart_width + "px";
  //}

  //if (typeofNumber(chart_height) == "float") {
  //chart_height_string = (chart_height * section.node().clientHeight ) + "px"
  //} else {
  chart_height_string = chart_height + "px";
  //}

  var svg;
  if (section.select("#" + plot + "_svg").empty()) {
    svg = section.append("svg");
  } else {
    svg = section.select("#" + plot + "_svg");
  }
  svg
    .attr("preserveAspectRatio", "xMinYMid meet")
    .classed("svg-content-responsive", true)
    .attr("id", plot + "_svg")
    .attr("width", chart_width_string)
    .attr("height", chart_height_string);
  return svg;
}

//-------------------------------------------------------------------//
//                                                                   //
//                            MAKE TITLE                             //
//                                                                   //
//-------------------------------------------------------------------//
function make_title(
  chart_group,
  text_array,
  margins,
  canvas,
  maximum_drawing_space
) {
  // Does chart title already exist?
  if (!chart_group.select("g.chart_title").empty()) {
    // Yes. Clear Title
    chart_group.select("g.chart_title").remove();
    // Reset Margins
    margins.title = charts_config.title.size * 2;
  }

  // Construct full title
  var full_title = text_array.join(" ");

  // Store title lines
  var title_lines = [];

  // Max line length
  var characters_per_line =
    (canvas.x - margins.x.right) / (charts_config.title.size / 2);

  while (full_title.length > 0) {
    var slice_position = characters_per_line - 1;

    var line_slice = full_title.slice(0, slice_position);

    var last_space = line_slice.lastIndexOf(" ");

    // space is first character, drop it
    if (line_slice[0] == " ") {
      full_title = full_title.slice(1, full_title.length);
      line_slice = full_title.slice(0, slice_position);
      last_space = line_slice.lastIndexOf(" ");
    }

    if (
      (full_title[slice_position + 1] != " ") &
      (slice_position < full_title.length)
    ) {
      // the leading character of next splice is not a space (e.g. breaks a word)
      // and there is more in the title to come
      if (last_space == -1) {
        // no spaces in this line, we have broken a word
        line_slice = full_title.slice(0, slice_position - 1) + "-";
        slice_position -= 1;
      } else {
        // there is a space, truncate to that space
        slice_position = last_space;
        line_slice = full_title.slice(0, slice_position);
      }
      last_space = line_slice.lastIndexOf(" ");
    } else if (
      (slice_position < full_title.length) &
      (last_space < line_slice.length)
    ) {
      // last word is split, so add a hypen
      line_slice = full_title.slice(0, slice_position - 1);
      slice_position -= 1;
      last_space = line_slice.lastIndexOf(" ");

      // if the word is a two letter word, e.g. the last letter in the string is
      // the first letter of the two letter word, then that letter is droped for
      // a hypen before a space. That makes no sense, so drop the entire 2 letter word
      if (last_space == slice_position - 1) {
        // if space is last character drop it
        line_slice = full_title.slice(0, slice_position - 1);
        slice_position -= 1;
      } else {
        line_slice += "-";
        slice_position -= 1;
      }
      last_space = line_slice.lastIndexOf(" ");
    }

    if (last_space == slice_position) {
      // if space is last character drop it
      line_slice = full_title.slice(0, slice_position - 1);
      slice_position -= 1;
    }

    title_lines.push(line_slice);
    full_title = full_title.slice(slice_position, full_title.length);
  }

  var chart_title = chart_group.append("g").attr("class", "chart_title");
  for (var i = 0; i < title_lines.length; i++) {
    chart_title
      .append("text")
      .attr("class", "chartTitle")
      .text(title_lines[i])
      .attr("text-anchor", "middle")
      .attr("font-size", charts_config.title.size)
      .attr("font-family", charts_config.title.family)
      .attr("x", margins.axes.y + margins.x.left + maximum_drawing_space.x / 2)
      .attr(
        "y",
        margins.y.top +
          (charts_config.title.size * i + charts_config.title.size / 2)
      );
    margins.title =
      chart_title.node().getBBox().height + charts_config.title.size;
    maximum_drawing_space.y =
      canvas.y -
      margins.y.top -
      margins.y.bottom -
      margins.axes.x -
      margins.title;
  }
}

//-------------------------------------------------------------------//
//                                                                   //
//                          MAKE TOOLTIP                             //
//                                                                   //
//  from https://riptutorial.com/d3-js/example/30311/scatter-plot    //
//-------------------------------------------------------------------//
function make_tooltip(obj, text_array, chart_group, canvas, margins) {
  // get the x and y coordinates of the object to apply tooltip too
  var x = obj.node().transform.baseVal.consolidate().matrix.e;
  var y = obj.node().transform.baseVal.consolidate().matrix.f;

  // for convenience
  var tooltip_config = charts_config.tooltip;
  var sep = tooltip_config.default_separation_from_object;

  // Add the tooltip to the chart and as a child - the text group
  var tooltip = chart_group.append("g").attr("class", "tooltip_group");
  var text_group = tooltip.append("g").attr("class", "tooltip_text_group");

  // Add text in reverse order placing low to high
  text_array.reverse();
  for (var i = 0; i < text_array.length; i++) {
    var text = text_group
      .append("text")
      .text(text_array[i])
      .attr("font-size", tooltip_config.size)
      .attr("text-anchor", "middle")
      .attr("x", x)
      .attr("y", y - sep - tooltip_config.curve - i * tooltip_config.size)
      .attr("class", "tooltipText")
      .attr("fill", tooltip_config.emphasis)
      .attr("font-family", tooltip_config.family)
      .attr("font-weight", "normal");

    // The first line in the tooltip gets different coloration
    if (i < text_array.length - 1) {
      text
        .attr("fill", tooltip_config.text)
        .attr("font-family", tooltip_config.family)
        .attr("font-weight", "normal");
    }
  }

  // Make the bubble around the text
  var bubble = tooltip
    .append("path")
    .attr("d", make_tooltip_bubble(text_group))
    .attr("fill", tooltip_config.fill)
    .attr("stroke", tooltip_config.stroke)
    .attr("opacity", tooltip_config.opacity);

  // Text goes in front of the box
  text_group.raise();

  // Get the bounding box of the bubble
  var bubble_box = bubble.node().getBBox();

  // Calculate the limits to contain the tooltip
  var limits = {
    top: margins.y.top + margins.title,
    bottom: canvas.y - margins.axes.x - margins.y.bottom,
    left: margins.x.left + margins.axes.y,
    right: canvas.x - margins.x.right
  };

  // Get the boundaries of the object
  var object_boundaries = {
    left: x,
    right: x + obj.node().getBBox().width,
    top: y,
    bottom: y + obj.node().getBBox().height
  };

  // Calculate putative tooltip placements
  var tooltip_placements = {
    upper_left: {
      x: object_boundaries.left - bubble_box.width - sep,
      y: object_boundaries.top - bubble_box.height - sep
    },
    upper_right: {
      x: object_boundaries.right + sep,
      y: object_boundaries.top - bubble_box.height - sep
    },
    lower_left: {
      x: object_boundaries.left - bubble_box.width - sep,
      y: object_boundaries.bottom + sep
    },
    lower_right: {
      x: object_boundaries.right + sep,
      y: object_boundaries.bottom + sep
    }
  };

  // Figure out which placements fall within the limits
  var valid_placements = {
    upper_left: {
      x: tooltip_placements.upper_left.x > limits.left,
      y: tooltip_placements.upper_left.y > limits.top
    },
    upper_right: {
      x: tooltip_placements.upper_right.x + bubble_box.width < limits.right,
      y: tooltip_placements.upper_right.y > limits.top
    },
    lower_left: {
      x: tooltip_placements.lower_left.x > limits.left,
      y: tooltip_placements.lower_left.y + bubble_box.height < limits.bottom
    },
    lower_right: {
      x: tooltip_placements.lower_right.x + bubble_box.width < limits.right,
      y: tooltip_placements.lower_right.y + bubble_box.height < limits.bottom
    }
  };
  function keys(data) {
    return Object.keys(data);
  }

  var placements = d3.keys(valid_placements);

  var tooltip_placement;
  for (var i = 0; i < placements.length; i++) {
    var current_placement = valid_placements[placements[i]];
    if (current_placement.x && current_placement.y) {
      tooltip_placement = tooltip_placements[placements[i]];
      break;
    }
  }
  // TODO:  this always chooses UpperLeft if it's OK, if not chooses:
  // UpperRight, LowerLeft, Lower Right
  // would it be possible to choose upperRight when x > xbar? for resampling charts
  // choose open space for scatterplots?

  // Reposition the tooltip to its correct location
  tooltip.attr(
    "transform",
    "translate(" +
      (tooltip_placement.x - bubble_box.x) +
      "," +
      (tooltip_placement.y - bubble_box.y) +
      ")"
  );
}

function transform_values(selection) {
  return {
    x: selection.node().transform.baseVal.consolidate().matrix.e,
    y: selection.node().transform.baseVal.consolidate().matrix.f
  };
}

function make_tooltip_bubble(text_group) {
  var textBox = text_group.node().getBBox();
  var x = textBox.x;
  var y = textBox.y;
  var width = textBox.width;
  var height = textBox.height;

  var point = charts_config.tooltip.point;
  var curve = charts_config.tooltip.curve;

  // Start at bottom center and work around left - up - right - down - close
  d = "M " + (x + width / 2) + " " + (y + height + curve);
  // go left
  d += "l -" + width / 2 + " 0 ";
  // curve left and up
  d += "q -" + curve + " 0 -" + curve + " -" + curve + " ";
  // go up
  d += "l 0 -" + height + " ";
  // curve up and right
  d += "q 0 -" + curve + " " + curve + " -" + curve + " ";
  // go right
  d += "l " + width + " 0 ";
  // curve right and down
  d += "q " + curve + " 0 " + curve + " " + curve + " ";
  // go down
  d += "l 0 " + height + " ";
  //  curve down and left
  d += "q 0 " + curve + " -" + curve + " " + curve + " ";
  // go left
  d += "l -" + width / 2 + " 0 ";
  // close
  d += " z";
  return d;
}

var charts_config = {
  svg: {
    width: "400",
    height: "400"
  },
  title: {
    family: "sans-serif",
    size: 0
  },
  tooltip: {
    curve: 5,
    point: 20,
    fill: "#1A1A1A",
    stroke: "#ffffff",
    opacity: 0.3,
    text: "black",
    emphasis: "red",
    family: "sans-serif",
    size: 14,
    default_separation_from_object: 3
  },
  buttons: {
    family: "Courier New",
    size: 12,
    stroke: "black",
    fill: {
      not_selected: "white",
      selected: "black"
    }
  },
  axes: {
    family: "sans-serif",
    size: 10,
    ticks: {
      size: 5
    },
    maxCharacters: {
      x: 10
    },
    labels: {
      family: "sans-serif",
      size: 14
    }
  },
  point: {
    fill: "#1A1A1A",
    opacity: 0.4,
    radius: 5
  },
  plots: {
    scatter: {
      point: {
        radius: 5
      },
      opacity: {
        hover: 0.5,
        nonhover: 0.8
      }
    },
    line: {
      width: 5,
      stroke: "#2196F3",
      fill: "none",
      hidden_radius: 10,
      opacity: {
        hover: 0.5,
        nonhover: 0.8
      }
    },
    box_and_whiskers: {
      spacing: 2,
      width: 1,
      stroke: "black",
      whiskers: {
        width: 2
      },
      opacity: {
        hover: 0.5,
        nonhover: 1
      }
    }
  },
  colors: {
    palette: [
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#9E9E9E",
      "#607D8B"
    ]
  }
};
