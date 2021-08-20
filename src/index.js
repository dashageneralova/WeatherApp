function formatDay(now) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[now.getDay()];
  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = now.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${day} ${hour}:${minute}`;
}

let now = new Date();
let divDay = document.querySelector("#dateTime");
divDay.innerHTML = formatDay(now);

function showMyWeather(response) {
  let currentTemp = Math.round(response.data.main.temp);
  let myCity = response.data.name;
  let city = document.querySelector("#city");
  city.innerHTML = myCity;
  let displayedTemp = document.querySelector("#currentTemperature");
  displayedTemp.innerHTML = currentTemp;
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
  let divCity = document.querySelector("#city");
  divCity.innerHTML = response.data.name;
  let displayedTemp = document.querySelector("#currentTemperature");
  displayedTemp.innerHTML = currentTemp;
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
