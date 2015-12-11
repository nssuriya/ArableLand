
  var margin = {top: 20, right: 80, bottom: 30, left: 70},
      width = 1200 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x1 = d3.scale.linear()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();

  var formatYAxis = function(d) {return d/1000000;}

  var xAxis = d3.svg.axis()
      .scale(x1)
      .tickFormat(d3.format("d"))
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(formatYAxis);

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x1(d.Year); })
      .y(function(d) { return y(d.arable); });

  var svg5 = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("../json/aggregate.json", function(error, data) {
    if (error) throw error;
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
    var continents = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {Year: d.Year, arable: +d[name]};
        })
      };
    });
    x1.domain(d3.extent(data, function(d) { return d.Year; }));
    y.domain([
      d3.min(continents, function(c) { return d3.min(c.values, function(v) { return v.arable; }); }),
      d3.max(continents, function(c) { return d3.max(c.values, function(v) { return v.arable; }); })
    ]);
    svg5.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg5.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Arable land by Continent (in million hectares)");
    var city = svg5.selectAll(".city")
        .data(continents)
      .enter().append("g")
        .attr("class", "city");
    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });
        var legend = svg5.selectAll(".legend")
        .data(color.domain().slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)
        .attr("transform", "translate(50,-10)");
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; })
        .attr("transform", "translate(50,-10)");;
  });
