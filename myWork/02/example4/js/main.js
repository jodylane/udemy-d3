var processData = data => {
  data.forEach(d => {
    d.height = +d.height;
  });

  // adds svg to DOM
  var svg = d3.select('#root')
  .append('svg')
    .attr('width', 500)
    .attr('height', 500);

  var bars = svg.selectAll('rect')
  .data(data);

  bars.enter()
  .append('rect')
    .attr('x', function (d, i) {
      return (i * 50) + 20;
    })
    .attr('y', 25)
    .attr('height', d => d.height)
    .attr('width', 25)
    .attr('fill', d => {
      return 'grey';
    });

}

d3.json('data/buildings.json')
  .then(processData)
  .catch(error => alert(error));

