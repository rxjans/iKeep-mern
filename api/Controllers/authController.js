import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken';

export const signup = async(req, res, next) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password || username === '' || email === '' || password === ''){
        next(errorHandler(400, "All fields are required"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })
    
    try{
        await newUser.save();
        res.json("Signup Successful");
    }
    catch(error){
        next(error);
    }
}

export const signin = async(req,res,next) => {
    const {email, password} = req.body;

    if(!email || !password || email === "" || password === ""){
        return next(errorHandler(400, "All fields are required!"));
    }
    try{
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(400, "Invalid Email or Password"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400, "Invalid Email or Password"));
        }

        const token = jwt.sign(
            {id: validUser._id}, 
            process.env.JWT_SECRET
            );  
        
        const {password:pass, ...rest} = validUser._doc;

        res.status(200).cookie('access-token', token, {httpOnly: true}).json(rest);
    }
    catch(error){
        next(error);
    }
    
}

export const google = async(req, res, next) => {
    const {name, email, googlePhotoUrl:photoUrl} = req.body;
    try{
        const user = await User.findOne({email});

        if(user){
            const token = jwt.sign(
                {id: user._id}, 
                process.env.JWT_SECRET
                );
            const{password, ...rest} = user._doc;
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newName = name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4);
            const newUser = new User({
                username: newName,
                email,
                password: hashedPassword,
                profilePicture:photoUrl
            });
            await newUser.save();
            const token = jwt.sign(
                {id: newUser._id},
                process.env.JWT_SECRET
            );
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest);
        }

    }
    catch(error){
        next(error);
    }

} 