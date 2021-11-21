import "./styles.css";
import "./reset.css";

const openWeatherAPIKey = "d46b5662af879b27eb72e6846556115c"; //oh no
let cityName = "Philadelphia"; //default
let cityWeatherData;

async function getWeatherJson() {
  const openWeatherReponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherAPIKey}`);
  const openWeatherReponseJSON = await openWeatherReponse.json();
  if (openWeatherReponseJSON.cod == 200) {
    console.log(openWeatherReponseJSON.cod);
    cityWeatherData = openWeatherReponseJSON;
  }
  console.log(cityWeatherData);
}
getWeatherJson();
