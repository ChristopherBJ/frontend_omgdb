import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import '../styles/Watchlist.css';

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
    <div className="watchlist">
      <h1>Watchlist</h1>
        <Carousel>
          {groupedData.map((group, index) => (
            <Carousel.Item key={index}>
              <div className="watchlist-group">
                {group.map((movie) => (
                  <div
                    key={movie.id}
                    className="watchlist-movie"
                    onClick={() => goToMoviePage(movie.id)}
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="watchlist-movie-poster"
                    />
                    <div className="watchlist-movie-title">{movie.title}</div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
    </div>
  );
}
export default Watchlist;
