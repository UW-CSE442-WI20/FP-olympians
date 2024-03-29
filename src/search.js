///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
// SEARCH BAR
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const d3 = require("d3");
const _ = require("underscore");
const {redrawBigChartClick} = require('./bigChart');
const generateMedalChart = require("./medalChart");

module.exports = 
function autocomplete(searchField, countryNames, sportData, medalsvg) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  searchField.addEventListener("input", function(e) {
    // a is the autocomplete outer div element
    // b is the temporary variable used to store each option in the div
    var a, b, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (var i = 0; i < countryNames.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (countryNames[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + countryNames[i].substr(0, val.length) + "</strong>";
        b.innerHTML += countryNames[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + countryNames[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          searchField.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
          currSportSelections = document.getElementById('select-sport');
          currSport = currSportSelections.options[currSportSelections.value].text // current sport
          const countryIndex = _.indexOf(countryNames, searchField.value);
          redrawBigChartClick(searchField.value, false);
          // generateMedalChart(sportData.values[countryIndex].values, medalsvg);
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  searchField.addEventListener("keydown", function(e) {
    var currSuggestion = document.getElementById(this.id + "autocomplete-list");
    if (currSuggestion) {
      currSuggestion = currSuggestion.getElementsByTagName("div");
    }
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(currSuggestion);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(currSuggestion);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (currSuggestion) {
          currSuggestion[currentFocus].click();
        }
      }
    }
  });

  function addActive(item) {
    /*a function to classify an item as "active":*/
    if (!item) {
      return false;
    }
    /*start by removing the "active" class on all items:*/
    removeActive(item);
    if (currentFocus >= item.length) {
      currentFocus = 0;
    }
    if (currentFocus < 0) {
      currentFocus = (item.length - 1);
    }
    /*add class "autocomplete-active":*/
    item[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(item) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < item.length; i++) {
      item[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != searchField) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}