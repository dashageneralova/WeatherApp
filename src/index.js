function formatDayTime(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${day} ${hour}:${minute}`;
}
function displayForecast() {
  let dayForecast = document.querySelector("#forecastPanel");
  let forecastHTML = `<div class="row">`;
  let days = ["Mon", "Tue", "Wed"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
    <div class="col-2">
        <div class="forecastDay">${day}</div>
        <div class="forecastWeather">
              <img src="src/01d.svg" class="forecastPic" />
              <img src="src/smallBoat.svg" class="forecastPic" />
        </div>
        <div class="forecastTemp">25°C</div>
    </div>
    `;
  });
  forecastHTML = forecastHTML + `</div>`;
  dayForecast.innerHTML = forecastHTML;
}

function displayCityWeather(response) {
  let currentWindSpeed = Math.round(response.data.wind.speed);
  celsiusTemperature = response.data.main.temp;

  let city = document.querySelector("#city");
  let displayedTemp = document.querySelector("#currentTemperature");
  let weatherDescription = document.querySelector(
    "#weatherDescription"
  );
  let windSpeed = document.querySelector("#currentWindSpeed");
  let humidity = document.querySelector("#currentHumidity");
  let currentWeatherIcon = document.querySelector(
    "#currentWeatherIcon"
  );
  let currentWindIcon = document.querySelector("#currentWindIcon");
  let dayTime = document.querySelector("#dateTime");
  let updateTime = document.querySelector("#updateTime");

  city.innerHTML = response.data.name;
  displayedTemp.innerHTML = Math.round(celsiusTemperature);
  weatherDescription.innerHTML = response.data.weather[0].description;
  windSpeed.innerHTML = currentWindSpeed;
  humidity.innerHTML = response.data.main.humidity;

  currentWeatherIcon.setAttribute(
    "src",
    `src/${response.data.weather[0].icon}.svg`
  );
  currentWeatherIcon.setAttribute(
    "alt",
    response.data.weather[0].description
  );

  if (currentWindSpeed < 16) {
    currentWindIcon.setAttribute("src", "src/smallBoat.svg");
    currentWindIcon.setAttribute("alt", "boating weather");
  } else {
    if (currentWindSpeed > 35) {
      currentWindIcon.setAttribute("src", "src/boatWarning.svg");
      currentWindIcon.setAttribute("alt", "all boats warning");
    } else {
      currentWindIcon.setAttribute("src", "src/bigBoat.svg");
      currentWindIcon.setAttribute("alt", "small boats warning");
    }
  }

  dayTime.innerHTML = moment()
    .utc()
    .add(response.data.timezone, "seconds")
    .format("dddd HH:mm");
  updateTime.innerHTML =
    "Last update: " +
    formatDayTime(new Date(response.data.dt * 1000));

  console.log(response);
  getCityForecast(response.data.coord);
}

function getCityForecast(coordinates) {
  let apiKey = "9fec9e7231d9ae66f5a9a5b307926c8c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getMyWeather(geo) {
  let apiKey = "9fec9e7231d9ae66f5a9a5b307926c8c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geo.coords.latitude}&lon=${geo.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayCityWeather);
}

function getMyGeo() {
  navigator.geolocation.getCurrentPosition(getMyWeather);
}

function findCityWeather(city) {
  let apiKey = "9fec9e7231d9ae66f5a9a5b307926c8c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayCityWeather);
}

function getSubmitValue(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#inlineFormInputCity2");
  findCityWeather(cityInput.value);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let displayedTemp = document.querySelector("#currentTemperature");
  displayedTemp.innerHTML = Math.round(
    (celsiusTemperature * 9) / 5 + 32
  );
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
}

function displayCelciusTemp(event) {
  event.preventDefault();
  let displayedTemp = document.querySelector("#currentTemperature");
  displayedTemp.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

findCityWeather("Vancouver");

let celsiusTemperature = null;

let form = document.querySelector("#city-form");
form.addEventListener("submit", getSubmitValue);

let myLocationButton = document.querySelector("#current-position");
myLocationButton.addEventListener("click", getMyGeo);

let fahrenheitLink = document.querySelector("#fahrenheitLink");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsiusLink");
celsiusLink.addEventListener("click", displayCelciusTemp);
