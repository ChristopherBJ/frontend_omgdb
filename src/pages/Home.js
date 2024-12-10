import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import '../styles/Home.css'; // Import the custom CSS

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
    <Container>
      {/* Featured Today Carousel */}
      <h2>Featured Today</h2>
      <Carousel id="carouselExampleFeatured" interval={null}>
        {generateFeaturedChunks('Box', 8)} {/* 8 items, 1 at a time with overlap */}
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
