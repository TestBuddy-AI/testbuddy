import dotenv from "dotenv";
import express from "express";
import apiRoutes from "./routes/apiRoutes";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT ||  process.env.PORT || 8000;

app.use(express.raw({ type: 'application/octet-stream', limit: '5mb' }));
app.use(express.json());
app.use(apiRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
