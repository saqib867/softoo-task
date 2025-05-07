import express from "express";
import { prismaDB } from "./config/db";
import router from "./routes/geo.routes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);
app.listen(5000, () => {
  console.log("server is listeing...");
});
