import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
        <button><Link to="/login">LogIn</Link></button>
        <button><Link to="/signup">SignUp</Link></button>
    </div>
  )
}

export default Home