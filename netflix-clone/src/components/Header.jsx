import React from 'react'
import "./Header.css"
const Header = () => {
  return (
    <div className='header'>
        <ul className='nav-ul'>
            <li className='nav-li cur-li'>Netflix</li>
            <li className='nav-li'>Browse</li>
            <li className='nav-li'>Kids</li>
            <li className='nav-li'>DvDs</li>
        </ul>
    </div>
  )
}

export default Header