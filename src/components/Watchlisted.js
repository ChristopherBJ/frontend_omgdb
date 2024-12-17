import React, { useState, useEffect } from 'react';
import { Button, Carousel } from 'react-bootstrap';
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import '../styles/Watchlist.css';

const Watchlist = () => {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlistStatus, setWatchlistStatus] = useState('');
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

  // Remove movie from the watchlist
  const removeFromWatchlist = async (movieId) => {
    if (!user || !token) {
      setWatchlistStatus('You need to be logged in to remove from the watchlist.');
      return;
    }

    try {
      const response = await fetch(`https://localhost/api/user/${user.id}/watchlist/movie/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWatchlistStatus('Movie removed from watchlist');
        setWatchlistMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
      } else {
        const errorData = await response.json();
        setWatchlistStatus(`Failed to remove from watchlist: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
    }
  };

  // Navigate to MoviePage when clicking on a movie
  const goToMoviePage = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user, token, fetched]);

  if (loading) {
    return <div>Loading watchlist...</div>;
  }

  return (
    <div className="watchlist-container">
      <h2>Your Watchlist</h2>

      {watchlistMovies.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <Carousel className="watchlist-carousel" interval={null}>
          {watchlistMovies.map((movie) => (
            <Carousel.Item key={movie.id}>
              <div className="carousel-item-content">
                <img
                  className="d-block w-100 carousel-image"
                  src={movie.poster || 'https://via.placeholder.com/150'}
                  alt={movie.title}
                />
                <Carousel.Caption>
                  <h3>{movie.title}</h3>
                  <p>{movie.releaseYear}</p>
                  <div className="carousel-actions">
                    <Button onClick={() => goToMoviePage(movie.id)} variant="primary">
                      View Movie
                    </Button>
                    <Button onClick={() => removeFromWatchlist(movie.id)} variant="danger">
                      Remove from Watchlist
                    </Button>
                  </div>
                </Carousel.Caption>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {watchlistStatus && <p>{watchlistStatus}</p>}
    </div>
  );
};

export default Watchlist;
