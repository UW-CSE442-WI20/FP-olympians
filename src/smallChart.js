// You can separate your code out into modules to
// keep code clean.
const d3 = require('d3');

class smallChart {
  //static smallsvg;

  constructor() {
    // smallsvg = d3.select('#smallchart')
    //       .append('svg')
    //       .attr('width',420)
    //       .attr('height',400);

  }

  sayHi() {
    console.log('[MyClass]', 'Hello World.');
  }

  drawRank(smallsvg) {
    console.log('draw rank');

    smallsvg.append("text")
        .attr("x", 70)
        .attr("y", 200)
        .text("Look it's on the page");
  }
}

module.exports = smallChart;
