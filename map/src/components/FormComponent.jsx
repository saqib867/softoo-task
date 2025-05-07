import axios from "axios";
import React, { useState } from "react";

function GeoJsonForm({ newFeatureData }) {
  const [name, setName] = useState("");
  const [geojson, setGeojson] = useState("");

  const [submitting, setSubmiting] = useState(false);
  const [featureName, setFeatureName] = useState(null);
  const handleNewFeature = async (e) => {
    e.preventDefault();
    setSubmiting(true);
    try {
      const newData = await axios.post("http://localhost:5000/api/geojsons", {
        geojson: {
          ...newFeatureData,
          properties: {
            name: featureName,
            createdAt: new Date().toDateString(),
          },
        },
        name: featureName,
      });
      console.log("new data => ", newData);
      window.location.reload();
    } catch (error) {
      console.log("error => ", error);
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <>
      {/* Form for new feature */}
      {newFeatureData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Name your new feature:</h3>
          <form onSubmit={handleNewFeature}>
            <input
              type="text"
              placeholder="Enter feature name"
              value={featureName}
              className="feature-input"
              onChange={(e) => setFeatureName(e.target.value)}
              required
            />
            <button className="submit-btn" type="submit" disabled={submitting}>
              {submitting ? "Submitting" : "Submit"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default GeoJsonForm;
