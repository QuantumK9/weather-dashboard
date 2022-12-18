// console.log("yo");

// event listenter on search button
$("#search-button").on("click", function (event) {
  // var person = $(this).attr("data-city");
  event.preventDefault();
  // console.log("event triggered");
  // This line of code will grab the input from the textbox
  var city = $("#search-input").val().trim();
  console.log(city);

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
          console.log(currentTimestamp, item.dt_txt);
          var firstDay = {
            city: city,
            date: moment.unix(item.dt).format("MM/DD/YYYY"),
            icon: `http://openweathermap.org/img/w/${item.weather[0].icon}.png`,
            temp: `${Math.round(item.main.temp - 273)} °C`,
            humidity: `${item.main.humidity} %`,
            // wind:
          };
          console.log(firstDay);
        }
        if (
          item.dt === currentTimestamp + 86400 ||
          item.dt === currentTimestamp + 2 * 86400 ||
          item.dt === currentTimestamp + 3 * 86400 ||
          item.dt === currentTimestamp + 4 * 86400
        ) {
          console.log(item, " is one day later", item.dt_txt);
          timeStamps.push(item.dt);
        }
        // console.log();
      });
      console.log(timeStamps);

      // console.log(response.list[0].dt);
      // var unixValue = response.list[3].dt;
      // var dateString = moment.unix(unixValue).format("MM/DD/YYYY");
      // console.log(dateString);
    });
  });
});
