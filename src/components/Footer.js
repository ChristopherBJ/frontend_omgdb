import React, { useState, useEffect } from 'react';
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Fetch recently viewed movies
  const fetchRecentlyViewed = async () => {
    if (!user || !token) return; // Make sure user is logged in

    try {
      const response = await fetch(`https://localhost/api/user/${user.id}/recentview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Recently Viewed Movies:", data); // Debugging log
        setRecentlyViewed(data); // Store fetched data
      } else {
        console.error('Failed to fetch recently viewed movies');
      }
    } catch (error) {
      console.error('Error fetching recently viewed movies:', error);
    }
  };

  // Navigate to MoviePage when clicking on a movie
  const goToMoviePage = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  useEffect(() => {
    fetchRecentlyViewed(); // Fetch the data when component mounts
  }, [user, token]); // Fetch data whenever the user or token changes

  return (
    <div className='footer'>
      <div className='recentlyviewed'>
        <h3>Recently Viewed</h3>
        {recentlyViewed.length === 0 ? (
          <p>No recently viewed movies.</p> // Message if no movies are found
        ) : (
          <div className='recently-viewed'>
            <div className='recently-viewed-list'>
              {recentlyViewed.map((movie) => (
                <div
                  key={movie.id}
                  className='recently-viewed-item'
                  onClick={() => goToMoviePage(movie.id)} // Navigate to movie details on click
                >
                  <img
                    src={movie.poster || 'https://via.placeholder.com/150'}
                    alt={movie.title}
                    className='recently-viewed-image'
                  />
                  <p>{movie.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='footnote'>made by Group 7</div>
    </div>
  );
}

export default Footer;
