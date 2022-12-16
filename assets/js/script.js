// console.log("yo");
var API_KEY = "678a5dc678523498214a6c93764d73f1";
// event listenter on search button
$("#search-button").on("click", function (event) {
  // var person = $(this).attr("data-city");
  event.preventDefault();
  console.log("event triggered");
  // This line of code will grab the input from the textbox
  var city = $("#search-input").val().trim();
  console.log(city);

  // AJAX request from Geolocation API for lon and lat of a city

  var geolocationQueryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

  $.ajax({
    url: geolocationQueryURL,
    method: "GET",
  }).then(function (response) {
    // console.log(response[0].lat, response[0].lon);

    var lat = response[0].lat;
    var lon = response[0].lon;

    var queryURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    // console.log(`queryURL: ${queryURL} lat: ${lat} lon:${lon}`);

    // second AJAX call for weather data , using lon and lat from the previous
    return $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
  });
});
