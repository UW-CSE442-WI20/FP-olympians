const d3 = require('d3');
const _ = require("underscore");

// Draws the total bronze/silver/medals won by the given country
// in the given year for the given sport.
// Will update based on year. Will be called once per country.
// Data needed: year (determined by bigchart), country, sport (determined by dropdown),
// medal counts (athlete rows for that year which can then be used to count the medals)
// Input will preferably be all the rows for that country for the given sport, plus the year.
// We can then filter based on year inside this method.

// global variables
let athleteFilter = false;

module.exports =
function generateMedalChart(data, medalsvg) {
    // console.log("generating medal counts chart!")
    // console.log("DATA****", data);
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
    });

    let medalTallies = []
    // want three rows per year
    // year -> medalType -> medalCount
    data.forEach(function (item) {
        var year = item.key;

        var bronze = getMedalCount(year, 'Bronze');
        var silver = getMedalCount(year, 'Silver');
        var gold = getMedalCount(year, 'Gold');

        if (year >= minYear && year <= maxYear && containsYear(medalTallies, year) === undefined) {
            var medalMap = [];
            medalMap.push({year: year, grpName: 'Bronze', grpValue: bronze});
            medalMap.push({year: year, grpName: 'Silver', grpValue: silver});
            medalMap.push({year: year, grpName: 'Gold', grpValue: gold});

            medalTallies.push(new Object(
                {
                    key: year, values: medalMap
                }))
        }
    });
    console.log("medal tallies", medalTallies);

    var nodes = []
    let medalCounts = []
    groupData.forEach((item) => {
        item.values.forEach((row) => {
            nodes.push(row);
        });
        medalCounts.push(new Object(
            {
                key: item.key,
                values: _.countBy(item.values, (row) => {
                    return row.grpName;
                })
            }));
    });
    console.log("medal counts", medalCounts);
    // console.log("nodes:", nodes);

    medalsvg.selectAll("g").transition();
    medalsvg.selectAll("g").remove();
    // d3.selectAll("circle").remove();
    medalsvg.selectAll("#medal").remove();
    medalsvg.selectAll("#medalTooltip").remove();
    medalsvg.selectAll("#tally").remove();
    medalsvg.selectAll("text").remove();
    medalsvg.selectAll("g").transition();

    var margin = { top: 0, right: 10, bottom: 30, left: 10 };

    // Set the width and height of the graph
    var divbox = document.getElementById("medalchart").getBoundingClientRect();
    console.log("divbox", divbox);
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

    const xSmallScale = d3.scaleBand().domain(getXDomain()).range([margin.left, innerWidth]); //[0, 950]);
    const ySmallScale = d3.scaleLinear().domain([10, 0]).range([margin.top, innerHeight]);

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
        .tickPadding(10)
        .tickSize(0)
        .tickValues(getTickValues(2000, 2020))
        .tickFormat(d3.format("Y"))
    const ySmallAxis = d3.axisLeft(ySmallScale)

    // add title: country name
    medalsvg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin["bottom"] + 18)  // 11 is r of circle
        //.attr("y", height - innerHeight - 1.3 * margin["top"])
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
    x1.domain(medalTypes).rangeRound([0, 30]); // 30

    const color = medalType => {
        if (medalType === 'Bronze') return "#CD7F32";
        else if (medalType === 'Silver') return "#C0C0C0";
        else return "#F2CE4B"; //"#D4AF37";
    }

    const hoverColor = medalType => {
        if (medalType === 'Bronze') return "#b9732d";
        else if (medalType === 'Silver') return "#a6a6a6";
        else return "#eebe11";
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

    const cxTallyOffset = medalType => {
        if (medalType === 'Bronze') {
            return 0.3;
        } else if (medalType === 'Silver') {
            return 0.5;
        } else {
            return 0.7;
        }
    }

    const medalRadius = 8; // radius of medal circles

    /////////////////////////////////// d3.force

    if (nodes.length == 0) {
      medalsvg.append("text")
          .attr("id", "medalTooltip")
          .attr("transform", "translate(" + (width / 2) + "," + (innerHeight / 3) + ")")
          .text("No medals to show for " + data[0].values[0].Team);
    }

    const yForceOffset = medalType => {
        if (medalType === 'Bronze') {
            return .4;
        } else if (medalType === 'Silver') {
            return 1.4;
        } else {
            return 2.4;
        }
    }

    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
        .alphaDecay(0.1)
      .force('x', d3.forceX().x(function(d) {
        return xSmallScale.bandwidth() * ((d.year - minYear) / 4 + 0.5);
      }))
      .force('y', d3.forceY().y(function(d) {
          return ySmallScale(yForceOffset(d.grpName));
          // return ySmallScale(d.grpValue / 4 * cxOffset(d.grpName));
        }))
      .force('collision', d3.forceCollide().radius(function(d) {
        return 9;//11;
      }))
      .force("bounds", boundingBox)
      .on('tick', ticked);

      // Custom force to put all nodes in a box
    function boundingBox() {
        for (let node of nodes) {
            // If the positions exceed the box, set them to the boundary position.
            var yearX = xSmallScale.bandwidth() * ((node.year - minYear) / 4 + 0.5) // xSmallScale.bandwidth() * ((node.year - minYear) / 4 + 0.1)
            node.x = Math.max(Math.min(node.x, yearX + xSmallScale.bandwidth() / 2.5 - medalRadius), yearX - xSmallScale.bandwidth() / 2.5 + medalRadius);
            // console.log("max X = " + (yearX + xSmallScale.bandwidth() - medalRadius) + ", node X = " + node.x + ", min X = " + (yearX - xSmallScale.bandwidth() + medalRadius));
            node.y = Math.max(Math.min(innerHeight - medalRadius, node.y), 0 + medalRadius);
        }
    }

    // Create container for the tooltip but make it invisible until we need it
    var tooltipContainer = d3.select('#medalchart').append("div")
        .attr("id", "medalTooltip")
        .style("position", "absolute")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("visibility", "hidden");

    function ticked() {
        var u = medalsvg
            .selectAll('#medal')
            .data(nodes);

            u.enter()
                .append('circle')
                .attr('id', 'medal')
                .merge(u)
                .attr('r', medalRadius)
                .style('fill', function(d) {
                  return color(d.grpName);
                })
                // .style('opacity', 0.6)
                .on("mouseover", function (d) {
                    // Change tooltip text
                    tooltipContainer
                        .style("left", (d3.mouse(this)[0] + medalRadius) + "px")
                        .style("top", (d3.mouse(this)[1] + medalRadius * 2) + "px")
                        .style("visibility", "visible")
                        .html("<p>" + d.grpAthlete + "<br>" + d.grpEvent + "<br>" + d.grpName + "</p>");
                    // highlight current circle selected
                    d3.select(this)
                        // .style('opacity', 1.0)
                        .style('fill', function(d) {
                            return hoverColor(d.grpName);
                        })
                        .attr('r', medalRadius * 1.2)
                        .style("stroke", '#663300');
                        // .style("stroke-width", 3);
                })
                .on("mouseout", function () {
                    // Remove the tooltip
                    d3.selectAll("#medalTooltip").style("visibility", "hidden");
                    d3.select(this)
                        // .style('opacity', 0.6)
                        .style('fill', function(d) {
                            return color(d.grpName);
                        })
                        .attr('r', medalRadius)
                        .style("stroke", "none");
                })
                .on("click", function(d) {
                    // var yearX = xSmallScale.bandwidth() * ((d.year - minYear) / 4 + 1)
                    // console.log("max X = " + (yearX + xSmallScale.bandwidth() - 10) + ", node X = " + d.x + ", min X = " + (yearX - xSmallScale.bandwidth() + 10));
                    currSelectedAthlete = d.grpAthlete;
                    athleteFilter = !athleteFilter;
                    redrawMedals(u, currSelectedAthlete);
                })
                .attr("cx", (d) => {
                    //return xSmallScale.bandwidth() * ((d.year - minYear) / 4 + 0.1);
                    return xSmallScale.bandwidth() * ((d.year - minYear) / 4 + 0.5)
                })
                .attr("cy", 0)
                .transition()
                .ease(d3.easeElastic)
                .duration((d) => {
                    return (cxOffset(d.grpName))* 2000 + (0.05 * d.grpValue);
                    // return (d.grpValue % 10) * 1000;
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

    d3.select("body").on("keydown", () => {
        // recolor all medals when esc key is pressed to original medal color
        if (d3.event.keyCode == 81) {
            // console.log("escape key pressed");
            athleteFilter = !athleteFilter;
            d3.selectAll("#medal")
                .style("fill", function(d) {
                    return color(d.grpName);
                })
                .attr("pointer-events", "auto");
        }
    });

    // now add titles to the axes
    medalsvg.append("text")
        .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate(" + margin.left + "," + (height / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
        .text("Medals Won");

    var tally = medalsvg
        .selectAll(".tally")
        .data(medalTallies)
        .enter()
        .append("g")
        .attr("class", "g")
        // .attr("transform", "translate(" + (width / 2) + "," + (height + 0.5 * margin.bottom) + ")")
        .attr("transform", function (d) {
            return "translate(" + xSmallScale(d.key) + "," + (height + 0.5 * margin.bottom) + ")";
        })

    tally.selectAll("#tallyGroup")
        .data(function (d) {
            console.log("medal tally data values", d.values)
            return d.values;
        })
        .enter().append("g")
        .attr('id', 'tallyGroup');
    tally.selectAll("#tallyGroup")
        .append("circle")
        .attr("id", "tallyCircle")
        .style("fill", function(d) {
            return hoverColor(d.grpName)
        })
        .attr("r", 11)
        .attr("cx", function (d) {
            return cxTallyOffset(d.grpName) * xSmallScale.bandwidth();
        })
        .attr("cy", 4);

    tally.selectAll("#tallyGroup")
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .attr("transform", function (d) {
            return "translate(" + (cxTallyOffset(d.grpName) * xSmallScale.bandwidth()) + ",13.5)";
        })
        .style("fill", "black")
        .text(function(d) {
            return d.grpValue;
        });
}

function redrawMedals(slice, currSelectedAthlete) {
    const color = medalType => {
        if (medalType === 'Bronze') return "#CD7F32";
        else if (medalType === 'Silver') return "#C0C0C0";
        else return "#F2CE4B";
    }

    // console.log("redrawing medals with selected athlete:", currSelectedAthlete);
    d3.selectAll("#medal")
        // .style("stroke", function(d) {
        //     return d.grpAthlete === currSelectedAthlete ? "black" : undefined;
        // })
        .style("fill", function(d) {
            currSelectedAthlete = athleteFilter ? currSelectedAthlete : d.grpAthlete;
            return d.grpAthlete === currSelectedAthlete ? color(d.grpName) : "#d5e8e8";
        })
        .style("opacity", function(d) {
            currSelectedAthlete = athleteFilter ? currSelectedAthlete : d.grpAthlete;
            return d.grpAthlete === currSelectedAthlete ? 1.0 : 0.8;
        })
        .attr("pointer-events", (d) => {
            currSelectedAthlete = athleteFilter ? currSelectedAthlete : d.grpAthlete;
            return d.grpAthlete === currSelectedAthlete ? "auto" : "none";
        });
}
