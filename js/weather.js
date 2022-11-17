const msg = document.querySelector(".top-banner .msg");
const weatherContainer = document.getElementById("weather__container")

const applicantForm = document.getElementById('location');
const myForm = document.getElementById("myForm")
const cityName = document.getElementById("city-name")
applicantForm.addEventListener('submit', handleFormSubmit);

// const cityContainer = document.getElementById("location__city")
// const cityChange = document.getElementById("city__change-btn")
// cityChange.addEventListener('click', () => {
//   cityContainer.innerHTML = ' ';
//   // searchBlock.append(searchInput, searchBtn, errorBlock);
//   cityContainer.innerHTML = markUpHeaderContainer();
// });

function openForm() {
  myForm.style.display = "block";
}

const fetchData = async (dataForm) => {
  try {
    const result = await
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${dataForm.get("latitude")}&lon=${dataForm.get("longitude")}&appid=2931438045cd03cbd77760fecb7fd68b&lang=ru`);
    return await result.json();
  } catch (error) {
    msg.textContent = "error";
    console.error(error)
  }
}

function serializeForm(formNode) {
  return new FormData(formNode)
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const dataForm = serializeForm(event.target);
  toggleLoader()

  const response = await fetchData(dataForm);
  if (!response) {
    return null;
  }

  toggleLoader()

  console.log(response)
  render(response)

}

function render(response) {
  myForm.style.display = "none";
  cityName.textContent = response.name;
  weatherContainer.innerHTML = markUpWeatherContainer(response);
}

//показать загрузку во время отправки данных
function toggleLoader() {
  const loader = document.getElementById('loader')
  loader.classList.toggle('hidden')
}

//Получить время дня
function isDay(data) {
  let sunrise = data.sys.sunrise;
  let sunset = data.sys.sunrise;
  let now = Date.now();
  return (now > sunrise && now < sunset);
}

const markUpWeatherContainer = (dataWeather) => {
  return `<div class="weather__inner">
            <h2 class="weather__temperature">${Math.floor(dataWeather.main.temp - 273)}</h2>
            <img class="weather__icon" src="https://openweathermap.org/img/w/${dataWeather.weather[0].icon}.png" alt="погода в картинке">
            <span class="weather__units">o</span>
          </div>
          <ul class="weather-info__list">
            <li class="weather-info__item">
                <span>Ветер</span>
                <p>${dataWeather.wind.speed + "м/с" + "," + directionOfWind(dataWeather.wind.deg)}</p>
            </li>
            <li class="weather-info__item">
                <span>Давление</span>
                <p>${dataWeather.main.pressure} мм рт. ст.</p>
            </li>
            <li class="weather-info__item">
                <span>Влажность</span>
                <p>${dataWeather.main.humidity + ' %'}</p>
            </li>
            <li class="weather-info__item">
                <span>Облачность</span>
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
}

// const markUpHeaderContainer = () => {
//   return `<form id="location" action="/apply/" method="POST">
//                 <label>
//                     Широта:
//                     <input type="number" lang="en" name="latitude" id="latitude" placeholder="60.612499" required autofocus>
//                 </label>
//                 <label>
//                     Longitude:
//                     <input type="number" lang="en" name="longitude" id="longitude" placeholder="56.857498" required>
//                 </label>
//                 <button class="submit" type="submit">Отправить</button>
//                 <div id="loader" class="hidden">Отправляем...</div>
//                 <span class="msg"></span>
//             </form>`;
// }
//


//обработка системы счисления температуры
// unitsC.addEventListener('click', () => {
//   if(unitsC.classList.contains('unit-current')) {
//     return;
//   }
//
//   unitsC.classList.add('unit-current');
//   unitsF.classList.remove('unit-current');
//   document.querySelector('.weather__units').textContent = 'o';
//
//   const temperature = document.querySelector('.weather__temperature');
//   const convertedTemp = fToC(+temperature.textContent);
//   temperature.textContent = Math.round(convertedTemp);
// });
//
// unitsF.addEventListener('click', () => {
//   if(unitsF.classList.contains('unit-current')) {
//     return;
//   }
//
//   unitsF.classList.add('unit-current');
//   unitsC.classList.remove('unit-current');
//   document.querySelector('.weather__units').textContent = 'f';
//
//   const temperature = document.querySelector('.weather__temperature');
//   const convertedTemp = cToF(+temperature.textContent);
//   temperature.textContent = Math.round(convertedTemp);
// });



// const form = document.getElementById('form');
// form.addEventListener('submit', getFormValue);
// function getFormValue(event) {
//   event.preventDefault();
//   const name = form.querySelector('[name="name"]'), //получаем поле name
//       age = form.querySelector('[name="age"]'), //получаем поле age
//       terms = form.querySelector('[name="terms"]'), //получаем поле terms
//       plan = form.querySelector('[name="plan"]'); //получаем поле plan
//
//   const data = {
//     name: name.value,
//     age: age.value,
//     plan: plan.value,
//     terms: terms.checked
//   };
//   console.log(data);
// }

//
// function checkValidity(event) {
//   const formNode = event.target.form
//   const isValid = formNode.checkValidity()
//
//   formNode.querySelector('button').disabled = !isValid
// }
//
// applicantForm.addEventListener('input', checkValidity)
