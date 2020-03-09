const d3 = require('d3');

class summaryChartCountry {

  constructor(data, columns) {
    this.data = data;
    this.columns = columns;

  }

  initData() {
    var obj = d3.nest()
           .key(function(d) {
             return d.Team;
           })
           .key(function(d) {
             return d.Year;
           }).sortKeys(d3.ascending)
           .rollup(function(v) {
             var m = d3.map(v, function(d) {
               return d.ID; }).size();
             return {
               Medals: d3.sum(v, function(d) {
                 return d.Medal.length > 0 ? 1 : 0;
               }),
               Athletes: m
             }
           })
           .entries(this.data);
    return obj;
  }

  createChart(country) {
    var result = this.initData();
    console.log("here's the result of init:", result);

    var columns = this.columns

    d3.select("#table_wrap")
      .attr("width", 100)
      .attr("height", 100);

    var table = d3.select("#country_table")
      .attr("width", 100)
      .attr("height", 100);

    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(function(columnNames) {
        return columnNames;
      });

    // create a row for each object in the data
    var index = result.findIndex(function(c) {
      return c.key == country;
    });

    var countryName = result[index].key
    document.getElementById("country").innerHTML = countryName;

    var flattened = []
    result[index].values.forEach(function(d) {
      flattened.push({
        Year: d.key,
        Medals: d.value.Medals,
        Athletes: d.value.Athletes
      });
    });

    var rows = tbody.selectAll("tr")
      .data(flattened)
      .enter()
      .append("tr")

    var cells = rows.selectAll("td")
      .data(function(row) {
          return columns.map(function(column) {
              return { column: column, value: row[column] };
          });
      })
      .enter()
      .append("td")
      // .attr("style", "font-family: 'Lato'")
      .html(function(d) {
        return d.value;
      });
  };

  updateChart(country) {
    d3.selectAll("thead").remove();
    d3.selectAll("tbody").remove();

    var result = this.initData();
    console.log("here's the result of init:", result);

    var columns = this.columns

    d3.select("#table_wrap")
      .attr("width", 100)
      .attr("height", 100);

    var table = d3.select("#country_table")
      .attr("width", 100)
      .attr("height", 100);

    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(function(columnNames) {
        return columnNames;
      });

    // create a row for each object in the data
    var index = result.findIndex(function(c) {
      return c.key == country;
    });

    var countryName = result[index].key
    document.getElementById("country").innerHTML = countryName;

    var flattened = []
    result[index].values.forEach(function(d) {
      flattened.push({
        Year: d.key,
        Medals: d.value.Medals,
        Athletes: d.value.Athletes
      });
    });

    var rows = tbody.selectAll("tr")
      .data(flattened)
      .enter()
      .append("tr")

    var cells = rows.selectAll("td")
      .data(function(row) {
          return columns.map(function(column) {
              return { column: column, value: row[column] };
          });
      })
      .enter()
      .append("td")
      // .attr("style", "font-family: 'Lato'")
      .html(function(d) {
        return d.value;
      });
  };
};

module.exports = summaryChartCountry;
