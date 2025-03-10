import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/loggedSlice.js';

const Logout = () => {
  const loggedIn = useSelector((state)=>state.loggedInSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(()=>{
    if (!loggedIn) {
      navigate("/");
    }else{
      dispatch(logout());
      navigate("/");
    }
  },[loggedIn])
  return (
    <></>
  );
}

export default Logout