var margin = { top: 10, right: 10, bottom: 50, left: 80 },
  height = 400 - margin.top - margin.bottom,
  width = 600 - margin.left - margin.right;

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
  .range([0, width])
  .paddingInner(0.2)
  .paddingOuter(0.2);

var xAxisGroup = g.append('g')
  .attr('class', 'x-axis')
  .attr('transform', 'translate(0, ' + height + ')');

// adding y axis scaling
var yScale = d3.scaleLinear()
  .range([height, 0]);

var yAxisGroup = g.append('g')
  .attr('class', 'y-axis');

var processData = data => {
  // handle data
  data.forEach(month => {
    month.profit = +month.profit;
    month.revenue = +month.revenue;
  });

  console.log(data);

  // update loop
  d3.interval(() => { update(data) }, 1000);
  // renders first time befor first update loop runs
  update(data);
}

const update = data => {
  console.log('hello world')
  xScale.domain(data.map(month => month.month));
  yScale.domain([0, d3.max(data, month => month.revenue)]);
  
  // adding x axis
  var xAxisCall = d3.axisBottom(xScale);
  
  xAxisGroup.call(xAxisCall);

  // adding y axis
  var yAxisCall = d3.axisLeft(yScale)
    .tickFormat(tick => '$' + tick)

  yAxisGroup.call(yAxisCall);

  // Data Join
  // join the new data with old elements, if any
  var bars = g.selectAll('rect')
    .data(data);

  // console.log(bars);
  /*
   * bars.exit() returns all the elements of our data array that have been rendered but are no longer part of our data
   * bars.enter() returns all the elements of our data array that have not been rendered
   * bars.group() returns an array of all elements that are rendered.
  **/ 

  // EXIT
  // Remove old elements as needed
  bars.exit().remove();
  // UPDATE
  // Update old elements as needed
  bars
    .attr('x', month => xScale(month.month))
    .attr('y', month => yScale(month.revenue))
    .attr('height', month => height - yScale(month.revenue))
    .attr('width', xScale.bandwidth);

  // ENTER
  // Create new elements as needed
  bars.enter()
    .append('rect')
      .attr('x', month => xScale(month.month))
      .attr('y', month => yScale(month.revenue))
      .attr('height', month => height - yScale(month.revenue))
      .attr('width', xScale.bandwidth)
      .attr('fill', 'grey');
      
  console.log(bars);
}

var handlerError = error => alert(error);

d3.json('data/revenues.json')
  .then(processData)
  .catch(handlerError);