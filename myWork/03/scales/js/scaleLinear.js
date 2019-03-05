var processLinearData = data => {
  data.forEach(d => {
    d.height = +d.height;
  });

  var svg = d3.select('#root')
  .append('svg')
    .attr('width', 400)
    .attr('height', 400);

  /*
   * domain is a range for your raw data max & min values
   * range is a range for you svg max height & min height values
  **/
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
      console.log('actual value: ', d.height , 'scale value: ', linearScale(d.height))
      return linearScale(d.height);
    })
    .attr('width', 25)
    .attr('fill', d => {
      return 'grey';
    });

}

var scaleLinear = () => {
  d3.json('data/scaleLinear.json')
    .then(processLinearData)
    .catch(error => alert(error));
}
