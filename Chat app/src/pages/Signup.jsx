import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import FormData from "form-data";
import { SERVER_API_URL } from '../utils/serverUrls';

const Signup = () => {
  const [gError, setGError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [success, setSuccess] = useState(false);

  const successMessage = "Registeration is Successful.   "

  const LoggedIn = useSelector((state)=>state.LoggedIn);
  const navigate = useNavigate();
  useEffect(()=>{
    if (LoggedIn) {
      navigate("/")
    }
  },[LoggedIn]);

  async function doSubmit(e) {
    e.preventDefault();
    //clear error message
    setGError("");
    //check if all data fields are populated
    if (!name || !email || !password || !confirmPassword) {
      setGError("Please provide all required fields");
      return;
    }
    //check if password = confirmPassword
    if (password != confirmPassword) {
      setGError("Passwords Don't match!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", profilePic);

    //make the register request
    const url = SERVER_API_URL + "/users/register";
    const res = await fetch(url, {
      method : "POST",
      body : formData
    })
    const resJson = await res.json();
    if (resJson.status != 'success') {
      setGError(resJson.message);
    }else{
      setSuccess(true);
    }

  }
  return (
    <div className='w-[100%] h-[100vh] bg-green-400 flex items-center justify-center'>
      <div className='two-container flex flex-wrap w-[60%] pe-5 shadow-2xl shadow-gray-900 items-center justify-center'>
        <div className='welcome flex flex-col w-[40%] p-14 gap-3 items-center justify-center'>
          <img src='profile.png' alt='Profile Picture' className='w-44' />
          <h1 className='text-xl font-bold text-blue-600'>Welcome To Speaker</h1>
          <p className='w-[100%] text-lg text-gray-700 font-bold'>
            Speaker is a chat app which is free and always will be.
          </p>
        </div>
        <div className='form w-[60%] flex flex-wrap items-center justify-end'>
          <form encType='multipart/form-data' className='relative flex flex-wrap items-baseline w-[100%] gap-0 bg-teal-600 p-6 border border-8 border-white'>
          {success && <p className='bg-green-600 text-white w-[100%] text-center p-1 rounded-md'>{successMessage}<Link to='/login'>login</Link></p>}
          {gError && <p className='w-[100%] p-2 my-3 text-center bg-red-400 font-semibold text-white rounded-md'>{gError}</p>}
            <div className='flex flex-col p-2 items-baseline gap-0 w-[50%]'>
              Name:
              <input type='text' placeholder='Enter Your Name' value={name} onChange={(e)=>setName(e.target.value)} className='w-[100%] text-sm p-2 rounded-sm outline-none focus:shadow-md focus:bg-slate-200'/>
            </div>
            <div className='flex flex-col p-2 items-baseline gap-0 w-[50%]'>
              Email:
              <input type='email' placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)} className='w-[100%] text-sm p-2 rounded-sm outline-none focus:shadow-md focus:bg-slate-200' />
            </div>
            <div className='flex flex-col p-2 items-baseline gap-0 w-[50%]'>
              Password:
              <input type='password' placeholder='Enter Your Password' value={password} onChange={(e)=>setPassword(e.target.value)} className='w-[100%] text-sm p-2 rounded-sm outline-none focus:shadow-md focus:bg-slate-200' />
            </div>
            <div className='flex flex-col p-2 items-baseline gap-0 w-[50%]'>
              Confirm Password:
              <input type='text' placeholder='Enter Password Again' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className='w-[100%] text-sm p-2 rounded-sm outline-none focus:shadow-md focus:bg-slate-200' />
            </div>
            <div className='flex flex-col p-2 items-baseline gap-0 w-[50%]'>
              Upload Profile Picture:
              <input type='file' value={profilePic} onChange={(e)=>setProfilePic(e.target.files[0]) }/>
            </div>
            <button type='submit' onClick={(e)=>doSubmit(e)} className='absolute bottom-1 left-[50%] translate-x-[-50%] bg-green-400 px-7 rounded-lg hover:bg-green-500 hover:text-white'>Signup</button>
            <p>Already Registered? <Link to={"/login"} className='text-green-400 hover:text-green-500'>Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup