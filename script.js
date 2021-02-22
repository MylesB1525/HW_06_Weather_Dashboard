// Variable calls
var input = document.getElementById("city-input");
var city = document.getElementById("city-name");
var search = document.getElementById("search-button");
var wind = document.getElementById("wind-speed");
var humidity = document.getElementById("humidity");
var temp = document.getElementById("temperature");
var uv = document.getElementById("UV-index");
var forecast = document.getElementById("forecast");
var apiKey = "66692d4c89b03e908fbb333c27dab470";
var cities = [];
if (localStorage.getItem("city")) {
  cities = JSON.parse(localStorage.getItem("city"));
}

$(document).ready(function () {
  // function for current weather
  function getWeather(cityName) {
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&appid=" +
        apiKey,
      method: "GET",
    }).then(function (response) {
      $.ajax({
        url:
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          response.coord.lat +
          "&lon=" +
          response.coord.lon +
          "&exclude=hourly,minutely}&appid=" +
          apiKey,
      }).then(function (res) {
        document.querySelector("#city-name").innerHTML = response.name;
        document.querySelector("#temperature").innerHTML =
          "Temperature: " + +res.current.temp + "°F";
        document.querySelector("#humidity").innerHTML =
          "Humidity: " + +res.current.humidity + "%";
        document.querySelector("#wind-speed").innerHTML =
          "Wind Speed: " + +res.current.wind_speed + "MPH";
        document.querySelector("#UV-index").innerHTML =
          "UV Index: " + +res.current.uvi;

        var temp = (response.main.temp - 273.15) * 1.8 + 32;
        $(temperature).html(temp.toFixed(0) + "&#8457");
      });
    });
  }

  // Forecast funtion (Need to fix Forcast, Icons, Local Storage)
  function getForecast(cityName) {
    let queryURL =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      cityName +
      "&appid=" +
      apiKey;
    console.log(queryURL);

    $.get(queryURL).then(function (response) {
      let forecastInfo = response.list;
      $(".fiveday").empty();
      $.each(forecastInfo, function (i) {
        console.log(moment(forecastInfo[i].dt_txt).format("l"));
        if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
          return;
        }
        let forecastDate = new Date(forecastInfo[i].dt * 1000);
        let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;

        $(".fiveday").append(`
          <div class="col-md">
            <div class="card text-white bg-primary">
              <div class="card-body">
                <h4>${
                  forecastDate.getMonth() + 1
                }/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                  <img src=${weatherIcon} alt="Icon">
                    <p>Temp: ${forecastInfo[i].main.temp} &#176;C</p>
                    <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
              </div>
            </div>
          </div>
        `);
      });
    });
  }

  document
    .querySelector("#searchButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      var city = document.querySelector("#inputBar").value.trim();
      getWeather(city);
      getForecast(city);
      cities.push(city);
      localStorage.setItem("city", JSON.stringify(cities));
      renderButtons();
    });

  function renderButtons() {
    $("#buttons-view").empty();

    for (var i = 0; i < cities.length; i++) {
      var a = $("<button>");
      a.addClass("city");
      a.attr("data-name", cities[i]);
      a.text(cities[i]);
      // Adding the button to the HTML
      $("#buttons-view").append(a);
    }
  }

  function displaycityInfo() {
    var city = $(this).attr("data-name");
    getForecast(city);
    getWeather(city);
  }

  $(document).on("click", ".city", displaycityInfo);

  renderButtons();
  getForecast("Kansas City");
  getWeather("Kansas City");
});
