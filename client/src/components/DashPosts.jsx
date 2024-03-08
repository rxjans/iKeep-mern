import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import {Table} from 'flowbite-react';

function DashPosts() {
  const {currentUser} = useSelector((state)=>state.user);
  const [userPosts, setUserPosts]= useState([]);
  const navigate = useNavigate();
  useEffect(()=> {
    const fetchPosts = async()=>{
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if(res.ok){
          setUserPosts(data.posts);
        }

      } catch (error) {
        console.log(error);
      }
    };
    if(currentUser.isAdmin){
      fetchPosts();
    }
  },[currentUser._id])

  return (
    <div className='lg:pt-20 p-3 lg:px-4 '>
      {
        currentUser.isAdmin && userPosts.length > 0 ? 
        (<>
            <div class="relative overflow-x-auto shadow-md rounded-lg no-scrollbar">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-100 uppercase bg-sky-600 dark:bg-[#23272a] dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Date Updated
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Post Image
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Post Title
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Category
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Delete
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Edit
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {userPosts.map((currElem, idx)=>{
                      return(
                      
                        <tr class="odd:bg-gray-100 odd:dark:bg-[#23272a] even:bg-gray-50 even:dark:bg-transparent border-b dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {new Date(currElem.updatedAt).toLocaleDateString()}
                            </th>
                            <td class="px-6 py-4">
                                <Link to={`/post/${currElem.slug}`}>
                                  <img src={currElem.image} alt={currElem.title} className='w-20 h-10 object-cover bg-gray-500' />
                                </Link>
                            </td>
                            <td class="px-6 py-4">
                              <Link className='font-medium dark:text-gray-400 text-black' to={`/post/${currElem.slug}`}>
                                {currElem.title.length < 48 ? currElem.title : currElem.title.slice(0,28) + "..."}
                              </Link>
                            </td>
                            <td class="px-6 py-4">
                                {currElem.category}
                            </td>
                            <td class="px-6 py-4">
                                <a href="#" class="font-medium text-red-500 dark:text-red-500 hover:underline">Delete</a>
                            </td>
                            <td class="px-6 py-4">
                              <Link to={`/update-post/${currElem._id}`}>
                                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                              </Link>
                            </td>
                        </tr>
                    )
                    })   
                    }
                  </tbody>
                </table>
            </div>
        </>) 
        : 
        (<p>You have no posts yet</p>)
      }
    </div>
            


  )
}

export default DashPosts
