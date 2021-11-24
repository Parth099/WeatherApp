import "./styles.css";
import "./reset.css";

const openWeatherAPIKey = "d46b5662af879b27eb72e6846556115c"; //oh no
var openWeatherReponseJSON;
let cityName = "Philadelphia"; //keeps track of last valid city
let celsius = false;

//dom elements
const cardMain = document.querySelector(".weather-card");
const cardLoc = cardMain.querySelector("#location");
const weatherImg = cardMain.querySelector("#weather-img");
const weatherDescrip = cardMain.querySelector("#weather-description");

const infoFlexCont = cardMain.querySelector(".info-flex");
const temp = infoFlexCont.querySelector("#Temp");
const feelsLike = infoFlexCont.querySelector("#real-feel");
const windSpd = infoFlexCont.querySelector("#wSpeed");
const hiLo = infoFlexCont.querySelector("#hi-lo");

async function getWeatherJson(cityName) {
  const openWeatherReponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherAPIKey}`);
  openWeatherReponseJSON = await openWeatherReponse.json();
  if (openWeatherReponseJSON.cod == 200) {
    console.log(openWeatherReponseJSON);
    updateDom(openWeatherReponseJSON);
  }
}
getWeatherJson(cityName);

const KtoCel = (t) => t - 273.15;
const KtoFaren = (t) => KtoCel(t) * (9 / 5) + 32;
const applyTempFlagsDom = (flag) => document.querySelectorAll(".tempFlag").forEach((f) => (f.textContent = flag));

function calulateTempData(data) {
  let convertionFunc = celsius ? KtoCel : KtoFaren;
  data.temp = convertionFunc(data.temp);
  data.feels_like = convertionFunc(data.feels_like);
  data.temp_max = convertionFunc(data.temp_max);
  data.temp_min = convertionFunc(data.temp_min);

  let flag = celsius ? "C" : "F";
  applyTempFlagsDom(flag);
}

//data will always be valid
function updateDom(data) {
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
});
