import {React, useRef, useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import {motion} from 'framer-motion';
import { fadeIn } from '../variants';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateFailure, updateSuccess } from '../redux/user/userSlice';


function DashProfile() {
    const {currentUser} = useSelector(state=> state.user);
    const [buttonBool, setButttonBool] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [updateProfileSuccess, setUpdateProfileSuccess] = useState(null);
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
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
            <span className='cursor-pointer hover:font-semibold'>Delete Account</span>
            <span className='cursor-pointer hover:font-semibold'>Sign Out</span>
        </div>
        <article>
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
        </article>
    </div>
  )
}

export default DashProfile
