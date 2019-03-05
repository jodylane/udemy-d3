var processOrdinalData = data => {
  // oridnal scales determine colors for different categories
  var categories = [];
  data.forEach(d => {
    categories.push(d.name);
    d.height = +d.height;
  });

  var svg = d3.select('#root')
    .append('svg')
      .attr('width', 400)
      .attr('height', 400);

  svg.append('text')
    .attr('y', 15)
    .attr('x', 400 / 2)
    .attr('text-anchor', 'middle')
    .text('ScaleOrdinal Graph');

  /*
   * domain is a list for all of your categories
   * range is a list for all of your colors 
   * range & domain are a 1:1 comparison if you have more 
   *   categories than colors then it will start at the 
   *   beginning of the color array and continue on
  **/
 
  var ordinalScale = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeCategory10);

  var linearScale = d3.scaleLinear()
  .domain([0, 828])
  .range([0, 400]);

  var bars = svg.selectAll('rect')
    .data(data);

  bars.enter()
    .append('rect')
      .attr('x', function (d, i) {
        return (i * 50) + 20;
      })
      .attr('y', 25)
      .attr('height', d => {
        return linearScale(d.height);
      })
      .attr('width', 25)
      .attr('fill', d => {
        return ordinalScale(d.name);
      });
}

var scaleOrdinal = () => {
  d3.json('data/scaleOrdinal.json')
    .then(processOrdinalData)
    .catch(error => alert(error));
}