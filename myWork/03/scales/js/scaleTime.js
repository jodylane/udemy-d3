// I needed random dates too lazy to make 5 on my own so here you go.
var randomDateGenerator = (start, end) => {
  return new Date(start + Math.random() * end - start);
}

var generateDates = (num = 5) => {
  var array = [];
  for(var i = 0; i < num; i++) {
    var newDate = randomDateGenerator(new Date(2012, 0, 1).getTime(), new Date().getTime());
    array.push(newDate.toJSON());
  }
  return array;
}

var processTimeData = data => {
  data.forEach(d => {
    d.height = new Date(d.height);
  });

  var svg = d3.select('#root')
    .append('svg')
      .attr('width', 400)
      .attr('height', 400);

  svg.append('text')
    .attr('y', 15)
    .attr('x', 400 / 2)
    .attr('text-anchor', 'middle')
    .text('ScaleTime Graph');

  /*
   * domain is a range for your raw data max & min values\
   *   with dates if you set the domain min value to your earliest date
   *   then the earliest date will not be displayed
   * range is a range for you svg max height & min height values
  **/
 
  var timeScale = d3.scaleTime()
    .domain([new Date("1976-05-17T04:10:44.803Z"), data[1].height])
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
        console.log('actual value: ', d.height , 'scale value: ', timeScale(d.height))
        return timeScale(d.height);
      })
      .attr('width', 25)
      .attr('fill', d => {
        return 'grey';
      });
}

var scaleTime = () => {
  console.log(generateDates());
  d3.json('data/scaleTime.json')
    .then(processTimeData)
    .catch(error => alert(error));
}