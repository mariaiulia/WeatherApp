import "./App.css";
import React, { useEffect, useState } from "react";
import Form from "./components/Form/Form";
import Weather from "./components/Weather/WeatherComponent";
import MapApp from "./components/Map/MapComponent";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import IconButton from '@mui/material/IconButton';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { List, ListItem, ListSubheader } from "@mui/material";

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
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [allData, setAllData] = useState([]);
  const [todayList, setTodayList] = useState([]);
  const [day2, setDay2] = useState([]);
  const [day3, setDay3] = useState([]);
  const [day4, setDay4] = useState([]);
  const [day5, setDay5] = useState([]);

  const [tabValue, setTabValue] = useState("1");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  const fetchApi = (city, country, URL) => {
    if (city && country) {
      fetch(
        URL == "loc"
          ? `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${API_key}`
          : `https://api.openweathermap.org/data/2.5/forecast?lat=${city}&lon=${country}&appid=${API_key}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMyState(
            data.city.coord.lat,
            data.city.coord.lon,
            data.city.name,
            data.city.country,
            calculateCelsius(data.list[0].main.temp),
            calculateCelsius(data.list[0].main.temp_max),
            calculateCelsius(data.list[0].main.temp_min),
            data.list[0].weather[0].description,
            false,
            true
          );
          getWeatherIcon(data.list[0].weather[0].icon);

          setAllData(data);
          setTodayList(data.list.slice(0, 3));
          setDay2(data.list.slice(8, 11));
          setDay3(data.list.slice(16, 19));
          setDay4(data.list.slice(24, 27));
          setDay5(data.list.slice(32, 35));
        })
        .catch(() => {
          setMyState();
        });
    } else {
      setMyState();
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
      fetchApi(position.coords.latitude, position.coords.longitude, "");
    });
  }, [lat, long]);

  const disableButton = () => {
    setState({ ...state, disabled: true });
  };

  const getWeather = (e) => {
    e.preventDefault();
    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    fetchApi(city, country, "loc");
    disableButton();
  };

  const refreshWeather = (city, country) => {
    fetchApi(city, country);
    disableButton();
  };

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
    alert("Added successfully!")
    localStorage.setItem("favourites", JSON.stringify(array));
  };

  return (
    <div className="App">
    <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", marginRight:"20px", marginTop:"20px"}}>
    
    <IconButton style={{ width:"fit-content",backgroundColor:"white"}} aria-label="day" onClick={handleDay}>
      <LightModeIcon />
    </IconButton>
    <IconButton style={{ width:"fit-content",backgroundColor:"white"}} aria-label="night" onClick={handleNight}>
      <ModeNightIcon />
    </IconButton>
    <IconButton style={{ width:"fit-content", backgroundColor:"white"}} aria-label="favorite" onClick={handleAddToFavourites}>
      <FavoriteIcon/>
    </IconButton>
  
    </div>
    <List
    style={{ marginLeft:"670px"}}
    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
    component="nav"
    aria-labelledby="favorite cities"
    subheader={
      <ListSubheader component="div" id="favorite cities">
        Favorite Cities
      </ListSubheader>
    }
  >
      {favourites.map((item) => (
        <ListItem>{item}</ListItem>
      ))}
      </List>
      
      <Form loadWeather={getWeather} error={state.error} />
      <Box
        sx={{
          width: "100%",
          typography: "body1",
        }}
      >
        <TabContext value={tabValue}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
            >
              <Tab style={{ color: "white" }} label="Today weather" value="1" />
              <Tab style={{ color: "white" }} label="Day 2" value="2" />
              <Tab style={{ color: "white" }} label="Day 3" value="3" />
              <Tab style={{ color: "white" }} label="Day 4" value="4" />
              <Tab style={{ color: "white" }} label="Day 5" value="5" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {allData.list &&
                todayList.map((item) => (
                  <div>
                    <Weather
                      city={state.city}
                      country={state.country}
                      temp_celcius={calculateCelsius(item.main.temp)}
                      temp_max={calculateCelsius(item.main.temp_max)}
                      temp_min={calculateCelsius(item.main.temp_min)}
                      description={item.weather[0].description}
                      weatherIcon={icon}
                      showButton={state.showButton}
                      refreshWeather={refreshWeather}
                      disabled={state.disabled}
                      lat={state.lat}
                      lon={state.lon}
                      dt_txt={item.dt_txt}
                    />
                  </div>
                ))}
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {allData.list &&
                day2.map((item) => (
                  <div>
                    <Weather
                      city={state.city}
                      country={state.country}
                      temp_celcius={calculateCelsius(item.main.temp)}
                      temp_max={calculateCelsius(item.main.temp_max)}
                      temp_min={calculateCelsius(item.main.temp_min)}
                      description={item.weather[0].description}
                      weatherIcon={icon}
                      showButton={state.showButton}
                      refreshWeather={refreshWeather}
                      disabled={state.disabled}
                      lat={state.lat}
                      lon={state.lon}
                      dt_txt={item.dt_txt}
                    />
                  </div>
                ))}
            </div>
          </TabPanel>
          <TabPanel value="3">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {allData.list &&
                day3.map((item) => (
                  <div>
                    <Weather
                      city={state.city}
                      country={state.country}
                      temp_celcius={calculateCelsius(item.main.temp)}
                      temp_max={calculateCelsius(item.main.temp_max)}
                      temp_min={calculateCelsius(item.main.temp_min)}
                      description={item.weather[0].description}
                      weatherIcon={icon}
                      showButton={state.showButton}
                      refreshWeather={refreshWeather}
                      disabled={state.disabled}
                      lat={state.lat}
                      lon={state.lon}
                      dt_txt={item.dt_txt}
                    />
                  </div>
                ))}
            </div>
          </TabPanel>
          <TabPanel value="4">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {allData.list &&
                day4.map((item) => (
                  <div>
                    <Weather
                      city={state.city}
                      country={state.country}
                      temp_celcius={calculateCelsius(item.main.temp)}
                      temp_max={calculateCelsius(item.main.temp_max)}
                      temp_min={calculateCelsius(item.main.temp_min)}
                      description={item.weather[0].description}
                      weatherIcon={icon}
                      showButton={state.showButton}
                      refreshWeather={refreshWeather}
                      disabled={state.disabled}
                      lat={state.lat}
                      lon={state.lon}
                      dt_txt={item.dt_txt}
                    />
                  </div>
                ))}
            </div>
          </TabPanel>
          <TabPanel value="5">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {allData.list &&
                day5.map((item) => (
                  <div>
                    <Weather
                      city={state.city}
                      country={state.country}
                      temp_celcius={calculateCelsius(item.main.temp)}
                      temp_max={calculateCelsius(item.main.temp_max)}
                      temp_min={calculateCelsius(item.main.temp_min)}
                      description={item.weather[0].description}
                      weatherIcon={icon}
                      showButton={state.showButton}
                      refreshWeather={refreshWeather}
                      disabled={state.disabled}
                      lat={state.lat}
                      lon={state.lon}
                      dt_txt={item.dt_txt}
                    />
                  </div>
                ))}
            </div>
          </TabPanel>
        </TabContext>
      </Box>
      {state.lon !== 0 && <MapApp lon={state.lon} lat={state.lat} />}
    </div>
  );
};

export default App;
