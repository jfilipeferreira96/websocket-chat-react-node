import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectToDatabase from "./config/mongoose.config";
import * as dotenv from "dotenv";
import authRoutes from './routes/user.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/views", express.static("views"));
app.use(morgan("dev"));

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

require("dotenv").config();

connectToDatabase();

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

export default app;