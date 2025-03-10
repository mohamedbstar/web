import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

const ErrorPage = () => {
  return (
    <>
    <Header />
    <div className='error-div'>
      <Link to={"/"} className='btn-link-dark'>Go Back Home</Link>
      <h2>Not Found</h2>
    </div>
    </>
  )
}

export default ErrorPage