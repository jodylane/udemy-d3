var margin = { top: 10, right: 10, bottom: 50, left: 80 },
  height = 400 - margin.top - margin.bottom,
  width = 600 - margin.left - margin.right;

var flag = true;
// creating a d3 transition with a duration less than our update loop
var t = d3.transition().duration(750);

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

var yAxisLabel = g.append('text')
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
  d3.interval(() => {
    var newData = flag ? data : data.slice(1,5);
    update(newData);
    flag = !flag;
  }, 1000);
  // renders first time befor first update loop runs
  update(data);
}

const update = data => {
  // console.log('hello world')
  var value = flag ? 'revenue' : 'profit';
  xScale.domain(data.map(d => d.month));
  yScale.domain([0, d3.max(data, d => d[value])]);
  
  // adding x axis
  var xAxisCall = d3.axisBottom(xScale);
  
  xAxisGroup.transition(t).call(xAxisCall);

  // adding y axis
  var yAxisCall = d3.axisLeft(yScale)
    .tickFormat(tick => '$' + tick)

  yAxisGroup.transition(t).call(yAxisCall);

  console.log(value)

  // Data Join
  // join the new data with old elements, if any

  // passing a second arguement to .data will determine how d3 should track our data
  // by default it tracks our data by index you can make d3 track a key.value instead
  var bars = g.selectAll('rect')
    .data(data, month => month.month);

  // console.log(bars);
  /*
   * bars.exit() returns all the elements of our data array that have been rendered but are no longer part of our data
   * bars.enter() returns all the elements of our data array that have not been rendered
   * bars.group() returns an array of
  **/ 

  // EXIT
  // Remove old elements as needed
  bars.exit()
    .attr('fill', 'red')
    .transition(t)
      .attr('y', yScale(0))
      .attr('height', 0)
      .remove();

  // ENTER
  // Create new elements as needed
  bars.enter()
    .append('rect')
      .attr('x', d => xScale(d.month))
      .attr('width', xScale.bandwidth)
      .attr('fill', 'grey')
      .attr('y', yScale(0))
      .attr('height', 0)
      // Update old elements as needed
      .merge(bars)
      .transition(t)
        .attr('x', d => xScale(d.month))
        .attr('y', d => yScale(d[value]))
        .attr('height', d => height - yScale(d[value]))
        .attr('width', xScale.bandwidth);
  var label = value.charAt(0).toUpperCase() + value.slice(1)
  yAxisLabel.text(label);
}

var handlerError = error => alert(error);

d3.json('data/revenues.json')
  .then(processData)
  .catch(handlerError);