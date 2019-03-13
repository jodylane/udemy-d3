/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

var margin = { top: 10, right: 10, bottom: 100, left: 100 },
	height = 400 - margin.top - margin.bottom,
	width = 700 - margin.left - margin.right;

var t = d3.transition().duration(100);

var g = d3.select('#chart-area')
	.append('svg')
		.attr('height', height + margin.top + margin.bottom)
		.attr('width', width + margin.left + margin.right)
		.append('g')
			.attr('height', height)
			.attr('width', width)
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

g.append('text')
	.attr('x', width / 2)
	.attr('y', height + margin.bottom - 5)
	.attr('text-anchor', 'middle')
	.attr('font-size', '20px')
	.text('GDP Per Capita ($)')

g.append('text')
	.attr('x', - height / 2)
	.attr('y', - margin.left / 2)
	.attr('transform', 'rotate(-90)')
	.attr('text-anchor', 'middle')
	.attr('font-size', '20px')
	.text('Life Expectancy (Years)');

var ordinalScale = d3.scaleOrdinal()
	.range(d3.schemeCategory10)

var xScale = d3.scaleLog()
	.range(0, width)
	.paddingInner(0.2)
	.paddingOuter(0.2);

var xAxisGroup = g.append('g')
	.attr('class', 'x-axis')
	.attr('transform', 'translate(0, ' + height + ')');

var yScale = d3.scaleLinear()
	.range([height, 0]);

var yAxisGroup = g.append('g')
	.attr('class', 'y-axis');




d3.json("data/data.json").then(function(data){
	data.forEach(data => {
		data.year = +data.year;
		data.countries = data.countries.filter(d => d.income !== null && d.life_exp !== null);
	});
	console.log(data);
	
	d3.interval(() => {
		update(data);
	}, 750);
	// render update before first loop is called
	update(data);
});

var update = data => {
	// data join
	var circles = d3.selectAll('circle')
		.data(data, data => data.income);

	// EXIT

	// UPDATE

	// ENTER
}