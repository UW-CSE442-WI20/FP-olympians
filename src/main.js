

// You can require libraries
const d3 = require('d3');

// You can include local JS files:
// const MyClass = require('./my-class');
// const myClassInstance = new MyClass();
// myClassInstance.sayHi();

 const BigChart = require('./bigChart');
 const SmallChart = require('./smallChart');
 const bigChartInstance = new BigChart();
 const smallChartInstance = new SmallChart();

 smallChartInstance.sayHi();

// create svg for smallChart
 const smallsvg = d3.select('#smallchart')
             .append('svg')
             .attr('width', 1200)
             .attr('height',420);
smallsvg.append("circle")
       .attr("cx", 15)
       .attr("cy", 15)
       .attr("r", 10)
       .style("fill", "black");
console.log(smallsvg);
console.log("d3 select: ", d3.select('#smallchart'));
smallChartInstance.drawRank(smallsvg);

// You can load JSON files directly via require.
// Note this does not add a network request, it adds
// the data directly to your JavaScript bundle.
const exampleData = require('./example-data.json');


// Anything you put in the static folder will be available
// over the network, e.g.
d3.csv('olympics.csv')
  .then((data) => {
    console.log('Dynamically loaded CSV data', data);
  })
