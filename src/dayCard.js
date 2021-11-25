const KtoCel = (t) => t - 273.15;
const KtoFaren = (t) => KtoCel(t) * (9 / 5) + 32;

export default class DayCard {
  //method

  createDayCard(weatherData, tempChar, date) {
    /*
    OUTLINE:
        <div class="day-card">
          <p class="day-card-title">Date</p>
          <div class="day-img-cont">
            <img src="" alt="" class="day-card-image">
          </div>
          <p class="day-img-descrip">Rain</p>
          <p class="day-hiLo">Temperature: <span class="day-hiLo">12/17</span>°<span class="tempFlag"> K</span></p>
        </div>
    */
    const convertionFunc = tempChar === "C" ? KtoCel : KtoFaren;
    const main = document.createElement("div");
    main.classList.add("day-card");

    let year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    let month = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
    let day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
    const title = document.createElement("p");
    title.classList.add("day-card-title");
    title.textContent = `${month}-${day}-${year}`; //to be formatted

    main.appendChild(title);

    const imgCont = document.createElement("div");
    imgCont.classList.add("day-img-cont");

    const img = document.createElement("img");
    img.classList.add("day-card-image");
    img.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    imgCont.appendChild(img);
    main.appendChild(imgCont);

    const descrip = document.createElement("p");
    descrip.classList.add("day-img-descrip");
    descrip.textContent = weatherData.weather[0].main;
    main.appendChild(descrip);

    const hiLo = document.createElement("p");
    hiLo.classList.add("day-hiLo");
    hiLo.textContent = `Temperature: ${parseInt(convertionFunc(weatherData.temp.max))} / ${parseInt(
      convertionFunc(weatherData.temp.min)
    )} °${tempChar}`;
    main.appendChild(hiLo);

    return main;
  }
}
