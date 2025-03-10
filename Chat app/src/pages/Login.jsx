import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Links, useNavigate } from 'react-router-dom';
import FormData from "form-data";
import { SERVER_API_URL } from '../utils/serverUrls';
import { login } from '../store/reducers/LoggedInReducer';
import { setToken } from '../store/reducers/TokenSlice';
import { setCurrentUser } from '../store/reducers/CurrentUserSlice';

const Login = () => {
  const [gError, setGError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const LoggedIn = useSelector((state)=>state.LoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    console.log(LoggedIn);
    
    if (LoggedIn) {
      console.log('inside login');
      
      navigate("/")
    }
  },[LoggedIn]);

  async function doSubmit(e) {
    e.preventDefault();
    //clear error message
    setGError("");
    //check if all data fields are populated
    if (!email || !password ) {
      setGError("Please provide all required fields");
      return;
    }
    
    //make the register request
    const url = SERVER_API_URL + "/users/login";
    const res = await fetch(url, {
      method : "POST",
      headers : {
        'Content-Type' : "application/json"
      },
      body : JSON.stringify({
        email : email,
        password : password
      })
    })
    const resJson = await res.json();
    if (resJson.status != 'success') {
      setGError(resJson.message);
    }else{
      //set loggedIn, settoken, setCurrentUser
      const user = resJson.data.user;
      const token = resJson.data.token;
      dispatch(login());
      dispatch(setToken(token));
      dispatch(setCurrentUser(user));

      //save logInfo into local stoarage
      localStorage.setItem('logInfo', JSON.stringify({
        CurrentUser : user,
        Token : token
      }));
      //navigate "/"
      navigate("/");
    }

  }
  return (
    <div className='w-[100%] h-[100vh] bg-green-400 flex items-center justify-center'>
      <div className='two-container flex flex-wrap w-[50%] pe-5 shadow-2xl shadow-gray-900 items-center justify-center py-10'>
        
        <div className='form w-[80%] flex flex-wrap items-center justify-end'>
          <form encType='application/json' className='relative flex flex-col  flex-wrap items-baseline w-[100%] gap-2 bg-teal-600 p-6 border border-8 border-white'>
          {gError && <p className='w-[100%] p-2 my-3 text-center bg-red-400 font-semibold text-white rounded-md'>{gError}</p>}
            
            <div className='flex flex-col p-2 items-baseline gap-0 w-[50%]'>
              Email:
              <input type='email' placeholder='Enter Your Email' value={email} onChange={(e)=>setEmail(e.target.value)} className='w-[100%] text-sm p-2 rounded-sm outline-none focus:shadow-md focus:bg-slate-200' />
            </div>
            <div className='flex flex-col p-2 items-baseline gap-0 w-[50%]'>
              Password:
              <input type='password' placeholder='Enter Your Password' value={password} onChange={(e)=>setPassword(e.target.value)} className='w-[100%] text-sm p-2 rounded-sm outline-none focus:shadow-md focus:bg-slate-200' />
            </div>
           
            <button type='submit' onClick={(e)=>doSubmit(e)} className='self-center mt-2 bg-green-400 px-7 rounded-lg hover:bg-green-500 hover:text-white w-[40%]'>Login</button>
            <p>Don't have an account? <Link to={"/signup"} className='text-green-400 hover:text-green-500'>Signup</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login