// adds svg to DOM
var svg = d3.select('#root')
  .append('svg')
    .attr('width', '500px')
    .attr('height', '300px');

// adds square to svg
var rect = svg
  .append('rect')
    .attr('x', 20)
    .attr('y', 20)
    .attr('width', 100)
    .attr('height', 100)
    .attr('fill', 'red');

// adds circle to svg
/* notes: 
 * this gives the effect of padding between circle & square
 * cy value is padding + radius
 * cx value is rect.x + rect.width
**/ 

var circle = svg
  .append('circle')
    .attr('cx', 180)
    .attr('cy', 70)
    .attr('r', 50)
    .attr('fill', 'blue');

var line = svg.append("line")
	.attr("x1", 250)
	.attr("y1", 70)
	.attr("x2", 350)
	.attr("y2", 70)
	.attr("stroke", "green")
	.attr("stroke-width", 3);