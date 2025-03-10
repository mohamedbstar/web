import React, { useEffect, useState } from 'react'
import "./css/AddProductForm.css"
import { IoMdClose } from "react-icons/io";
import { SERVER_API_URL } from '../utils/serverUrl';
import { useSelector } from 'react-redux';

const categs = [
    'airpod', 'camera', 'earphone', 'mobile', 'mouse', 'printer', 'processor', 'refrigerator', 'speaker', 'trimmer', 'tv', 'watch'
]

const UserForm = ({ setVisible, setSuccessMessage, url, formMethod, user }) => {
    let fileInput;
    let fileDiv;
    const token = useSelector((state) => state.Token);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPasswrod] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState();
    const [profilePic, setProfilePic] = useState("");

    const [gError, setGError] = useState("")
    const [cats, setCats] = useState(categs);

    useEffect(() => {
        fileInput = document.getElementById('file-input');
        fileDiv = document.getElementById('file-div');
        fileDiv.addEventListener('click', () => {
            fileInput.click();
        });
    }, []);
    async function doSubmit(e) {
        e.preventDefault();
        console.log(name);
        console.log(email);
        console.log(password);
        console.log(confirmPassword);
        console.log(role);
        console.log(profilePic);

        //the function used to update state based on the field
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("profilePic", profilePic);

        const body ={
            name:name, email:email, password:password, role:role
        }

        let fetchUrl = url;
        console.log('fetchUrl is ' + fetchUrl);
        let res;
        if (profilePic) {
            res = await fetch(fetchUrl, {
                method: formMethod,
                headers: {
                    "Authorization": 'Bearer ' + token,
    
                },
                body: formData
            })
        }else{
            res = await fetch(fetchUrl, {
                method: formMethod,
                headers: {
                    "Authorization": 'Bearer ' + token,
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(body)
            })
        }
        console.log('AFTER FETCH url is ' + fetchUrl);


        const resJson = await res.json();
        if (resJson.status != 'success') {
            setGError(resJson.message);
            console.log(resJson.message);

        } else {
            if (formMethod == 'POST') {
                setSuccessMessage("Added User Successfully")
            } else {
                setSuccessMessage("Edited User Successfully")
            }
            setVisible(false);
        }
    }
    return (
        /* className='w-[100vw] h-[100vh] flex items-center justify-center backdrop-blur-3xl' */
        <div className='overlay'>
            <form encType='multipart/form-data' className='relative border box-border w-[40%] p-5 bg-white flex flex-col items-start gap-3 h-[600px] overflow-scroll'>
                <IoMdClose size={30} className='absolute top-2 right-2 cursor-pointer' onClick={() => {
                    setVisible(false);
                }} />
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Name:</p>
                    <input type='text' name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name' className='w-[100%] bg-slate-100 p-3 text-lg outline-none focus:shadow-md focus:bg-slate-200' />
                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Email:</p>
                    <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email' className='w-[100%] bg-slate-100 p-3 text-lg outline-none focus:shadow-md focus:bg-slate-200' />
                </div>
                <div className='flex flex-col items-baseline w-[100%] max-w-[400px] gap-3'>
                    <p className='text-lg font-bold'>Role:</p>
                    <select className='styled-select' name='role' onChange={(e) => setRole(e.target.value)}>
                        <option value='admin'>Admin</option>
                        <option value='user'>User</option>
                    </select>
                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Profile Picture:</p>
                    <input id='file-input' onChange={(e) => {
                        setProfilePic(e.target.files[0]);
                    }} name='profilePic' type='file' accept='png, jpg, jpeg' className='hidden' />
                    <div id='file-div' className='w-[100%] h-[100px] bg-slate-100 text-black font-bold flex items-center justify-center cursor-pointer'>Drop Image here</div>
                    <p className='text-xs text-red-700'>*Please Provide a profile picture</p>

                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Password:</p>
                    <input type='password' name='password' value={password} onChange={(e) => setPasswrod(e.target.value)} placeholder='Enter Price' className='w-[100%] bg-slate-100 p-3 text-lg outline-none focus:shadow-md focus:bg-slate-200' />
                </div>
                <div className='flex flex-col items-baseline w-[100%]'>
                    <p className='text-lg font-bold'>Confirm Password:</p>
                    <input type='password' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Enter Selling Price' className='w-[100%] bg-slate-100 p-3 text-lg outline-none focus:shadow-md focus:bg-slate-200' />
                </div>

                <button onClick={doSubmit} className='w-[70%] p-2 text-lg font-bold text-white bg-red-700 rounded-s-full rounded-e-full self-center hover:bg-white hover:text-red-700 hover:border hover:border-red-700 hover:border-4'>Submit</button>
            </form>
        </div>
    )
}

export default UserForm