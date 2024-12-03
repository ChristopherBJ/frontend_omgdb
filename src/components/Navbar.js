import React, { useState } from 'react';
import logo from '../assets/OMGDB_logo.png';
import '../styles/Navbar.css';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className='navbar'>
      <div className='leftSide'>
        <a href="/"><img src={logo} alt='OMGDB Logo' /></a>
        <div 
          className='dropdown' 
          onMouseEnter={toggleDropdown} 
          onMouseLeave={toggleDropdown}
        >
          <button className='dropdownButton'>Menu</button>
          {dropdownOpen && (
            <div className='dropdownContent'>
              <a href="/Title">Movies</a>
              <a href="/Title">Series</a>
              <a href="/Persons">Actors</a>
            </div>
          )}
        </div>
      </div>
      <div className='center'>
        <input className='searchbar' type='text' placeholder='Search OMGDB' />
      </div>
      <div className='rightSide'>
        <div className='watchlist'>Watchlist</div>
        <div className='signin'>Sign In</div>
        </div>
      </div>
  );
}

export default Navbar;

