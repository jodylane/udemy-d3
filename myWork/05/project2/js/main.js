let time = 0;
d3.json('data/data.json').then(data => {
	console.log(data)
	// clean data
	data.forEach(year => {
		year.year = +year.year;
		year.countries = year.countries.filter(country => country.income && country.life_exp);
	});

	// find the max year in data set
	const maxYear =  data.length - 1;

	d3.interval(() => {
		// loops over all data repeatedly
		time = time < maxYear ? time + 1 : 0;
		update(data[time]);
	}, 100);
	update(data[time]);
});

const update = year => {
	console.log(year)
	//Domains

	//Data Join

	// Exit

	// Enter && Update
}