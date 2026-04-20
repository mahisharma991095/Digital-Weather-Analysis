var cityInput = document.getElementById("searchCity");

var backgroundsList = [
  "day1.jpg",
  "day2.jpg",
  "day3.jpg",
  "day4.jpg",
  "day5.jpg",
  // "night1.jpg",
  // "night2.jpg",
  // "night3.jpg",
  // "night4.jpg",
  // "night5.jpg",
  "cloudy1.jpg",
  "cloudy2.jpg",
  "cloudy3.jpg",
  "cloudy4.jpg",
  "cloudy5.jpg",
  // "rainy1.jpg",
  // "rainy2.jpg",
  // "rainy3.jpg",
  // "rainy4.jpg",
  // "rainy5.jpg",
];

var randomBackground = backgroundsList[Math.floor(Math.random() * backgroundsList.length)];

document.body.style.background = "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)) , url('media/" + randomBackground + "')";

cityInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    loader();
    function loader() {

      document.getElementById("locationName").innerHTML = "";
      document.getElementById("temperatureValue").innerHTML = "";
      document.getElementById("weatherType").innerHTML = "";

      const img1 = document.createElement("img");
      const img2 = document.createElement("img");
      const img3 = document.createElement("img");

      img1.id = "loader1";
      img2.id = "loader2";
      img3.id = "loader3";

      img1.src = "icons/loader.gif";
      img2.src = "icons/loader.gif";
      img3.src = "icons/loader.gif";

      const parentElement1 = document.getElementById("locationName");
      const parentElement2 = document.getElementById("temperatureValue");
      const parentElement3 = document.getElementById("weatherType");

      parentElement1.appendChild(img1);
      parentElement2.appendChild(img2);
      parentElement3.appendChild(img3);

      // document.getElementById("loader1").src = "icons/loader.gif";
      // document.getElementById("loader2").src = "icons/loader.gif";
      // document.getElementById("loader3").src = "icons/loader.gif";
    }

    var cityInputValue = cityInput.value;

    var apiKey = "b1fd6e14799699504191b6bdbcadfc35"; // Default
    var unit = "metric";
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInputValue}&appid=${apiKey}&units=${unit}`;

    if (cityInputValue != "") {
      async function getWeather() {
        var response = await fetch(apiUrl);
        var data = await response.json();

        if (data.message != "city not found" && data.cod != "404") {
          // Fetch high-accuracy temperature from Open-Meteo as a verification/correction
          const lat = data.coord.lat;
          const lon = data.coord.lon;
          let accurateTemp = data.main.temp;

          try {
            const omResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const omData = await omResponse.json();
            if (omData && omData.current_weather) {
              accurateTemp = omData.current_weather.temperature;
            }
          } catch (e) {
            console.log("Open-Meteo fetch failed, falling back to OWM temp");
          }

          var location = data.name;
          var temperature = accurateTemp;
          var weatherType = data.weather[0].description;
          var realFeel = data.main.feels_like;
          var windSpeed = data.wind.speed;
          var windDirection = data.wind.deg;
          var visibility = data.visibility / 1000;
          var pressure = data.main.pressure;
          var maxTemperature = data.main.temp_max;
          var minTemperature = data.main.temp_min;
          var humidity = data.main.humidity;
          var sunrise = data.sys.sunrise;
          var sunset = data.sys.sunset;

          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInputValue}&appid=${apiKey}&units=${unit}`)
            .then(response => response.json())
            .then(data => {
              const forecastContainer = document.getElementById('forecast-container');

              forecastContainer.innerHTML = '';

              const dailyForecasts = {};
              data.list.forEach(entry => {
                const dateTime = new Date(entry.dt * 1000);
                const date = dateTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                if (!dailyForecasts[date]) {
                  dailyForecasts[date] = {
                    date: date,
                    icon: `https://openweathermap.org/img/w/${entry.weather[0].icon}.png`,
                    maxTemp: -Infinity,
                    minTemp: Infinity,
                    weatherType: entry.weather[0].main
                  };
                }

                if (entry.main.temp_max > dailyForecasts[date].maxTemp) {
                  dailyForecasts[date].maxTemp = entry.main.temp_max;
                }
                if (entry.main.temp_min < dailyForecasts[date].minTemp) {
                  dailyForecasts[date].minTemp = entry.main.temp_min;
                }
              });

              Object.values(dailyForecasts).forEach(day => {
                const forecastCard = document.createElement('div');
                forecastCard.classList.add('daily-forecast-card');

                forecastCard.innerHTML = `
        <p class="daily-forecast-date">${day.date}</p>
        <div class="daily-forecast-logo"><img class="imgs-as-icons" src="${day.icon}"></div>
        <div class="max-min-temperature-daily-forecast">
          <span class="max-daily-forecast">${Math.round(day.maxTemp)}<sup>o</sup>C</span>
          <span class="min-daily-forecast">${Math.round(day.minTemp)}<sup>o</sup>C</span>
        </div>
        <p class="weather-type-daily-forecast">${day.weatherType}</p>
      `;

                forecastContainer.appendChild(forecastCard);
              });
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });



          const formatTime = (timestamp) => {
            const date = new Date(timestamp * 1000);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          };

           // Fetch AQI & Life Analysis
           fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
             .then(res => res.json())
             .then(pollutionData => {
               const aqi = pollutionData.list[0].main.aqi;
               const aqiLevels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
               
               // Update AQI in UI
               const aqiElement = document.getElementById("aqiAdditionalValue") || document.querySelector(".air-quality-index-additional-value");
               if (aqiElement) aqiElement.innerHTML = aqiLevels[aqi - 1];

               // 🏥 Update Life & Health Analysis
               if (typeof updateLifeAnalysis === 'function') {
                  updateLifeAnalysis(Math.round(temperature), humidity, weatherType.toLowerCase(), aqi);
               }
             });

          document.getElementById("locationName").innerHTML = location;
          document.getElementById("temperatureValue").innerHTML = Math.round(temperature) + "<sup>o</sup>C";
          document.getElementById("weatherType").innerHTML = weatherType.charAt(0).toUpperCase() + weatherType.slice(1);
          document.getElementById("realFeelAdditionalValue").innerHTML = Math.round(realFeel) + "<sup>o</sup>C";
          document.getElementById("windSpeedAdditionalValue").innerHTML = windSpeed + " km/h";
          document.getElementById("windDirectionAdditionalValue").innerHTML = windDirection + "°";
          document.getElementById("visibilityAdditionalValue").innerHTML = visibility + " km";
          document.getElementById("pressureAdditionalValue").innerHTML = pressure + " hPa";
          document.getElementById("maxTemperatureAdditionalValue").innerHTML = Math.round(maxTemperature) + "<sup>o</sup>C";
          document.getElementById("minTemperatureAdditionalValue").innerHTML = Math.round(minTemperature) + "<sup>o</sup>C";
          document.getElementById("humidityAdditionalValue").innerHTML = humidity + "%";
          document.getElementById("sunriseAdditionalValue").innerHTML = formatTime(sunrise);
          document.getElementById("sunsetAdditionalValue").innerHTML = formatTime(sunset);

          // ⚡ Power Analysis
          updatePowerAnalysis(Math.round(temperature));

          // Update main weather icon
          const iconCode = data.weather[0].icon;
          document.querySelector(".temperature-icon img").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

          // Change background based on weather
          const weatherMain = data.weather[0].main.toLowerCase();
          let bgImage = "day1.jpg"; // default

          if (weatherMain.includes("cloud")) {
            bgImage = "cloudy" + (Math.floor(Math.random() * 5) + 1) + ".jpg";
          } else if (weatherMain.includes("rain") || weatherMain.includes("drizzle") || weatherMain.includes("thunderstorm")) {
            bgImage = "rainy" + (Math.floor(Math.random() * 5) + 1) + ".jpg";
          } else if (data.weather[0].icon.includes("n")) {
            bgImage = "night" + (Math.floor(Math.random() * 5) + 1) + ".jpg";
          } else {
            bgImage = "day" + (Math.floor(Math.random() * 5) + 1) + ".jpg";
          }
          document.body.style.background = "linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)) , url('media/" + bgImage + "')";
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundAttachment = "fixed";
        }
        else {
          document.getElementById("locationName").innerHTML = "City Not Found";
          document.getElementById("temperatureValue").innerHTML = "";
          document.getElementById("weatherType").innerHTML = "";
          // Reset Power Analysis on error
          document.getElementById("powerDeviceIcon").textContent = "❓";
          document.getElementById("powerDeviceName").textContent = "Analysis Unavailable";
          document.getElementById("powerMeterFill").style.width = "0%";
        }
      }

      getWeather();
    }
    else document.getElementById("locationName").innerHTML = "Enter a city name...";
  }
});


document.getElementById("resetBtn").addEventListener("click", function (event) {
  event.preventDefault(); // Prevents page reload if reset button is <a>

  // Clear input field (correct ID is "searchCity")
  document.getElementById("searchCity").value = "";

  // Reset main weather display
  document.getElementById("locationName").innerHTML = "";
  document.getElementById("temperatureValue").innerHTML = "";
  document.getElementById("weatherType").innerHTML = "";

  // Reset additional weather details
  document.getElementById("realFeelAdditionalValue").innerHTML = "-";
  document.getElementById("windSpeedAdditionalValue").innerHTML = "-";
  document.getElementById("windDirectionAdditionalValue").innerHTML = "-";
  document.getElementById("visibilityAdditionalValue").innerHTML = "-";
  document.getElementById("pressureAdditionalValue").innerHTML = "-";
  document.getElementById("maxTemperatureAdditionalValue").innerHTML = "-";
  document.getElementById("minTemperatureAdditionalValue").innerHTML = "-";
  document.getElementById("humidityAdditionalValue").innerHTML = "-";
  document.getElementById("sunriseAdditionalValue").innerHTML = "-";
  document.getElementById("sunsetAdditionalValue").innerHTML = "-";
  document.getElementById("aqiAdditionalValue").innerHTML = "-";

  // Reset Power Analysis
  document.getElementById("powerDeviceIcon").textContent = "❓";
  document.getElementById("powerDeviceName").textContent = "Search a city to see analysis";
  document.getElementById("powerDeviceStatus").textContent = "—";
  document.getElementById("powerBadge").textContent = "—";
  document.getElementById("powerBadge").className = "power-badge";
  document.getElementById("powerMeterFill").style.width = "0%";
  document.getElementById("powerAnalysisMsg").textContent = "—";

  // Clear forecast cards
  document.getElementById("forecast-container").innerHTML = "";

  // Optionally show default message
  document.getElementById("locationName").innerHTML = "Search City...";
});

// Star Button Functionality
document.getElementById("starBtn").addEventListener("click", function (event) {
  event.preventDefault();
  const icon = this.innerHTML;
  if (icon === "☆") {
    this.innerHTML = "★";
    this.style.color = "#ffcc00"; 
  } else {
    this.innerHTML = "☆";
    this.style.color = "#fff";
  }
});

// Initialize all sections with their default "Search a city" states
window.onload = () => {
  if (typeof updatePowerAnalysis === 'function') updatePowerAnalysis();
  if (typeof updateLifeAnalysis === 'function') updateLifeAnalysis();
};

// More Button (Settings/About) Functionality
const modal = document.getElementById("aboutModal");
const btn = document.getElementById("moreBtn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function (event) {
  event.preventDefault();
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


