var data = [5, 10, 15, 20, 25];

// adds svg to DOM
var svg = d3.select('#root')
  .append('svg')
    .attr('width', '500px')
    .attr('height', '300px');

var circles = svg.selectAll('circle')
  .data(data);

// adds circles to svg
/* notes: 
 * this gives the effect of padding between circle & square
 * cy value is padding + radius
 * cx value is rect.x + rect.width
**/ 

circles.enter()
  .append('circle')
    .attr('cx', function (d, i) {
      return (i * d) + d;
    })
    .attr('cy', 25)
    .attr('r', (d, i) => {
      return d;
    })
    .attr('fill', 'blue');
