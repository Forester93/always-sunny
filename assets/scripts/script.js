let pageContent = $("#dashboard");
let resultsSection = $("#display-results");
let locationInputEl = document.getElementById("locationInput");
const API_KEY = "3c268b02dcc7e0b6b33d3d40d7acd0fd";
let data = [];

function buildPage() {
  for (let i = 0; i < products.length; i++) {
    let product = $("<section>")
      .addClass("col-3 col-s-5 col-xs-10 custom-card bg-custom")
      .append("<br>")
      .append("<br>")
      .append("<br>")
      .append($("<h2>").text(products[i].name))
      .append(
        $("<img>")
          .addClass("product-image")
          .attr("src", "./assets/images/" + products[i].photo)
          .attr("alt", products[i].description)
      )
      .append(
        $("<article>")
          .addClass("card-body")
          .append($("<p>").addClass("card-text").text(products[i].description))
      )
      .append(
        $("<span>")
          .addClass("price")
          .text("$" + products[i].price)
      )
      .append(
        $("<form>")
          .addClass("row justify-content-center align-items-center")
          .attr("product", i)
          .append(
            $("<button>")
              .addClass("col-2 removeFromCart")
              .attr("product", i)
              .attr("price", products[i].price)
              .text("➖")
          )
          .append(
            $("<button>")
              .addClass("col-2 addToCart")
              .attr("product", i)
              .attr("price", products[i].price)
              .text("➕")
          )
      );
    /* <section class="col-3 custom-card bg-custom">
                            <br><br><br>
                            <h2>Arrangement 1</h2>
                            <img class="product-image" src="./assets/images/Product (1).jpg" alt="Card image cap">
                            <article class="card-body">
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </article>
                            <span class='price'>$34.99</span>
                            <form product='product1' class='row justify-content-center align-items-center'>
                                <button class='col-2 removeFromCart' id='removeproduct1'>➖</button>
                                <button class='col-2 addToCart'  id='addproduct1'>➕</button>
                            </form>
                        </section> */
    pageContent.append(product);
  }
}

// buildPage();

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
      buildWeatherCard(data.current, locationInputEl.value);
      locationInputEl.value = "";
      //TODO: save search in a list
    });
}

// <div class="card">
// <img class="card-img-top" src="..." alt="Card image cap" />
// <div class="card-body">
//   <h5 class="card-title">Card title</h5>
//   <p class="card-text">
//     This is a longer card with supporting text below as a natural
//     lead-in to additional content. This content is a little bit
//     longer.
//   </p>
//   <p class="card-text">
//     This is a longer card with supporting text below as a natural
//     lead-in to additional content. This content is a little bit
//     longer.
//   </p>
//   <p class="card-text">
//     This is a longer card with supporting text below as a natural
//     lead-in to additional content. This content is a little bit
//     longer.
//   </p>
//   <p class="card-text">
//     This is a longer card with supporting text below as a natural
//     lead-in to additional content. This content is a little bit
//     longer.
//   </p>
//   <p class="card-text">
//     <small class="text-muted">Last updated 3 mins ago</small>
//   </p>
// </div>
// </div>
function selectImage(data) {
  return "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@4x.png";
}

function uvi(data) {
  return data;
  //TODO: put html representing colours for different UV indices
}
function buildWeatherCard(data, city) {
  let weatherCard = $("<section>")
    .addClass("card col-4")
    .append(
      $("<img>")
        // .addClass("card-img-top")
        .attr("src", selectImage(data))
    )
    .append(
      $("<div>")
        .addClass("card-body")
        //timezone name
        .append($("<h5>").addClass("card-title").text(city))
        .append("<hr>")
        .append(
          //date
          $("<p>").addClass("card-text").text(moment().format("MMM Do YYYY"))
        )
        //temperature
        .append(
          $("<p>")
            .addClass("card-text temperature")
            .text(
              "Temperature: " +
                Math.ceil((data.temp - 273.15) * 100) / 100 +
                "°C"
            )
        )
        //feels like
        .append(
          $("<p>")
            .addClass("card-text feels like")
            .text(
              "Feels like: " +
                Math.ceil((data.feels_like - 273.15) * 100) / 100 +
                "°C"
            )
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
              "Wind Speed: " + data.wind_speed + "m/s @" + data.wind_deg + "°"
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
