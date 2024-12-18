import React from 'react'
import '../styles/Profile.css'
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Carousel, Card } from 'react-bootstrap';
import Logo from '../assets/Omg_main_logo.svg';



//Show the watchlist of the user

function Profile() {

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

//Navigation to the movie details page, Person details page, or TV show details page
  const handleClick = (title_type, title_id) => {
    if (title_type === 'movie') {
      navigate(`/movie/${title_id}`);
    } else if (title_type === 'series') {
      navigate(`/series/${title_id}`);
    } else if (title_type === 'episode') {
      navigate(`/episode/${title_id}`);
    }
  };


  useEffect(() => {
    fetchWatchlist();
  }, [user, token, fetched]);

  if (loading) {
    return <div>Loading watchlist...</div>;
  }

  return (
      <div>
          <h2>Your Watchlist</h2>
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
                                                  onClick={() => handleClick(item.title_type, item.title_id)}
                                                  style={{ width: '100%', height: '80%', objectFit: 'cover' }}
                                              />
                                          ) : (
                                              <Card.Img
                                                  className="default-image"
                                                  variant="top"
                                                  src={Logo}
                                                  alt="Poster not available"
                                                  onClick={() => handleClick(item.title_type, item.title_id)}
                                                  style={{ width: '100%', height: '80%', objectFit: 'cover' }}
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



export default Profile
