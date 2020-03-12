const d3 = require('d3');
const _ = require("underscore");
const {redrawBigChartClick} = require('./bigChart');
const generateMedalChart = require("./medalChart");

const Datamap = require('../node_modules/datamaps/dist/datamaps.world.min.js')

var countries = {
    "Afghanistan": "Afghanistan",
    "Albania": "Albania",
    "Algeria": "Algeria",
    "American Samoa": "American Samoa",
    "Andorra": "Andorra",
    "Angola": "Angola",
    "Argentina": "Argentina",
    "Armenia": "Armenia",
    "Aruba": "Aruba",
    "Australia": "Australia",
    "Austria": "Austria",
    "Azerbaijan": "Azerbaijan",
    "Bahamas": "Bahamas",
    "Bahrain": "Bahrain",
    "Bangladesh": "Bangladesh",
    "Barbados": "Barbados",
    "Belarus": "Belarus",
    "Belgium": "Belgium",
    "Belize": "Belize",
    "Benin": "Benin",
    "Bermuda": "Bermuda",
    "Bhutan": "Bhutan",
    "Bolivia": "Bolivia",
    "Bosnia and Herzegovina": "Bosnia and Herzegovina",
    "Botswana": "Botswana",
    "Brazil": "Brazil",
    "British Virgin Islands": "British Virgin Islands",
    "Brunei": "Brunei",
    "Bulgaria": "Bulgaria",
    "Burkina Faso": "Burkina Faso",
    "Burundi": "Burundi",
    "Cambodia": "Cambodia",
    "Cameroon": "Cameroon",
    "Canada": "Canada",
    "Cape Verde": "Cape Verde",
    "Cayman Islands": "Cayman Islands",
    "Central African Republic": "Central African Republic",
    "Chad": "Chad",
    "Chile": "Chile",
    "China": "China",
    "Taiwan": "Chinese Taipei",
    "Colombia": "Colombia",
    "Comoros": "Comoros",
    "Republic of the Congo": "Congo Brazzaville",
    "Democratic Republic of the Congo": "Congo Kinshasa",
    "Cook Islands": "Cook Islands",
    "Costa Rica": "Costa Rica",
    "Ivory Coast": "Cote dIvoire",
    "Croatia": "Croatia",
    "Cuba": "Cuba",
    "Cyprus": "Cyprus",
    "Czech Republic": "Czech Republic",
    "Denmark": "Denmark",
    "Djibouti": "Djibouti",
    "Dominica": "Dominica",
    "Dominican Republic": "Dominican Republic",
    "Ecuador": "Ecuador",
    "Egypt": "Egypt",
    "El Salvador": "El Salvador",
    "Equatorial Guinea": "Equatorial Guinea",
    "Eritrea": "Eritrea",
    "Estonia": "Estonia",
    "Ethiopia": "Bermuda",
    "Federated States of Micronesia": "Federated States of Micronesia",
    "Fiji": "Fiji",
    "Finland": "Finland",
    "France": "France",
    "Gabon": "Gabon",
    "Gambia": "Gambia",
    "Georgia": "Georgia",
    "Germany": "Germany",
    "Ghana": "Ghana",
    "United Kingdom": "Great Britain",
    "Greece": "Greece",
    "Grenada": "Grenada",
    "Guam": "Guam",
    "Guatemala": "Guatemala",
    "Guinea": "Guinea",
    "Guinea Bissau": "Guinea Bissau",
    "Guyana": "Guyana",
    "Haiti": "Haiti",
    "Honduras": "Honduras",
    "Hong Kong": "Hong Kong",
    "Hungary": "Hungary",
    "Iceland": "Iceland",
    "India": "India",
    "Indonesia": "Indonesia",
    "Iran": "Iran",
    "Iraq": "Iraq",
    "Ireland": "Ireland",
    "Israel": "Israel",
    "Italy": "Italy",
    "Jamaica": "Jamaica",
    "Japan": "Japan",
    "Jordan": "Jordan",
    "Kazakhstan": "Kazakhstan",
    "Kenya": "Kenya",
    "Kiribati": "Kiribati",
    "Kosovo": "Kosovo",
    "Kuwait": "Kuwait",
    "Kyrgyzstan": "Kyrgyzstan",
    "Laos": "Laos",
    "Latvia": "Latvia",
    "Lebanon": "Lebanon",
    "Lesotho": "Lesotho",
    "Liberia": "Liberia",
    "Libya": "Libya",
    "Liechtenstein": "Liechtenstein",
    "Lithuania": "Lithuania",
    "Luxembourg": "Luxembourg",
    "Macedonia": "Macedonia",
    "Madagascar": "Madagascar",
    "Malawi": "Malawi",
    "Malaysia": "Malaysia",
    "Maldives": "Maldives",
    "Mali": "Mali",
    "Malta": "Malta",
    "Marshall Islands": "Marshall Islands",
    "Mauritania": "Mauritania",
    "Mauritius": "Mauritius",
    "Mexico": "Mexico",
    "Moldova": "Moldova",
    "Monaco": "Monaco",
    "Mongolia": "Mongolia",
    "Montenegro": "Montenegro",
    "Morocco": "Morocco",
    "Mozambique": "Mozambique",
    "Myanmar": "Myanmar",
    "Namibia": "Namibia",
    "Nauru": "Nauru",
    "Nepal": "Nepal",
    "Netherlands": "Netherlands",
    "Netherlands Antilles": "Netherlands Antilles",
    "New Zealand": "New Zealand",
    "Nicaragua": "Nicaragua",
    "Niger": "Niger",
    "Nigeria": "Nigeria",
    "North Korea": "North Korea",
    "Norway": "Norway",
    "Oman": "Oman",
    "Pakistan": "Pakistan",
    "Palau": "Palau",
    "Palestine": "Palestine",
    "Panama": "Panama",
    "Papua New Guinea": "Papua New Guinea",
    "Paraguay": "Paraguay",
    "Peru": "Peru",
    "Philippines": "Philippines",
    "Poland": "Poland",
    "Portugal": "Portugal",
    "Puerto Rico": "Puerto Rico",
    "Qatar": "Qatar",
    "Romania": "Romania",
    "Russia": "Russia",
    "Rwanda": "Rwanda",
    "Kyrgyzstan": "Kyrgyzstan",
    "Laos": "Laos",
    "Latvia": "Latvia",
    "Lebanon": "Lebanon",
    "Lesotho": "Lesotho",
    "Liberia": "Liberia",
    "Libya": "Libya",
    "Liechtenstein": "Liechtenstein",
    "Lithuania": "Lithuania",
    "Luxembourg": "Luxembourg",
    "Macedonia": "Macedonia",
    "Madagascar": "Madagascar",
    "Malawi": "Malawi",
    "Malaysia": "Malaysia",
    "Maldives": "Maldives",
    "Saint Kitts and Nevis": "Saint Kitts and Nevis",
    "Saint Lucia": "Saint Lucia",
    "Saint Vincent and the Grenadines": "Saint Vincent and the Grenadines",
    "Samoa": "Samoa",
    "San Marino": "San Marino",
    "Sao Tome and Principe": "Sao Tome and Principe",
    "Saudi Arabia": "Saudi Arabia",
    "Senegal": "Senegal",
    "Serbia": "Serbia",
    "Serbia and Montenegro": "Serbia and Montenegro",
    "Seychelles": "Seychelles",
    "Sierra Leone": "Sierra Leone",
    "Singapore": "Singapore",
    "Slovakia": "Slovakia",
    "Slovenia": "Slovenia",
    "Solomon Islands": "Solomon Islands",
    "Somalia": "Somalia",
    "South Africa": "South Africa",
    "South Korea": "South Korea",
    "South Sudan": "South Sudan",
    "Spain": "Spain",
    "Sri Lanka": "Sri Lanka",
    "Sudan": "Sudan",
    "Suriname": "Suriname",
    "Swaziland": "Swaziland",
    "Sweden": "Sweden",
    "Switzerland": "Switzerland",
    "Syria": "Syria",
    "Tajikistan": "Tajikistan",
    "Tanzania": "Tanzania",
    "Thailand": "Thailand",
    "Timor Leste": "Timor Leste",
    "Togo": "Togo",
    "Tonga": "Tonga",
    "Trinidad and Tobago": "Trinidad and Tobago",
    "Tunisia": "Tunisia",
    "Turkey": "Turkey",
    "Turkmenistan": "Turkmenistan",
    "Tuvalu": "Tuvalu",
    "Uganda": "Uganda",
    "Ukraine": "Ukraine",
    "United Arab Emirates": "United Arab Emirates",
    "United States of America": "United States",
    "United States Virgin Islands": "United States Virgin Islands",
    "Uruguay": "Uruguay",
    "Uzbekistan": "Uzbekistan",
    "Vanuatu": "Vanuatu",
    "Venezuela": "Venezuela",
    "Vietnam": "Vietnam",
    "Yemen": "Yemen",
    "Zambia": "Zambia",
    "Zimbabwe": "Zimbabwe"
};

class worldMap {
  constructor(entriesBySportByYearByCountryRatio, data, currSport, medalsvg) {
    this.entriesBySportByYearByCountryRatio = entriesBySportByYearByCountryRatio;
    var res = d3.nest()
    .key(function(d) {
      return d.Team;
    }).entries(data)

    this.data = d3.nest()
      .key(function(d) {
        return d.Team
      })
      .entries(data)

    data = this.data;
    this.map = new Datamap({
      element: document.getElementById('map'),
      scope: 'world',
      responsive: true,
      geographyConfig: {
        highlightBorderColor: '#bada55',
        popupOnHover: true,
        highlightOnHover: true,
        highlightBorderWidth: 1,
        popupTemplate: function(geography, data) {
          return '<div class="hoverinfo">' + geography.properties.name +
            '\'s top sport(s): ' + data.first +
             data.second + data.third + '</div>';
        }
      },
      done: function(datamap) {
        d3.select('.datamap').call(
          d3.zoom()
            .scaleExtent([0.7, 6])
            .on('zoom', function() {
              datamap.svg.selectAll('g').attr('transform', d3.event.transform);
            })
        );
        document.getElementById('map-btn').onclick = function() {
          datamap.svg.selectAll("g")
            .transition()
            .duration(500)
            .attr("transform", d3.zoomIdentity);
          d3.select('.datamap').call(d3.zoom().transform, d3.zoomIdentity);
        };
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            // alert(geography.properties.name);
            var name = countries[geography.properties.name]
            currSportSelections = document.getElementById('select-sport');
            currSport = currSportSelections.options[currSportSelections.value].text // current sport
            medalsvg = d3.select('#medalchart').select("svg")
           
            redrawBigChartClick(name, currSport, medalsvg, false);
        });
      },
      fills: {
        defaultFill: '#6C8CBF'
      },
      data: {
        'AFG': {
          first: data[0].values[0].Sport,
          second: "",
          third: ""
        },
        'ALB': {
          first: 'None',
          second: "",
          third: ""
        },
        'DZA': {
          first: data[2].values[0].Sport + ", ",
          second: data[2].values[1].Sport + ", ",
          third: data[2].values[4].Sport
        },
        // not here
        'ASM': {
          first: 'None',
          second: "",
          third: ""
        },
        // not here
        'AND': {
          first: 'None',
          second: "",
          third: ""
        },
        'AGO': {
          first: 'None',
          second: "",
          third: ""
        },
        'ATG': {
          first: 'None',
          second: "",
          third: ""
        },
        'ARG': {
          first: data[7].values[0].Sport + ", ",
          second: data[7].values[1].Sport + ", ",
          third: data[7].values[4].Sport
        },
        'ARM': {
          first: data[8].values[0].Sport + ", ",
          second: data[8].values[1].Sport + ", ",
          third: data[8].values[4].Sport
        },
        'ABW': {
          first: 'None',
          second: "",
          third: ""
        },
        'AUS': {
          first: data[10].values[0].Sport + ", ",
          second: data[10].values[1].Sport + ", ",
          third: data[10].values[2].Sport
        },
        'AUT': {
          first: data[11].values[0].Sport + ", ",
          second: data[11].values[1].Sport + ", ",
          third: data[11].values[3].Sport
          },
        'AZE': {
          first: data[12].values[0].Sport + ", ",
          second: data[12].values[1].Sport + ", ",
          third: data[12].values[2].Sport
        },
        'BHS': {
          first: data[13].values[0].Sport,
          second: "",
          third: ""
        },
        'BHR': {
          first: data[14].values[0].Sport,
          second: "",
          third: ""
        },
        'BGD': {
          first: 'None',
          second: "",
          third: ""
        },
        'BRB': {
          first: data[16].values[0].Sport,
          second: "",
          third: ""
        },
        'BLR': {
          first: data[17].values[0].Sport + ", ",
          second: data[17].values[1].Sport + ", ",
          third: data[17].values[3].Sport
        },
        'BEL': {
          first: data[18].values[0].Sport + ", ",
          second: data[18].values[1].Sport + ", ",
          third: data[18].values[2].Sport
        },
        'BLZ': {
          first: 'None',
          second: "",
          third: ""
        },
        'BEN': {
          first: 'None',
          second: "",
          third: ""
        },
        'BMU': {
          first: 'None',
          second: "",
          third: ""
        },
        'BTN': {
          first: 'None',
          second: "",
          third: ""
        },
        'BOL': {
          first: 'None',
          second: "",
          third: ""
        },
        'BIH': {
          first: 'None',
          second: "",
          third: ""
        },
        'BWA': {
          first: data[25].values[0].Sport,
          second: "",
          third: ""
        },
        'BRA': {
          first: data[26].values[0].Sport + ", ",
          second: data[26].values[2].Sport + ", ",
          third: data[26].values[3].Sport
        },
        'VGB': {
          first: 'None',
          second: "",
          third: ""
        },
        'BRU': {
          first: 'None',
          second: "",
          third: ""
        },
        'BGR': {
          first: data[29].values[0].Sport + ", ",
          second: data[29].values[1].Sport + ", ",
          third: data[29].values[2].Sport
        },
        'BFA': {
          first: 'None',
          second: "",
          third: ""
        },
        'BDI': {
          first: data[31].values[0].Sport,
          second: "",
          third: ""
        },
        'KHM': {
          first: 'None',
          second: "",
          third: ""
        },
        'CMR': {
          first: data[33].values[0].Sport + ", ",
          second: data[33].values[1].Sport,
          third: ""
        },
        'CAN': {
          first: data[34].values[0].Sport + ", ",
          second: data[34].values[1].Sport + ", ",
          third: data[34].values[2].Sport
        },
        'CPV': {
          first: 'None',
          second: "",
          third: ""
        },
        'CYM': {
          first: 'None',
          second: "",
          third: ""
        },
        'CAF': {
          first: 'None',
          second: "",
          third: ""
        },
        'TCD': {
          first: 'None',
          second: "",
          third: ""
        },
        'CHL': {
          first: data[39].values[0].Sport + ", ",
          second: data[39].values[1].Sport,
          third: ""
        },
        'CHN': {
          first: data[40].values[0].Sport + ", ",
          second: data[40].values[1].Sport + ", ",
          third: data[40].values[2].Sport
        },
        'TWN': {
          first: data[41].values[0].Sport + ", ",
          second: data[41].values[1].Sport + ", ",
          third: data[41].values[2].Sport
        },
        'COL': {
          first: data[42].values[0].Sport + ", ",
          second: data[42].values[2].Sport + ", ",
          third: data[42].values[3].Sport
        },
        'COM': {
          first: 'None',
          second: "",
          third: ""
        },
        // republic of the congo
        'COG': {
          first: 'None',
          second: "",
          third: ""
        },
        // democratic republic of the congo
        'COD': {
          first: 'None',
          second: "",
          third: ""
        },
        'COK': {
          first: 'None',
          second: "",
          third: ""
        },
        'CRI': {
          first: data[47].values[0].Sport,
          second: "",
          third: ""
        },
        'CIV': {
          first: data[48].values[0].Sport,
          second: "",
          third: ""
        },
        'HRV': {
          first: data[49].values[0].Sport + ", ",
          second: data[49].values[1].Sport + ", ",
          third: data[49].values[2].Sport
        },
        'CUB': {
          first: data[50].values[0].Sport + ", ",
          second: data[50].values[1].Sport + ", ",
          third: data[50].values[2].Sport
        },
        'CYP': {
          first: 'None',
          second: "",
          third: ""
        },
        'CZE': {
          first: data[52].values[0].Sport + ", ",
          second: data[52].values[1].Sport + ", ",
          third: data[52].values[2].Sport
        },
        'DNK': {
          first: data[53].values[0].Sport + ", ",
          second: data[53].values[1].Sport + ", ",
          third: data[53].values[2].Sport
        },
        'DJI': {
          first: 'None',
          second: "",
          third: ""
        },
        'DMA': {
          first: 'None',
          second: "",
          third: ""
        },
        'DOM': {
          first: data[56].values[0].Sport + ", ",
          second: data[56].values[1].Sport + ", ",
          third: data[56].values[4].Sport
        },
        'ECU': {
          first: data[57].values[0].Sport,
          second: "",
          third: ""
        },
        'EGY': {
          first: data[58].values[0].Sport + ", ",
          second: data[58].values[1].Sport + ", ",
          third: data[58].values[4].Sport
        },
        'SLV': {
          first: 'None',
          second: "",
          third: ""
        },
        'GNQ': {
          first: 'None',
          second: "",
          third: ""
        },
        'ERI': {
          first: data[61].values[0].Sport,
          second: "",
          third: ""
        },
        'EST': {
          first: data[62].values[0].Sport + ", ",
          second: data[62].values[2].Sport + ", ",
          third: data[62].values[3].Sport
        },
        'ETH': {
          first: data[63].values[0].Sport,
          second: "",
          third: ""
        },
        'FSM': {
          first: 'None',
          second: "",
          third: ""
        },
        'FJI': {
          first: data[65].values[0].Sport,
          second: "",
          third: ""
        },
        'FIN': {
          first: data[66].values[0].Sport + ", ",
          second: data[66].values[1].Sport + ", ",
          third: data[66].values[2].Sport
        },
        'FRA': {
          first: data[67].values[0].Sport + ", ",
          second: data[67].values[1].Sport + ", ",
          third: data[67].values[2].Sport
        },
        'GAB': {
          first: 'None',
          second: "",
          third: ""
        },
        'GMB': {
          first: 'None',
          second: "",
          third: ""
        },
        'GEO': {
          first: data[70].values[0].Sport + ", ",
          second: data[70].values[1].Sport + ", ",
          third: data[70].values[3].Sport
        },
        'DEU': {
          first: data[71].values[0].Sport + ", ",
          second: data[71].values[1].Sport + ", ",
          third: data[71].values[2].Sport
        },
        'GHA': {
          first: 'None',
          second: "",
          third: ""
        },
        'GBR': {
          first: data[73].values[0].Sport + ", ",
          second: data[73].values[1].Sport + ", ",
          third: data[73].values[3].Sport
        },
        'GRC': {
          first: data[74].values[0].Sport + ", ",
          second: data[74].values[1].Sport + ", ",
          third: data[74].values[2].Sport
        },
        'GRD': {
          first: data[75].values[0].Sport,
          second: "",
          third: ""
        },
        'GUM': {
          first: 'None',
          second: "",
          third: ""
        },
        'GTM': {
          first: data[77].values[0].Sport,
          second: "",
          third: ""
        },
        'GIN': {
          first: 'None',
          second: "",
          third: ""
        },
        'GNB': {
          first: 'None',
          second: "",
          third: ""
        },
        'GUY': {
          first: 'None',
          second: "",
          third: ""
        },
        'HTI': {
          first: 'None',
          second: "",
          third: ""
        },
        'HND': {
          first: 'None',
          second: "",
          third: ""
        },
        'HKG': {
          first: data[83].values[0].Sport,
          second: "",
          third: ""
        },
        'HUN': {
          first: data[84].values[0].Sport + ", ",
          second: data[84].values[2].Sport + ", ",
          third: data[84].values[3].Sport
        },
        'ISL': {
          first: data[85].values[0].Sport,
          second: "",
          third: ""
        },
        'IND': {
          first: data[86].values[0].Sport + ", ",
          second: data[86].values[1].Sport + ", ",
          third: data[86].values[3].Sport
        },
        'IDN': {
          first: data[88].values[0].Sport + ", ",
          second: data[88].values[3].Sport,
          third: ""
        },
        'IRN': {
          first: data[89].values[0].Sport + ", ",
          second: data[89].values[1].Sport + ", ",
          third: data[89].values[2].Sport
        },
        'IRQ': {
          first: 'None',
          second: "",
          third: ""
        },
        'IRL': {
          first: data[91].values[0].Sport + ", ",
          second: data[91].values[2].Sport + ", ",
          third: data[91].values[3].Sport
        },
        'ISR': {
          first: data[92].values[0].Sport + ", ",
          second: data[92].values[1].Sport + ", ",
          third: data[92].values[2].Sport
        },
        'ITA': {
          first: data[93].values[0].Sport + ", ",
          second: data[93].values[1].Sport + ", ",
          third: data[93].values[2].Sport
        },
        'JAM': {
          first: data[94].values[0].Sport,
          second: "",
          third: ""
        },
        'JPN': {
          first: data[95].values[0].Sport + ", ",
          second: data[95].values[1].Sport + ", ",
          third: data[95].values[2].Sport
        },
        'JOR': {
          first: data[96].values[0].Sport,
          second: "",
          third: ""
        },
        'KAZ': {
          first: data[97].values[0].Sport + ", ",
          second: data[97].values[1].Sport + ", ",
          third: data[97].values[2].Sport
        },
        'KEN': {
          first: data[98].values[0].Sport,
          second: "",
          third: ""
        },
        'KIR': {
          first: 'None',
          second: "",
          third: ""
        },
        // KOSOVO BUT UNSURE OF THE CODE
        'UNK': {
          first: data[100].values[0].Sport,
          second: "",
          third: ""
        },
        'KWT': {
          first: data[101].values[0].Sport,
          second: "",
          third: ""
        },
        'KGZ': {
          first: data[102].values[0].Sport + ", ",
          second: data[102].values[1].Sport,
          third: ""
        },
        'LAO': {
          first: 'None',
          second: "",
          third: ""
        },
        'LVA': {
          first: data[104].values[0].Sport + ", ",
          second: data[104].values[1].Sport + ", ",
          third: data[104].values[2].Sport
        },
        'LBN': {
          first: 'None',
          second: "",
          third: ""
        },
        'LSO': {
          first: 'None',
          second: "",
          third: ""
        },
        'LBR': {
          first: 'None',
          second: "",
          third: ""
        },
        'LBY': {
          first: 'None',
          second: "",
          third: ""
        },
        'LIE': {
          first: 'None',
          second: "",
          third: ""
        },
        'LTU': {
          first: data[110].values[0].Sport + ", ",
          second: data[110].values[1].Sport + ", ",
          third: data[110].values[2].Sport
        },
        'LUX': {
          first: 'None',
          second: "",
          third: ""
        },
        'MKD': {
          first: data[112].values[0].Sport,
          second: "",
          third: ""
        },
        'MDG': {
          first: 'None',
          second: "",
          third: ""
        },
        'MWI': {
          first: 'None',
          second: "",
          third: ""
        },
        'MYS': {
          first: data[115].values[0].Sport + ", ",
          second: data[115].values[1].Sport + ", ",
          third: data[115].values[2].Sport
        },
        'MDV': {
          first: 'None',
          second: "",
          third: ""
        },
        'MLI': {
          first: 'None',
          second: "",
          third: ""
        },
        'MLT': {
          first: 'None',
          second: "",
          third: ""
        },
        'MHL': {
          first: 'None',
          second: "",
          third: ""
        },
        'MRT': {
          first: 'None',
          second: "",
          third: ""
        },
        'MUS': {
          first: data[121].values[0].Sport,
          second: "",
          third: ""
        },
        'MEX': {
          first: data[122].values[0].Sport + ", ",
          second: data[122].values[1].Sport + ", ",
          third: data[122].values[2].Sport
        },
        'MDA': {
          first: data[123].values[0].Sport + ", ",
          second: data[123].values[1].Sport + ", ",
          third: data[123].values[3].Sport
        },
        'MCO': {
          first: 'None',
          second: "",
          third: ""
        },
        'MNG': {
          first: data[125].values[0].Sport + ", ",
          second: data[125].values[1].Sport + ", ",
          third: data[125].values[3].Sport
        },
        'MNE': {
          first: data[126].values[0].Sport,
          second: "",
          third: ""
        },
        'MAR': {
          first: data[127].values[0].Sport + ", ",
          second: data[127].values[2].Sport,
          third: ""
        },
        'MOZ': {
          first: data[128].values[0].Sport,
          second: "",
          third: ""
        },
        'MMR': {
          first: 'None',
          second: "",
          third: ""
        },
        'NAM': {
          first: 'None',
          second: "",
          third: ""
        },
        'NRU': {
          first: 'None',
          second: "",
          third: ""
        },
        'NPL': {
          first: 'None',
          second: "",
          third: ""
        },
        'NLD': {
          first: data[133].values[0].Sport + ", ",
          second: data[133].values[1].Sport + ", ",
          third: data[133].values[2].Sport
        },
        'NZL': {
          first: data[135].values[0].Sport + ", ",
          second: data[135].values[1].Sport + ", ",
          third: data[135].values[2].Sport
        },
        'NIC': {
          first: 'None',
          second: "",
          third: ""
        },
        'NER': {
          first: data[137].values[0].Sport,
          second: "",
          third: ""
        },
        'NGA': {
          first: data[138].values[0].Sport + ", ",
          second: data[138].values[1].Sport + ", ",
          third: data[138].values[4].Sport
        },
        'PRK': {
          first: data[139].values[0].Sport + ", ",
          second: data[139].values[1].Sport + ", ",
          third: data[139].values[2].Sport
        },
        'NOR': {
          first: data[140].values[0].Sport + ", ",
          second: data[140].values[3].Sport + ", ",
          third: data[140].values[5].Sport
        },
        'OMN': {
          first: 'None',
          second: "",
          third: ""
        },
        'PAK': {
          first: 'None',
          second: "",
          third: ""
        },
        'PLW': {
          first: 'None',
          second: "",
          third: ""
        },
        'PSE': {
          first: 'None',
          second: "",
          third: ""
        },
        'PAN': {
          first: 'None',
          second: "",
          third: ""
        },
        'PNG': {
          first: 'None',
          second: "",
          third: ""
        },
        'PRY': {
          first: data[147].values[0].Sport,
          second: "",
          third: ""
        },
        'PER': {
          first: 'None',
          second: "",
          third: ""
        },
        'PHL': {
          first: data[149].values[0].Sport,
          second: "",
          third: ""
        },
        'POL': {
          first: data[150].values[0].Sport + ", ",
          second: data[150].values[1].Sport + ", ",
          third: data[150].values[2].Sport
        },
        'PRT': {
          first: data[151].values[0].Sport + ", ",
          second: data[151].values[1].Sport + ", ",
          third: data[151].values[2].Sport
        },
        'PRI': {
          first: data[152].values[0].Sport + ", ",
          second: data[152].values[1].Sport + ", ",
          third: data[152].values[2].Sport
        },
        'QAT': {
          first: data[153].values[0].Sport + ", ",
          second: data[153].values[1].Sport + ", ",
          third: data[153].values[2].Sport
        },
        'ROU': {
          first: data[155].values[0].Sport + ", ",
          second: data[155].values[1].Sport + ", ",
          third: data[155].values[3].Sport
        },
        'RUS': {
          first: data[156].values[0].Sport + ", ",
          second: data[156].values[1].Sport + ", ",
          third: data[156].values[2].Sport
        },
        'RWA': {
          first: 'None',
          second: "",
          third: ""
        },
        'KNA': {
          first: 'None',
          second: "",
          third: ""
        },
        'LCA': {
          first: 'None',
          second: "",
          third: ""
        },
        'VCT': {
          first: 'None',
          second: "",
          third: ""
        },
        'WSM': {
          first: 'None',
          second: "",
          third: ""
        },
        'SMR': {
          first: 'None',
          second: "",
          third: ""
        },
        'STP': {
          first: 'None',
          second: "",
          third: ""
        },
        'SAU': {
          first: data[164].values[0].Sport + ", ",
          second: data[164].values[2].Sport,
          third: ""
        },
        'SEN': {
          first: 'None',
          second: "",
          third: ""
        },
        'SRB': {
          first: data[166].values[0].Sport + ", ",
          second: data[166].values[1].Sport + ", ",
          third: data[166].values[3].Sport
        },
        'SYC': {
          first: 'None',
          second: "",
          third: ""
        },
        'SLE': {
          first: 'None',
          second: "",
          third: ""
        },
        'SGP': {
          first: data[170].values[0].Sport + ", ",
          second: data[170].values[2].Sport
        },
        'SVK': {
          first: data[171].values[0].Sport + ", ",
          second: data[171].values[1].Sport + ", ",
          third: data[171].values[3].Sport
        },
        'SVN': {
          first: data[172].values[0].Sport + ", ",
          second: data[172].values[1].Sport + ", ",
          third: data[172].values[2].Sport
        },
        'SLB': {
          first: 'None',
          second: "",
          third: ""
        },
        'SOM': {
          first: 'None',
          second: "",
          third: ""
        },
        'ZAF': {
          first: data[175].values[0].Sport + ", ",
          second: data[175].values[1].Sport + ", ",
          third: data[175].values[2].Sport
        },
        'KOR': {
          first: data[176].values[0].Sport + ", ",
          second: data[176].values[1].Sport + ", ",
          third: data[176].values[2].Sport
        },
        'SSD': {
          first: 'None',
          second: "",
          third: ""
        },
        'ESP': {
          first: data[178].values[0].Sport + ", ",
          second: data[178].values[1].Sport + ", ",
          third: data[178].values[2].Sport
        },
        'LKA': {
          first: data[179].values[0].Sport,
          second: "",
          third: ""
        },
        'SDN': {
          first: data[180].values[0].Sport,
          second: "",
          third: ""
        },
        'SUR': {
          first: 'None',
          second: "",
          third: ""
        },
        // SWAZILAND AKA ESWATINI
        'SWZ': {
          first: 'None',
          second: "",
          third: ""
        },
        'SWE': {
          first: data[183].values[0].Sport + ", ",
          second: data[183].values[1].Sport + ", ",
          third: data[183].values[2].Sport
        },
        'CHE': {
          first: data[184].values[0].Sport + ", ",
          second: data[184].values[1].Sport + ", ",
          third: data[184].values[2].Sport
        },
        'SYR': {
          first: data[185].values[0].Sport,
          second: "",
          third: ""
        },
        'TJK': {
          first: data[186].values[0].Sport + ", ",
          second: data[186].values[1].Sport + ", ",
          third: data[186].values[2].Sport
        },
        'TZA': {
          first: 'None',
          second: "",
          third: ""
        },
        'THA': {
          first: data[188].values[0].Sport + ", ",
          second: data[188].values[1].Sport + ", ",
          third: data[188].values[3].Sport
        },
        'TLS': {
          first: 'None',
          second: "",
          third: ""
        },
        'TGO': {
          first: 'None',
          second: "",
          third: ""
        },
        'TON': {
          first: 'None',
          second: "",
          third: ""
        },
        'TTO': {
          first: data[192].values[0].Sport + ", ",
          second: data[192].values[2].Sport,
          third: ""
        },
        'TUN': {
          first: data[193].values[0].Sport + ", ",
          second: data[193].values[1].Sport + ", ",
          third: data[193].values[2].Sport
        },
        'TUR': {
          first: data[194].values[0].Sport + ", ",
          second: data[194].values[1].Sport + ", ",
          third: data[194].values[2].Sport
        },
        'TKM': {
          first: 'None',
          second: "",
          third: ""
        },
        'TUV': {
          first: 'None',
          second: "",
          third: ""
        },
        'UGA': {
          first: data[197].values[0].Sport + ", ",
          second: "",
          third: ""
        },
        'UKR': {
          first: data[198].values[0].Sport + ", ",
          second: data[198].values[1].Sport + ", ",
          third: data[198].values[2].Sport
        },
        'ARE': {
          first: data[199].values[0].Sport + ", ",
          second: "",
          third: ""
        },
        'USA': {
          first: data[200].values[0].Sport + ", ",
          second: data[200].values[1].Sport + ", ",
          third: data[200].values[2].Sport
        },
        'URY': {
          first: data[202].values[0].Sport,
          second: "",
          third: ""
        },
        'UZB': {
          first: data[203].values[0].Sport + ", ",
          second: data[203].values[1].Sport + ", ",
          third: data[203].values[2].Sport
        },
        'VUT': {
          first: 'None',
          second: "",
          third: ""
        },
        'VEN': {
          first: data[205].values[0].Sport + ", ",
          second: data[205].values[1].Sport + ", ",
          third: data[205].values[2].Sport
        },
        'VNM': {
          first: data[206].values[0].Sport + ", ",
          second: data[206].values[1].Sport + ", ",
          third: data[206].values[2].Sport
        },
        'YEM': {
          first: 'None',
          second: "",
          third: ""
        },
        'ZMB': {
          first: 'None',
          second: "",
          third: ""
        },
        'ZWE': {
          first: data[209].values[0].Sport + ", ",
          second: "",
          third: ""
        }
      }
      // idea: get list of countries and manually put them
      // in including color change?
    });

    d3.select(window).on('resize', () => {
      this.map.resize();
    });
  }

  // old code to generate ranking
  // getRanking() {
  //   var countryToRatio = this.countryToRatio;
  //   var athleteNames = [];
  //   this.entriesBySportByYearByCountryRatio.forEach(function(d) {
  //     var sport = d.key;
  //     d.values.forEach(function(e) {
  //       e.values.forEach(function(f) {
  //         var countryName = f.key;
  //         var athletes = f.values;
  //         var num_medals = 0.0;
  //         var num_athletes = 0.0;
  //         athletes.forEach(function(a) {
  //           if (!athleteNames.includes(a.Name)) {
  //             athleteNames.push(a.Name);
  //             num_athletes++;
  //           }
  //           if (a.Medal.length > 0) {
  //             num_medals++;
  //           }
  //         })
  //         var ratio = num_athletes === 0 ? 0: num_medals / num_athletes;
  //         countryToRatio.push(new Object({key: countryName, values: [ratio, sport]}));
  //       })
  //     })
  //   })
  //   var result = d3.nest()
  //     .key(function(d) {
  //       return d.key;
  //     })
  //     .sortKeys(d3.ascending)
  //     .sortValues(function(a, b) {
  //       // console.log("here's a", a)
  //       // console.log("here's b", b)
  //       return b.values[0] - a.values[0];
  //     })
  //     .entries(countryToRatio);
  //   this.orderedTop = result
  //   console.log("finally the result", this.orderedTop)
  //
  //   let csv = ""
  //   result.forEach(function(d) {
  //     d.values.forEach(function(e) {
  //       // console.log("here's e:", e)
  //       let row = e.key += "," + e.values[0] + "," + e.values[1] + "\n";
  //       csv += row;
  //       // console.log("here's row:", row);
  //     })
  //   })
  //   var pom = document.createElement('a');
  //   var csvContent=csv; //here we load our csv data
  //   var blob = new Blob([csv],{type: 'text/csv;charset=utf-8;'});
  //   var url = URL.createObjectURL(blob);
  //   pom.href = url;
  //   pom.setAttribute('download', 'foo.csv');
  //   pom.click();
  // }

  // getTop(country) {
  //   var top = this.data;
  //   console.log("checking what top is", this.data)
  //   var index = top.findIndex(function(c) {
  //     return c.key == country;
  //   });
  //
  //   console.log("checking this country", country);
  //
  //   var values = top[index];
  //   console.log("here's the info", values)
  //
  // }

} module.exports = worldMap;
