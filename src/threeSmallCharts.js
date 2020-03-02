const d3 = require('d3');

// This class provides functions to create and update the
// small charts for a single rank item.
class threeSmallCharts {

  constructor() {
    this.firstChart;  // medal count chart
    this.secondChart; // athlete count chart
    this.thirdChart;  // medal/athlete ratio chart
  }

  initializeCharts(initDiv) {
    // first chart
    this.firstChart = this.createSmallSVG(initDiv);
    // second chart
    this.secondChart = this.createSmallSVG(initDiv);
    // third chart
    this.thirdChart = this.createSmallSVG(initDiv);
  }

  // Create an initial svg for a small chart
  createSmallSVG(initDiv) {
    return initDiv.append('svg')
      .attr('width', 120)
      .attr('height', 90)
      .style("margin", "5px")
      //.style("display","table-row")
      .style("background-color", "White");
  }


  // Draw the top rank elements onto the small chart
  // given the current topRanks
  // topranks is the array with the ids of top ranked groups in data
  // where id is one of the identifying features in the data object
  // data is the dataset
  drawTopRanks(smallchartdiv, topRanks, data) {
    // console.log(data.length)
    // draw a rectangle element for each result
    // for (var i = 0; i < topRanks.length; i++) {
    //   // create the svg for country row
    //   var smallsvg = smallchartdiv
    //     .append('svg')
    //     .attr('width', 1200)
    //     .attr('height', 460)
    //     .attr("fill", "Black");
    //   // we will create 1 g for each small multiple graph
    //   var g = smallsvg.append("g");
    //   g.append("text")
    //       .attr("x", 0)
    //       .attr("y", 30 + 110)
    //       .style("fill", "Black")
    //       .text(data[i].Name);
    //   g.append("rect")
    //       .attr("x", 300)
    //       .attr("width", 300)
    //       .attr("height", 300)
    //       .style("fill", "White");
    //   g.append("rect")
    //       .attr("x", 600)
    //       .attr("width", 300)
    //       .attr("height", 300)
    //       .style("fill", "Green");
    //   g.append("rect")
    //       .attr("x", 900)
    //       .attr("width", 300)
    //       .attr("height", 300)
    //       .style("fill", "Blue");
    //   }
  }
}

module.exports = threeSmallCharts;
