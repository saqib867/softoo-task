import axios from "axios";

const API_URL = "http://localhost:5000/geojsons";

export const fetchGeojsons = () => axios.get(API_URL);
export const saveGeojson = (data) => axios.post(API_URL, data);
