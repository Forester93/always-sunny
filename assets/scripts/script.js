let pageContent = $("#dashboard");
let resultsSection = $("#display-results");
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
  const locationInputEl = document.getElementById("locationInput");
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
}

/**
 * If document is ready, call init()
 */
$(document).ready(() => {
  init();
});

function getData() {
  function buildPage(data) {
    for (let i in data) {
      let job = $("<div>")
        .addClass("col my-2")
        .append(
          $("<div>")
            .addClass("front-imgblock")
            .append(
              $("<div>")
                .addClass("front-img")
                .append(
                  $("<a>")
                    .addClass("custom-anchor")
                    .attr("href", data[i].company_url)
                    .text(data[i].company)
                )
            )
        )
        .append(
          $("<div>")
            .addClass("front-text")
            .append($("<h4>").text(data[i].title))
            .append($("<div>").html(data[i].description))
            .append(
              $("<span>")
                .addClass("position")
                .addClass("card col-5-body jobs")
                .text("Type:" + data[i].type)
            )
        );

      resultsSection.append(job);
    }
  }

  //TODO: Do a check if local storage doesn't exist

  if (!localStorage.getItem("restaurant-genie")) {
    alert(
      "No saved searches were found in this browsing session. Please submit a search query"
    );
    window.location.href = "index.html";
  }
  const dataJSON = localStorage.getItem("restaurant-genie");
  const data = JSON.parse(dataJSON);
  const resultLat = data.latitude;
  const resultLong = data.longitude;
  const jobDescription = data.jobDescription;

  // alert('URL CONSTRUCTED (LAT & LON FROM DATASTORE): https://developers.zomato.com/api/v2.1/search?entity_type=city&lat='+resultLat +'&lon='+resultLong+'&cuisine='+cuisineId+'&count=6' +'&sort=real_distance');
  let url = "";
  if (jobDescription == "All Programming Jobs") {
    url =
      "https://jobs.github.com/positions.json?lat=" +
      resultLat +
      "&long=" +
      resultLong;
  } else {
    url =
      "https://jobs.github.com/positions.json?description=" +
      jobDescription +
      "&lat=" +
      resultLat +
      "&long=" +
      resultLong;
  }

  alert(url);

  fetch(
    `https://api.codetabs.com/v1/proxy?quest=${url}`
    // ,{
    //   // The browser fetches the resource from the remote server without first looking in the cache.
    //   // The browser will then update the cache with the downloaded resource.
    // //   mode: "no-cors"
    // }
  )
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      if (data.length == 0) {
        alert("No results found. Please refine your search results");
        window.location.href = "index.html";
        return;
      }
      buildPage(data);
    });
}
