const d3 = require('d3');

// This class contains functions to create and update the rank rows,
// which display the top results data.
class rankRows {

  constructor(rowDiv, topCountryToRatio) {
    // save the results from the previous hover/click (country names)
    this.previousRankings = [];
    for (var i = 0; i < topCountryToRatio.length; i++) {
      countryName = topCountryToRatio[i].key.replace(/ /g,"");
      this.previousRankings[i] = countryName;
    }
    // all the div elements for all of the rank rows
    // (1 div per row)
    this.topDivs = [];
    for (var i = 0; i < topCountryToRatio.length; i++) {
      // get country name
      countryName = topCountryToRatio[i].key.replace(/ /g,"");
      console.log(countryName);
      if (topCountryToRatio[i].value > 0) {
        newDiv = rowDiv.append("div")
        .attr("id", "row" + countryName)
        .style("position", "absolute")
        .style("top", (i)*10 + "%")
        // .style("left", 0)
        .style("width", "190px")
        .style("height", "60px")
        .style("margin-top", "6px")
        .style("margin-bottom", "6px")
        .style("background-color", "#B0C4DE")
        .style("display","flex")
        .style("flex-direction","row")
        .style("justify-content","flex-start")
        .style("align-items","center");
        this.topDivs.push(newDiv);

        // add image to each row here
        // get country name
        imgcountryName = topCountryToRatio[i].key.replace(/ /g,"-");
        countryName = topCountryToRatio[i].key.replace(/ /g,"");
        console.log(imgcountryName);
        d3.select("#row" + countryName).append("img")
        .attr("src","flags/" + imgcountryName + "-flag.svg")
        .attr("id", "img" + countryName)
        .attr("width", 90)
        .attr("height", 60);

        // create text labels for each row
        // get country name
        countryName = topCountryToRatio[i].key.replace(/ /g,"");
        console.log(countryName);
        // mainDiv contains the right side of the rank item (the text)
        var mainDiv = this.topDivs[i].append("div")
        .attr("width", "90px")
        .attr("height", "40px")
        .attr("id", "mainDiv" + countryName)
        .style("padding", "5px")
        .attr("display", "flex")
        .attr("flex-direction", "column")
        .attr("justify-content", "center")
        .attr("align-content", "center");
        var nameDiv = mainDiv.append("div")
        .attr("width", "90px")
        .attr("height", "20px")
        .attr("id", "country" + countryName)
        .style("padding", "2px")
        .append("text")
        .attr("x", "40")
        .attr("y", "10")
        .style('color', 'White')
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("text-anchor", "center")  // centering doesn't work
        .text(topCountryToRatio[i].key);
        var ratioDiv = mainDiv.append("div")
        .attr("width", "90px")
        .attr("height", "20px")
        .attr("id", "ratio" + countryName)
        .style("padding", "2px")
        .append("text")
        .attr("x", "40px")
        .attr("y", "10px")
        .style('color', "#000080")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("text-anchor", "center")  // centering doesn't work
        .text(this.roundRank(topCountryToRatio[i].value));
      } // end of if
    }
  }

  // Round ranking to the 2 decimal places
  roundRank(rank) {
    return Number(Math.round(rank + 'e' + 2) + 'e-' + 2);
  }

  // Update the rank rows based on new year or new sport selection,
  // animate transitions as appropriate
  updateRankRowsSport(rowDiv, topCountryToRatio) {
    var countryName = "";
    var imgcountryName = "";
    // Remove all old elements
    for (var i = 0; i < this.previousRankings.length; i++) {
      d3.select('#row' + this.previousRankings[i]).remove();
    }

    // Add all new elements
    for (var i = 0; i < topCountryToRatio.length; i++) {
      if (topCountryToRatio[i].value > 0) {
        countryName = topCountryToRatio[i].key.replace(/ /g,"");
        imgcountryName = topCountryToRatio[i].key.replace(/ /g,"-");

        // add in new element
        rowDiv.append("div")
        .attr("id", "row" + countryName)  // new country
        .style("position", "absolute")
        .style("top", "90%")
        // .style("left", 0)
        .style("width", "190px")
        .style("height", "60px")
        .style("margin-top", "6px")
        .style("margin-bottom", "6px")
        .style("background-color", "#B0C4DE")
        .style("display","flex")
        .style("flex-direction","row")
        .style("justify-content","flex-start")
        .style("align-items","center")
        .style("opacity", 0.5)
        .transition()  // slide up from bottom
        .delay(500)
        .style("top", (i)*10 + "%")
        .style("opacity", 1.0);

        // add image
        d3.select("#row" + countryName).append("img")
        .attr("src","flags/" + imgcountryName + "-flag.svg")
        .attr("id", "img" + countryName)
        .attr("width", 90)
        .attr("height", 60);

        // add text labels
        // mainDiv contains the right side of the rank item (the text)
        var mainDiv = d3.select("#row" + countryName).append("div")
        .attr("width", "90px")
        .attr("height", "40px")
        .attr("id", "mainDiv" + countryName)
        .style("padding", "5px")
        .attr("display", "flex")
        .attr("flex-direction", "column")
        .attr("justify-content", "center")
        .attr("align-content", "center");
        // add country name label
        var nameDiv = mainDiv.append("div")
        .attr("width", "90px")
        .attr("height", "20px")
        .attr("id", "country" + countryName)
        .style("padding", "2px")
        .append("text")
        .attr("x", "40")
        .attr("y", "10")
        .style('color', 'White')
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("text-anchor", "center")  // centering doesn't work
        .text(topCountryToRatio[i].key);
        // add ratio label
        var ratioDiv = mainDiv.append("div")
        .attr("width", "90px")
        .attr("height", "20px")
        .attr("id", "ratio" + countryName)
        .style("padding", "2px")
        .append("text")
        .attr("x", "40px")
        .attr("y", "10px")
        .style('color', "#000080")
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
      }  // end of if
    }
    // update previousRankings
    this.previousRankings = [];  // clear
    for (var i = 0; i < topCountryToRatio.length; i++) {
      if (topCountryToRatio[i].value > 0) {
        countryName = topCountryToRatio[i].key.replace(/ /g,"");
        this.previousRankings[i] = countryName;
      }
    }
    //console.log("previous rankings after update: ", this.previousRankings);
  }

  // Update the rank rows based on new year selection.  Perform swaps between
  // continuing countries or perform a fade-in/fade-out between new results.
  updateRankRowsYear(rowDiv, topCountryToRatio) {
    var oldswappedIndex = [];
    var newswappedIndex = [];
    var countryName = ""; // country name used for IDs (no spaces)
    var imgcountryName = "";  // country name used for img files (spaces replaced with '-')

    // check for elements that need to be swapped first
    for (var i = 0; i < this.previousRankings.length; i++) {
      for (var j = 0; j < topCountryToRatio.length; j++) {
        // get country name
        countryName = topCountryToRatio[j].key.replace(/ /g,"");
        // found a swap
        if (topCountryToRatio[j].value > 0 && this.previousRankings[i] === countryName) {
          console.log("swapping", countryName);
          oldswappedIndex.push(i);  // the old index position (finished)
          newswappedIndex.push(j);  // the new index position (finished)
          // perform swap
          d3.select('#row' + countryName)
          .style("position","absolute")
          .style("top", (i)*10 + "%")
          .transition()
          .delay(50)
          .style("top", (j)*10 + "%");
          // update ratio label
          d3.select("#ratio" + countryName).remove();
          var ratioDiv = d3.select("#mainDiv" + countryName).append("div")
          .attr("width", "90px")
          .attr("height", "20px")
          .attr("id", "ratio" + countryName)
          .style("padding", "2px")
          .append("text")
          .attr("x", "40px")
          .attr("y", "10px")
          .style('color', "#000080")
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .attr("text-anchor", "center")  // centering doesn't work
          .text(this.roundRank(topCountryToRatio[j].value));
        }
      }
    }

    // Update rest of elements (that were not swapped)
    for (var i = 0; i < topCountryToRatio.length; i++) {
      // get country name
      countryName = topCountryToRatio[i].key.replace(/ /g,"");
      // Remove old elements
      if (!oldswappedIndex.includes(i)) {
        d3.select('#row' + this.previousRankings[i])
        .style("opacity", 1.0)
        .transition()
        .delay(50)
        .style("opacity", 0.0);
        d3.select('#row' + this.previousRankings[i])
        .remove();
      }
      // Add new elements
      if (topCountryToRatio[i].value > 0 && !newswappedIndex.includes(i)) {
        rowDiv.append("div")
        .attr("id", "row" + countryName)  // new country
        .style("position", "absolute")
        .style("top", (i)*10 + "%")
        // .style("left", 0)
        .style("width", "190px")
        .style("height", "60px")
        .style("margin-top", "6px")
        .style("margin-bottom", "6px")
        .style("background-color", "#B0C4DE")
        .style("display","flex")
        .style("flex-direction","row")
        .style("justify-content","flex-start")
        .style("align-items","center")
        .style("opacity", 0.0)
        .transition()
        .delay(100)
        .style("opacity", 1.0);

        // add image
        imgcountryName = topCountryToRatio[i].key.replace(/ /g,"-");
        console.log(imgcountryName);
        d3.select("#row" + countryName).append("img")
        .attr("src","flags/" + imgcountryName + "-flag.svg")
        .attr("id", "img" + countryName)
        .attr("width", 90)
        .attr("height", 60);

        // add text labels
        // mainDiv contains the right side of the rank item (the text)
        var mainDiv = d3.select("#row" + countryName).append("div")
        .attr("width", "90px")
        .attr("height", "40px")
        .attr("id", "mainDiv" + countryName)
        .style("padding", "5px")
        .attr("display", "flex")
        .attr("flex-direction", "column")
        .attr("justify-content", "center")
        .attr("align-content", "center");
        // add country name label
        var nameDiv = mainDiv.append("div")
        .attr("width", "90px")
        .attr("height", "20px")
        .attr("id", "country" + countryName)
        .style("padding", "2px")
        .append("text")
        .attr("x", "40")
        .attr("y", "10")
        .style('color', 'White')
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("text-anchor", "center")  // centering doesn't work
        .text(topCountryToRatio[i].key);
        // add ratio label
        var ratioDiv = mainDiv.append("div")
        .attr("width", "90px")
        .attr("height", "20px")
        .attr("id", "ratio" + countryName)
        .style("padding", "2px")
        .append("text")
        .attr("x", "40px")
        .attr("y", "10px")
        .style('color', "#000080")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("text-anchor", "center")  // centering doesn't work
        .text(this.roundRank(topCountryToRatio[i].value));
      }

    }
    // update previousRankings
    this.previousRankings = [];  // clear
    for (var i = 0; i < topCountryToRatio.length; i++) {
      if (topCountryToRatio[i].value > 0) {
        countryName = topCountryToRatio[i].key.replace(/ /g,"");
        this.previousRankings[i] = countryName;
      }
    }
  }
}

module.exports = rankRows;
