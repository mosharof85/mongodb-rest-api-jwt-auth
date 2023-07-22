import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  })
);

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is working...",
  });
});

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
