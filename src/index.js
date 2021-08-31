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

let now = new Date();
let divDay = document.querySelector("#dateTime");
divDay.innerHTML = formatDayTime(now);

function showMyWeather(response) {
  let currentTemp = Math.round(response.data.main.temp);
  let myCity = response.data.name;
  let currentWeather = response.data.weather[0].description;
  let currentWindSpeed = Math.round(response.data.wind.speed);
  let currentHumidity = response.data.main.humidity;
  let city = document.querySelector("#city");
  city.innerHTML = myCity;
  let displayedTemp = document.querySelector("#currentTemperature");
  displayedTemp.innerHTML = currentTemp;
  let weatherDescription = document.querySelector(
    "#weatherDescription"
  );
  weatherDescription.innerHTML = currentWeather;
  let windSpeed = document.querySelector("#currentWindSpeed");
  windSpeed.innerHTML = currentWindSpeed;
  let humidity = document.querySelector("#currentHumidity");
  humidity.innerHTML = currentHumidity;
  let currentWeatherIcon = document.querySelector(
    "#currentWeatherIcon"
  );
  currentWeatherIcon.setAttribute(
    "src",
    `src/${response.data.weather[0].icon}.svg`
  );
  currentWeatherIcon.setAttribute(
    "alt",
    response.data.weather[0].description
  );
  let currentWindIcon = document.querySelector("#currentWindIcon");
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
  let currentDayTime = moment()
    .utc()
    .add(response.data.timezone, "seconds")
    .format("dddd HH:mm");
  let dayTime = document.querySelector("#dateTime");
  dayTime.innerHTML = currentDayTime;
  let updateTime = document.querySelector("#updateTime");
  updateTime.innerHTML =
    "Last update: " +
    formatDayTime(new Date(response.data.dt * 1000));
}

function getMyWeather(geo) {
  let apiKey = "9fec9e7231d9ae66f5a9a5b307926c8c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geo.coords.latitude}&lon=${geo.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showMyWeather);
}

function getMyGeo() {
  navigator.geolocation.getCurrentPosition(getMyWeather);
}

function logWeather(response) {
  let currentTemp = Math.round(response.data.main.temp);
  let currentWeather = response.data.weather[0].description;
  let currentWindSpeed = Math.round(response.data.wind.speed);
  let currentHumidity = response.data.main.humidity;
  let divCity = document.querySelector("#city");
  divCity.innerHTML = response.data.name;
  let displayedTemp = document.querySelector("#currentTemperature");
  displayedTemp.innerHTML = currentTemp;
  let weatherDescription = document.querySelector(
    "#weatherDescription"
  );
  weatherDescription.innerHTML = currentWeather;
  let windSpeed = document.querySelector("#currentWindSpeed");
  windSpeed.innerHTML = currentWindSpeed;
  let humidity = document.querySelector("#currentHumidity");
  humidity.innerHTML = currentHumidity;
  let currentWeatherIcon = document.querySelector(
    "#currentWeatherIcon"
  );
  currentWeatherIcon.setAttribute(
    "src",
    `src/${response.data.weather[0].icon}.svg`
  );
  currentWeatherIcon.setAttribute(
    "alt",
    response.data.weather[0].description
  );
  let currentWindIcon = document.querySelector("#currentWindIcon");
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

  let currentDayTime = moment()
    .utc()
    .add(response.data.timezone, "seconds")
    .format("dddd HH:mm");
  let dayTime = document.querySelector("#dateTime");
  dayTime.innerHTML = currentDayTime;
  let updateTime = document.querySelector("#updateTime");
  updateTime.innerHTML =
    "Last update: " +
    formatDayTime(new Date(response.data.dt * 1000));
}

function cityDefine(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#inlineFormInputCity2");
  let apiKey = "9fec9e7231d9ae66f5a9a5b307926c8c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(logWeather);
}

let form = document.querySelector("#city-form");
form.addEventListener("submit", cityDefine);

let myLocationButton = document.querySelector("#current-position");
myLocationButton.addEventListener("click", getMyGeo);
