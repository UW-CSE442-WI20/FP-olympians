const d3 = require('d3');
// const ThreeSmallCharts = require("./threeSmallCharts");

// This class contains functions to create and update the rank rows,
// which display the top results data.
class rankRows {

  constructor(rowDiv, topCountryToRatio) {
    // all the div elements for all of the rank rows
    // (1 div per row)
    this.topDivs = [];
    for (var i = 0; i < topCountryToRatio.length; i++) {
      newDiv = rowDiv.append("div")
        .style("top", 0)
        .style("left", 0)
        .style("width", "190px")
        .style("height", "60px")
        .style("margin-top", "6px")
        .style("margin-bottom", "6px")
        .style("background-color", "Gray")
        .style("display","flex")
        .style("flex-direction","row")
        .style("justify-content","flex-start")
        .style("align-items","center")
        .attr("id", "placehere" + i);
      this.topDivs.push(newDiv);
    }

    // add image to each row here
    for (var i = 0; i < topCountryToRatio.length; i++) {
      countryName = topCountryToRatio[i].key.replace(/ /g,"-");
      console.log(countryName);
      d3.select("#placehere" + i).append("img")
          .attr("src","flags/" + countryName + "-flag.svg")
          .attr("id", "img" + i)
          .attr("width", 90)
          .attr("height", 60);
      //d3.select("#placehere" + i).append("svg");
      // var elem = document.createElement("img");
      // elem.setAttribute("src", "flag_AUS.png");
      // //elem.setAttribute("src", "https://stillmed.olympic.org/media/Images/OlympicOrg/Countries/A/Afghanistan/CNO-AFG.jpg?interpolation=lanczos-none&resize=253:*");
      // elem.setAttribute("height", "60");
      // elem.setAttribute("width", "90");
      // elem.setAttribute("alt", "AUS flag");
      // document.getElementById("placehere" + i).appendChild(elem);
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
      var nameDiv = mainDiv.append("div")//this.topDivs[i].append("div")
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
      var ratioDiv = mainDiv.append("div")//this.topDivs[i].append("div")
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

updateRankRows(rowDiv, topCountryToRatio) {
  // clear all previous data, transition
  console.log("trying to updateRankRows");

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

  // update country labels for each row
  for (var i = 0; i < topCountryToRatio.length; i++) {
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
    //     .transition()
    //     .text(this.roundRank(topCountryToRatio[i].value));
  }
}

  // Draw the top rank elements onto the small chart
  // given the current topRanks
  // topranks is the array with the ids of top ranked groups in data
  // where id is one of the identifying features in the data object
  // data is the dataset
  //drawTopRanks(smallchartdiv, topRanks, data) {
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
  //}
}

module.exports = rankRows;
