import {React, useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import {BsPatchCheckFill} from 'react-icons/bs';
import { RxCross2 } from "react-icons/rx";

function DashUsers() {
    const [users, setUsers] = useState({});
    const [totalUsers, setTotalUsers]= useState(null);
    const {currentUser} = useSelector((state)=> state.user);
    const [showMore, setShowMore] = useState(true);
    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                const res = await fetch("/api/user/getusers");
                const data = await res.json();
                if(!res.ok){
                    console.log(data.message);
                }
                else{
                    setUsers(data.usersNoPassword);
                    setTotalUsers(data.totalUsers);
                    if(data.totalUsers <= 9){
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUsers();
    },[])

    useEffect(()=>{
        if(users.length == totalUsers){
          setShowMore(false);
        }
      },[users])

    const handleShowMore = async()=>{
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/users/getusers?startIndex=${startIndex}`);
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
            }
            else{
                setUsers([...users, ...data.usersNoPassword]);
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='lg:pt-20 p-3 lg:px-4 max-w-[1500px] mx-auto'>
      {
        currentUser.isAdmin && users.length > 0 ? 
        (<>
            <div class="relative overflow-x-auto shadow-md rounded-lg no-scrollbar">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-100 uppercase bg-sky-600 dark:bg-[#23272a] dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Date Created
                            </th>
                            <th scope="col" class="px-6 py-3">
                                User Image
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Username
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Admin
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Delete
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {users.map((currElem, idx)=>{
                      return(
                      
                        <tr class="odd:bg-gray-100 odd:dark:bg-[#23272a] even:bg-gray-50 even:dark:bg-transparent border-b dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {new Date(currElem.createdAt).toLocaleDateString()}
                            </th>
                            <td class="px-6 py-4">
                                <Link to={`/post/${currElem.slug}`}>
                                  <img src={currElem.profilePicture} alt="user" className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                                </Link>
                            </td>
                            <td class="px-6 py-4">
                              <Link className='font-medium dark:text-gray-400 text-black' to={`/post/${currElem.slug}`}>
                                {currElem.username.length < 15 ? currElem.username : currElem.username.slice(0,15) + "..."}
                              </Link>
                            </td>
                            <td class="px-6 py-4">
                                {currElem.email}
                            </td>
                            <td class="px-6 py-4 flex ml-3 mt-3">
                                {
                                    currElem.isAdmin ? 
                                    (<BsPatchCheckFill className=' text-sky-600 text-lg' />) 
                                    : 
                                    (<RxCross2 className='text-red-500 text-bold text-lg' />)    
                                }
                            </td>
                            <td class="px-6 py-4">
                                <a /*onClick={(e)=>{e.preventDefault(); setShowModals(true); setPostId(currElem._id);}}*/ href="#" class="font-medium text-red-500 dark:text-red-500 hover:underline">Delete</a>
                            </td>
                        </tr>
                    )
                    })   
                    }
                  </tbody>
                </table>
                {
                  showMore && 
                  <div className='py-2 text-center'> 
                    <button onClick={handleShowMore} type='button' class={`inline-flex items-center justify-center h-6 w-18 px-10 py-0 text-sm font-semibold text-center bg-sky-600 text-white dark:bg-transparent dark:text-gray-200 no-underline align-middle transition duration-200 ease-in dark:border-2 hover:border-2 dark:border-gray-600 border-gray-300 border-b border-solid rounded-full cursor-pointer select-none hover:bg-transparent dark:hover:text-white dark:hover:border-white hover:border-sky-600 hover:text-sky-600  focus:shadow-xs focus:no-underline`}>
                      Show more
                    </button>  
                  </div>

                }
            </div>
        </>) 
        : 
        (<p>There are no users yet</p>)
      }
    </div>
  )
}

export default DashUsers
