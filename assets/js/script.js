// console.log("yo");
// event listenter on search button
$("#search-button").on("click", function (event) {
  // var person = $(this).attr("data-city");
  event.preventDefault();
  console.log("event triggered");
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
    // var results = response.data;
    console.log(response[0].lat, response[0].lon);

    var lat = response[0].lat;
    var lon = response[0].lon;
    // for (var i = 0; i < results.length; i++) {
    //   var gifDiv = $("<div>");

    //   var rating = results[i].rating;

    //   var p = $("<p>").text("Rating: " + rating);

    //   var personImage = $("<img>");
    //   personImage.attr("src", results[i].images.fixed_height.url);

    //   gifDiv.prepend(p);
    //   gifDiv.prepend(personImage);

    //   $("#gifs-appear-here").prepend(gifDiv);
    // }
  });

  // var queryURL =`api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  // console.log(queryURL);
});
