/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    6.8 - Line graphs in D3
 */

let formattedData = {};

var margin = { left: 80, right: 100, top: 50, bottom: 100 },
  height = 500 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// Time parser for x-scale
var parseTime = d3.timeParse("%d/%m/%Y");
// For tooltip
var bisectDate = d3.bisector(d => {
  console.log(d);
  return d.date;
}).left;

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axis generators
var xAxisCall = d3.axisBottom();
var yAxisCall = d3
  .axisLeft()
  .ticks(6)
  .tickFormat(d => {
    return parseInt(d / 1000) + "k";
  });

// Axis groups
var xAxis = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g").attr("class", "y axis");

// Y-Axis label
yAxis
  .append("text")
  .attr("class", "axis-title")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .attr("fill", "#5D6971")
  .text("Population)");
// create line but without path
g.append("path")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "grey")
  .attr("stroke-with", "3px");

d3.json("data/coins.json").then(data => {
  const keys = Object.keys(data);
  const cleaningData = Object.values(data);
  // Data cleaning
  cleaningData.forEach((coins, i) => {
    // filter out null values
    coins = coins.filter(coin => {
      return (
        coin.market_cap !== null &&
        coin.price_usd !== null &&
        coin["24h_vol"] !== null
      );
    });
    // replace strings with integers and date objects
    coins.forEach(coin => {
      coin.date = parseTime(coin.date);
      coin.market_cap = +coin.market_cap;
      coin.price_usd = +coin.price_usd;
      coin["24h_vol"] = +coin["24h_vol"];
    });
    // set formatted data
    formattedData[keys[i]] = coins;
  });

  update();
});

$("#var-select").on("change", () => {
  update();
});

$("#coin-select").on("change", () => {
  update();
});

const update = () => {
  const metric = $("#var-select").val(),
    coin = $("#coin-select").val(),
    filteredData = formattedData[coin].filter(d => {
      return d.date;
    });
  // Set scale domains
  x.domain(
    d3.extent(formattedData[coin], d => {
      return d.date;
    })
  );
  y.domain([
    d3.min(formattedData[coin], d => {
      return d[metric];
    }) / 1.005,
    d3.max(formattedData[coin], d => {
      return d[metric];
    }) * 1.005
  ]);

  // Generate axes once scales have been set
  xAxis.call(xAxisCall.scale(x));
  yAxis.call(yAxisCall.scale(y));

  /******************************** Tooltip Code ********************************/
  d3.select(".focus").remove();
  d3.select(".overlay").remove();

  var focus = g
    .append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus
    .append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height);

  focus
    .append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", 0)
    .attr("x2", width);

  focus.append("circle").attr("r", 7.5);

  focus
    .append("text")
    .attr("x", 15)
    .attr("dy", ".31em");

  g.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", () => {
      focus.style("display", null);
    })
    .on("mouseout", () => {
      focus.style("display", "none");
    })
    .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(formattedData[coin], x0, 1),
      d0 = formattedData[coin][i - 1],
      d1 = formattedData[coin][i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr(
      "transform",
      "translate(" + x(d.date) + "," + y(d[metric]) + ")"
    );
    focus.select("text").text(d[metric]);
    focus.select(".x-hover-line").attr("y2", height - y(d[metric]));
    focus.select(".y-hover-line").attr("x2", -x(d.date));
  }

  /******************************** Tooltip Code ********************************/

  // Line path generator
  var line = d3
    .line()
    .x(d => {
      return x(d.date);
    })
    .y(d => {
      return y(d[metric]);
    });

  // Add line to chart
  d3.select(".line").attr("d", line(formattedData[coin]));
};
