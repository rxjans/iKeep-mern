import {React, useEffect, useState} from 'react';
import Header from '../components/header';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
function PostPage() {
    const {postSlug} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError]= useState(false);
    const [post,setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);

    useEffect(()=>{
        const fetchPost = async()=>{
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if(!res.ok){
                    setError(data.message);
                    setLoading(false);
                    return
                }
                if(res.ok){
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(null);
                }
            } catch (error) {
                setError(error);
                setLoading(false);  
            }
        }
        fetchPost();
    },[postSlug])

    useEffect(()=>{
        const fetchRecentPosts = async()=>{
            try {
                const res = await fetch('/api/post/getposts?limit=3');
                const data = await res.json();
                if(res.ok){
                    setRecentPosts(data.posts);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchRecentPosts();
    },[])

    if(loading){
        return (
                <><Header />
                <div className='flex justify-center items-center min-h-screen'><svg aria-hidden="true" class="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span></div></>)
    }
  return (
    <>
    <Header />
    <main className='p-3 pt-20 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
        <Link className='self-center mt-5'>
        <button href="#_" class="inline-flex items-center justify-center h-4 px-3 py-2.5 text-xs font-semibold text-center text-black dark:text-gray-200 no-underline align-middle transition-all duration-100 ease-in-out bg-transparent border dark:border-gray-600 border-solid rounded-full cursor-pointer select-none hover:border-2 hover:dark:border-2 hover:dark:text-white hover:dark:border-white focus:shadow-xs focus:no-underline">
            {post && post.category}
        </button>
        </Link>
        <img src={post && post.image} alt={post && post.title}  className='lg:mt-10 mt-6 p-3 max-h-[600px] w-full object-cover rounded-2xl '/>
        <div className='mt-4 flex justify-between p-3 border-b border-slate-250 dark:border-gray-500 mx-auto w-full max-w-2xl text-xs'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span className='italic'>{post && (post.content.length/1000).toFixed(0)} mins read</span>
        </div>
        <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: post && post.content}}>

        </div>
        <CommentSection postId={post._id} />

        <div className='flex flex-col justify-center items-center mb-5'>
            <h1 className='text-2xl mt-5'>Recent Articles</h1>
            <div className='flex flex-wrap gap-5 mt-5 justify-center w-screen'>
                {
                    recentPosts && (
                        recentPosts.map((post)=>{
                           return <PostCard key={post._id} post={post} />
                        })
                    )
                }
            </div>
        </div>
    </main>
    </>
  )
}

export default PostPage