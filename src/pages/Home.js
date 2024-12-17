import React from 'react';
import { Carousel, Container, Row, Col, Spinner } from 'react-bootstrap';
import '../styles/Home.css'; // Import the custom CSS
import TopWeekly from '../components/TopWeekly';
import PopluarCelebs from '../components/PopularCelebs';
import Watchlisted from '../components/Watchlisted';

const Home = () => {
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

  // Logic to generate overlapping chunks for Featured Today
  const generateFeaturedChunks = (prefix, totalItems) => {
    const chunks = [];
    for (let i = 1; i <= totalItems - 1; i++) {
      const chunkItems = generateBoxes(prefix, i, i + 1, 6); // Always pick the current and next item
      chunks.push(
        <Carousel.Item key={i}>
          <Row>{chunkItems}</Row>
        </Carousel.Item>
      );
    }
    return chunks;
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

  return (

    // Show top weekly movies and series
    

    <Container>
      {/* Featured Today Carousel */}
    <TopWeekly />

      {/* Actors Carousel */}
    
    <PopluarCelebs />

      {/* Movies Carousel */}
    <Watchlisted />

      {/* Series Carousel */}

    </Container>
  );
};

export default Home;