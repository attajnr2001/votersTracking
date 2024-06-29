import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser"; 
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import voterRoutes from "./routes/voterRoutes.js";
import constituencyRoutes from "./routes/constituencyRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import groupMemberRoutes from "./routes/groupMemberRoutes.js";

const port = process.env.PORT || 5000;

connectDB(); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/constituencies", constituencyRoutes); 
app.use("/api/voters", voterRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/group-members", groupMemberRoutes);

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));
