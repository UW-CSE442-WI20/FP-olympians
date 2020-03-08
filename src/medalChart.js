const d3 = require('d3');
const _ = require("underscore");

// Draws the total bronze/silver/medals won by the given country
// in the given year for the given sport.
// Will update based on year. Will be called once per country.
// Data needed: year (determined by bigchart), country, sport (determined by dropdown),
// medal counts (athlete rows for that year which can then be used to count the medals)
// Input will preferably be all the rows for that country for the given sport, plus the year.
// We can then filter based on year inside this method.

// TODO: Apply d3 force?
module.exports =
function generateMedalChart(data, medalsvg) {
    console.log("generating medal counts chart!")
    console.log("DATA****", data);
    const minYear = 2000;
    const maxYear = 2020;

    // test
    medalsvg.append('g')
        .attr('transform', "translate(100,200)");

    // ----- helper functions ----- //

    const containsYear = (groups, year) => {
        return _.find(d3.values(groups), function (item) {
            return item.key === year;
        });
    }

    const getMedalCount = (year, medal) => {
        var numMedals = 0;
        data.forEach(function (item) {
            // console.log("getting ", medal, " medal count for item:", item)
            item.values.forEach(function(athlete) {
                // console.log("examining athlete:", athlete, "with medal:", athlete.Medal)
                if (athlete.Medal === medal && athlete.Year === parseInt(year)) numMedals++;
            })

        });
        return numMedals;
    }

    const getEvents = (year, medal) => {
        var events = [];
        data.forEach(function (item) {
            // console.log("getting events for item:", item)
            item.values.forEach(function(athlete) {
                // console.log("examining athlete:", athlete, "with medal:", athlete.Medal)
                if (athlete.Medal === medal && athlete.Year === parseInt(year)) events.push(athlete.Event);
            })
        })
        return events;
    }

    const getAthletes = (year, medal) => {
        var athletes = [];
        data.forEach(function (item) {
            // console.log("getting events for item:", item)
            item.values.forEach(function(athlete) {
                // console.log("examining athlete:", athlete, "with medal:", athlete.Medal)
                if (athlete.Medal === medal && athlete.Year === parseInt(year)) athletes.push(athlete.Name);
            })
        })
        return athletes;
    }

    // ----- end of helper functions ----- //

    const groupData = [];
    data.forEach(function (item) {
        var year = item.key;

        var bronze = getMedalCount(year, 'Bronze');
        var silver = getMedalCount(year, 'Silver');
        var gold = getMedalCount(year, 'Gold');

        var bronzeEvents = getEvents(year, 'Bronze');
        var silverEvents = getEvents(year, 'Silver');
        var goldEvents = getEvents(year, 'Gold');

        var bronzeAthletes = getAthletes(year, 'Bronze');
        var silverAthletes = getAthletes(year, 'Silver');
        var goldAthletes = getAthletes(year, 'Gold');

        // console.log("item:", item)
        // console.log("year:", item.key)
        // console.log("bronze=", bronze)
        // console.log("silver=", silver)
        // console.log("gold=", gold)
        // console.log("bronzeEvents=", bronzeEvents)
        // console.log("silverEvents=", silverEvents)
        // console.log("goldEvents=", goldEvents)
        // console.log("bronzeAthletes=", bronzeAthletes)
        // console.log("silverAthletes=", silverAthletes)
        // console.log("goldAthletes=", goldAthletes)


        if (year >= minYear && year <= maxYear && containsYear(groupData, year) === undefined) {
            var medalMap = [];
            for (let i = 1; i <= bronze; i++) {
                medalMap.push({year: year, grpName: 'Bronze', grpValue: i, grpEvent: bronzeEvents[i - 1], grpAthlete: bronzeAthletes[i-1]});
            }
            for (let i = 1; i <= silver; i++) {
                medalMap.push({year: year, grpName: 'Silver', grpValue: i, grpEvent: silverEvents[i - 1], grpAthlete: silverAthletes[i-1]});
            }
            for (let i = 1; i <= gold; i++) {
                medalMap.push({year: year, grpName: 'Gold', grpValue: i, grpEvent: goldEvents[i - 1], grpAthlete: goldAthletes[i-1]});
            }

            groupData.push(new Object(
                {
                    key: year, values: medalMap
                }))
        }

        console.log("groupData:", groupData)
    });

    var nodes = []
    groupData.forEach((item) => {
        item.values.forEach((row) => {
            nodes.push(row);
        });
    });
    console.log("nodes:", nodes);

    medalsvg.selectAll("g").transition();
    medalsvg.selectAll("g").remove();
    medalsvg.selectAll("text").remove();
    medalsvg.selectAll("g").transition();

    var margin = {top: 20, right: 20, bottom: 30, left: 50};

    // Set the width and height of the graph
    var width = parseInt(medalsvg.style("width"), 10);
    var height = parseInt(medalsvg.style("height"), 10);
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    var x = d3.scaleLinear().rangeRound([0, width], 0.5);
    var y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain(data.map(function (d) {
        return d.key;
    }));
    y.domain([0, d3.max(groupData, function (key) {
        return d3.max(key.values, function (d) {
            return d.grpValue;
        });
    })]);

    const getXDomain = () => {
        var domain = [];
        for (let i = minYear; i <= maxYear; i += 4) {
            domain.push(i);
        }
        return domain;
    }

    const xSmallScale = d3.scaleBand().domain(getXDomain()).range([margin.left, innerWidth]);
    const ySmallScale = d3.scaleLinear().domain([10, 0]).range([margin.bottom, innerHeight]);

    const getTickValues = (startTick, endTick) => {
        var values = [];
        for (var i = startTick; i <= endTick; i += 4) {
            values.push(i)
        }
        return values;
    }

    // console.log("before map", groupData);
    // let tickVals = getXDomain().map(item => (item - 2));
    // console.log("ticks", tickVals);
    // let xAxisWeekGenerator = d3.axisBottom(xSmallScale)
    //     .tickValues(tickVals)
    //     .tickSize(10)
    //     .tickPadding(5)
    //     .tickFormat((d, i) => {
    //       // let index = Math.floor(i / 2);
    //       // console.log(tickVals[i] + 2)
    //       return tickVals[i] + 2;
    //       // return graphData[index].x;
    //     });
      
    // const xAxisWeekGenerator = d3.axisBottom(xSmallScale)
    //     .tickPadding(30)
    //     .tickSize(-innerHeight, 0, 0)
    //     .tickValues([2000,2002,2004,2006,2008,2010,2012,2014,2016,2018,2020])
    //     .tickFormat(d3.format("Y"))

    // let xAxisWeekUi = medalsvg.append('g')
    //     .attr('class', 'axis x')
    //     .attr("id", "xAxisMedals")
    //     .attr('transform', "translate(0," + innerHeight + ")")
    //     .call(xAxisWeekGenerator);
      
    //   xAxisWeekUi.selectAll('.tick')
    //     .attr('class', (d, i) => {
    //       if (i % 2 === 0) {
    //         return 'tick label';
    //       }
    //       return 'tick mark';
    //     });

    const xSmallAxis = d3.axisBottom(xSmallScale)
        .tickPadding(30)
        .tickValues(getTickValues(2000, 2020))
        .tickFormat(d3.format("Y"))
    const ySmallAxis = d3.axisLeft(ySmallScale)

    // add title: country name
    medalsvg.append("text")
        .attr("x", width / 2)
        .attr("y", height - innerHeight - 1.3 * margin["top"])
        .style("text-anchor", "middle")
        .text(data[0].values[0].Team);  // Country Name

    // add axis groups to medalsvg
    const xSmallAxisGroup = medalsvg.append("g")
        .attr("class", "axis x")
        .attr("id", "xAxisMedals")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(xSmallAxis);

    var x1 = d3.scaleBand();
    var medalTypes = groupData[0].values.map(function (d) {
        return d.grpName;
    });
    x1.domain(medalTypes).rangeRound([0, 30]);

    const color = medalType => {
        if (medalType === 'Bronze') return "#CD7F32";
        else if (medalType === 'Silver') return "#C0C0C0";
        else return "#D4AF37";
    }

    const cxOffset = medalType => {
        if (medalType === 'Bronze') {
            return 0.3;
        } else if (medalType === 'Silver') {
            return 0.5;
        } else {
            return 0.7;
        }
    }

    /////////////////////////////////// d3.force

    var simulation = d3.forceSimulation(nodes)
      // .force('charge', d3.forceManyBody().strength(5))
      .force('x', d3.forceX().x(function(d) {
        // console.log(d.year - minYear);
        return xSmallScale.bandwidth() * ((d.year - minYear) / 4 + 1);
      }))
      .force('y', d3.forceY().y(function(d) {
          return ySmallScale(d.grpValue / 4);
        }))
      .force('collision', d3.forceCollide().radius(function(d) {
        return 10;
      }))
      .force("bounds", boundingBox)
      .on('tick', ticked);

      // Custom force to put all nodes in a box
    function boundingBox() {
        const radius = 10;

        for (let node of nodes) {
            // If the positions exceed the box, set them to the boundary position.
            // You may want to include your nodes width to not overlap with the box.
            var yearX = xSmallScale.bandwidth() * ((node.year - minYear) / 4 + 1)
            node.x = Math.max(Math.min(node.x, yearX + xSmallScale.bandwidth() / 2 - radius), yearX - xSmallScale.bandwidth() / 2 + radius);
            // console.log("max X = " + (yearX + xSmallScale.bandwidth() - radius) + ", node X = " + node.x + ", min X = " + (yearX - xSmallScale.bandwidth() + radius));            
            node.y = Math.max(Math.min(innerHeight - radius, node.y), 0 + radius);
        }
    }

    function ticked() {
      var u = medalsvg
        .selectAll('circle')
        .data(nodes);

      u.enter()
        .append('circle')
        .attr('r', function(d) {
          return 10;
        })
        .style('fill', function(d) {
          return color(d.grpName);
        })
        .merge(u)
        .on("mouseover", function (d) {//Get this circle's x/y values, then augment for the tooltip
            //Create the tooltip label
            medalsvg.append("text")
                .attr("id", "tooltip")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + (width / 2) + "," + (innerHeight / 3) + ")")
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .style("pointer-events", "none")
                .text(d.grpAthlete);
            medalsvg.append("text")
                .attr("id", "tooltip")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + (width / 2) + "," + (innerHeight / 3 + 20) + ")")
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .style("pointer-events", "none")
                .text(d.grpEvent);
        })
        .on("mouseout", function () {// Remove the tooltip
            medalsvg.select("#tooltip").remove();
            medalsvg.select("#tooltip").remove();
        })
        .on("click", function(d) {
            // var yearX = xSmallScale.bandwidth() * ((d.year - minYear) / 4 + 1)
            // console.log("max X = " + (yearX + xSmallScale.bandwidth() - 10) + ", node X = " + d.x + ", min X = " + (yearX - xSmallScale.bandwidth() + 10));            
            currSelectedAthlete = d.grpAthlete;
            redrawMedals(u, currSelectedAthlete);
        })
        .attr("cx", (d) => {
            return xSmallScale.bandwidth() * ((d.year - minYear) / 4 + 1);
        })
        .attr("cy", 0)
        .transition()
        .ease(d3.easeElastic)
        .duration((d) => {
            return (d.grpValue % 10) * 1000;
        })
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        });

      u.exit().remove();
    }

    /////////////////////// d3.force

    // var slice = medalsvg.selectAll(".slice")
    //     .data(groupData)
    //     .enter().append("g")
    //     .attr("class", "g")
    //     .attr("transform", function (d) {
    //         return "translate(" + xSmallScale(d.key) + ",0)";
    //     });

    // var currSelectedAthlete = null;

    // slice.selectAll("circle")
    //     .data(function (d) {
    //         return d.values;
    //     })
    //     .enter().append("circle")
    //     .style("fill", function (d) {
    //         return color(d.grpName)
    //     })
    //     .style("stroke", function(d) {
    //         return d.grpAthlete === currSelectedAthlete ? "black" : undefined;
    //     })
    //     .attr("r", 10)
    //     .on("mouseover", function (d) {//Get this circle's x/y values, then augment for the tooltip
    //         //Create the tooltip label
    //         medalsvg.append("text")
    //             .attr("id", "tooltip")
    //             .attr("text-anchor", "middle")
    //             .attr("transform", "translate(" + (width / 2) + "," + (innerHeight / 3) + ")")
    //             .attr("font-family", "sans-serif")
    //             .attr("font-size", "11px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "black")
    //             .style("pointer-events", "none")
    //             .text(d.grpAthlete);
    //         medalsvg.append("text")
    //             .attr("id", "tooltip")
    //             .attr("text-anchor", "middle")
    //             .attr("transform", "translate(" + (width / 2) + "," + (innerHeight / 3 + 20) + ")")
    //             .attr("font-family", "sans-serif")
    //             .attr("font-size", "11px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "black")
    //             .style("pointer-events", "none")
    //             .text(d.grpEvent);
    //     })
    //     .on("mouseout", function () {// Remove the tooltip
    //         medalsvg.select("#tooltip").remove();
    //         medalsvg.select("#tooltip").remove();
    //     })
    //     .on("click", function(d) {
    //         console.log("medal selected:", d);
    //         currSelectedAthlete = d.grpAthlete;
    //         console.log("d.grpAthlete...", d.grpAthlete)
    //         redrawMedals(slice, currSelectedAthlete);
    //     })
    //     .attr("cx", cxOffset("Silver") * xSmallScale.bandwidth())
    //     .attr("cy", 0)
    //     .transition()
    //     .delay(function(d) {
    //         return 50 * d.grpValue + 1000 * (cxOffset(d.grpName) - cxOffset("Silver"))
    //     })
    //     .attr("cx", function (d) {
    //         return cxOffset(d.grpName) * xSmallScale.bandwidth();
    //     })
    //     .attr("cy", function (d) {
    //         return ySmallScale(d.grpValue - 1.5) - 30
    //     });

    // now add titles to the axes
    medalsvg.append("text")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + margin.left + "," + (height / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
        .text("Medals Won");
}

function redrawMedals(slice, currSelectedAthlete) {
    const color = medalType => {
        if (medalType === 'Bronze') return "#CD7F32";
        else if (medalType === 'Silver') return "#C0C0C0";
        else return "#D4AF37";
    }

    console.log("redrawing medals with selected athlete:", currSelectedAthlete);
    slice.selectAll("circle")
        // .style("stroke", function(d) {
        //     return d.grpAthlete === currSelectedAthlete ? "black" : undefined;
        // })
        .style("fill", function(d) {
            return d.grpAthlete === currSelectedAthlete ? color(d.grpName) : "#d5e8e8";
        });
}
