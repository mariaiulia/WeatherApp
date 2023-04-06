import React, { useState, useEffect, useRef } from "react";

// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2FiaTM2IiwiYSI6ImNrdnh6NTV4NzBteGUybnFpdWlmZmtqamMifQ.mJkJlPdcH1m3_r1NqIPfXw";

export default function MapApp(props) {
  const [state, setState] = useState({
    zoom: 9,
  });

  const mapContainer = useRef(null);

  useEffect(() => {
    const lat = props.lat;
    const lng = props.lon;
    const { zoom } = state;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/gabi36/ckvy8b2b23u5515n6736ax1wo",
      center: [lng, lat],
      zoom: zoom,
    });

    map.on("move", () => {
      setState((prevState) => ({
        ...prevState,
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      }));
    });

    return () => map.remove();
  }, [props, state]);

  return (
    <div>
      <div className="sidebar py-2">
        Longitude: {state.lng} | Latitude: {state.lat} | Zoom: {state.zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
