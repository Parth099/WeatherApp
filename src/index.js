import "./styles.css";
import "./reset.css";

import DayCard from "./dayCard.js";

const openWeatherAPIKey = "d46b5662af879b27eb72e6846556115c"; //oh no
var openWeatherReponseJSON; //keeps track of last valid query
var openWeatherReponseWeeklyJson;
let celsius = false;

//dom elements
const gridDaily = document.querySelector(".daily-grid-cont");

const cardMain = document.querySelector(".weather-card");
const cardLoc = cardMain.querySelector("#location");
const weatherImg = cardMain.querySelector("#weather-img");
const weatherDescrip = cardMain.querySelector("#weather-description");

const infoFlexCont = cardMain.querySelector(".info-flex");
const temp = infoFlexCont.querySelector("#Temp");
const feelsLike = infoFlexCont.querySelector("#real-feel");
const windSpd = infoFlexCont.querySelector("#wSpeed");
const hiLo = infoFlexCont.querySelector("#hi-lo");

const searchCard = document.querySelector(".search-card");
const cityField = searchCard.querySelector("#city");
const stateField = searchCard.querySelector("#state");
const countryField = searchCard.querySelector("#country");

cityField.value = "Philadelphia";
stateField.value = "";
countryField.value = "";

const errorSpace = searchCard.querySelector("#error-space");
const displayError = (errStr) => (errorSpace.textContent = errStr);

//main function: calls the API and triggers DOM update as well as saves prev valid Calls.
//its chained to call another async function if the first call was valid [cod: 200OK]
async function getWeatherJson(queryString) {
  const openWeatherReponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${queryString}&appid=${openWeatherAPIKey}`);
  const openWeatherReponsePotential = await openWeatherReponse.json();
  if (openWeatherReponsePotential.cod == 200) {
    updateDom(openWeatherReponsePotential);
    openWeatherReponseJSON = openWeatherReponsePotential;
    getWeatherForcastJson(openWeatherReponseJSON.coord);
  } else {
    displayError(openWeatherReponsePotential.cod + ": " + openWeatherReponsePotential.message);
  }
}
getWeatherJson("Philadelphia");

const KtoCel = (t) => t - 273.15;
const KtoFaren = (t) => KtoCel(t) * (9 / 5) + 32;
const applyTempFlagsDom = (flag) => document.querySelectorAll(".tempFlag").forEach((f) => (f.textContent = flag));

function calulateTempData(data) {
  const convertionFunc = celsius ? KtoCel : KtoFaren;
  data.temp = convertionFunc(data.temp);
  data.feels_like = convertionFunc(data.feels_like);
  data.temp_max = convertionFunc(data.temp_max);
  data.temp_min = convertionFunc(data.temp_min);

  const flag = celsius ? "C" : "F";
  applyTempFlagsDom(flag);
}

//data will always be valid
function updateDom(data) {
  errorSpace.textContent = ""; //clear errorSpace
  const TempData = Object.assign({}, data.main); //creates new object that can be altered
  calulateTempData(TempData); //changes K deg to what is required {C, F}

  cardLoc.textContent = `${data.name}, ${data.sys.country}`;
  weatherImg.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherDescrip.textContent = data.weather[0].main;

  temp.textContent = parseInt(TempData.temp);
  feelsLike.textContent = parseInt(TempData.feels_like);
  hiLo.textContent = `${parseInt(TempData.temp_max)} / ${parseInt(TempData.temp_min)}`;

  windSpd.textContent = `${data.wind.speed} m/s`;
}

document.getElementById("tempSwap").addEventListener("click", () => {
  celsius = !celsius;
  updateDom(openWeatherReponseJSON);
  displayToGrid(gridDaily, openWeatherReponseWeeklyJson);
});

document.getElementById("search-submit").addEventListener("click", () => {
  let queryString = "";
  if (cityField.value.length !== 0) {
    queryString += cityField.value;
  } else {
    return;
  }

  if (stateField.value.length !== 0) {
    queryString += "," + stateField.value;
  }
  if (countryField.value.length !== 0) {
    queryString += "," + countryField.value;
  }

  getWeatherJson(queryString);
});

async function getWeatherForcastJson(coord) {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly&appid=${openWeatherAPIKey}`
  );
  const potential = await data.json();
  if (potential.current !== "undefined") {
    openWeatherReponseWeeklyJson = potential;
    displayToGrid(gridDaily, openWeatherReponseWeeklyJson);
  }
}
function displayToGrid(G, weatherData) {
  document.querySelectorAll(".day-card").forEach((card) => card.remove());
  const C = new DayCard();
  const date = new Date();
  const tFlag = celsius ? "C" : "F";
  const convertionFunc = celsius ? KtoCel : KtoFaren;
  for (let i = 1; i < 8; i++) {
    date.setDate(date.getDate() + 1);
    G.appendChild(C.createDayCard(weatherData.daily[i], tFlag, date, convertionFunc));
  }
}
