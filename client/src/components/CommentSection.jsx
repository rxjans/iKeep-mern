import {React, useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';

function CommentSection({postId}) {
    const {currentUser} = useSelector((state)=>state.user);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentError, setCommentError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(comment.length > 200){
            return;
        }
        try {
            const res = await fetch("/api/comment/create",{
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({content: comment, postId, userId: currentUser._id})
            });
            const data = await res.json();
            if(res.ok){
                setComment('');
                setCommentError(null);
                setComments([data, ...comments])
            }
            if(!res.ok){
                setCommentError(data.message);
            }
        } catch (error) {
            setCommentError(error);
        }
        
    }

    useEffect(()=>{
        const fetchComments = async()=>{
            try {
                const res = await fetch(`/api/comment/getcomments/${postId}`);
                const data = await res.json();
                if(res.ok){
                    setComments(data);
                    setCommentError(null);
                }
                if(!res.ok){
                    setCommentError(data.message);
                }
    
            } catch (error) {
                setCommentError(error);
            }   
        };   
        fetchComments();
    },[postId]);

    const handleLike = async(commentId)=> {
        try {
            if(!currentUser){
                navigate('/sign-in');
                return
            }
            const res = await fetch(`/api/comment/likecomment/${commentId}`,{
                method: 'PUT'
            });
            if(res.ok){
                const data = await res.json();
                setComments(comments.map((comment) => 
                    comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length
                    }
                    :
                    comment
                ))
            }
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {
            currentUser ? 
            (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img className='w-5 h-5 rounded-full' src={currentUser.profilePicture} alt="" />
                    <Link to='/dashboard?tab=profile' className='text-xs text-cyan-600 hover:underline'>
                        @ {currentUser.username}
                    </Link>
                </div>

            )
            :
            (
                <div className='text-sm my-5'>
                    You must be signed in to comment.
                    <Link className='ml-1 text-cyan-600 hover:underline' to='/sign-in'>
                        Sign In
                    </Link>
                </div>
            )
        }
        {
            currentUser &&
            <form onSubmit={handleSubmit} className='mb-8'>
                <textarea onChange={(e)=>setComment(e.target.value)} value={comment} maxlength="200" rows='4' className='no-scrollbar bg-transparent dark:focus:ring-slate-600 focus:ring-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-2xl outline-none w-full placeholder:dark:text-white/70 placeholder:text-gray-600 rounded-lg transition-all resize-none' type='text' placeholder='Write a comment..' name='comment'></textarea>
                <div className='flex justify-between items-center mt-5 '>
                    <p className='text-xs italic'>{200 - comment.length} Characters remaining</p>
                    <button type='submit' class="relative inline-flex items-center justify-center p-4 px-5 py-1.5 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500">
                        <span class="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                        <span class="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                        <span class="relative text-white">Submit</span>
                    </button>
                </div>
            </form>
        }
        {
            comments.length === 0 ? 
            (
                <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
                <div className='flex-shrink-0 mr-3'>
                    <img className='2-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600' src={currentUser.profilePicture} alt="user"  />
                </div>
                <div className='flex-1'>
                    <div className='flex items-center mb-1'>
                        <span className='font-bold mr-1 text-xs truncate'>{currentUser ? `@${currentUser.username}` : "Sign In"}</span>
                    </div>
                    <p className='text-gray-500 dark:text-gray-500 pb-2'>Be the first one to comment...</p>
                </div>
                </div>
                )
            :
            (
                <>
                <div className='text-sm my-5 flex items-center gap-2'>
                    <p>Comments</p>
                    <div className='border border-gray-400 dark:border-gray-600 py-1 px-2 rounded-md'>
                        <p>{comments.length}</p>
                    </div>
                </div>
                {
                    comments.map((currElem)=>{
                        return(
                            <Comment key={currElem._id} comment={currElem} onLike={handleLike} />
                        )
                    })
                }
                </>
            )
        }
    </div>
  )
}

export default CommentSection
