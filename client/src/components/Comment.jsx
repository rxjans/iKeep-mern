import {React, useEffect, useState} from 'react'
import moment from 'moment';
import {FaThumbsUp} from 'react-icons/fa';
import { useSelector } from 'react-redux';
function Comment({comment, onLike}) {
    const [user, setUser] = useState({});
    const {currentUser} = useSelector(state => state.user);
    useEffect(()=>{
        const getUsers = async()=>{
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUsers();
    },[comment])
    
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img className='2-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600' src={user.profilePicture} alt="user"  />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
            <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : "anonymous user"}</span>
            <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        <p className='text-gray-800 dark:text-gray-200 pb-2'>{comment.content}</p>
        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-600 max-w-fit gap-2'>
            <button type="button" onClick={()=>onLike(comment._id)} className={`text-gray-500 hover:text-blue-500 ${currentUser && !comment.likes.includes(currentUser._id) && '!text-gray-500'} ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
              <FaThumbsUp className='text-sm' />
            </button>
            <p className='ml-1 text-gray-400'>
              {
                comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? 'like' : 'likes')
              }
            </p>
        </div>
      </div>
    </div>
  )
}

export default Comment
