import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { logout } from '../store/reducers/LoggedInReducer';
import { clearToken } from '../store/reducers/TokenSlice';
import { clearCurrentUser } from '../store/reducers/CurrentUserSlice';

const Logout = () => {
    const LoggedIn = useSelector((state) => state.LoggedIn);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        if (!LoggedIn) {
            navigate("/");
        }else{
            dispatch(logout());
            dispatch(clearToken());
            dispatch(clearCurrentUser());

            //clear logInfo from localStorage
            localStorage.setItem("logInfo", null)
            navigate("/");
        }
    },[LoggedIn])
    return (
        <div>Logout</div>
    )
}

export default Logout