import { Request, Response } from "express";
import { prismaDB } from "../config/db";

export const getGeojsons = async (req: Request, res: Response) => {
  try {
    const features = await prismaDB.geoJSONData.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(201).json({ data: features });
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({ error: "Failed to fetch GeoJSONs" });
  }
};

export const deleteJson = async (req: Request, res: Response) => {
  try {
    await prismaDB.geoJSONData.deleteMany();
    res.status(200).json({ success: "deleted" });
  } catch (error) {
    res.status(500).json({ success: error });
  }
};
export const postGeojson = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, geojson } = req.body;
    if (!name || !geojson) {
      return res.status(400).json({ error: "Missing name or geojson" });
    }

    const newFeature = await prismaDB.geoJSONData.create({
      data: {
        name,
        geojson,
        // geometry,
      },
    });

    res.status(201).json({ data: newFeature });
  } catch (error) {
    console.error("POST error:", error);
    res.status(500).json({ error: "Failed to save GeoJSON" });
  }
};
