import React from 'react';
import {Link} from 'react-router-dom';
import Header from '../components/header';
import logo1 from '../assets/logo1.png';
import {motion} from 'framer-motion';
import {fadeIn} from '../variants.js';
import { Button, Navbar, TextInput } from 'flowbite-react'

function SignUp() {
  return (
    <>
  
      <motion.div
        initial={{width:0}}
        animate={{width:"100%"}}
        exit={{x:"100%"}}
        className="h-screen bg-[url('./assets/london.jpg')] bg-cover">
        <div className='flex h-screen'>
        {/* left division */}
            <motion.div
              // variants={fadeIn('right', 0.1)}
              // initial='hidden'
              // whileInView={'show'}
              // viewport={{once: false, amount: 0.1}} 
              className='flex order-1 bg-white bg-opacity-60 justify-center items-center w-[0px] lg:flex-1'>
                <div>
                    <img src={logo1} />
                </div>
            </motion.div>
        {/* right division */}
            <motion.div
              // variants={fadeIn('left', 0.1)}
              // initial='hidden'
              // whileInView={'show'}
              // viewport={{once: false, amount: 0.1}} 
              className='flex-1 bg-black bg-opacity-90 flex-col ease-in duration-75'>
                <nav className='text-white text-[13px] lg:text-[20px] opacity-80 flex justify-evenly mt-8'>
                    <a href='/'>Home</a>
                    <a href='/dashboard'>SignIn</a>
                    <a href='/sign-up'>SignUp</a>
                    <a href='/dashboard'>Contact</a>
                </nav>
                <div className='flex justify-center items-center mt-[29%] pr-20'>
                  <form className=' w-[320px] h-[320px] '>
                    <div className='flex flex-col p-6 gap-y-6'>
                        <article>
                          <label className='text-white'>Username</label>
                          <input className="block w-[350px] h-[35px] border caret-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900  focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm pr-10 rounded-lg" type="text" placeholder="Username..." />
                        </article>
                        <article>
                          <label className='text-white '>Email</label>
                          <input className="block w-[350px] h-[35px] border caret-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900  focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm pr-10 rounded-lg" type="text" placeholder="eg: name@gmail.com" />
                        </article>
                        <article>
                          <label className='text-white'>Password</label>
                          <input className="block w-[350px] h-[35px] border caret-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900  focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm pr-10 rounded-lg" type="text" placeholder="Password..." />
                        </article> 
                        <button type='submit' class="w-[350px] relative inline-flex items-center justify-center py-[8px] overflow-hidden font-medium transition duration-300 ease-out border-2 border-white rounded-full shadow-md group">
                          <span class="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-white/40 group-hover:translate-x-0 ease">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          </span>
                          <span class="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">Sign Up</span>
                          <span class="relative invisible">Button Text</span>
                        </button> 
                        <Link className='text-white leading-[0]' to="/sign-in">
                          Already have an account?
                        </Link>                  
                    </div>
                  </form>
                </div>
            </motion.div>
        </div>
    </motion.div>
    </>
  )
}

export default SignUp
