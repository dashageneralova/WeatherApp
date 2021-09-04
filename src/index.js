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

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let dayForecast = document.querySelector("#forecastPanel");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (day, index) {
    let dayTemp = Math.round(day.temp.day);
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
         <div class="forecastDay">${formatForecastDay(day.dt)}</div>
         <div class="forecastWeather">
              <img src="src/${
                day.weather[0].icon
              }.svg" class="forecastPic" />
              <img src=${defineWindIconSrc(
                day.wind_speed
              )} class="forecastPic" />
         </div>
         <div class="forecastTemp">${dayTemp}°C</div>
      </div>
      `;
      celsiusTempForecast[index] = dayTemp;
    }
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

  currentWindIcon.setAttribute(
    "src",
    `${defineWindIconSrc(currentWindSpeed)}`
  );
  currentWindIcon.setAttribute(
    "alt",
    `${defineWindIconAlt(currentWindSpeed)}`
  );

  dayTime.innerHTML = moment()
    .utc()
    .add(response.data.timezone, "seconds")
    .format("dddd HH:mm");
  updateTime.innerHTML =
    "Last update: " +
    formatDayTime(new Date(response.data.dt * 1000));

  getCityForecast(response.data.coord);
  displayCelciusTemp();
}

function defineWindIconSrc(windSpeed) {
  let windIconSrc = null;
  if (windSpeed < 16) {
    windIconSrc = "src/smallBoat.svg";
  } else {
    if (windSpeed > 35) {
      windIconSrc = "src/boatWarning.svg";
    } else {
      windIconSrc = "src/bigBoat.svg";
    }
  }
  return windIconSrc;
}

function defineWindIconAlt(windSpeed) {
  let windIconAlt = null;
  if (windSpeed < 16) {
    windIconAlt = "boating weather";
  } else {
    if (windSpeed > 35) {
      windIconAlt = "all boats warning";
    } else {
      windIconSrc = "small boats warning";
    }
  }
  return windIconAlt;
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
  let forecastTemp = document.querySelectorAll(".forecastTemp");
  forecastTemp.forEach(function (celsiusTempDisplayed, index) {
    forecastTemp[index].innerHTML = `${Math.round(
      (celsiusTempForecast[index] * 9) / 5 + 32
    )} °F`;
  });
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
}

function displayCelciusTemp() {
  let displayedTemp = document.querySelector("#currentTemperature");
  displayedTemp.innerHTML = Math.round(celsiusTemperature);
  let forecastTemp = document.querySelectorAll(".forecastTemp");
  forecastTemp.forEach(function (fahrenheitTempDisplayed, index) {
    forecastTemp[
      index
    ].innerHTML = `${celsiusTempForecast[index]} °C`;
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
  });
}

function preventLinkDefault(event) {
  event.preventDefault();
  displayCelciusTemp();
}

findCityWeather("Vancouver");

let celsiusTemperature = null;

let celsiusTempForecast = [];

let form = document.querySelector("#city-form");
form.addEventListener("submit", getSubmitValue);

let myLocationButton = document.querySelector("#current-position");
myLocationButton.addEventListener("click", getMyGeo);

let fahrenheitLink = document.querySelector("#fahrenheitLink");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsiusLink");
celsiusLink.addEventListener("click", preventLinkDefault);
