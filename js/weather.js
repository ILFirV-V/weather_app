const msg = document.querySelector(".msg");
const units = document.querySelector(".units");
const map = document.getElementById("map");
const weatherContainer = document.getElementById("weather__container");
const applicantForm = document.getElementById('form__box');
const weatherForm = document.getElementById("form");
const cityName = document.querySelector("h1");
const unitsC = document.getElementById("units-c");
const unitsF = document.getElementById("units-f");
const btnOpenForm = document.getElementById('openForm');
const locationMy = document.getElementById('location__my');

applicantForm.addEventListener('submit', handleFormSubmit);
locationMy.addEventListener('mousedown', getLocation);
document.addEventListener('mousedown', closeForm);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleLocationMy, errorLocationMy);
  }  else {
    msg.textContent = "error. Не получается определить вашу геолокацию";
  }
}

async function handleLocationMy(position) {
  const { longitude, latitude }  = position.coords;
  const response = await fetchData(latitude, longitude);
  if (!response) {
    return null;
  }
  render(response);
}

function errorLocationMy() {
  msg.textContent = "error. Не получается определить вашу геолокацию";
}

function closeForm(event) {
  if(event.target.closest('.form') === null && btnOpenForm.disabled){
    weatherForm.style.display = 'none';
    btnOpenForm.disabled = false;
  }
}

function openForm() {
  weatherForm.style.display = "flex";
  btnOpenForm.disabled = true;
}

const fetchData = async (latitude, longitude) => {
  try {
    const result = await
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=2931438045cd03cbd77760fecb7fd68b&lang=ru`);
    return await result.json();
  } catch (error) {
    msg.textContent = "error";
  }
}

function serializeForm(formNode) {
  return new FormData(formNode);
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const dataForm = serializeForm(event.target);
  const response = await fetchData(dataForm.get("latitude"), dataForm.get("longitude"));
  if (!response) {
    return null;
  }
  render(response)
}

function render(response) {
  defaultStateBeforeRender();
  cityName.textContent = response.name;
  weatherContainer.innerHTML = markUpWeatherContainer(response);
  renderDayOrNight(response);
  renderMap(response);
}

function renderDayOrNight(data) {
  let attrName = isDay(data) ? 'day':'night';
  document.documentElement.setAttribute('data-theme', attrName);
}

function isDay(data) {
  let sunrise = data.sys.sunrise;
  let sunset = data.sys.sunset;
  let now = Date.now() - data.timezone;
  return (now > (sunrise * 1000) && now < (sunset * 1000));
}

const markUpWeatherContainer = (dataWeather) => {
  return `<div class="weather__inner">
            <h2 class="weather__temperature"><span id="temperature">${Math.floor(dataWeather.main.temp - 273)}</span>&deg</h2>
            <img class="weather__icon" src="https://openweathermap.org/img/w/${dataWeather.weather[0].icon}.png" alt="погода в картинке">
          </div>
          <ul class="weather-info__list">
            <li class="weather-info__item">
                <span>Ветер:</span>
                <p>${dataWeather.wind.speed + " м/с"},<br> ${directionOfWind(dataWeather.wind.deg)}</p>
            </li>
            <li class="weather-info__item">
                <span>Давление:</span>
                <p>${dataWeather.main.pressure} мм рт. ст.</p>
            </li>
            <li class="weather-info__item">
                <span>Влажность:</span>
                <p>${dataWeather.main.humidity + ' %'}</p>
            </li>
            <li class="weather-info__item">
                <span>Облачность:</span>
                <p>${dataWeather.clouds.all + ' %'}</p>
            </li>
          </ul>`
}

const directionOfWind = (degree) => {
  if (degree>337.5) { return 'северный' }
  if (degree>292.5) { return 'северо-западный' }
  if (degree>247.5) { return 'западный' }
  if (degree>202.5) { return 'юго-западный' }
  if (degree>157.5) { return 'южный' }
  if (degree>122.5) { return 'юго-восточный' }
  if (degree>67.5) { return 'восточный' }
  if (degree>22.5) { return 'северо-восточный' }
  return 'северный';
}

function defaultStateBeforeRender() {
  weatherForm.style.display = "none";
  btnOpenForm.disabled = false;
  units.style.display = "flex";
  if(unitsC.classList.contains('unit-current')) {
    return;
  }
  unitsC.classList.add('unit-current');
  unitsF.classList.remove('unit-current');
}

unitsC.addEventListener('click', () => {
  if(unitsC.classList.contains('unit-current')) {
    return;
  }
  unitsC.classList.add('unit-current');
  unitsF.classList.remove('unit-current');
  const temperature = document.getElementById("temperature");
  const convertedTemp = fToC(+temperature.textContent);
  temperature.textContent = Math.round(convertedTemp);
});

unitsF.addEventListener('click', () => {
  if(unitsF.classList.contains('unit-current')) {
    return;
  }
  unitsF.classList.add('unit-current');
  unitsC.classList.remove('unit-current');
  const temperature = document.getElementById("temperature");
  const convertedTemp = cToF(+temperature.textContent);
  temperature.textContent = Math.round(convertedTemp);
});

const cToF = (celsius) => {
  return celsius * 9 / 5 + 32;
}

const fToC = (fahrenheit) => {
  return (fahrenheit - 32) * 5 / 9;
}

function renderMap(data) {
  map.innerHTML = "";
  ymaps.ready(function () {
    let myMap = new ymaps.Map('map', {
          center: [data.coord.lat, data.coord.lon],
          zoom: 15,
        }, {
          searchControlProvider: 'yandex#search'
        }),

        placemark = new ymaps.Placemark(myMap.getCenter(), {
          hintContent: 'Метка расположения',
        }, {
          iconLayout: 'default#image',
          iconImageHref: 'images/location.svg',
          iconImageSize: [30, 42],
          iconImageOffset: [-5, -38],
        });
    myMap.geoObjects
        .add(placemark);
  });
}