const d3 = require('d3');

// This class contains functions to create and update the rank rows,
// which display the top results data.
class rankRows {

  constructor(rowDiv, topCountryToRatio) {
    // all the div elements for all of the rank rows
    // (1 div per row)
    this.topDivs = [];
    for (var i = 0; i < topCountryToRatio.length; i++) {
      newDiv = rowDiv.append("div")
        .attr("id", "row" + i)
        // .style("top", 0)
        // .style("left", 0)
        .style("width", "190px")
        .style("height", "60px")
        .style("margin-top", "6px")
        .style("margin-bottom", "6px")
        .style("background-color", "Gray")
        .style("display","flex")
        .style("flex-direction","row")
        .style("justify-content","flex-start")
        .style("align-items","center");
      this.topDivs.push(newDiv);
    }

    // add image to each row here
    for (var i = 0; i < topCountryToRatio.length; i++) {
      countryName = topCountryToRatio[i].key.replace(/ /g,"-");
      console.log(countryName);
      d3.select("#row" + i).append("img")
          .attr("src","flags/" + countryName + "-flag.svg")
          .attr("id", "img" + i)
          .attr("width", 90)
          .attr("height", 60);
    }

    // create text labels for each row
    for (var i = 0; i < topCountryToRatio.length; i++) {
      // mainDiv contains the right side of the rank item (the text)
      var mainDiv = this.topDivs[i].append("div")
        .attr("width", "90px")
        .attr("height", "40px")
        .attr("id", "mainDiv" + i)
        .style("padding", "5px")
        .attr("display", "flex")
        .attr("flex-direction", "column")
        .attr("justify-content", "center")
        .attr("align-content", "center");
      var nameDiv = mainDiv.append("div")
        .attr("width", "90px")
        .attr("height", "20px")
        .attr("id", "country" + i)
        .style("padding", "2px")
        .append("text")
        .attr("x", "40")
        .attr("y", "10")
        .style('color', 'White')
        .style("font-size", "12px")
        .attr("text-anchor", "center")  // centering doesn't work
        .text(topCountryToRatio[i].key);
      var ratioDiv = mainDiv.append("div")
        .attr("width", "90px")
        .attr("height", "20px")
        .attr("id", "ratio" + i)
        .style("padding", "2px")
        .append("text")
        .attr("x", "40px")
        .attr("y", "10px")
        .style('color', "Red")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("text-anchor", "center")  // centering doesn't work
        .text(this.roundRank(topCountryToRatio[i].value));
    }
  }

// Round ranking to the 2 decimal places
roundRank(rank) {
      return Number(Math.round(rank + 'e' + 2) + 'e-' + 2);
  }

// Update the rank rows based on new year or new sport selection,
// animate transitions as appropriate
updateRankRows(rowDiv, topCountryToRatio) {
  // clear all previous data, transition

  // replace image to each row here
  for (var i = 0; i < topCountryToRatio.length; i++) {
    countryName = topCountryToRatio[i].key.replace(/ /g,"-");
    console.log(countryName);
    d3.select("#img" + i)
        .transition()
        .attr("src","flags/" + countryName + "-flag.svg")
        .attr("width", 90)
        .attr("height", 60);
  }

  // update rest of elements (how should these be looped correctly?)
  for (var i = 0; i < topCountryToRatio.length; i++) {
    d3.select('#row' + i)
      .style("position","absolute")
      .style("top","90%")
      .transition()
      .delay(250)
      .style("top", "" + (i+1)*9 + "%");

    // update country labels for each row
    d3.select("#country" + i).remove();
    var nameDiv = d3.select("#mainDiv" + i).append("div")
            .attr("width", "90px")
            .attr("height", "20px")
            .attr("id", "country" + i)
            .style("padding", "2px")
            .append("text")
            .attr("x", "40")
            .attr("y", "10")
            .style('color', 'White')
            .style("font-size", "12px")
            .attr("text-anchor", "center")  // centering doesn't work
            .text(topCountryToRatio[i].key);

    // update ratio labels for each row
    d3.select("#ratio" + i).remove();
    var ratioDiv = d3.select("#mainDiv" + i).append("div")
            .attr("width", "90px")
            .attr("height", "20px")
            .attr("id", "ratio" + i)
            .style("padding", "2px")
            .append("text")
            .attr("x", "40px")
            .attr("y", "10px")
            .style('color', "Red")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .attr("text-anchor", "center")  // centering doesn't work
            .text(this.roundRank(topCountryToRatio[i].value));

    // d3 transitions doesn't preserve css styling...
    // d3.select("#country" + i)
    //     .transition()
    //     .text(topCountryToRatio[i].key);
    //
    // d3.select("#ratio" + i)
    //     .style("position","absolute")
    //     .style("left","0px")
    //     .transition()
    //     .style("left","50px")
    //     .text(this.roundRank(topCountryToRatio[i].value));

    }
  }
}

module.exports = rankRows;
