const d3 = require('d3');

// This class contains functions to create and update the rank rows,
// which display the top results data.
class rankRows {

  constructor(rowDiv, topCountryToRatio) {
    // save the results from the previous hover/click (country names)
    this.previousRankings = [];
    for (var i = 0; i < topCountryToRatio.length; i++) {
      countryName = topCountryToRatio[i].key.replace(/ /g,"");
      this.previousRankings[i] = countryName; //topCountryToRatio[i].key;
    }
    //this.previousRankings = topCountryToRatio;
    // all the div elements for all of the rank rows
    // (1 div per row)
    this.topDivs = [];
    for (var i = 0; i < topCountryToRatio.length; i++) {
      // get country name
      countryName = topCountryToRatio[i].key.replace(/ /g,"");
      console.log(countryName);

      newDiv = rowDiv.append("div")
        .attr("id", "row" + countryName)
        .style("position", "absolute")
        .style("top", (i+1)*10 + "%")
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
      // get country name
      imgcountryName = topCountryToRatio[i].key.replace(/ /g,"-");
      countryName = topCountryToRatio[i].key.replace(/ /g,"");
      console.log(imgcountryName);
      d3.select("#row" + countryName).append("img")
          .attr("src","flags/" + imgcountryName + "-flag.svg")
          .attr("id", "img" + countryName)
          .attr("width", 90)
          .attr("height", 60);
    }

    // create text labels for each row
    for (var i = 0; i < topCountryToRatio.length; i++) {
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
updateRankRowsSport(rowDiv, topCountryToRatio) {
  console.log("previous rankings before update: ", this.previousRankings);
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
      //.style("top", .9*668 + "%")
      .transition()
      .delay(250)
      //.style("top", (i/50)*668+10 + "%");
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
    // update previousRankings
    for (var i = 0; i < topCountryToRatio.length; i++) {
      this.previousRankings[i] = topCountryToRatio[i].key;
    }
    console.log("previous rankings after update: ", this.previousRankings);
  }

  // Update the rank rows based on new year or new sport selection,
  // animate transitions as appropriate
  updateRankRowsYear(rowDiv, topCountryToRatio) {
    console.log("previous rankings before update: ", this.previousRankings);

    var oldswappedIndex = [];
    var newswappedIndex = [];
    // check for swapping first
    for (var i = 0; i < this.previousRankings.length; i++) {
      for (var j = 0; j < topCountryToRatio.length; j++) {
        // get country name
        countryName = topCountryToRatio[j].key.replace(/ /g,"");
        //console.log(countryName);
        // found a swap
        if (this.previousRankings[i] === countryName) {
          console.log("swapping", countryName);
          // get previous index
          //var index = this.previousRankings.indexOf(countryName);
          //console.log("index", index);
          console.log("i", i);
          console.log("j", j);
          oldswappedIndex.push(i);  // the old index position (finished)
          newswappedIndex.push(j);  // the new index position (finished)
          d3.select('#row' + countryName)
            .style("position","absolute")
            .style("top", (i+1)*10 + "%")//(index+1)*9 + "%")
            .transition()
            .delay(1000)
            .style("top", (j+1)*10 + "%");//(i+1)*9 + "%");
        }
      }
    }

    // update elements that were not swapped
    for (var i = 0; i < topCountryToRatio.length; i++) {
      // get country name
      countryName = topCountryToRatio[i].key.replace(/ /g,"");

      if (!oldswappedIndex.includes(i)) {
        console.log("not swapping index", i)
        // need to update
        // replace old element from new element
        d3.select('#row' + this.previousRankings[i])
          .style("opacity", 1.0)
          .transition()
          .delay(500)
          .style("opacity", 0.2);
        d3.select('#row' + this.previousRankings[i])
          .remove();  // corresponding old element
      }
        if (!newswappedIndex.includes(i)) {
          // ADD new element
          rowDiv.append("div")
            .attr("id", "row" + countryName)  // new country
            .style("position", "absolute")
            .style("top", (i+1)*10 + "%")
            // .style("left", 0)
            .style("width", "190px")
            .style("height", "60px")
            .style("margin-top", "6px")
            .style("margin-bottom", "6px")
            .style("background-color", "Gray")
            .style("display","flex")
            .style("flex-direction","row")
            .style("justify-content","flex-start")
            .style("align-items","center")
            .style("opacity", 0.2)
            .transition()
            .delay(2000)
            .style("opacity", 1.0);
        }

    }



    // replace image to each row here
    // for (var i = 0; i < topCountryToRatio.length; i++) {
    //   // get country name
    //   countryName = topCountryToRatio[i].key.replace(/ /g,"");
    //   console.log(countryName);
    //
    //   // need to swap
    //   if (this.previousRankings.includes(countryName)) {
    //     console.log("swapping", countryName);
    //     // get previous index
    //     var index = this.previousRankings.indexOf(countryName);
    //     console.log("index", index);
    //     console.log("i", i);
    //     d3.select('#row' + countryName)
    //       .style("position","absolute")
    //       .style("top", (index+1)*10 + "%")//(index+1)*9 + "%")
    //       .transition()
    //       .delay(2000)
    //       .style("top", (i+1)*10 + "%");//(i+1)*9 + "%");
    //   } else {
    //     console.log("not swapping", countryName);
    //     // replace old element from new element
    //     d3.select('#row' + this.previousRankings[i])  // corresponding old element
    //       //.style("position","absolute")
    //       .style("opacity", 1.0)
    //       //.style("top", "0%")
    //       .transition()
    //       .delay(250)
    //       .style("opacity", 0.2)
    //       //.style("top", "90%");
    //   }


      // d3.select("#img" + i)
      //     .transition()
      //     .attr("src","flags/" + countryName + "-flag.svg")
      //     .attr("width", 90)
      //     .attr("height", 60);
    //}

    // update rest of elements (how should these be looped correctly?)
    // for (var i = 0; i < topCountryToRatio.length; i++) {
    //   // d3.select('#row' + i)
    //   //   .style("position","absolute")
    //   //   .style("top","90%")
    //   //   .transition()
    //   //   .delay(250)
    //   //   .style("top", "" + (i+1)*9 + "%");
    //
    //   // update country labels for each row
    //   d3.select("#country" + i).remove();
    //   var nameDiv = d3.select("#mainDiv" + i).append("div")
    //           .attr("width", "90px")
    //           .attr("height", "20px")
    //           .attr("id", "country" + i)
    //           .style("padding", "2px")
    //           .append("text")
    //           .attr("x", "40")
    //           .attr("y", "10")
    //           .style('color', 'White')
    //           .style("font-size", "12px")
    //           .attr("text-anchor", "center")  // centering doesn't work
    //           .text(topCountryToRatio[i].key);
    //
    //   // update ratio labels for each row
    //   d3.select("#ratio" + i).remove();
    //   var ratioDiv = d3.select("#mainDiv" + i).append("div")
    //           .attr("width", "90px")
    //           .attr("height", "20px")
    //           .attr("id", "ratio" + i)
    //           .style("padding", "2px")
    //           .append("text")
    //           .attr("x", "40px")
    //           .attr("y", "10px")
    //           .style('color', "Red")
    //           .style("font-size", "12px")
    //           .style("font-weight", "bold")
    //           .attr("text-anchor", "center")  // centering doesn't work
    //           .text(this.roundRank(topCountryToRatio[i].value));

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
      //}
      // update previousRankings
      for (var i = 0; i < topCountryToRatio.length; i++) {
        countryName = topCountryToRatio[i].key.replace(/ /g,"");
        this.previousRankings[i] = countryName;//topCountryToRatio[i].key;
      }
      console.log("previous rankings after update: ", this.previousRankings);
    }

  // Update the rank rows based on new year or new sport selection,
  // animate transitions as appropriate
  // updateRankRowsYear(rowDiv, topCountryToRatio) {
  //   // clear all previous data, transition
  //
  //   // replace image to each row here
  //   // for (var i = 0; i < topCountryToRatio.length; i++) {
  //   //   countryName = topCountryToRatio[i].key.replace(/ /g,"-");
  //   //   console.log(countryName);
  //   //   d3.select("#img" + i)
  //   //       .transition()
  //   //       .attr("src","flags/" + countryName + "-flag.svg")
  //   //       .attr("width", 90)
  //   //       .attr("height", 60);
  //   // }
  //
  //   // update rest of elements (how should these be looped correctly?)
  //   for (var i = 0; i < topCountryToRatio.length; i++) {
  //     // var currPrevRankings = this.previousRankings;
  //     // console.log("currPrevRankings", currPrevRankings);
  //     // if this is a swapping transition
  //     if (this.previousRankings.includes(topCountryToRatio[i].key)) {
  //       console.log("It's a repeat!", topCountryToRatio[i].key);
  //       console.log("previous rankings", this.previousRankings);
  //       // get index in previousRankings
  //       var index = this.previousRankings.indexOf(topCountryToRatio[i].key);
  //       console.log("index", index);
  //       console.log("i", i);
  //       // update image
  //         countryName = topCountryToRatio[i].key.replace(/ /g,"-");
  //         console.log("coutnryName",countryName);
  //         d3.select("#img" + i)
  //             .transition()
  //             .attr("src","flags/" + countryName + "-flag.svg")
  //             .attr("width", 90)
  //             .attr("height", 60);
  //       // swap
  //       d3.select('#row' + index)
  //         .style("position","absolute")
  //         //.style("top","" + (index+1)*9 + "%")  // original position
  //         .transition()
  //         .delay(1000)
  //         .style("top", "" + (i+1)*9 + "%");  // new position
  //       console.log("swapped?", index);
  //
  //         // update country labels for each row
  //         d3.select("#country" + i).remove();
  //         var nameDiv = d3.select("#mainDiv" + i).append("div")
  //                 .attr("width", "90px")
  //                 .attr("height", "20px")
  //                 .attr("id", "country" + i)
  //                 .style("padding", "2px")
  //                 .append("text")
  //                 .attr("x", "40")
  //                 .attr("y", "10")
  //                 .style('color', 'White')
  //                 .style("font-size", "12px")
  //                 .attr("text-anchor", "center")  // centering doesn't work
  //                 .text(topCountryToRatio[i].key);
  //
  //         // update ratio labels for each row
  //         d3.select("#ratio" + i).remove();
  //         var ratioDiv = d3.select("#mainDiv" + i).append("div")
  //                 .attr("width", "90px")
  //                 .attr("height", "20px")
  //                 .attr("id", "ratio" + i)
  //                 .style("padding", "2px")
  //                 .append("text")
  //                 .attr("x", "40px")
  //                 .attr("y", "10px")
  //                 .style('color', "Red")
  //                 .style("font-size", "12px")
  //                 .style("font-weight", "bold")
  //                 .attr("text-anchor", "center")  // centering doesn't work
  //                 .text(this.roundRank(topCountryToRatio[i].value));
  //     } else {
  //       d3.select('#row' + i)
  //         .style("position","absolute")
  //         .style("top","90%")
  //         .transition()
  //         .delay(250)
  //         .style("top", "100%");
  //         //.style("top", "" + (i+1)*9 + "%");
  //
  //
  //     }
  //
  //     // // update country labels for each row
  //     // d3.select("#country" + i).remove();
  //     // var nameDiv = d3.select("#mainDiv" + i).append("div")
  //     //         .attr("width", "90px")
  //     //         .attr("height", "20px")
  //     //         .attr("id", "country" + i)
  //     //         .style("padding", "2px")
  //     //         .append("text")
  //     //         .attr("x", "40")
  //     //         .attr("y", "10")
  //     //         .style('color', 'White')
  //     //         .style("font-size", "12px")
  //     //         .attr("text-anchor", "center")  // centering doesn't work
  //     //         .text(topCountryToRatio[i].key);
  //     //
  //     // // update ratio labels for each row
  //     // d3.select("#ratio" + i).remove();
  //     // var ratioDiv = d3.select("#mainDiv" + i).append("div")
  //     //         .attr("width", "90px")
  //     //         .attr("height", "20px")
  //     //         .attr("id", "ratio" + i)
  //     //         .style("padding", "2px")
  //     //         .append("text")
  //     //         .attr("x", "40px")
  //     //         .attr("y", "10px")
  //     //         .style('color', "Red")
  //     //         .style("font-size", "12px")
  //     //         .style("font-weight", "bold")
  //     //         .attr("text-anchor", "center")  // centering doesn't work
  //     //         .text(this.roundRank(topCountryToRatio[i].value));
  //     }
  //
  //     console.log("updating previousRankings");
  //     //update previousRankings
  //     for (var i = 0; i < topCountryToRatio.length; i++) {
  //       this.previousRankings[i] = topCountryToRatio[i].key;
  //     }
  //   }
}

module.exports = rankRows;
