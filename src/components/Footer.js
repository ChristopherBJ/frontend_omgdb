import React from 'react';
import {Container} from 'react-bootstrap';
import '../styles/Footer.css'
import RecentlyViewed from './RecentlyViewed'

function Footer() {
  return (
    <Container>
    <div className='footer'>
      <div className='watchlist'>
        <h3>Recently Viewed</h3>
        
        <RecentlyViewed />

      </div>
      <div className='footnote'>made by Group 7</div>
    </div>
    </Container>
  )
}

export default Footer