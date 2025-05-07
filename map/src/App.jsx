import React, { useState, useEffect } from "react";
import GeoJsonForm from "./components/FormComponent";
import MapView from "./components/MapComponent";

function App() {
  const [newFeatureData, setNewFeatureData] = useState(null);

  return (
    <>
      <MapView setNewFeatureData={setNewFeatureData} />
      <div style={{ marginTop: "10px" }}>
        <GeoJsonForm newFeatureData={newFeatureData} />
      </div>
    </>
  );
}

export default App;
