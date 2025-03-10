import { React, useEffect, useState } from 'react'
import { Link, useNavigate, useParams , } from 'react-router-dom'
import Avatar from "../images/avatar3.jpg"
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { FaCheck, FaFileUpload } from "react-icons/fa";
import { SERVER_API_URL, SERVER_ASSET_URL } from '../creds';
import FormData from 'form-data';
import {useSelector} from 'react-redux'

const UserProfile = () => {
    const params = useParams();
    const currentUserId = useSelector((state)=>state.decoded_token);
    console.log('currntUserID ' + currentUserId);
    
    const token = useSelector((state)=>state.token);
    const navigate = useNavigate();
    const id = params.id;
    const [avatar, setAvatar] = useState("");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState({});
    const [gError, setGError] = useState('');
    const [gSuccess, setGSuccess] = useState('');
    useEffect(() => {
      //first check user is requesting to edit hos own profile not another one's
      if (!id == currentUserId) {
        //user is not authorized to edit the profile
        navigate('/');
      }
      //first get old user info to display them
      async function fetchData(params) {
        const res = await fetch(SERVER_API_URL + "/users/" + id);
        const resJson = await res.json();
        if (resJson.status !== 'success') {
          setGError(resJson.message);
        } else {
          setUser(resJson.data);
        }
      }
      fetchData();
      /*document.getElementById('upload-label').addEventListener('click', () => {
        document.getElementById('avatar-input').click();
      })
      document.getElementById('avatar-input').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          setAvatar(file);
        }
      });*/
    }, [])

    async function doSubmit(e) {
      console.log('In doSubmit currentPassword: ' + currentPassword);
      
      e.preventDefault();
      //first check for old password correct or not
      const passwordRes = await fetch(SERVER_API_URL+"/users/"+currentUserId, {
        method : 'POST',
        headers : {
          'authorization' : 'Bearer '+token,
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          password : currentPassword
        })
      });
      console.log('Before  await passwordRes.json();');
      console.log('passwordRes '+ passwordRes);
      
      const passwordResJson = await passwordRes.json();
      if (passwordResJson.status != 'success') {
        setGError(passwordResJson.message);
        return;
      }
      console.log('After Old Password is correct');
      
      //check password and confirmPassword are equal
      if (newPassword != confirmPassword) {
        setGError('New Password and Confirm Password are not equal');
        return;
      }

      //then send the new data
      const formData = new FormData();
      formData.append('id', user._id);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', newPassword);
      
      formData.append('avatar', avatar);
      

      const res = await fetch(SERVER_API_URL+"/users/"+currentUserId, {
        method : 'PUT',
        headers : {
          'authorization' : 'Bearer ' + token,
        },
        body : formData
      })
      const resJson = await res.json();
      if (resJson.status != 'success') {
        console.log('In resJson.status != success');
        
        setGError(resJson.message);
        return;
      }
      console.log('resJson.status: ' + resJson.status);
      
      setGSuccess('Updated Successfully!');
      setGError('');
    }

    return (
      <div className="profile" encType="multipart/form-data">
        {id == currentUserId && <Link to={`/myposts/${id}`} className='btn-nav'>My Posts</Link>}
        <img src={SERVER_ASSET_URL + "uploads/" + user.avatar} className='avatar' />
        <form className="avatar-form">

          <input type="file" name='avatar' id='avatar-input' accept='png, jpg, jpeg' onChange={(e) => {
            setAvatar(e.target.files[0]);
          }} />

        </form>
        <h2>Mohamed Abdelsattar</h2>
        <div className="update-info">
          <form className="form" encType='multipart/form-data'>
            {gError && <p className="error-msg">{gError}</p>}
            {gSuccess && <p className="success-msg">{gSuccess}</p>}
            <input type='text' id='name' placeholder='Update Your Name' onChange={(e) => {
              setName(e.target.value);
            }} />
            <input type='email' id='email' placeholder='Update Your Email' onChange={(e) => {
              setEmail(e.target.value);
            }} />

            <input type='password' id='password' placeholder='Enter Your Current Password' onChange={(e) => {
              setCurrentPassword(e.target.value);
            }} />

            <input type='password' id='newPassword' placeholder='Enter Your New Password' onChange={(e) => {
              setNewPassword(e.target.value);
            }} />

            <input type='password' id='confirmPassword' placeholder='Re-Enter Your New Password' onChange={(e) => {
              setConfirmPassword(e.target.value);
            }} />
            <button type='submit' className='btn-nav' onClick={(e)=>{
              doSubmit(e);
            }} >Update</button>
          </form>
        </div>
      </div>
    )
  }



  export default UserProfile