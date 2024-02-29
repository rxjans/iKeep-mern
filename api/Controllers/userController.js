import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs';

export default (req, res)=> {
    res.json({message: 'Api is Working!'})
}

export const updateUser = async(req, res, next)=> {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, "User not authorized to perform this action"))
    }
    if(req.body.password){
        if(req.body.password.length < 7){
            return next(errorHandler(400, "Password must be atleast 7 characters"))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if(req.body.username){
        if(req.body.username.length > 20 || req.body.username.length < 5 ){
            return next(errorHandler(400, "Username must be between 5 and 20 characters "));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, "Username cannot contain spaces"));
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, "Username must be in LowerCase"));
        }
        if(!req.body.username.match(/^[a-zA-z0-9]+$/)){
            return next(errorHandler(400, "Username can only contain numbers and letters"))
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set : {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password
            }
        }, {new: true});
        const{password, ...rest} = updatedUser._doc;
        res.json(rest);
    } catch (error) {
        next(error);
    }
}