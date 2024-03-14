import Comment from '../models/commentModel.js';

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