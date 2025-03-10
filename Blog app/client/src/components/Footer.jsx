import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div className="footer-categories">
        <Link to={"/posts/categories/Agriculture"} className='btn-link'>Agriculture</Link>
        <Link to={"/posts/categories/Engineering"} className='btn-link'>Engineering</Link>
        <Link to={"/posts/categories/Science"} className='btn-link'>Science</Link>
        <Link to={"/posts/categories/Politics"} className='btn-link'>Politics</Link>
        <Link to={"/posts/categories/History"} className='btn-link'>History</Link>
        <Link to={"/posts/categories/Art"} className='btn-link'>Art</Link>
        <Link to={"/posts/categories/Coding"} className='btn-link'>Coding</Link>
      </div>
      <div className="footer-copyrights">
        <small>All rights reserved &copy; Copyrights, Mohamed Abdelsattar</small>
      </div>
    </footer>
  )
}

export default Footer