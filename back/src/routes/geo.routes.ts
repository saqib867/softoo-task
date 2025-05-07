import express from "express";
import {
  deleteJson,
  getGeojsons,
  postGeojson,
} from "../controllers/geo.controller";

const router = express.Router();

router.get("/geojsons", getGeojsons);
router.post("/geojsons", postGeojson);
router.delete("/geojsons", deleteJson);
export default router;
