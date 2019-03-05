var processData = data => {
  data.forEach(d => {
    d.height = +d.height;
  });

  var margin = { top: 10, right: 10, bottom:150, left: 100 },
    height = 400 - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right;

  var g = d3.select('#root')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  g.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - margin.top)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('The Worlds Tallest buildings');

  g.append('text')
    .attr('class', 'y-axis-label')
    .attr('x', - (height / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Height (m)');

  var categories = data.map(building => building.name);
      
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, building => building.height)])
    .range([height, 0])

  var xScale = d3.scaleBand()
    .domain(categories)
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  var colorScale = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeCategory10)

  var yAxisCall = d3.axisLeft(yScale)
    .tickFormat(tick => tick + 'm');

  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxisCall);


  var xAxisCall = d3.axisBottom(xScale);

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxisCall)
      .selectAll('text')
        .attr('y', 10)
        .attr('x', -5)
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-40)');

  var bars = g.selectAll('rect')
    .data(data);

  bars.enter()
    .append('rect')
      .attr('x', building => xScale(building.name))
      .attr('y', building => yScale(building.height))
      .attr('height', building => height - yScale(building.height))
      .attr('width', xScale.bandwidth)
      .attr('fill', building => colorScale(building.name));
}

d3.json('data/buildings.json')
  .then(processData)
  .catch(error => alert(error));

