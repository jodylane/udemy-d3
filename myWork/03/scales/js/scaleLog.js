var processLogData = data => {
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
   * base is the factors of your data set you want to display IDK math that will need to look up factors
   *   example mentioned this would display something like 1000 5000 10000 range values
  **/
 
  var logScale = d3.scaleLog()
    .domain([300, 150000])
    .range([0, 400])
    .base(10);

  var bars = svg.selectAll('rect')
    .data(data);

  bars.enter()
    .append('rect')
      .attr('x', function (d, i) {
        return (i * 50) + 20;
      })
      .attr('y', 25)
      .attr('height', d => {
        console.log('actual value: ', d.height , 'scale value: ', logScale(d.height))
        return logScale(d.height);
      })
      .attr('width', 25)
      .attr('fill', d => {
        return 'grey';
      });
}

var scaleLog = () => {
  d3.json('data/scaleLog.json')
    .then(processLogData)
    .catch(error => alert(error));
}