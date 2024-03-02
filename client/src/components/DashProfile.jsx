import {React, useRef, useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import {motion} from 'framer-motion';
import { fadeIn } from '../variants';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateFailure, updateSuccess, deleteStart, deleteFailure, deleteSuccess, signoutSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

function DashProfile() {
    const {currentUser, error} = useSelector(state=> state.user);
    const [buttonBool, setButttonBool] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [updateProfileSuccess, setUpdateProfileSuccess] = useState(null);
    const [modals, setModals] = useState(false);
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if(file){
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      } 
    };  
    
    useEffect(()=> {
      if(imageFile){
        uploadImage();
      }
    }, [imageFile]);

    const uploadImage = async() => {
      setImageUploadError(null);
      setButttonBool(true);
      console.log('file is uploading...');
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadProgress(progress.toFixed(0));
            // console.log(`upload is ${progress} done...`);
        },
        (error) => {
          setImageUploadError("Image couldn't be uploaded (note: File must be less than 2mb)");
          setImageUploadProgress(null);
          setButttonBool(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageFileUrl(downloadUrl);
            setImageUploadProgress(null);
            setButttonBool(false);
            setFormData({...formData, profilePicture: downloadUrl});
          });
        }
      );
    }

    const handleChange = (e) => {
      setFormData({...formData, [e.target.id]: e.target.value});
      setUpdateError(null);
      setUpdateProfileSuccess(null);
    }
    
    const handleSubmit = async(e)=> {
      e.preventDefault();
      setUpdateError(null);
      setUpdateProfileSuccess(null);
      
      if(Object.keys(formData).length === 0){
        setUpdateError("No Changes Made...");
        return;
      }
      try {
        dispatch(updateStart());
        
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if(!res.ok){
          dispatch(updateFailure(data.message));
          setUpdateError(data.message);
        }
        else{
          dispatch(updateSuccess(data));
          setUpdateProfileSuccess("Profile Successfully Updated...");
        }
        
      } catch (error) {
        dispatch(updateFailure(error.message));
        setUpdateError("Error in Updating Profile...");
      }
    }

    const handleDelete = async()=>{
      setModals(false);
      try {
        dispatch(deleteStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`,{
          method: 'DELETE'
        });
        const data = await res.json();
        if(res.ok){
          dispatch(deleteSuccess(data));
          navigate('/');
        }
        if(!res.ok){
          dispatch(deleteFailure(data.message));
        }
      } catch (error) {
        dispatch(deleteFailure(error.message));
      }
    }

    const handleSignout = async()=> {
      try {
        const res = await fetch("/api/user/signout", {
          method: 'POST'
        });
        const data = await res.json();
        if(!res.ok){
          console.log(data.message)
        }
        else{
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <div className='lg:pt-20 max-w-xl p-3 mx-auto w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl mr-[8px]'>
            Profile
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col'>
            <input type='file'  accept='image/*' onChange={handleImageChange} className='hidden' ref={filePickerRef}/>
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden' onClick={() => filePickerRef.current.click()}>
                {
                  imageUploadProgress && 
                  <CircularProgressbar value={imageUploadProgress || 0} text={`${imageUploadProgress}%`} 
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 50
                      },
                      path: {
                        stroke: `rgb(62, 152, 199, ${imageUploadProgress / 100})`
                      }
                    }}
                  />
                }
                <div className={`h-full w-full absolute top-0 left-0 ${ imageUploadProgress && imageUploadProgress < 100 && 'filter blur-sm' }`}>
                  <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] dark:border-zinc-600`} />
                </div>
            </div>
            {
                          imageUploadError && 
                          <motion.div variants={fadeIn('left', 0.3)}
                              initial='hidden'
                              whileInView={'show'}
                              viewport={{once: false, amount: 0.3}}   
                              className='ml-2'>
                              <div className='text-center font-semibold dark:text-red-500/80 border-b bg-red-600 text-white border-black py-1 dark:border-none dark:bg-black/40 p-2 text-[13px] mt-6 rounded-full w-[400px]'>
                              {imageUploadError}
                              </div>
                              </motion.div>
                        }  
            <div className='flex flex-col p-6 gap-y-6 items-center'>
                        <article>
                          <label className='dark:text-gray-200'>Username</label>
                          <input onChange={handleChange} autoComplete='off' className="block lg:w-[550px] w-[350px] h-[35px] mt-2 border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900  focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 p-2.5 text-sm pr-10 rounded-lg" type="text" id='username' value={formData.username} defaultValue={currentUser.username} placeholder="Username..." />
                        </article>
                        <article>
                          <label className='dark:text-gray-200 '>Email</label>
                          <input onChange={handleChange} autoComplete='off' className="block lg:w-[550px] w-[350px] h-[35px] mt-2 border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900  focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 p-2.5 text-sm pr-10 rounded-lg" type="email" id='email' value={formData.email} defaultValue={currentUser.email} placeholder="eg: name@gmail.com" />
                        </article>
                        <article>
                          <label className='dark:text-gray-200'>Password</label>
                          <input onChange={handleChange} autoComplete='off' className="block lg:w-[550px] w-[350px] h-[35px] border mt-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900  focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500 p-2.5 text-sm pr-10 rounded-lg" type="password" id='password' placeholder=" New Password..." />
                        </article> 
                        <article>
                            <button onClick={()=> console.log('clicked')} type='submit' disabled={buttonBool} class={`inline-flex items-center justify-center h-8 w-[350px] lg:w-[550px] px-10 py-0 text-sm font-semibold text-center bg-sky-600 text-white dark:bg-transparent dark:text-gray-200 no-underline align-middle transition duration-200 ease-in dark:border-2 hover:border-2 dark:border-gray-600 border-gray-300 border-b border-solid rounded-full cursor-pointer select-none hover:bg-transparent dark:hover:text-white dark:hover:border-white hover:border-sky-600 hover:text-sky-600 ${buttonBool && 'bg-opacity-20 dark:text-opacity-15 dark:border-opacity-20 dark:hover:border-white/5 dark:hover:text-white/20'} focus:shadow-xs focus:no-underline`}>
                                UPDATE
                            </button>  
                        </article>       
            </div>
        </form>
        <div className='text-red-500 dark:text-gray-200 flex justify-between underline underline-offset-6'>
            <span onClick={()=> setModals(true)} className='cursor-pointer hover:font-semibold'>Delete Account</span>
            <span onClick={handleSignout} className='cursor-pointer hover:font-semibold'>Sign Out</span>
        </div>
        <article className='flex justify-center items-center'>
            {
              updateError && 
              <motion.div variants={fadeIn('left', 0.3)}
                  initial='hidden'
                  whileInView={'show'}
                  viewport={{once: false, amount: 0.3}}   
                  className='ml-2'>
                  <div className='w-[350px] lg:w-[550px] text-center font-semibold dark:text-red-500/80 border border-red-600 bg-red-800/20 text-red-600 py-1 dark:border-none dark:bg-black/40 p-2 text-[13px] mt-6 rounded-full'>
                  {updateError}
                  </div>
                  </motion.div>
            }
            {
              updateProfileSuccess && 
              <motion.div variants={fadeIn('left', 0.3)}
                  initial='hidden'
                  whileInView={'show'}
                  viewport={{once: false, amount: 0.3}}   
                  className='ml-2'>
                  <div className='text-center font-semibold dark:text-green-500/80 border-b bg-green-300 text-green-600 border-green-600 py-1 dark:border-none dark:bg-green/40 p-2 text-[13px] mt-6 rounded-full w-[350px] lg:w-[550px]'>
                  {updateProfileSuccess}
                  </div>
                  </motion.div>
            }
            {
              error && 
              <motion.div variants={fadeIn('left', 0.3)}
                  initial='hidden'
                  whileInView={'show'}
                  viewport={{once: false, amount: 0.3}}   
                  className='ml-2'>
                  <div className='w-[350px] lg:w-[550px] text-center font-semibold dark:text-red-500/80 border border-red-600 bg-red-800/20 text-red-600 py-1 dark:border-none dark:bg-black/40 p-2 text-[13px] mt-6 rounded-full'>
                  {error}
                  </div>
                  </motion.div>
            }
            {
              modals && 
              <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                      
                      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white dark:bg-[rgb(35,39,42)] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
                              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                              </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                              <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-200" id="modal-title">Deactivate account</h3>
                              <div className="mt-2">
                                <p className="text-sm dark:text-gray-400 text-gray-500">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="dark:bg-[rgb(35,39,42)] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button onClick={handleDelete} type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 dark:bg-red-800/90 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 dark:hover:bg-red-600/50 sm:ml-3 sm:w-auto">Deactivate</button>
                          <button onClick={()=> setModals(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-400 dark:text-gray-900 hover:dark:bg-gray-500 hover:bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:mt-0 sm:w-auto">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            }
        </article>
    </div>
  )
}

export default DashProfile
