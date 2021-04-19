let pageContent = $("#dashboard");
let resultsSection = $("#display-results");
let locationInputEl = document.getElementById("locationInput");
const API_KEY = "3c268b02dcc7e0b6b33d3d40d7acd0fd";
let data = [];

let formEl = document.getElementById("inputForm");
let searchButton = $("#searchBtn");
let clearBtn = $("#clearBtn");

/**
 * Page initializer
 */
function init() {
  formEl.addEventListener("submit", handleSubmit);
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

  // Add inputs to local store
  addInputsToLocalStore(locationInputEl);

  // Run search
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
function addInputsToLocalStore(locationInputEl) {
  data.push({
    latitude: locationInputEl.getAttribute("data-lat"),
    longitude: locationInputEl.getAttribute("data-lon"),
    location: locationInputEl.value,
  });
  localStorage.setItem("always-sunny-cities", JSON.stringify(data));
  fetchData(
    locationInputEl.getAttribute("data-lat"),
    locationInputEl.getAttribute("data-lon")
  );
}

//   if (!localStorage.getItem("restaurant-genie")) {
//     alert(
//       "No saved searches were found in this browsing session. Please submit a search query"
//     );
//     window.location.href = "index.html";
//   }
//   const dataJSON = localStorage.getItem("restaurant-genie");
//   const data = JSON.parse(dataJSON);
//   const resultLat = data.latitude;
//   const resultLong = data.longitude;
//   const jobDescription = data.jobDescription;

function fetchData(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_KEY}`;

  fetch(url)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      resultsSection.append(
        $("<section>")
          .addClass("bg-dark text-light col-12 rounded")
          .text("Today's Weather")
      );
      buildWeatherCard(
        data.current,
        locationInputEl.value,
        moment().format("LLLL")
      );
      locationInputEl.value = "";
      resultsSection.append(
        $("<section>")
          .addClass("bg-dark text-light col-12 rounded")
          .text("Five-day Forecast")
      );
      for (let i = 0; i < 5; i++) {
        buildWeatherCard(
          data.daily[i],
          locationInputEl.value,
          moment()
            .add(i + 1, "days")
            .format("LLLL")
        );
      }
      //TODO: save search in a list
    });
}

function selectImage(data) {
  return "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
}

function uvi(data) {
  return data;
  //TODO: put html representing colours for different UV indices
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
            .addClass("card-text UVI")
            .html("UVI: " + uvi(data.uvi))
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
