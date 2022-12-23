// console.log("yo");
let cities = [
  // {
  //   cityName: "",
  //   data: [],
  // },
];

$(document).ready(function () {
  var storedCities = JSON.parse(localStorage.getItem("cities"));
  if (storedCities !== null) {
    cities = storedCities;
  }
});

// event listenter on search button
$("#search-button").on("click", function (event) {
  // var person = $(this).attr("data-city");
  event.preventDefault();
  // console.log("event triggered");
  // This line of code will grab the input from the textbox
  var city = $("#search-input").val().trim();
  // console.log(city);

  // AJAX request from Geolocation API for lon and lat of a city
  var API_KEY = "678a5dc678523498214a6c93764d73f1";
  var geolocationQueryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

  $.ajax({
    url: geolocationQueryURL,
    method: "GET",
  }).then(function (response) {
    // console.log(response[0].lat, response[0].lon);

    var lat = response[0].lat;
    var lon = response[0].lon;

    var queryURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=50&appid=${API_KEY}`;
    // console.log(`queryURL: ${queryURL} lat: ${lat} lon:${lon}`);

    // second AJAX call for weather data , using lon and lat from the previous
    return $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // console.log(response);
      var results = response.list;
      var timeStamps = [];
      var currentTimestamp;
      var fiveDaysData = [];
      results.map(function (item, i) {
        if (i === 0) {
          timeStamps.push(item.dt);
          currentTimestamp = item.dt;
          // console.log(currentTimestamp, item.dt_txt);
          var firstDay = {
            city: city,
            date: moment.unix(item.dt).format("MM/DD/YYYY"),
            icon: `http://openweathermap.org/img/w/${item.weather[0].icon}.png`,
            temp: `${Math.round(item.main.temp - 273)} °C`,
            humidity: `${item.main.humidity} %`,
            wind: `${
              Math.round(convertingWindToKph(item.wind.speed) * 100) / 100
            } Km/h`,
          };
          fiveDaysData.push(firstDay);
          console.log(firstDay);
          console.log(fiveDaysData);
        }
        if (
          item.dt === currentTimestamp + 86400 ||
          item.dt === currentTimestamp + 2 * 86400 ||
          item.dt === currentTimestamp + 3 * 86400 ||
          item.dt === currentTimestamp + 4 * 86400
        ) {
          // console.log(item, " is one day later", item.dt_txt);
          var futureDay = {
            city: city,
            date: moment.unix(item.dt).format("MM/DD/YYYY"),
            icon: `http://openweathermap.org/img/w/${item.weather[0].icon}.png`,
            temp: `${Math.round(item.main.temp - 273)} °C`,
            humidity: `${item.main.humidity} %`,
            wind: `${
              Math.round(convertingWindToKph(item.wind.speed) * 100) / 100
            } Km/h`,
          };
          fiveDaysData.push(futureDay);
          timeStamps.push(item.dt);
          console.log(fiveDaysData);
        }
        // console.log();
      });
      displayCurrentDay(fiveDaysData);
      displayFiveDayForecast(fiveDaysData);
      addCityToCities(city, fiveDaysData);
      renderButtons(cities);
      addToLocalStorage(cities);
    });
  });
});

//helper functions
function convertingWindToKph(windSpeed) {
  return windSpeed * 3.6;
}

function displayCurrentDay(fiveDaysData) {
  $("#today").empty();
  var firstDayData = fiveDaysData[0];
  var h3El = $("<h3>").text(`${firstDayData.city} ${firstDayData.date} `);
  var iconEl = $("<img>").attr("src", firstDayData.icon);
  h3El.append(iconEl);
  var temperatureEl = $("<p>").text(`Temperature: ${firstDayData.temp}`);
  var humidityEl = $("<p>").text(`Humidity: ${firstDayData.humidity}`);
  var windEl = $("<p>").text(`Wind: ${firstDayData.wind}`);
  $("#today").append(h3El, temperatureEl, humidityEl, windEl);
}

function displayFiveDayForecast(fiveDaysData) {
  $("#forecast").empty();
  fiveDaysData.map(function (day) {
    var dayDiv = $("<div>");
    dayDiv.attr("class", "card col px-1 py-2 mx-1  ");
    var h5El = $("<h5>").text(`${day.date} `);
    var iconEl = $("<img>").attr("src", day.icon);

    var temperatureEl = $("<p>").text(`Temp: ${day.temp}`);
    var humidityEl = $("<p>").text(`Humidity: ${day.humidity}`);

    dayDiv.append(h5El, iconEl, temperatureEl, humidityEl);
    $("#forecast").append(dayDiv);
  });
}

// function that adds city with data to cities state
function addCityToCities(city, fiveDaysData) {
  let cityExists = false;
  cities.map((ct) => {
    if (ct.cityName === city) {
      console.log(`city already exists`);
      cityExists = true;
      return;
    }
  });
  if (!cityExists) {
    console.log("It doesnt exist so I add it!");
    cities.push({
      cityName: city,
      data: fiveDaysData,
    });
  }
}

// function that stores cities to localstorage
function addToLocalStorage(cities) {
  localStorage.setItem("cities", JSON.stringify(cities));
}
// function that adds button for city searched
function renderButtons() {
  $("#history").empty();

  // Loops through the array of cities

  cities.map(function (ct) {
    var btnEl = $("<button>");
    btnEl.addClass("city");
    btnEl.attr("data-city", ct.cityName);
    btnEl.text(ct.cityName);
    $("#history").append(btnEl);
  });
}
