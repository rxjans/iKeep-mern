import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utils/errorHandler.js";

export const create = async(req, res, next)=>{
    if(!req.user.isAdmin || !User.findById(req.user.id)){
        return next(errorHandler(403, "User is not authorized"));
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(403, "All fields are required"));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    });
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        next(error);
    }
}

export const getposts = async (req, res, next)=>{
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = (req.query.sortDirection === 'asc' ? 1 : -1); 
        const posts = await Post.find({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchParams && {
                $or: [
                    { title: {$regex: req.query.searchParams, $options: 'i'} },
                    {content: {$regex: req.query.searchParams, $options: 'i'}}
                ]
                }
                )
        }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const userPosts = await Post.find({userId: req.query.userId});

        const userTotalPosts = userPosts.length;

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: {$gte: oneMonthAgo}
        });

        res.status(200).json({
            posts, totalPosts, lastMonthPosts, userTotalPosts
        });
        

    } catch (error) {
        next(error);
    }
}

export const deletepost = async(req,res,next)=> {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, "User is not authorized to perform this action"));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json("Post Successfully Deleted...");
    } catch (error) {
        next(error);
    }
}

export const update = async(req, res, next)=>{
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, "User is not authorized"));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    try{   
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set : {
                title: req.body.title,
                content: req.body.content,
                image: req.body.image,
                category: req.body.category,
                slug
            }
        }, {new: true});
        res.status(200).json(updatedPost);
        }
    catch(error){
        next(error);
    }        
    
}