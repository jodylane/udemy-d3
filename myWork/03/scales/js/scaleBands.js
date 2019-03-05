var processBandsData = data => {
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
    .text('ScaleBand Graph');
 
  var ordinalScale = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeCategory10);

  var linearScale = d3.scaleLinear()
    .domain([0, 828])
    .range([0, 400]);

  /*
   * domain takes a list of categories
   * ramge tales a ramge of min height & max height values
   * paddingInner & paddingOuter determine spacing between each bar
   *   & between the sides of the svg
   * bandwidth determines width of bars based on number of categories
  **/

  var bandScale = d3.scaleBand()
    .domain(categories)
    .range([0, 400])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  var bars = svg.selectAll('rect')
    .data(data);

  bars.enter()
    .append('rect')
      .attr('x', function (d, i) {
        return bandScale(d.name);
      })
      .attr('y', 25)
      .attr('height', d => {
        return linearScale(d.height);
      })
      .attr('width', bandScale.bandwidth)
      .attr('fill', d => {
        return ordinalScale(d.name);
      });
}

var scaleBands = () => {
  d3.json('data/scaleBands.json')
    .then(processBandsData)
    .catch(error => alert(error));
}