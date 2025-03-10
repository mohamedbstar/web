import React, { useEffect, useState } from 'react'
import LoginGif from "../assest/signin.gif"
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import imageReader from '../utils/imageReader';
import FormData from "form-data";
import { SERVER_API_URL } from '../utils/serverUrl';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/reducers/LoggedInReducer';
import { setToken } from '../store/reducers/TokenSlice';
import { setCurrentUser } from '../store/reducers/CurrentUserSlice';


const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [gError, setGError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const navigate = useNavigate();

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const LoggedIn = useSelector((state) => state.LoggedIn);
    const Token = useSelector((state) => state.Token);
    const CurrentUser = useSelector((state) => state.CurrentUser);
    const dispatch = useDispatch();
    useEffect(() => {
        if (LoggedIn) {
            console.log('Already Logged in from SignUp');
            navigate("/");
            return;
        }
        //2 => by local storage

        let logInfo = JSON.parse(localStorage.getItem('logInfo'));
        if (!LoggedIn && logInfo !== null) {
            logInfo = JSON.parse(logInfo);
            //user is logged in but closed the browser
            dispatch(login());
            dispatch(setToken(logInfo.Token));
            dispatch(setCurrentUser(logInfo.CurrentUser));
            navigate("/");
            return;
        }
    }, []);

    //const [profilePic, setProfilePic] = useState("");
    function handleOnChange(e) {
        const { name, value } = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
        console.log("data: ", data);
    }
    async function doSubmit(e) {
        e.preventDefault();
        //make sure are required inputs are filled
        if (!data.name || !data.email || !data.password || !data.confirmPassword) {
            setGError("You Must Fill all fields");
            setSuccessMessage("");
            return;
        }
        //make sure passwords do match
        if (data.password != data.confirmPassword) {
            setGError("Password and confirm password must match");
            setSuccessMessage("");
            return;
        }
        //make a form data
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('profilePic', profilePic);


        console.log('Submitting data ====> ' + JSON.stringify(data));
        console.log('Submitting file ====> ' + JSON.stringify(profilePic));


        //make a request to server to register
        const registerUrl = SERVER_API_URL + "/users/register";
        const res = await fetch(registerUrl, {
            method: "POST",
            body: formData
        })
        const resJson = await res.json();
        if (resJson.status != 'success') {
            setGError(resJson.message);
            setSuccessMessage("");
        } else {
            setGError("");
            setSuccessMessage("Registered User Successfully...");
            navigate("/login")
        }
    }
    return (
        <section id="login">
            <div className="container bg-white mx-auto mt-5 max-w-[500px] p-6">
                <div className='flex flex-col items-center p-5'>
                    <img src={data.profilePic || LoginGif} className='w-52 rounded-full h-52' />
                    <form className='grid gap-3 w-auto' encType='multipart/form-data'>
                        {gError && <p className='bg-red-600 text-white w-full mt-2 p-0 text-center'>{gError}</p>}
                        {successMessage && <p className='bg-lime-500 text-white  w-full mt-2 p-0 text-center'>{successMessage} Hi</p>}
                        <div className='grid gap-1 w-80'>
                            <label htmlFor="email">Name</label>
                            <div className='focus-within:shadow-md border rounded-s-md rounded-e-md w-80'>
                                <input type='email' name='name' placeholder='Email' onChange={(e) => handleOnChange(e)} className='w-full bg-slate-100 outline-none p-1 rounded-s-md rounded-e-md' />
                            </div>
                        </div>
                        <div className='grid gap-1 w-80'>
                            <label htmlFor="email">Email</label>
                            <div className='focus-within:shadow-md border rounded-s-md rounded-e-md w-80'>
                                <input type='email' name='email' placeholder='Email' onChange={(e) => handleOnChange(e)} className='w-full bg-slate-100 outline-none p-1 rounded-s-md rounded-e-md' />
                            </div>
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor="password">Password</label>
                            <div className='flex items-center relative focus-within:shadow-md border rounded-s-md rounded-e-md'>
                                <input type={showPassword ? 'text' : 'password'} name='password' onChange={(e) => handleOnChange(e)} placeholder="Password" className='w-full bg-slate-100 outline-none p-1 rounded-s-md rounded-e-md' />
                                <span onClick={() => {
                                    setShowPassword((prevState) => !prevState)
                                }}>
                                    {
                                        showPassword ? (
                                            <FaEyeSlash className='cursor-pointer bg-slate-100 h-full absolute -top-0.5 right-1.5' />
                                        ) : (
                                            <FaEye className='cursor-pointer bg-slate-100 h-full absolute -top-0.5 right-1.5' />
                                        )
                                    }
                                </span>
                            </div>
                        </div>
                        <div className='grid gap-1'>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className='flex items-center relative focus-within:shadow-md border rounded-s-md rounded-e-md'>
                                <input type={showPassword ? 'text' : 'password'} name='confirmPassword' onChange={(e) => handleOnChange(e)} placeholder="Password" className='w-full bg-slate-100 outline-none p-1 rounded-s-md rounded-e-md' />
                                <span onClick={() => {
                                    setShowPassword((prevState) => !prevState)
                                }}>
                                    {
                                        showPassword ? (
                                            <FaEyeSlash className='cursor-pointer bg-slate-100 h-full absolute -top-0.5 right-1.5' />
                                        ) : (
                                            <FaEye className='cursor-pointer bg-slate-100 h-full absolute -top-0.5 right-1.5' />
                                        )
                                    }
                                </span>
                            </div>
                        </div>
                        <div className='grid gap-1 w-80'>
                            <label htmlFor="profilePic">Choose a proflie picture</label>
                            <input type='file' name='profilePic' onChange={async (e) => {
                                /*setProfilePic(e.target.files[0])
                                console.log(e.target.files[0]);*/

                                /*const image = e.target.files[0];
                                const imageData = await imageReader(image);

                                setData((prev) => {
                                    return {
                                        ...prev,
                                        profilePic: imageData
                                    }
                                })*/
                                setProfilePic(e.target.files[0]);

                            }} />
                        </div>
                        <div className='cursor-pointer bg-red-600 px-2 py-1 text-white rounded-full w-40 text-center hover:bg-red-700 hover:scale-110'>
                            <Link to={""}><button type='submit' onClick={(e) => {
                                doSubmit(e);
                            }} className='cursor-pointer'>Sign Up</button></Link>
                        </div>
                        <p>Already have an account? <Link to={'/login'} className='hover:text-red-600 hover:underline'>Login</Link></p>

                    </form>
                </div>
            </div>
        </section>
    )
}

export default Signup