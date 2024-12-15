import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap'; // Import Carousel from React Bootstrap
import Logo from '../assets/Omg_main_logo.svg';

const TopWeekly = () => {
  const [data, setData] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    fetch('https://localhost/api/topweekly')
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Check data structure
        setData(data); // Set the entire array of items
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  if (data.length === 0) {
    return <div>Loading...</div>; // Show loading message if data is still being fetched
  }

  return (
    <div>
      <h2>Featured Today</h2>
      <Carousel>
        {data.map((item, index) => (
          <Carousel.Item key={index}>
            {item.poster ? (
              <img
                className="d-block h-100"
                src={item.poster}
                alt={item.title}
                style={{
                  width: '30%',
                  objectFit: 'cover',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            ) : (
              <img
                className="d-block h-100"
                src={Logo} // Fallback image
                alt="Poster not available"
                style={{
                  width: '30%',
                  objectFit: 'cover',
                }}
              />
            )}
            <Carousel.Caption>
              <h5>{item.title}</h5>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default TopWeekly;