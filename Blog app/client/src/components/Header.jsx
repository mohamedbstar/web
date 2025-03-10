import React, { useEffect, useState } from 'react'
import Logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useSelector } from 'react-redux';
import { SERVER_API_URL } from "../creds.js"

const Header = () => {
  const [sideMenuShown, setSideMenuShown] = useState(false);

  const loggedIn = useSelector((state) => state.loggedInSlice);
  const token = useSelector((state) => state.token);
  const currentUserId = useSelector((state) => state.decoded_token);
  const [user, setUser] = useState({});

  function handleSideMenu() {
    document.getElementsByClassName('nav__menu_small')[0].style.display = 'flex';
    document.getElementById('openMenu').style.display = 'none';
  }

  function closeMenu() {
    document.getElementsByClassName('nav__menu_small')[0].style.display = 'none';
    document.getElementById('openMenu').style.display = 'block';
  }

  useEffect(()=>{
    async function doJob(){
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1275) {
          document.getElementsByClassName('nav__menu_small')[0].style.display = 'none';
          document.getElementById('openMenu').style.display = 'none';
        } else {
          document.getElementById('openMenu').style.display = 'block';
        }
      })
      const loggedInElements = document.getElementsByClassName('login-shown');
      if (!loggedIn) {
        for (let index = 0; index < loggedInElements.length; index++) {
          loggedInElements[index].style.display = 'none';
        }
      } else {
        for (let index = 0; index < loggedInElements.length; index++) {
          loggedInElements[index].style.display = 'block';
        }
      }
  
      const loggedOutElements = document.getElementsByClassName('login-removed');
      if (!loggedIn) {
        for (let index = 0; index < loggedOutElements.length; index++) {
          loggedOutElements[index].style.display = 'block';
        }
      } else {
        for (let index = 0; index < loggedOutElements.length; index++) {
          loggedOutElements[index].style.display = 'none';
        }
      }
      //set current user if logged in
      if (loggedIn) {
        const res = await fetch(SERVER_API_URL + "/users/" + currentUserId);
        const resJson = await res.json();
        if (resJson.status == 'success') {
          setUser(resJson.data);
        } else {
          setUser({});
        }
      }
    }
    doJob();
  }, [loggedIn]);
  return (
    <nav>
      <div className="container nav__container">
        <div className="nav__logo">
          <img src={Logo} alt='nav logo' />
        </div>
        <ul className="nav__menu hide-small">
          <li className='nav__item login-shown'><Link to={"/posts/users/"+currentUserId} className='btn-nav'>
            {user.name}
          </Link></li>
          <li className='nav__item'><Link to={"/authors"} className='btn-nav'>All Authors</Link></li>
          <li className='nav__item'><Link to={"/"} className='btn-nav'>All Posts</Link></li>
          <li className='nav__item login-shown'><Link to={"/posts/create"} className='btn-nav'>Create Post</Link></li>
          <li className='nav__item login-shown'><Link to={"/logout"} className='btn-nav'>Logout</Link></li>
          <li className='nav__item login-removed'><Link to={"/login"} className='btn-nav'>Login</Link></li>
          <li className='nav__item login-removed'><Link to={"/register"} className='btn-nav'>Sign Up</Link></li>

        </ul>
        <CiMenuBurger className='hidden-large' id='openMenu' size={30} onClick={() => {
          handleSideMenu();
        }} />
      </div>
      <ul className='nav__menu_small hidden-large'>
        <IoMdClose className='hidden-large' id='closeMenu' size={30} onClick={() => {
          closeMenu();
        }} />
        <li className='nav__item_container'><Link to={"/profile"} className='nav__item'>Mohamed Abdelsattar</Link></li>
        <li className='nav__item_container'><Link to={"/authors"} className='nav__item'>All Authors</Link></li>
        <li className='nav__item_container'><Link to={"/create"} className='nav__item'>Create Post</Link></li>
        <li className='nav__item_container'><Link to={"/logout"} className='nav__item'>Logout</Link></li>
      </ul>
    </nav>
  )
}

export default Header