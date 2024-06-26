import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import postRoutes from './routes/postRoute.js';
import commentRoutes from './routes/commentRoute.js';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Connection Successful");
})
.catch((err) => console.log(err));

const __dirname = path.resolve();

app.listen(3000, () => {
    console.log("Server started at port 3000")
})


app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next)=> {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})