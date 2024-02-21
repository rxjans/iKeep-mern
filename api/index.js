import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Connection Successful");
})
.catch((err) => console.log(err));

const app = express();

app.listen(3000, () => {
    console.log("Server started at port 3000")
})


app.use("/api/user", userRoutes);