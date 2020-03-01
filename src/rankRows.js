const d3 = require('d3');
// const ThreeSmallCharts = require("./threeSmallCharts");

// This class contains functions to create and update the rank rows,
// which display the top results data.
class rankRows {

  constructor(rowDiv, numRows) {
    // all the div elements for all of the rank rows
    // (1 div per row)
    this.topDivs = [];
    for (var i = 0; i < numRows; i++) {
      newDiv = rowDiv.append("div")
        .style("top", 0)
        .style("left", 0)
        .style("width", "100px")
        .style("height", "80px")
        .style("margin", "8px")
        .style("background-color", "Pink")
        .style("display","flex")
        .style("flex-direction","column")
        .style("justify-content","space-between")
        .attr("id", "placehere" + i);
      this.topDivs.push(newDiv);
    }

    for (var i = 0; i < numRows; i++) {
      // add image to each row here
      var elem = document.createElement("img");
      elem.setAttribute("src", "flag_AUS.png");
      //elem.setAttribute("src", "https://stillmed.olympic.org/media/Images/OlympicOrg/Countries/A/Afghanistan/CNO-AFG.jpg?interpolation=lanczos-none&resize=253:*");
      elem.setAttribute("height", "60");
      elem.setAttribute("width", "90");
      elem.setAttribute("alt", "AUS flag");
      document.getElementById("placehere" + i).appendChild(elem);
    }

    // create text labels for each row
    for (var i = 0; i < numRows; i++) {
      this.topDivs[i].append("div")
        .attr("width", "100px")
        .attr("height", "40px")
        .style("padding", "5px")
      .append("text")
        .attr("x", "0")
        .attr("y", "0")
        .style('color', 'White')
        .text("Country" + (i+1));
    }

    // instance to create and update small charts
  //  const detailChartsInstance = new ThreeSmallCharts();

    // add the three small charts to each rank row
    // for (var i = 0; i < numRows; i++) {
    //   var chartDiv = this.topDivs[i].append("div")
    //     .attr("width", "20px")
    //     .attr("height", "40px");
    //   detailChartsInstance.initializeCharts(chartDiv); //(this.topDivs[i]);
    // }

    // this.firstDiv = rowDiv.append("div").style("background-color", "Black").style("display","table");
    // this.secondDiv = rowDiv.append("div").style("background-color", "Blue").style("display","table");
    // this.thirdDiv = rowDiv.append("div").style("background-color", "Green").style("display","table");
    // this.smallCharts = new ThreeSmallCharts(this.firstDiv, this.secondDiv, this.thirdDiv);
  }

  // draw

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

module.exports = rankRows;
