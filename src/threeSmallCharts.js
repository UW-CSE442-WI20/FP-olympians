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
      .style("display","table-row")
      .style("background-color", "White");
  }

  // Draws the total bronze/silver/medals won by the given country
  // in the given year for the given sport.
  // Will update based on year. Will be called once per country.
  // Data needed: year (determined by bigchart), country, sport (determined by dropdown),
  // medal counts (athlete rows for that year which can then be used to count the medals)
  // Input will preferably be all the rows for that country for the given sport, plus the year.
  // We can then filter based on year inside this method.
  generateMedalCountsChart(firstChart, data, year) {
    console.log("generating medal counts chart (first of three small charts)")
    console.log(data)

    const containsYear = (groups, year) => {
      return _.find(d3.values(groups), function (item) {
        return item.key === year;
      });
    }

    const getMedalCount = (year, medal) => {
      var numMedals = 0;
      data.forEach(function (item) {
        if (item.Medal === medal && item.Year === year) numMedals++;
      });
      return numMedals;
    }

    data.forEach(function (item) {
      var bronze = getMedalCount(item.Year, 'Bronze');
      var silver = getMedalCount(item.Year, 'Silver');
      var gold = getMedalCount(item.Year, 'Gold');


      if (containsYear(groupData, item.Year) === undefined) {
        var medalMap = [];
        for (let i = 1; i <= bronze; i++) {
          medalMap.push({grpName: 'Bronze', grpValue: i, grpEvent: bronzeEvents[i - 1]});
        }
        for (let i = 1; i <= silver; i++) {
          medalMap.push({grpName: 'Silver', grpValue: i, grpEvent: silverEvents[i - 1]});
        }
        for (let i = 1; i <= gold; i++) {
          medalMap.push({grpName: 'Gold', grpValue: i, grpEvent: goldEvents[i - 1]});
        }

        groupData.push(new Object(
            {
              key: item.Year, values: medalMap
            }))
      }
    });
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
