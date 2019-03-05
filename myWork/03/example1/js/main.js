var processData = data => {
  data.forEach(d => {
    d.height = +d.height;
  });

  // adds svg to DOM
  var svg = d3.select('#root')
  .append('svg')
    .attr('width', 400)
    .attr('height', 400);

  /*
   * domain is a range for your raw data max & min values
   * range is a range for you svg max height & min height values
  **/
  var y = d3.scaleLinear()
    .domain([0, 828])
    .range([0, 400])

  var bars = svg.selectAll('rect')
  .data(data);

  bars.enter()
  .append('rect')
    .attr('x', function (d, i) {
      return (i * 50) + 20;
    })
    .attr('y', 25)
    .attr('height', d => y(d.height))
    .attr('width', 25)
    .attr('fill', d => {
      return 'grey';
    });

}

d3.json('data/buildings.json')
  .then(processData)
  .catch(error => alert(error));

