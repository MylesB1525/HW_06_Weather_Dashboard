var inputEl = document.getElementById("city-input");
var cityEl = document.getElementById("city-name");
var searchEl = document.getElementById("search-button");
var windEl = document.getElementById("wind-speed");
var humidityEl = document.getElementById("humidity");
var tempEl = document.getElementById("temperature");
var uvEl = document.getElementById("UV-index");
var forecastEl = document.getElementById("forecast")
var apiKey = "66692d4c89b03e908fbb333c27dab470";

// function for current weather
function getWeather (cityName) {
  $.ajax({ url: 'http://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid='+apiKey, method: 'GET'})
  .then(function(response){
    console.log(response);
      $.ajax({
        url:"https://api.openweathermap.org/data/2.5/onecall?lat="+response.coord.lat+"&lon="+response.coord.lon+"&exclude=hourly,minutely}&appid="+apiKey
        }).then(function(response_two){
          document.querySelector("#city-name").innerHTML = (response.name)
          document.querySelector("#temperature").innerHTML = "Temperature: " + (+response_two.current.temp) + "°F"
          document.querySelector("#humidity").innerHTML = "Humidity: " + (+response_two.current.humidity) + "%"
          document.querySelector("#wind-speed").innerHTML = "Wind Speed: " + (+response_two.current.wind_speed) + "MPH"
          document.querySelector("#UV-index").innerHTML = "UV Index: " + (+response_two.current.uvi)

          var temp =(response.main.temp - 273.15) * 1.80 + 32;
        $(temperature).html((temp).toFixed(0)+"&#8457");
        })
  })
}

// Function for 5-day forecast
// function getForecast (cityName) {
//   $.ajax({ 
//     url:"api.openweathermap.org/data/2.5/forecast?id="+cityName+"&appid="+apiKey,
//       method: "GET"})
//       .then(function(response_two){
//         document.querySelector("#forecast").innerHTML = (response_two.daily[i])
//       })    
// }

function returnWeatherForecast(cityName) {
  let queryURL = "api.openweathermap.org/data/2.5/forecast?id="+cityName+"&appid="+apiKey;

  $.get(queryURL).then(function(response){
    let forecastInfo = response.list;
    forecastDiv.empty();
      $.each(forecastInfo, function(i) {
        if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
          return;
        }
          let forecastDate = new Date(forecastInfo[i].dt*1000);
          let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;

          forecastDiv.append(`
            <div class="col-md">
              <div class="card text-white bg-primary">
                <div class="card-body">
                  <h4>${forecastDate.getMonth()+1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                  <img src=${weatherIcon} alt="Icon">
                    <p>Temp: ${forecastInfo[i].main.temp} &#176;C</p>
                    <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
                </div>
              </div>
            </div>
            `)
      })
  })
};

document.querySelector("#searchButton").addEventListener("click",function(event){
  event.preventDefault();
  var city = document.querySelector("#inputBar").value.trim();
  console.log(city)
  getWeather(city);
})