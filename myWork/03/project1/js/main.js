var margin = { top: 10, right: 10, bottom: 50, left: 80 },
  height = 400 - margin.top - margin.bottom,
  width = 600 - margin.left - margin.right;

var processData = data => {
  // handle data
  data.forEach(month => {
    month.profit = +month.profit;
    month.revenue = +month.revenue;
  });

  console.log(data)

  var categories = data.map(month => month.month);
  // add svg group our chart and slide to fit margins for axis labels
  var g = d3.select('#chart-area')
    .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .append('g')
        .attr('height', height)
        .attr('width', width)
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
  
  g.append('text')
    .attr('y', height + margin.bottom - 5)
    .attr('x', width / 2)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .attr('font-size', '20px')
    .text('Month');

  g.append('text')
    .attr('x', - height / 2)
    .attr('y', - 60)
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .attr('transform', 'rotate(-90)')
    .attr('font-size', '20px')
    .text('Revenue');
  // adding scaling for x axis
  var xScale = d3.scaleBand()
    .domain(categories)
    .range([0, width])
    .paddingInner(0.2)
    .paddingOuter(0.2);
  
  // adding x axis
  var xAxisCall = d3.axisBottom(xScale);

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxisCall);

  // adding y axis scaling
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, month => month.revenue)])
    .range([height, 0])

  // adding y axis
  var yAxisCall = d3.axisLeft(yScale)
    .tickFormat(tick => '$' + tick)

  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxisCall);
  
  var bars = g.selectAll('rect')
    .data(data);

  bars.enter()
    .append('rect')
      .attr('x', month => xScale(month.month))
      .attr('y', month => yScale(month.revenue))
      .attr('height', month => height - yScale(month.revenue))
      .attr('width', xScale.bandwidth)
      .attr('fill', 'grey');
}

var handlerError = error => alert(error);

d3.json('data/revenues.json')
  .then(processData)
  .catch(handlerError);