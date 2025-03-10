import React, { useEffect, useState } from 'react'
import LoginGif from "../assest/signin.gif"
import {Link, useNavigate} from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormData from 'form-data'
import { SERVER_API_URL } from '../utils/serverUrl.js';
import {} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import { setToken } from '../store/reducers/TokenSlice.js';
import { login } from '../store/reducers/LoggedInReducer.js';
import { setCurrentUser } from '../store/reducers/CurrentUserSlice.js';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [gError, setGError] = useState("");
    const navigate = useNavigate();
    const LoggedIn = useSelector((state)=>state.LoggedIn);
    const Token = useSelector((state)=>state.Token);
    const CurrentUser = useSelector((state)=>state.CurrentUser);
    const dispatch = useDispatch();
    const [data, setData] = useState({
        email : "",
        password : ""
    })
    useEffect(()=>{
        //check if user is loggedin or not
        //1 => by redux
        if (LoggedIn) {
            console.log('Login.jsx: User is already logged in');
            navigate("/");
            return;
        }
        console.log('after first login check');
        
        //2 => by local storage
        let logInfo = JSON.parse(localStorage.getItem('logInfo'));
        if (logInfo) {
            logInfo = JSON.parse(logInfo);
            //user is logged in but closed the browser
            dispatch(login());
            dispatch(setToken(logInfo.token));
            dispatch(setCurrentUser(logInfo.CurrentUser));
            console.log('Login.jsx: User is already logged in from localStorage');
            navigate("/");
        } 
    },[]);
    function handleOnChange(e) {
        const {name, value} = e.target;
        setData((prev) =>{
            return{
                ...prev,
                [name] : value
            }
        })
        console.log("data: ", data);
    
    }

    async function doSubmit(e) {
        e.preventDefault();
        //check all required inputs are given
        if(!data.email || !data.password){
            setGError("Email and Password Must be provided");
            return;
        }
        //make a form data

        //send request to login
        const loginUrl = SERVER_API_URL + "/users/login";
        const res = await fetch(loginUrl, {
            method : "POST",
            headers : {
                'Content-Type' : "application/json"
            },
            body : JSON.stringify({
                email : data.email,
                password : data.password
            })
        })

        const resJson = await res.json();
        
        if (resJson.status != 'success') {
            setGError(resJson.message);
            return;
        }
        //set token,loggedIn, currentUser in redux
        dispatch(setToken(resJson.data.token));
        dispatch(login());
        dispatch(setCurrentUser(resJson.data.user));

        //set token,currentUser in local storage
        const logInfo = {
            token : resJson.data.token, 
            CurrentUser : resJson.data.user
        }
        window.localStorage.setItem('logInfo', JSON.stringify(logInfo));
        navigate("/");
    }
        
    
    return (
        <section id="login">
            <div className="container bg-white mx-auto mt-5 max-w-[500px] p-6">
                <div className='flex flex-col items-center p-5'>
                    <img src={LoginGif} />
                    <form className='grid gap-3 w-auto' encType='application/json'>
                    {gError && <p className='bg-red-600 text-white w-full mt-2 p-0 text-center'>{gError}</p>}
                        <div className='grid gap-1 w-80'>
                            <label htmlFor="email">Email</label>
                            <div className='focus-within:shadow-md border rounded-s-md rounded-e-md w-80'>
                                <input type='email' name='email' placeholder='Email' onChange={(e)=>handleOnChange(e)}  className='w-full bg-slate-100 outline-none p-1 rounded-s-md rounded-e-md' />
                            </div>
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor="password">Password</label>
                            <div className='flex items-center relative focus-within:shadow-md border rounded-s-md rounded-e-md'>
                                <input type={showPassword ? 'text' : 'password'} name='password' onChange={(e)=>handleOnChange(e)} placeholder="Password" className='w-full bg-slate-100 outline-none p-1 rounded-s-md rounded-e-md' />
                                <span onClick={()=>{
                                    setShowPassword((prevState)=>!prevState)
                                }}>
                                    {
                                        showPassword ? (
                                            <FaEyeSlash className='cursor-pointer bg-slate-100 h-full absolute -top-0.5 right-1.5'/>
                                        ) : (
                                            <FaEye className='cursor-pointer bg-slate-100 h-full absolute -top-0.5 right-1.5'/>
                                        )
                                    }
                                </span>
                            </div>
                            <Link to={"/forgot-password"} className='block hover:text-red-600 hover:underline'>
                                Forgot Password
                            </Link>
                        </div>
                        <div className='cursor-pointer bg-red-600 px-2 py-1 text-white rounded-full w-40 text-center hover:bg-red-700 hover:scale-110'>
                            <button type='submit' onClick={(e)=>{
                                doSubmit(e);
                            }} className='cursor-pointer'>Login</button>
                        </div>
                        <p>Don't have an account? <Link to={'/sign-up'} className='hover:text-red-600 hover:underline'> Sign Up</Link></p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login