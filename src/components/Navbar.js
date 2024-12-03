import React from 'react'
import logo from '../assets/OMGDB_logo.png'
import '../styles/Navbar.css'

function Navbar() {
  return (
    <div className='navbar'>
      <div className='leftSide'>
        <img src={logo} alt='OMGDB Logo' />
      </div>
      <div className='rightSide'>dhdh</div>
    </div>
  )
}

export default Navbar
