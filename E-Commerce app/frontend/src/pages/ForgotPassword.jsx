import FormData from 'form-data';
import React, { useEffect, useState } from 'react'
import { SERVER_API_URL } from '../utils/serverUrl';
import { Link, useNavigate } from "react-router-dom"
import OtpInput from './TypeOtp';
import ChangePassword from './ChangePassword';
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [gError, setGError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [typeOtp, setTypeOtp] = useState(false);
  const [typePass, setTypePass] = useState(false);
  const [validOtp, setValidOtp] = useState(false);
  const [token, setToken] = useState("");
  const [tokenReady, setTokenReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setTokenReady(true);
    }
  }, [token])
  async function doSubmit(e) {
    e.preventDefault();
    const res = await fetch(SERVER_API_URL + "/users/forgot/" + email);
    const resJson = await res.json();
    if (resJson.status != 'success') {
      setGError(resJson.message);
      return;
    } else {
      setTypeOtp(true);
      return;
    }
  }
  return (
    <div className='w-[100%] h-[100vh] flex flex-col items-center justify-center gap-3'>
      {gError && <p className='bg-red-600 text-white texxt-lg text-center w-[60%] h-auto p-2'>{gError}</p>}
      {successMessage &&
        <>
          <p className='bg-green-400 text-white texxt-lg text-center w-[60%] h-auto p-2'>{successMessage}</p>
          <Link to={'/login'}>Login</Link>
        </>
      }
      {typeOtp && <OtpInput email={email} setGError={setGError} setValidOtp={setValidOtp} setTypeOtp={setTypeOtp} setToken={setToken} setTypePass={setTypePass} />}
      {validOtp && typePass && tokenReady && <ChangePassword email={email} setSuccessMessage={setSuccessMessage} setTypePass={setTypePass} token={token} />}
      {!typeOtp && !typePass &&
        <form className='flex flex-col gap-2 items-center justify-center bg-red-400 w-[40%] h-[40%] rounded-lg' encType='application/json'>
          <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-60 h-auto text-xl border-none rounded-lg bg-white p-2 outline-none focus:bg-slate-200 focus:shadow-md' placeholder='Enter Email' />
          <button className='w-52 h-auto p-2 bg-white text-red-500 text-xl rounded-lg' type='submit' onClick={(e) => doSubmit(e)}>Send code via email</button>
        </form>
      }
    </div>
  )
}

export default ForgotPassword