import React from 'react';
import { Carousel, Container, Row, Col, Spinner } from 'react-bootstrap';
import '../styles/Home.css'; // Import the custom CSS
import { useState, useEffect } from 'react';
import Logo from '../assets/Omg_main_logo.svg';

const Home = () => {
  const [topWeekly, setTopWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(()=> {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost/api/topweekly');
        const data = await response.json();
        console.log(data); // Check data structure
        setTopWeekly(data); // Set the entire array of items
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  }
  })
  
  // Logic to generate overlapping chunks for Featured Today
  const renderFeaturedChunks = () => {
    const chunks = [];
    for (let i = 0; i < topWeekly.length - 1; i++) {
      // Overlapping logic: current and next items
      const current = topWeekly[i];
      const next = topWeekly[i + 1];

      chunks.push(
        <Carousel.Item key={i}>
          <Row>
            {[current, next].map((item, index) => (
              <Col key={index} xs={12} sm={6} md={6} className="mb-3">
                <div className="carousel-box">
                  <img
                    src={item.poster || Logo} // Use fallback if no poster
                    alt={item.title}
                    className="img-fluid"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'cover',
                    }}
                  />
                  <h5>{item.title}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Carousel.Item>
      );
    }
    return chunks;
  };


  // Function to generate carousel boxes dynamically
  const generateBoxes = (prefix, start, end, colSize = 2) => {
    let boxes = [];
    for (let i = start; i <= end; i++) {
      boxes.push(
        <Col key={i} xs={12} sm={6} md={colSize} className="mb-3">
          <div className="carousel-box">
            {prefix} {i}
          </div>
        </Col>
      );
    }
    return boxes;
  };


  // Logic to generate the carousel blocks in chunks of items (default for other carousels)
  const generateCarouselChunks = (prefix, totalItems, itemsPerChunk, colSize = 2) => {
    const chunks = [];
    for (let i = 0; i < totalItems; i += itemsPerChunk) {
      const start = i + 1;
      const end = Math.min(i + itemsPerChunk, totalItems);
      const chunkItems = generateBoxes(prefix, start, end, colSize);
      chunks.push(
        <Carousel.Item key={i}>
          <Row>{chunkItems}</Row>
        </Carousel.Item>
      );
    }
    return chunks;
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container>
      {/* Featured Today Carousel */}
      <h2>Featured Today</h2>
      <Carousel id="carouselExampleFeatured" interval={null}>
        {topWeekly.length > 0 ? renderFeaturedChunks() : <div>No items available</div>}
      </Carousel>

      {/* Actors Carousel */}
      <h2>Actors</h2>
      <Carousel id="carouselExampleActors" interval={null}>
        {generateCarouselChunks('Actor', 60, 6)} {/* 6 items per chunk */}
      </Carousel>

      {/* Movies Carousel */}
      <h2>Movies</h2>
      <Carousel id="carouselExampleMovies" interval={null}>
        {generateCarouselChunks('Movie', 30, 6)} {/* 6 items per chunk */}
      </Carousel>

      {/* Series Carousel */}
      <h2>Series</h2>
      <Carousel id="carouselExampleSeries" interval={null}>
        {generateCarouselChunks('Series', 30, 6)} {/* 6 items per chunk */}
      </Carousel>
    </Container>
  );
};

export default Home;