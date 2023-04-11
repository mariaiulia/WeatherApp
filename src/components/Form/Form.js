import "./Form.css";
import "weather-icons/css/weather-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { TextField } from "@mui/material";

const Form = (props) => {
  const error = () => {
    return (
      <div className="alert alert-warning mx-5" role="alert">
        Error!
      </div>
    );
  };

  return (
    <div className="container">
      <div>{props.error ? error() : null}</div>
      <form onSubmit={props.loadWeather}>
        <div className="row justify-content-center">
          <div className="col-3">
            <TextField
              type="text"
              className="form-control"
              name="city"
              autoComplete="off"
              placeholder="City"
            />
          </div>
          <div className="col-3">
            <TextField
              type="text"
              className="form-control"
              name="country"
              autoComplete="off"
              placeholder="Country"
            />
          </div>
        </div>
        <div className="py-4">
          <button className="btn btn-warning">Get Weather</button>
        </div>
      </form>
    </div>
  );
};

export default Form;