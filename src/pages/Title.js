import React from 'react'
import '../styles/Title.css'
import { useEffect, useState } from 'react'

//Write your API key here


function Title() {

  const [user, setUser] = useState([]);
  useEffect(() => {
    const mytoken = process.env.REACT_APP_MY_TOKEN;
    if (mytoken) {
      console.log('Token found');
    const headers ={'Authorization': `Bearer ${mytoken}`};
      fetch('https://localhost/api/user', {headers})
        .then(res => res.json())
        .then(data => console.log(data))
        
    } else {
      console.log('No token found');
    }
    }, 
    []);


  


 
  return (
    <div className='title-container'>
      <h2 className='title'>Movie Finder</h2>
        </div>
  )
}

export default Title
