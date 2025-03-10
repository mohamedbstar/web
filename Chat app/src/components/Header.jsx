import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { login } from '../store/reducers/LoggedInReducer';
import { setToken } from '../store/reducers/TokenSlice';
import { setCurrentUser } from '../store/reducers/CurrentUserSlice';
import { Link } from 'react-router-dom';
const Header = () => {
  const LoggedIn = useSelector((state) => state.LoggedIn);
  const Token = useSelector((state) => state.Token);
  const CurrentUser = useSelector((state) => state.CurrentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!LoggedIn) {
      //see if there is logInfo in the localStorage
      const logInfo = localStorage.getItem('logInfo') ? JSON.parse(localStorage.getItem('logInfo')) : null;
      if (logInfo) {
        dispatch(login());
        dispatch(setToken(logInfo.Token));
        dispatch(setCurrentUser(logInfo.CurrentUser));
      }
    }
  }, [LoggedIn])
  return (
    <div className='fixed top-0 w-[100%]'>
      {LoggedIn &&
        <div className='w-[100%] bg-slate-200 p-3 flex gap-3 items-end justify-end relative'>
          <Link to={'/logout'} className=' text-xl text-green-600'>logout</Link>
          <Link to={''} className=' text-xl text-green-600'>{CurrentUser.name}</Link>
        </div>
      }
    </div>
  )
}

export default Header