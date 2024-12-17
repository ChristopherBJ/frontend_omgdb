import React, { useState, useEffect } from 'react';
import { Carousel, Card } from 'react-bootstrap';
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import '../styles/TopWeekly.css';
import Logo from '../assets/Omg_main_logo.svg';

const Watchlist = () => {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  // const [watchlistStatus, setWatchlistStatus] = useState('');
  const [watchlistStatus, setWatchlistStatus] = useState('');
  const [loading, setLoading] = useState(true); // Track loading state
  const [fetched, setFetched] = useState(false); // Track if watchlist is fetched
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Fetch watchlist for the user
  const fetchWatchlist = async () => {
    if (!user || !token || fetched) return;

    try {
      const response = await fetch(`https://localhost/api/user/${user.id}/watchlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWatchlistMovies(data); // Set watchlist movies
      } else {
        console.error('Failed to fetch watchlist');
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
      setFetched(true); // Mark as fetched
    }
  };

  // Helper function to chunk data into groups of 5
  const chunkData = (data, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const groupedData = chunkData(watchlistMovies, 5);

  // Navigate to MoviePage when clicking on a movie
  const handleClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user, token, fetched]);

  if (loading) {
    return <div>Loading watchlist...</div>;
  }

  return (
      <div>
          <h2>Watchlist</h2>
          <Carousel indicators={false} interval={null} className="carousel">
              {groupedData.map((group, groupIndex) => (
                  <Carousel.Item key={groupIndex}>
                      <div className="d-flex justify-content-center">
                          {group.map((item, index) => (
                              <div key={index} className="poster-item mx-2">
                                  <Card className="poster-card">
                                      <div className="poster-container">
                                          {item.poster ? (
                                              <Card.Img
                                                  className="poster-image"
                                                  variant="top"
                                                  src={item.poster}
                                                  alt={item.name}
                                                  onClick={() => handleClick(item.id)}
                                                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                              />
                                          ) : (
                                              <Card.Img
                                                  className="default-image"
                                                  variant="top"
                                                  src={Logo}
                                                  alt="Poster not available"
                                                  onClick={() => handleClick(item.id)}
                                                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                              />
                                          )}
                                      </div>
                                      <Card.Body>
                                          <h6 className="text-center mt-2">{item.title}</h6>
                                      </Card.Body>
                                  </Card>
                              </div>
                          ))}
                      </div>
                  </Carousel.Item>
              ))}
          </Carousel>
      </div>
  );
};


export default Watchlist;