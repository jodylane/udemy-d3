var processData = data => {
  data.forEach(d => {
    d.age = +d.age;
  });

  // adds svg to DOM
var svg = d3.select('#root')
.append('svg')
  .attr('width', '500px')
  .attr('height', '300px');

var circles = svg.selectAll('circle')
.data(data);

// adds circles to svg
/* notes: 
* this gives the effect of padding between circle & square
* cy value is padding + radius
* cx value is rect.x + rect.width
**/ 

circles.enter()
.append('circle')
  .attr('cx', function (d, i) {
    return (i * 50) + 25;
  })
  .attr('cy', 25)
  .attr('r', (d, i) => {
    return d.age * 2;
  })
  .attr('fill', d => {
    if (d.name === 'Tony') {
      return 'red';
    }
    return 'blue';
  });

}

var processError = error => alert(error);

d3.json('data/ages.json')
  .then(processData)
  .catch(processError);

d3.csv('data/ages.csv')
  .then(processData)
  .catch(processError);

d3.tsv('data/ages.tsv')
  .then(processData)
  .catch(processError);

