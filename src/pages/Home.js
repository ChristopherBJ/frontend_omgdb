import React, { useState, useEffect } from 'react';
import { Carousel, Container, Row, Col, Spinner } from 'react-bootstrap';
import '../styles/Home.css'; // Import the custom CSS
import Logo from '../assets/Omg_main_logo.svg';

const Home = () => {
  const [topWeekly, setTopWeekly] = useState([]);
  const [mostPopularCelebs, setMostPopularCelebs] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [omgdbTop10, setOmgdbTop10] = useState([]);
  const [fanFavorites, setFanFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from multiple APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace these endpoints with real ones
        const topWeeklyRes = await fetch('https://localhost/api/topweekly');
        const mostPopularCelebsRes = await fetch('https://localhost/api/mostpopularcelebs');
        const watchlistRes = await fetch('https://localhost/api/watchlist');
        const omgdbTop10Res = await fetch('https://localhost/api/omgdbtop10');
        const fanFavoritesRes = await fetch('https://localhost/api/fanfavorites');
        const recentlyViewedRes = await fetch('https://localhost/api/recentlyviewed');

        // Parse responses
        const topWeeklyData = await topWeeklyRes.json();
        const mostPopularCelebsData = await mostPopularCelebsRes.json();
        const watchlistData = await watchlistRes.json();
        const omgdbTop10Data = await omgdbTop10Res.json();
        const fanFavoritesData = await fanFavoritesRes.json();
        const recentlyViewedData = await recentlyViewedRes.json();

        // Set state
        setTopWeekly(topWeeklyData);
        setMostPopularCelebs(mostPopularCelebsData);
        setWatchlist(watchlistData);
        setOmgdbTop10(omgdbTop10Data);
        setFanFavorites(fanFavoritesData);
        setRecentlyViewed(recentlyViewedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to render a generic carousel from dynamic data
  const renderCarouselChunks = (data, itemsPerChunk = 6, colSize = 2) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += itemsPerChunk) {
      const chunkItems = data.slice(i, i + itemsPerChunk).map((item, index) => (
        <Col key={index} xs={12} sm={6} md={colSize} className="mb-3">
          <div className="carousel-box">
            <img
              src={item.poster || Logo} // Use fallback if no poster
              alt={item.title || item.name}
              className="img-fluid"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
            <h5>{item.title || item.name}</h5>
          </div>
        </Col>
      ));
      chunks.push(
        <Carousel.Item key={i}>
          <Row>{chunkItems}</Row>
        </Carousel.Item>
      );
    }
    return chunks;
  };

  // Function to render the Top Weekly carousel with overlapping logic
  const renderFeaturedChunks = () => {
    const chunks = [];
    for (let i = 0; i < topWeekly.length - 1; i++) {
      const current = topWeekly[i];
      const next = topWeekly[i + 1];

      chunks.push(
        <Carousel.Item key={i}>
          <Row>
            {[current, next].map((item, index) => (
              <Col key={index} xs={12} sm={6} md={6} className="mb-3">
                <div className="carousel-box">
                  <img
                    src={item.poster || Logo}
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
      {/* Featured Today */}
      <h2>Featured Today</h2>
      <Carousel id="carouselExampleFeatured" interval={null}>
        {topWeekly.length > 0 ? renderFeaturedChunks() : <div>No items available</div>}
      </Carousel>

      {/* Most Popular Celebs */}
      <h2>Most Popular Celebs</h2>
      <Carousel id="carouselExampleCelebs" interval={null}>
        {renderCarouselChunks(mostPopularCelebs, 5)} {/* 5 items per chunk */}
      </Carousel>

      {/* From Your Watchlist */}
      <h2>From Your Watchlist</h2>
      <Carousel id="carouselExampleWatchlist" interval={null}>
        {renderCarouselChunks(watchlist, 5)} {/* 5 items per chunk */}
      </Carousel>

      {/* Top 10 from OMGDB This Week */}
      <h2>Top 10 from OMGDB This Week</h2>
      <Carousel id="carouselExampleTop10" interval={null}>
        {renderCarouselChunks(omgdbTop10, 5)} {/* 5 items per chunk */}
      </Carousel>

      {/* Fan Favorites */}
      <h2>Fan Favorites</h2>
      <Carousel id="carouselExampleFanFavorites" interval={null}>
        {renderCarouselChunks(fanFavorites, 5)} {/* 5 items per chunk */}
      </Carousel>

      {/* Recently Viewed */}
      <h2>Recently Viewed</h2>
      <Carousel id="carouselExampleRecentlyViewed" interval={null}>
        {renderCarouselChunks(recentlyViewed, 5)} {/* 5 items per chunk */}
      </Carousel>
    </Container>
  );
};

export default Home;
