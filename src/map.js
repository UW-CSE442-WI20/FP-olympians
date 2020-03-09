const d3 = require('d3');
const _ = require("underscore");
const Datamap = require('../node_modules/datamaps/dist/datamaps.world.min.js')

class worldMap {
  constructor(entriesBySportByYearByCountryRatio) {
    this.map = new Datamap({element: document.getElementById('map')});
    this.entriesBySportByYearByCountryRatio = entriesBySportByYearByCountryRatio;
    this.countryToRatio = []
    this.orderedTop = []
  }

  getRanking() {
    var countryToRatio = this.countryToRatio;
    var athleteNames = [];
    console.log("initial data", this.entriesBySportByYearByCountryRatio)
    this.entriesBySportByYearByCountryRatio.forEach(function(d) {
      var sport = d.key;
      d.values.forEach(function(e) {
        e.values.forEach(function(f) {
          var countryName = f.key;
          var athletes = f.values;
          var num_medals = 0.0;
          var num_athletes = 0.0;
          athletes.forEach(function(a) {
            if (!athleteNames.includes(a.Name)) {
              athleteNames.push(a.Name);
              num_athletes++;
            }
            if (a.Medal.length > 0) {
              num_medals++;
            }
          })
          var ratio = num_athletes === 0 ? 0: num_medals / num_athletes;
          countryToRatio.push(new Object({key: countryName, values: [ratio, sport]}));
        })
      })
    })
    var result = d3.nest()
      .key(function(d) {
        return d.key;
      })
      .sortKeys(d3.ascending)
      .sortValues(function(a, b) {
        // console.log("here's a", a)
        // console.log("here's b", b)
        return b.values[0] - a.values[0];
      })
      .entries(countryToRatio);
    this.orderedTop = result
    console.log("finally the result", this.orderedTop)
  }

  getTop(country) {
    var top = this.orderedTop;
    var index = top.findIndex(function(c) {
      return c.key == country;
    });

    var values = top[index];

  }

}

module.exports = worldMap;
