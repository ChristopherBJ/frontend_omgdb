import React from 'react'
import '../styles/Title.css'
import { useEffect, useState } from 'react'

//Write your API key here
const APIkey = 'your_api_key_here'

function Title() {
  return (
    <div className='title'>
      <p>This is the Title page for the movie etc. with id as a search</p>
    </div>
  )
}

export default Title
