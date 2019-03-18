let time = 0;
const margin = { top: 10, right: 10, bottom: 140, left: 100 },
	height = 500 - margin.top - margin.bottom,
	width = 800 - margin.left - margin.right,
	maxOptions = {};

const g = d3.select('#chart-area')
	.append('svg')
		.attr('height', height + margin.top + margin.bottom)
		.attr('width', width + margin.left + margin.right)
		.append('g')
			.attr('height', height)
			.attr('width', width)
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// scales
const yScale = d3.scaleLinear()
	.range([height, 0]);

const xScale = d3.scaleLog()
	.range([0, width])
	.base(10);

const rScale = d3.scaleLinear()
	.range([75, 2500]);

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Axis
const xAxis = g.append('g')
	.attr('class', 'x-axis')
	.attr('transform', 'translate(0, ' + height + ')');

const yAxis = g.append('g')
	.attr('class', 'y-axis');

// Labels
const xAxisLabel = g.append('text')
	.attr('x', width / 2)
	.attr('y', height + margin.bottom / 3)
	.attr('text-anchor', 'middle')
	.attr('font-size', '20px')
	.text('GDP per Capita ($)');

const yAxisLabel = g.append('text')
	.attr('x', - height / 2)
	.attr('y', - margin.left / 2)
	.attr('text-anchor', 'middle')
	.attr('font-size', '20px')
	.attr('transform', 'rotate(-90)')
	.text('Life Expectancy (years)');

const yearLabel = g.append('text')
	.attr('x', width)
	.attr('y', height - margin.top)
	.attr('text-anchor', 'end')
	.attr('font-size', '30px')
	.attr('opacity', '0.4');

// create legend
const continents = ['americas', 'asia', 'europe', 'africa'].sort();
const legend = g.append('g')
	.attr('transform', 'translate(' + (width - 15) + ', ' + (height - 120) + ')');

continents.forEach((continent, i) => {
	const legendRow = legend.append('g')
		.attr('transform', 'translate(0, ' + i * 20 + ')');

	const keyBox = legendRow.append('rect')
		.attr('height', 10)
		.attr('width', 10)
		.attr('fill', colorScale(continent));

	const keyName = legendRow.append('text')
		.attr('x', -10)
		.attr('y', 10)
		.attr('text-anchor', 'end')
		.style('text-transform', 'capitalize')
		.text(continent);
});


d3.json('data/data.json').then(data => {
	console.log(data)
	// clean data
	const popArray = [],
		incomeArray = [],
		lifeArray = [];
	data.forEach(year => {
		year.countries = year.countries.filter(country => country.income && country.life_exp);
		popArray.push(d3.max(year.countries, country => country.population));
		incomeArray.push(d3.max(year.countries, country => country.income));
		lifeArray.push(d3.max(year.countries, country => country.life_exp));
	});
	
	// set our max options with our dataset
	maxOptions.year =  data.length - 1;
	maxOptions.population = d3.max(popArray);
	maxOptions.income = d3.max(incomeArray);
	maxOptions.life_exp = d3.max(lifeArray);

	d3.interval(() => {
		// loops over all data repeatedly
		time = time < maxOptions.year ? time + 1 : 0;
		update(data[time]);
	}, 100);
	update(data[time]);
});

const update = year => {
	// console.log(year)
	const t = d3.transition().duration(100);
	//Domains
	yScale.domain([0, maxOptions.life_exp]);
	xScale.domain([105, maxOptions.income]);
	rScale.domain([0, maxOptions.population]);

	// call Axis
	const xAxisCall = d3.axisBottom(xScale)
		.tickFormat(tick => tick + '$')
		.tickValues([400, 4000, 40000]);
	xAxis.call(xAxisCall);
	const yAxisCall = d3.axisLeft(yScale);
	yAxis.call(yAxisCall);

	//Data Join
	const circles = g.selectAll('circle')
		.data(year.countries, country => country.country);

	// Exit
	circles.exit()
		.remove();

	// Enter && Update
	circles.enter()
		.append('circle')
			.attr('fill', country => colorScale(country.continent))
			.attr('r', country => Math.sqrt(rScale(country.population) / Math.PI))
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			.merge(circles)
			.transition(t)
				.attr('cy', country => yScale(country.life_exp))
				.attr('cx', country => xScale(country.income));

	yearLabel.text(year.year);
}