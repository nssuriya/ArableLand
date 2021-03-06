var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 1200 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
.range([height, 0]);


var formatData = function(d){
  return d/1000000;
}

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickFormat(formatData);


var svg3 = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("../json/indiaHectares.json",function(error, data) {
if (error) throw error;

x.domain(data.map(function(d) { return d.YEAR; }));
y.domain([150000000, d3.max(data, function(d) { return d.VALUE; })]);

svg3.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
  .attr("transform","rotate(-90)")
  .attr("dx","-0.6em")
  .attr("dy","-0.6em")
  .style("text-anchor","end");

svg3.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Hectares in Millions");

svg3.selectAll(".bar")
  .data(data)
.enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.YEAR); })
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.VALUE); })
  .attr("height", function(d) { return height - y(d.VALUE); });
});
