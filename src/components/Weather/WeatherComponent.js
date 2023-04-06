// import MapApp from "../map/map";
import MapApp from "../Map/MapComponent";

const Weather = (props) => {
  const showTemp = (temp, min, max) => {
    if (temp != null)
      return (
        <div>
          <h1 className="py-2">{temp}&deg;</h1>
          <h1>
            <span className="px-4">{min}&deg;</span>
            <span className="px-4">{max}&deg;</span>
          </h1>
        </div>
      );
  };

  const showButton = () => {
    return (
      <div>
        {props.disabled ? (
          <button
            className="btn btn-warning refresh"
            onClick={() => {
              props.refreshWeather(props.city, props.country);
            }}
            disabled
          >
            Refresh
          </button>
        ) : (
          <button
            className="btn btn-warning refresh"
            onClick={() => {
              props.refreshWeather(props.city, props.country);
            }}
          >
            Refresh
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="container text-light">
      <div className="cards py-4">
        <h1>
          {props.city} {props.country}
        </h1>

        <h5 className="py-2">
          <i className={`wi ${props.weatherIcon} display-1`} />
        </h5>

        {showTemp(props.temp_celcius, props.temp_min, props.temp_max)}

        <h4 className="py-3">{props.description}</h4>
        <div>{props.showButton ? showButton() : null}</div>
      </div>
      {props.lon !== 0 && <MapApp lon={props.lon} lat={props.lat} />}
    </div>
  );
};

export default Weather;
