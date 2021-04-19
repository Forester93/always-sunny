const API_KEY = "3c268b02dcc7e0b6b33d3d40d7acd0fd";

let pageContent = $("#dashboard");
let resultsSection = $("#display-results");
let locationInputEl = document.getElementById("locationInput");

let storedData = [];
let currentLocation = "";
let formEl = document.getElementById("inputForm");
let searchButton = $("#searchBtn");
let clearBtn = $("#clearBtn");

//clear local storage
function reset() {
  localStorage.setItem("always-sunny-cities", "");
  storedData = [];
}

// Build Saved Search List

function buildSavedSearchList() {
  $("#savedSearches").html("");
  for (let i = 0; i < storedData.length; i++) {
    let savedSearch = $("<span>")
      .attr("lat", storedData[i].latitude)
      .attr("lon", storedData[i].longitude)
      .addClass("btn btn-primary text-light mt-2 p-1 rounded searchHistory")
      .text(storedData[i].location);
    $("#savedSearches").append(savedSearch);
  }
}

/**
 * Page initializer
 */
function init() {
  formEl.addEventListener("submit", handleSubmit);
  if (
    localStorage.getItem("always-sunny-cities") != null &&
    localStorage.getItem("always-sunny-cities") != ""
  ) {
    storedData = JSON.parse(localStorage.getItem("always-sunny-cities"));
  }

  buildSavedSearchList();
  //to search from savedSearchHistory
  $(".searchHistory").on("click", function (event) {
    event.preventDefault();
    fetchData(
      this.getAttribute("lat"),
      this.getAttribute("lon"),
      this.innerText
    );
  });
  $("#clearBtn").on("click", function (event) {
    event.preventDefault();
    reset();
    buildSavedSearchList();
  });
}

/**
 * Function to handle when submit button is clicked
 */
function handleSubmit(e) {
  e.preventDefault();

  // Get location textfield element & check if input is valid
  if (!validLocation(locationInputEl)) {
    $("#location-modal").modal("show");
    return;
  }

  // Add inputs to local store & Run fetch
  currentLocation = locationInputEl.value;
  handleData(locationInputEl);
}

/**
 * Validates if location is valid
 */
function validLocation(locationInputEl) {
  return (
    locationInputEl.value !== "" &&
    locationInputEl.getAttribute("data-lat") !== null &&
    locationInputEl.getAttribute("data-lon") !== null
  );
}

/**
 * Saves input to local store
 */
function handleData(locationInputEl) {
  //make sure the location wasn't saved before
  if (
    !storedData.some((element) => {
      return locationInputEl.value === element.location;
    })
  ) {
    storedData.push({
      latitude: locationInputEl.getAttribute("data-lat"),
      longitude: locationInputEl.getAttribute("data-lon"),
      location: locationInputEl.value,
    });
  }

  //save to local storage

  localStorage.setItem("always-sunny-cities", JSON.stringify(storedData));
  buildSavedSearchList();
  fetchData(
    locationInputEl.getAttribute("data-lat"),
    locationInputEl.getAttribute("data-lon"),
    locationInputEl.value
  );
}

//Fetch data

function fetchData(lat, lon, location) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_KEY}`;
  resultsSection.html("");

  fetch(url)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      resultsSection.append(
        $("<section>")
          .addClass("bg-dark text-light col-12 rounded my-2 py-2")
          .text("Today's Weather")
      );
      buildWeatherCard(data.current, location, moment().format("LLLL"));
      resultsSection.append(
        $("<section>")
          .addClass("bg-dark text-light col-12 rounded my-2 py-2")
          .text("Five-day Forecast")
      );
      for (let i = 0; i < 5; i++) {
        buildWeatherCard(
          data.daily[i],
          location,
          moment()
            .add(i + 1, "days")
            .format("LLLL")
        );
      }
    });
}

function selectImage(data) {
  return "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
}

function buildWeatherCard(data, city, date) {
  let weatherCard = $("<section>")
    .addClass("card col-4")
    .append(
      $("<div>")
        .addClass("card-body")
        //timezone name
        .append(
          $("<h5>")
            .addClass("card-title")
            .text(city)
            .append(
              $("<img>")
                // .addClass("card-img-top")
                .attr("src", selectImage(data))
            )
        )
        .append("<hr>")
        .append(
          //date
          $("<p>")
            .addClass("card-text")
            .text(moment(date, "LLLL").format("ddd MMM Do YYYY"))
        )
        //temperature
        .append(
          $("<p>")
            .addClass("card-text temperature")
            .text(() => {
              if (!isNaN(data.temp)) {
                return (
                  "Temperature: " +
                  Math.ceil((data.temp - 273.15) * 10) / 10 +
                  "°C"
                );
              } else {
                return (
                  "Temperature: Min " +
                  Math.ceil((data.temp["min"] - 273.15) * 10) / 10 +
                  "°C, Max " +
                  Math.ceil((data.temp["max"] - 273.15) * 10) / 10 +
                  "°C"
                );
              }
            })
        )
        //feels like
        .append(
          $("<p>")
            .addClass("card-text feels-like")
            .text(() => {
              if (!isNaN(data.feels_like)) {
                return (
                  "Feels like: " +
                  Math.ceil((data.feels_like - 273.15) * 10) / 10 +
                  "°C"
                );
              } else {
                return (
                  "Feels like: Day " +
                  Math.ceil((data.feels_like["day"] - 273.15) * 10) / 10 +
                  "°C, Night " +
                  Math.ceil((data.feels_like["night"] - 273.15) * 10) / 10 +
                  "°C"
                );
              }
            })
        )
        //humidity
        .append(
          $("<p>")
            .addClass("card-text humidity)")
            .text("Humidity: " + data.humidity + "%")
        )
        //UVI
        .append(
          $("<p>")
            .addClass("card-text")
            .addClass(() => {
              if (parseInt(data.uvi) < 2) {
                return "UV1";
              } else if (parseInt(data.uvi) < 5) {
                return "UV2";
              } else if (parseInt(data.uvi) < 8) {
                return "UV3";
              } else {
                return "UV4";
              }
            })
            .html(function () {
              if (parseInt(data.uvi) < 2) {
                return "UVI: " + data.uvi + " Favourable";
              } else if (parseInt(data.uvi) < 5) {
                return "UVI: " + data.uvi + " Moderate";
              } else if (parseInt(data.uvi) < 8) {
                return "UVI: " + data.uvi + " High";
              } else {
                return "UVI: " + data.uvi + " Severe";
              }
            })
        )
        //Wind speed and direction
        .append(
          $("<p>")
            .addClass("card-text wind-speed")
            .text(
              "Wind Speed: " + data.wind_speed + "km/hr @" + data.wind_deg + "°"
            )
        )
        //Weather Condition
        .append(
          $("<p>")
            .addClass("card-text weather")
            .text("Expected: " + data.weather[0].description)
        )
    );

  resultsSection.append(weatherCard);
}

/**
 * If document is ready, call init()
 */
$(document).ready(() => {
  init();
});
