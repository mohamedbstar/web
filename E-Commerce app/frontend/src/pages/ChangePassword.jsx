import FormData from 'form-data';
import React, { useState } from 'react'
import { SERVER_API_URL } from '../utils/serverUrl';
import {IoMdClose} from "react-icons/io"

const ChangePassword = ({ email, setTypePass, token , setSuccessMessage}) => {
    const [lError, setLError] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    async function doSubmit(e) {
        e.preventDefault();
        console.log('token is '+ token);
        
        if (password != confirmPassword) {
            setLError("Two Passwords Don't match");
        } else {
            //update user password in db
            const formData = new FormData();
            formData.append("password", password);
            formData.append("email", email);
            console.log('formData is ' + {...formData});
            
            const res = await fetch(SERVER_API_URL + "/users/", {
                method: "PUT",
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type' : "application/json"
                },
                body: JSON.stringify({
                    email : email,
                    password : password
                })
            });
            const resJson = await res.json();
            if (resJson.status != 'success') {
                setLError(resJson.message)
            } else {
                setSuccessMessage("Changed Password Successfully!");
                setTypePass(false);
            }
        }
    }
    return (
        <form className='flex flex-col gap-2 items-center justify-center bg-red-400 w-[40%] h-[40%] rounded-lg relative' encType='application/json'>
            {lError && <p className='bg-red-600 text-white texxt-lg text-center w-[100%] h-auto p-2'>{lError}</p>}
            <IoMdClose size={30} className='absolute top-2 right-2 cursor-pointer' onClick={()=>setTypePass(false)} />
            <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} className='w-60 h-auto text-xl border-none rounded-lg bg-white p-2 outline-none focus:bg-slate-200 focus:shadow-md' placeholder='Enter Password' />
            <input type='password' name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='w-60 h-auto text-xl border-none rounded-lg bg-white p-2 outline-none focus:bg-slate-200 focus:shadow-md' placeholder='Enter Password Again' />
            <button className='w-52 h-auto p-2 bg-white text-red-500 text-xl rounded-lg' type='submit' onClick={(e) => doSubmit(e)}>Change Password</button>
        </form>
    )
}

export default ChangePassword