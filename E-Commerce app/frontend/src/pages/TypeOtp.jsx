import React, { useEffect, useState } from 'react'
import { SERVER_API_URL } from '../utils/serverUrl';
import { IoMdClose } from "react-icons/io";

const OtpInput = ({ email, setGError, setValidOtp, setTypeOtp, setTypePass , setToken}) => {
    const [otp, setOtp] = useState("");
    const [user, setUser] = useState({});
    const [inputOtp, setInputOtp] = useState("");
    const [Submit, setSubmit] = useState(false);
    const [lError, setLError] = useState("");
    
    useEffect(() => {
        async function getUser() {
            const res = await fetch(SERVER_API_URL + "/users/user/" + email);
            const resJson = await res.json();
            if (resJson.status != 'success') {
                setGError(resJson.message);
                setTypeOtp(false);
                return;
            }
            setOtp(resJson.data.otp);
            setValidOtp(true);
            setUser(resJson.data);
        }
        getUser();
    }, []);
    useEffect(() => {
        
    }, [otp, inputOtp]);
    async function doSubmit(e) {
        e.preventDefault();
        console.log('otp ==> ' + otp);
        console.log('inputOtp ==> ' + inputOtp);
        if (inputOtp == otp) {
            setValidOtp(true);
            setLError("");
            //set otp to "" in db and otpVerified true
            const res = await fetch(SERVER_API_URL + "/users/"+user._id, {
                method : "PUT"
            })
            const resJson = await res.json();
            if (resJson.status != 'success') {
                setLError(resJson.message);
            }else{
                setToken(resJson.data.token)
                setTypePass(true);
                setTypeOtp(false);
            }
        } else {
            setLError("Incorrect OTP");
        }
    }
    return (
        <div className='w-[100%] h-[100vh] relative flex flex-col items-center justify-center gap-3'>
            {lError && <p className='bg-red-600 text-white texxt-lg text-center w-[100%] h-auto p-2'>{lError}</p>}
            <form className='relative flex flex-col gap-2 items-center justify-center bg-red-400 w-[40%] h-[40%] rounded-lg' encType='application/json'>
                <IoMdClose size={30} className='absolute top-2 right-2 cursor-pointer' onClick={()=>setTypeOtp(false)} />
                <input type='inputOtp' name='text' value={inputOtp} onChange={(e) => setInputOtp(e.target.value)} className='w-60 h-auto text-xl border-none rounded-lg bg-white p-2 outline-none focus:bg-slate-200 focus:shadow-md' placeholder='Enter OTP' />
                <button className='w-52 h-auto p-2 bg-white text-red-500 text-xl rounded-lg' type='submit' onClick={(e) => doSubmit(e)}>Verify OTP</button>
            </form>
        </div>
    )
}

export default OtpInput