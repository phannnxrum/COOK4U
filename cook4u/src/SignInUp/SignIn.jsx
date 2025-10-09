// rafce
import React from 'react'
import { NavLink } from 'react-router'

const SignIn = () => {
  return (
    <div>
        <h1>Sign In</h1>
        <NavLink to='/' className='underline cursor-pointer'>Back</NavLink>
    </div>
  )
}

export default SignIn