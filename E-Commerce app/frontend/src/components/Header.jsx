import React, { useEffect, useState } from 'react'
import Logo from './Logo';

import { FaSearch, FaRegUserCircle, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/reducers/LoggedInReducer.js';
import { clearToken, setToken } from '../store/reducers/TokenSlice.js';
import { clearCurrentUser, setCurrentUser } from '../store/reducers/CurrentUserSlice.js';
import { SERVER_API_URL, SERVER_BASE_URL } from '../utils/serverUrl';
import { setCart } from '../store/reducers/CartReducer.js';


export const Header = () => {
    const LoggedIn = useSelector((state) => state.LoggedIn);
    const Token = useSelector((state) => state.Token);
    const CurrentUser = useSelector((state) => state.CurrentUser);
    const Cart = useSelector((state)=>state.Cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [searchInput, setSearchInput] = useState("");
    const [cart,setHeaderCart] = useState([]);
    useEffect(() => {
        //load cart from localStorage
        let storageCart = localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : [];
        console.log('header setting CartSlice to ' + storageCart + ' with length ' + storageCart.length);
        console.log('starage cart is ', storageCart);
        
        dispatch(setCart(storageCart));
        console.log('after dispatch');
        
        //2 => by local storage
        let logInfo = JSON.parse(localStorage.getItem('logInfo'));
        console.log('log info is ', logInfo);
        
        if (!LoggedIn && logInfo !== null) {
            logInfo = JSON.parse(logInfo);
            //user is logged in but closed the browser
            dispatch(login());
            console.log('after login dispatch');
            
            dispatch(setToken(logInfo.Token));
            console.log('after set token dispatch');
            dispatch(setCurrentUser(logInfo.CurrentUser));
            console.log('after logging in');
            
        }
    }, []); 
    function doLogOut() {
        console.log('in logout');
        //do logout, clearToken and clear currentUSer
        dispatch(logout());
        console.log('clearing token');
        dispatch(clearToken());
        console.log('clearing current user');
        dispatch(clearCurrentUser());

        //remove logInfo from localStorage
        localStorage.removeItem('logInfo');
        window.location.reload();
    }

    async function doSearch() {
        const res = await fetch(SERVER_API_URL + "/products/");//get all products
        const resJson = await res.json();
        if (resJson.status != 'success') {
            console.log(resJson.message);
        }else{
            let intermediateData = [...resJson.data];//deep copy
            intermediateData = intermediateData.filter((item)=>{
                return(
                    item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchInput.toLowerCase())
                )
            })
            navigate("/search", {state : intermediateData});
        }
    }

    useEffect(()=>{
        setHeaderCart(Cart);
        
    },[Cart])
    return (
        <header className='h-16 shadow-md bg-white'>
            <div className='container w-full mx-auto flex items-center justify-between'>
                <div className="">
                    <Link to={'/'}><img src={SERVER_BASE_URL+"/uploads/logo.png"} className='w-[40px]' /></Link>
                </div>
                <div className="hidden lg:flex items-center justify-between border rounded-full pl-2 focus-within:shadow-md">
                    <input type="text" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} className=' w-full outline-none' placeholder='Search Products' />
                    <div className='bg-red-600 text-lg min-w-[50px] h-8 text-white flex items-center justify-center rounded-r-full'>
                        <FaSearch onClick={doSearch} />
                    </div>
                </div>
                <div className='flex items-center gap-5' >
                    
                    {
                        LoggedIn ?
                            
                            (CurrentUser.role == 'admin' ? <Link to={'/admin'}><img src={SERVER_BASE_URL +"/uploads/"+ CurrentUser.profilePic} className='rounded-full cursor-pointer w-12 pt-1' /></Link> 
                                : <Link to={'/me'}><img src={SERVER_BASE_URL +"/uploads/"+ CurrentUser.profilePic} className='rounded-full cursor-pointer w-7' /></Link> ):
                            <FaRegUserCircle className='text-3xl cursor-pointer' />

                    }

                    <div className='flex items-center relative' onClick={()=>{
                        navigate("/cart");
                    }}>
                        <span><FaShoppingCart className='text-3xl cursor-pointer' /></span>
                        <div className='bg-red-600 text-white absolute -top-1 -right-2 rounded-full px-1'>
                            {cart.length}
                        </div>
                    </div>

                    {!LoggedIn &&
                        <div className='cursor-pointer bg-red-600 px-2 py-1 text-white rounded-full hover:bg-red-700'>
                            <Link to={"/login"}><input type='button' value="Login" /></Link>
                        </div>
                    }
                    {!LoggedIn &&
                        <div className='cursor-pointer bg-red-600 px-2 py-1 text-white rounded-full hover:bg-red-700'>
                            <Link to={"/sign-up"}><input type='button' value="Sign up" /></Link>
                        </div>
                    }
                    {LoggedIn &&
                        <div className='cursor-pointer bg-red-600 px-2 py-1 text-white rounded-full hover:bg-red-700'>
                            <input type='button' value="Logout" onClick={doLogOut} />
                        </div>
                    }
                </div>
            </div>

        </header>
    )
}

export default Header;