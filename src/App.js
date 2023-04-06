import "./App.css";
import React, { useEffect, useState } from "react";
import Form from "./components/Form/Form";
import Weather from "./components/Weather/WeatherComponent";

const API_key = "8119b9a182f84edac1ba537349f1e5ff";

const weatherIcon = {
  Thunderstorm: "wi-thunderstorm",
  Drizzle: "wi-sleet",
  Rain: "wi-storm-showers",
  Snow: "wi-day-snow",
  Atmosphere: "wi-fog",
  Clear: "wi-day-sunny",
  Clouds: "wi-day-fog",
};

const App = (props) => {
  const [state, setState] = useState({
    city: undefined,
    country: undefined,
    icon: undefined,
    celsius: undefined,
    temp_min: undefined,
    temp_max: undefined,
    description: "",
    error: false,
    showButton: false,
    disabled: false,
    lat: 0,
    lon: 0,
  });

  const [favourites, setFavourites] = useState([]);

  const calculateCelsius = (temp) => {
    return Math.floor(temp - 273.15);
  };

  const setMyState = (
    lat = 0,
    lon = 0,
    city = undefined,
    country = undefined,
    celsius = undefined,
    temp_min = undefined,
    temp_max = undefined,
    description = undefined,
    error = true,
    showButton = false
  ) => {
    setState({
      lat: lat,
      lon: lon,
      city: city,
      country: country,
      celsius: celsius,
      temp_min: temp_min,
      temp_max: temp_max,
      description: description,
      error: error,
      showButton: showButton,
    });
  };

  const [icon, setIcon] = useState(undefined);

  const getWeatherIcon = (rangeId) => {
    switch (true) {
      case rangeId >= 200 && rangeId <= 232:
        setIcon(weatherIcon.Thunderstorm);
        break;
      case rangeId >= 300 && rangeId <= 321:
        setIcon(weatherIcon.Drizzle);
        break;
      case rangeId >= 500 && rangeId <= 531:
        setIcon(weatherIcon.Rain);
        break;
      case rangeId >= 600 && rangeId <= 622:
        setIcon(weatherIcon.Snow);
        break;
      case rangeId >= 700 && rangeId <= 781:
        setIcon(weatherIcon.Atmosphere);
        break;
      case rangeId === 800:
        setIcon(weatherIcon.Clear);
        break;
      case rangeId >= 801 && rangeId <= 804:
        setIcon(weatherIcon.Clouds);
        break;
      default:
        setIcon(weatherIcon.Clear);
    }
  };

  const fetchApi = (city, country) => {
    if (city && country) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}`
        // `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city},${country}&cnt=7&appid=${API_key}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMyState(
            data.coord.lat,
            data.coord.lon,
            data.name,
            data.sys.country,
            calculateCelsius(data.main.temp),
            calculateCelsius(data.main.temp_min),
            calculateCelsius(data.main.temp_max),
            data.weather[0].description,
            false,
            true
          );
          getWeatherIcon(data.weather[0].id);
          console.log({ data });
        })
        .catch(() => {
          setMyState();
        });
    } else {
      setMyState();
    }
  };
  const disableButton = () => {
    setState({ ...state, disabled: true });
  };

  const getWeather = (e) => {
    e.preventDefault();
    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    fetchApi(city, country);
    disableButton();
  };

  const refreshWeather = (city, country) => {
    fetchApi(city, country);
    disableButton();
  };

  useEffect(() => {
    fetchApi("cluj", "romania");
    // Tried to see where the user is located
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("favourites"));
    if (items) {
      setFavourites(items);
    }
  }, []);

  const handleDay = () => {
    const bodyElement = document.getElementById("bodyElementId");
    bodyElement.classList.add("active");
  };

  const handleNight = () => {
    const bodyElement = document.getElementById("bodyElementId");
    bodyElement.classList.remove("active");
  };

  const handleAddToFavourites = () => {
    const array = JSON.parse(localStorage.getItem("favourites")) || [];

    if (!array.includes(state.city)) {
      array.push(state.city);
    }

    localStorage.setItem("favourites", JSON.stringify(array));
  };

  return (
    <div className="App">
      <button onClick={handleDay}>DAY</button>
      <button onClick={handleNight}>NIGHT</button>
      <button onClick={handleAddToFavourites}>
        Add this city to favourites !
      </button>

      <div style={{ color: "white" }}>
        <h2>My fav cities:</h2>
        {favourites.map((item) => (
          <h4>{item}</h4>
        ))}
      </div>

      <Form loadWeather={getWeather} error={state.error} />

      <Weather
        city={state.city}
        country={state.country}
        temp_celcius={state.celsius}
        temp_max={state.temp_max}
        temp_min={state.temp_min}
        description={state.description}
        weatherIcon={icon}
        showButton={state.showButton}
        refreshWeather={refreshWeather}
        disabled={state.disabled}
        lat={state.lat}
        lon={state.lon}
      />
    </div>
  );
};

export default App;
