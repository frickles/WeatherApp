// Nyckel för API
const apiKey = '7b1a4f52409074450a76901b1adcaef0';

let lon = 0;
let lat = 0;

// Funktion för att hämta väder-api
function fetchWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=sv&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => displayWeather(data));
}

//Funktion för att söka stad
function search() {
  // Anropar "fetchWeather-funktionen" på sökrutans värde
  fetchWeather(document.querySelector('.search-bar').value);
}

//Funktion för att visa dagens väder
function displayWeather(data) {
  //Hämtar ut aktuella värden från API:n
  const name = data.name;
  const icon = data.weather[0].icon;
  const description = data.weather[0].description;
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const speed = data.wind.speed;
  lon = data.coord.lon;
  lat = data.coord.lat;

  //Datum för att få ut tid för senast uppdaterad
  const d = new Date();
  const currTime = d.toLocaleTimeString();

  // Hämtar ut och visar värden i motsvarande container
  document.querySelector('.city').innerText = name;
  document.querySelector(
    '.icon'
  ).src = `https://openweathermap.org/img/wn/${icon}.png`;
  document.querySelector('.description').innerText = description;
  document.querySelector('.temp').innerText = `${temp}°`;
  document.querySelector('.humidity').innerText = `Luftfuktighet: ${humidity}%`;
  document.querySelector('.wind').innerText = `Vindstyrka: ${speed}m/s`;
  document.querySelector('.time').innerHTML = `Senast uppdaterad: ${currTime}`;
  // Visar en bild från respektive stad man skriver in i sökfältet
  document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?"${name}')`;
}

// Event Listener för knappen sök
document.querySelector('.search-btn').addEventListener('click', function () {
  search();
});

// Funktion för att hämta detaljerad väderdata
function fetchDetailedWeather() {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&units=metric&lang=sv&lon=${lon}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const detailedContainer = document.querySelector('.detailed-weather');
      detailedContainer.innerHTML = '';
      // Loopar igenom kommande dagar
      for (let i = 0; i < 5; i++) {
        let day = new Date(data.daily[i + 1].dt * 1000).toLocaleString(
          // Formatering av datum och dag
          'sv-se',
          {weekday: 'long'}
        );
        // Multiplicerar minutrar med 1000 för att få ut rätt dag
        let date = new Date(data.daily[i + 1].dt * 1000);

        // Skriver ut en div för varje loop med hjälp av att lägga till HTML-kod
        let minTemp = data.daily[i + 1].temp.min;
        let maxTemp = data.daily[i + 1].temp.max;
        let detailedCard = `<div class="card">
                            <h3>${day}</h3>
                            <h4>${date.toLocaleDateString('se-sv', {
                              month: '2-digit',
                              day: '2-digit',
                            })}</h4>
                            <p>Min: ${minTemp}°</p>
                            <p>Max: ${maxTemp}°</p>
                            <img src="https://openweathermap.org/img/wn/${
                              data.daily[i + 1].weather[0].icon
                            }.png" class="icon">
                            <p class="detailed-description">${
                              data.daily[i + 1].weather[0].description
                            }</p>
                            </div>`;

        detailedContainer.innerHTML += detailedCard;
      }
    });
}

// Event Listener för Bootstrap-knapp
// Visar och gömmer container för kommande väder
document.querySelector('.btn-secondary').addEventListener('click', function () {
  var detailedContainer =
    document.getElementsByClassName('detailed-weather')[0];

  if (detailedContainer.style.display == 'none') {
    detailedContainer.style.display = 'flex';
  } else {
    detailedContainer.style.display = 'none';
  }

  // Funktion för kommande väder
  fetchDetailedWeather();
});

// EVENT LISTENER FÖR ATT KUNNA SÖKA MED HJÄLP AV ENTER-KNAPPEN
document
  .querySelector('.search-bar')
  .addEventListener('keyup', function (event) {
    if (event.key == 'Enter') {
      search();
    }
  });

// STARTAR MED ATT ROPA PÅ FUNKTIONEN "FETCHWEATHER" MED§ VÄDER FÖR GÄVLE
fetchWeather('Gävle');
