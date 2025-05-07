import React, { useEffect, useRef, useState } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import axios from "axios";

const MapComponent = ({ setNewFeatureData }) => {
  const mapRef = useRef();
  const drawRef = useRef();
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const getJsonData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/geojsons");
      console.log("response => ", res.data);
      setFeatures(res.data?.data);
    } catch (error) {
      console.log("getting api error => ", error);
    }
  };
  useEffect(() => {
    // Load dummy features into map
    getJsonData();
    // setFeatures(dummyFeatures);
  }, []);

  const handleMapLoad = () => {
    const map = mapRef.current.getMap();
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
      },
    });
    map.addControl(draw);
    drawRef.current = draw;

    map.on("draw.create", (e) => {
      console.log("draw me => ", e);
      const feature = e.features[0];
      setNewFeatureData(feature);
    });
  };

  const renderLayerStyle = (featureType, id) => {
    if (featureType === "Point") {
      return {
        id: `layer-point-${id}`,
        type: "circle",
        paint: {
          "circle-radius": 6,
          "circle-color": "#FF0000",
        },
      };
    } else if (featureType === "LineString") {
      return {
        id: `layer-line-${id}`,
        type: "line",
        paint: {
          "line-color": "#00FF00",
          "line-width": 3,
        },
      };
    } else if (featureType === "Polygon") {
      return {
        id: `layer-polygon-${id}`,
        type: "fill",
        paint: {
          "fill-color": "#0000FF",
          "fill-opacity": 0.4,
        },
      };
    }
  };

  console.log("selected feature => ", selectedFeature);

  return (
    <div>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 71.25724,
          latitude: 29.143644,
          zoom: 5,
        }}
        style={{ width: "100%", height: "600px" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onLoad={handleMapLoad}
        getCursor={() => "pointer"}
        onClick={(e) => {
          const map = mapRef.current.getMap();
          const featuresAtClick = map.queryRenderedFeatures(e.point);

          const clickedFeature = featuresAtClick.find(
            (f) => f.properties && f.properties.name
          );

          if (clickedFeature) {
            console.log("click feature => ", clickedFeature);
            setSelectedFeature(clickedFeature.properties);
          } else {
            setSelectedFeature(null);
          }
        }}
      >
        {features.map((item) => (
          <Source key={item.id} id={item.id} type="geojson" data={item.geojson}>
            <Layer
              metadata={{ abc: "asdf" }}
              {...renderLayerStyle(item.geojson.geometry.type, item?.id)}
            />
          </Source>
        ))}

        {/* Popup */}
        {selectedFeature && (
          <Popup
            longitude={selectedFeature.longitude || 71.25724}
            latitude={selectedFeature.latitude || 29.143644}
            onClose={() => setSelectedFeature(null)}
            anchor="top"
          >
            <div>
              <h4>{selectedFeature.name}</h4>
              <p>
                {selectedFeature.createdAt
                  ? new Date(selectedFeature.createdAt).toLocaleString()
                  : ""}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
