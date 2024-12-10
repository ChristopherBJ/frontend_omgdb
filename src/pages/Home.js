import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import '../styles/Home.css'; // Import the custom CSS

const Home = () => {
  // Function to generate carousel boxes dynamically
  const generateBoxes = (prefix, start, end) => {
    let boxes = [];
    for (let i = start; i <= end; i++) {
      boxes.push(
        <Col key={i} xs={12} sm={6} md={2} className="mb-3">
          <div className="carousel-box">
            {prefix} {i}
          </div>
        </Col>
      );
    }
    return boxes;
  };

  // Logic to generate the carousel blocks in chunks of 6 items
  const generateCarouselChunks = (prefix, totalItems, itemsPerChunk) => {
    const chunks = [];
    for (let i = 0; i < totalItems; i += itemsPerChunk) {
      const start = i + 1;
      const end = Math.min(i + itemsPerChunk, totalItems);
      const chunkItems = generateBoxes(prefix, start, end);
      chunks.push(
        <Carousel.Item key={i}>
          <Row>{chunkItems}</Row>
        </Carousel.Item>
      );
    }
    return chunks;
  };

  return (
    <Container>
      {/* Featured Today Carousel (2 items per chunk) */}
      <h2>Featured Today</h2>
      <Carousel id="carouselExampleFeatured" interval={null}>
        {generateCarouselChunks('Box', 8, 2)} {/* 2 items per chunk for Featured Today */}
      </Carousel>

      {/* Actors Carousel */}
      <h2>Actors</h2>
      <Carousel id="carouselExampleActors" interval={null}>
        {generateCarouselChunks('Actor', 60, 6)} {/* 6 items per chunk for this carousel */}
      </Carousel>

      {/* Movies Carousel */}
      <h2>Movies</h2>
      <Carousel id="carouselExampleMovies" interval={null}>
        {generateCarouselChunks('Movie', 30, 6)} {/* 6 items per chunk for this carousel */}
      </Carousel>

      {/* Series Carousel */}
      <h2>Series</h2>
      <Carousel id="carouselExampleSeries" interval={null}>
        {generateCarouselChunks('Series', 30, 6)} {/* 6 items per chunk for this carousel */}
      </Carousel>
    </Container>
  );
};

export default Home;
