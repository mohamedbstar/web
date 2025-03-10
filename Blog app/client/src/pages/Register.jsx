import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { SERVER_API_URL } from '../creds';
import FormData from 'form-data'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [gError, setGError] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();
  const doSubmit = async (e) => {
    console.log('in do submit');
    e.preventDefault();
    if (pass !== pass2) {
      setGError("Passwords don't match");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', pass);
      const res = await fetch(SERVER_API_URL + '/users/register', {
        method: 'POST',
        body : formData
      });
      const resJson = await res.json();


      if (resJson.status === 'fail' || resJson.status === 'error') {
        setGError(resJson.message);
      } else {
        setGError("")
        navigate("/login");
      }

    } catch (error) {
      setGError(error.response.data.message);
      return;
    }
  }
  return (
    <div className='register'>
      {gError && <p className="error-msg">{gError}</p>}
      <h2>Sign Up</h2>
      <form className='form' encType="multipart/form-data" >
        <input type='text' name='name' id='name' placeholder='Enter Your Name' value={name} onChange={(event) => {
          setName(event.target.value);
        }} />

        <input type='email' name='email' id='email' placeholder='Enter Your Email' value={email} onChange={(event) => {
          setEmail(event.target.value)
        }} />

        <input type='password' name='pass' id='pass' placeholder='Enter Your Password' value={pass} onChange={(event) => {
          setPass(event.target.value)
        }} />

        <input type='password' name='pass2' id='pass2' placeholder='Re-Enter Your Password' value={pass2} onChange={(event) => {
          setPass2(event.target.value)
        }} />

        <input type="file" name='avatar' id='avatar-input' accept='png, jpg, jpeg' onChange={(e) => {
          setAvatar(e.target.files[0]);
        }} />

        <button type='submit' className='btn-nav' onClick={(event) => {
          doSubmit(event);
        }}>Sign Up</button>
      </form>
      <div className="already-registered">
        <small>Already have an account? </small><Link to="/login">Sing in</Link>
      </div>
    </div>
  );
}

export default Register