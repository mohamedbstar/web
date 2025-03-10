import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import FormData from 'form-data';
import { SERVER_API_URL, SERVER_ASSET_URL } from '../creds';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/loggedSlice';
import { setToken } from '../store/slices/tokenSlice';
import { setDecodedToken } from '../store/slices/decodedToken';


const Login = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [gError, setGError] = useState('');

  const loggedIn = useSelector((state)=>{
    return state.loggedInSlice;
  })

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    if (loggedIn) {
      console.log('Navigating from login');
      
      navigate("/")
    }
  },[]);

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handlePass(e){
    setPass(e.target.value);
  }

  const doSubmit = async(e)=>{
    e.preventDefault();
    
    try {
      console.log(email);
      console.log(pass);
      const res = await fetch("http://localhost:5000/api/users/login", {
        method : 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify({
          email : email,
          password : pass
        })
      });
      const resJson = await res.json();
      
      if (resJson.status == 'success') {
        dispatch(login());
        dispatch(setToken(resJson.data.token));
        dispatch(setDecodedToken(resJson.data.user_id));
        console.log('user_id is====>'+resJson.data.user_id);
        
        navigate("/")
      }else{
        setGError(resJson.message);
      }
    } catch (error) {
      setGError(error)
    }
  }

  return (
    <div className='login'>
      <h2>Sign Up</h2>
      <form className='form' enctype="multipart/form-data">
        {gError && <p className="error-msg">{gError}</p>}
        
        <input type='email' name='email' id='email' placeholder='Enter Your Email' value={email} onChange={(event)=>{
          handleEmail(event);
        }}/>

        <input type='password' name='pass' id='pass' placeholder='Enter Your Password' value={pass} onChange={(event)=>{
          handlePass(event);
        }}/>

        <button className='btn-nav' onClick={(event)=>{
          doSubmit(event);
        }}>Login</button>
      </form>
    </div>
  );
}

export default Login;