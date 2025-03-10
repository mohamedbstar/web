import React from 'react'
import { Link } from 'react-router-dom'

const NotAuthorized = () => {
  return (
    <div className='flex flex-col items-center justify-center w-[100vw] h-[100vh]'>
        <h1 className='text-3xl'>OOPS</h1>
        <h1 className='text-2xl'>You Are Not Authorized to access this page</h1>
        <Link className='text-lg text-blue-500' to={'/'}>back to home</Link>
    </div>
  )
}

export default NotAuthorized