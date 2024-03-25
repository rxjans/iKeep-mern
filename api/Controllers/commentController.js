import Comment from '../models/commentModel.js';
import { errorHandler } from '../utils/errorHandler.js';

export const createComment = async(req,res, next)=>{
    try {
        const {content, postId, userId, } = req.body;
        if(userId !== req.user.id){
            return next(errorHandler(403, "You are not authorized to make a comment"));
        }
        const newComment = new Comment({
            userId,
            postId,
            content
        })
        await newComment.save();
        res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }

}

export const getComments = async(req, res, next)=>{
    try {
        const comments = await Comment.find({postId: req.params.postId}).sort({createdAt: -1});
        res.status(200).json(comments);
    } catch (error) {
        next(error)
    }
}

export const likeComment = async(req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            next(errorHandler(404, "Comment not found..."))
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        }
        else{
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
}