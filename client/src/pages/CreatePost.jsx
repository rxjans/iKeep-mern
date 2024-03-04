import {React, useRef} from 'react';
import Header from '../components/header';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import icon from '../assets/icon.jpg';
import newicon from '../assets/newicon.webp';


function CreatePost() {
    const filePickerRef = useRef();

  return (
    <>
        <Header />
            <div className=' flex justify-center items-center h-screen overflow-auto bg-[url("https://transparenttextures.com/patterns/crissxcross.png")]'>
                <div className='p-3 formmm w-full md:dark:bg-[rgb(35,39,42)]/70  md:bg-white/70 px-4 max-w-3xl mx-auto md:rounded-2xl mt-12 h-[660px]'>
                    <div className='flex flex-row justify-center items-center'>
                        <img className='w-[40px] h-[36px] mr-2' src={newicon} />
                        <h1 className='text-center text-[32px] my-4 font-bold dark:text-white'>CREATE A POST</h1>
                    </div>
                    <form className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                            <div className='shadow-2xl w-full'>
                                 <input autoComplete='off' className="inputform block w-full h-[35px] mt-2 border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900  focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 p-2.5 text-sm rounded-lg" type="text" id='title' required placeholder="Title" />
                            </div>
                            <div className='shadow-2xl'>
                                <select className='block h-[35px] w-full max-h-60 mt-2 border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900  focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 text-sm pr-10 rounded-lg'>
                                        <option value="" disabled selected hidden>Select a category...</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Gaming">Gaming</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Education">Education</option>
                                        <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>
                        <div className='w-full'>

                            {/* <!-- scroll area --> */}
                            <section class="h-full overflow-auto p-2 w-full flex flex-col"  >
                                <header class="border-dashed rounded-3xl border-2 border-gray-400 py-2 flex flex-col justify-center items-center" >
                                <p class="mb-3 font-semibold text-gray-900 dark:text-gray-200 flex flex-wrap justify-center cursor-pointer" onClick={()=> filePickerRef.current.click()}>
                                    <span>Click here to select</span>&nbsp;<span>a File and then click upload</span>
                                </p>
                                <input id="hidden-input" ref={filePickerRef} type="file" accept='image/*' multiple className="hidden" />
                                <button onClick={()=> console.log('clicked')} type='button' class={`inline-flex items-center justify-center h-6 px-10 py-0 text-sm font-semibold text-center bg-sky-600 text-white dark:bg-transparent dark:text-gray-200 no-underline align-middle transition duration-200 ease-in dark:border-2 hover:border-2 dark:border-gray-600 border-gray-300 border-b border-solid rounded-full cursor-pointer select-none hover:bg-transparent dark:hover:text-white dark:hover:border-white hover:border-sky-600 hover:text-sky-600  focus:shadow-xs focus:no-underline`}>
                                    UPLOAD IMAGE
                                </button>
                                </header>
                            </section>
                                {/* <div>
                                
                            </div> */}
                        </div>
                        <ReactQuill theme='snow' placeholder='Write something...' required className='h-64 mb-12'/>
                        <div className='flex justify-center items-center mt-6 md:mt-0'>    
                        <button onClick={()=> console.log('clicked')} type='button' class={`inline-flex items-center justify-center h-8 w-[190px] lg:w-[190px] px-10 py-0 text-sm font-semibold text-center hover:bg-sky-600  bg-sky-600 text-gray-200 no-underline align-middle transition duration-200 ease-in border-2 border-gray-200  border-solid rounded-full cursor-pointer select-none  hover:text-white hover:border-white  focus:shadow-xs focus:no-underline`}>
                                  CREATE A POST
                                  </button> 
                        </div>
                    </form>

                </div>  
            </div>
    </>
  )
}

export default CreatePost