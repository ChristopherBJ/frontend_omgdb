import React, { useState, useEffect } from 'react';
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';
import { Carousel, Card, Button } from 'react-bootstrap';
import Logo from '../assets/Omg_main_logo.svg';
import '../styles/Footer.css';

function Footer() {
  const [data, setData] = useState([]); // Store fetched data
  const [watchlistStatuses, setWatchlistStatuses] = useState({}); // Track watchlist status for each series/movie
  const [watchlistFetched, setWatchlistFetched] = useState(false); // Track if the watchlist data is fetched
  const [fetchingStatusFor, setFetchingStatusFor] = useState(null); // Track which item status is being fetched
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Fetch recent view data
  useEffect(() => {
      fetch(`https://localhost/api/user/${user.Id}/recentview`)
          .then((response) => response.json())
          .then((data) => {
              console.log(data); // Check data structure
              setData(data); // Set data to state
              fetchUserWatchlistStatuses(data); // Fetch watchlist status for each item
          })
          .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Fetch user's watchlist status for each item
  const fetchUserWatchlistStatuses = async (items) => {
    if (!user || !token) return;

    const statuses = {};
    for (let item of items) {

        try {
            const response = await fetch(`https://localhost/api/user/${user.Id}/recentview`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Handle 401 Unauthorized error
            if (response.status === 401) {
                console.error('Unauthorized: Invalid or expired token');
                return;
            }

            // Check if the response is valid JSON
            const text = await response.text(); // Get raw text response first
            let data = {};
            try {
                data = JSON.parse(text); // Attempt to parse the response as JSON
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
            }

            if (data) {
                statuses[item.titleId] = 'Watchlisted'; // Handle valid data
            } else {
                statuses[item.titleId] = 'Error';
            }
        } catch (error) {
            console.error('Error fetching watchlist status:', error);
            statuses[item.titleId] = 'Error';
        }
    }
    setWatchlistStatuses(statuses);
    setWatchlistFetched(true);
};

  // Add item to watchlist
  const handleAddToWatchlist = async (itemId, titleType) => {
      if (!user || !token) {
          setWatchlistStatuses((prevStatuses) => ({
              ...prevStatuses,
              [itemId]: 'You need to be logged in to add to watchlist.',
          }));
          return;
      }

      const endpoint = titleType === 'movie'
          ? 'movie'
          : titleType === 'series'
              ? 'series'
              : 'episode';

      const watchlistData = {
          userId: user.id,
          [`${titleType}Id`]: itemId,
      };

      try {
          const response = await fetch(`https://localhost/api/user/recentview`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(watchlistData),
          });

          if (response.ok) {
              setWatchlistStatuses((prevStatuses) => ({
                  ...prevStatuses,
                  [itemId]: 'Watchlisted',
              }));
          } else {
              const errorData = await response.json();
              setWatchlistStatuses((prevStatuses) => ({
                  ...prevStatuses,
                  [itemId]: `Failed to add: ${errorData.message || response.statusText}`,
              }));
          }
      } catch (error) {
          console.error('Error adding to watchlist:', error);
      }
  };

  // Remove item from watchlist
  const handleRemoveFromWatchlist = async (itemId, titleType) => {
      if (!user || !token) {
          setWatchlistStatuses((prevStatuses) => ({
              ...prevStatuses,
              [itemId]: 'You need to be logged in to remove from watchlist.',
          }));
          return;
      }

      const endpoint = titleType === 'movie'
          ? `movie/${itemId}`
          : titleType === 'series'
              ? `series/${itemId}`
              : `episode/${itemId}`;

      try {
          const response = await fetch(`https://localhost/api/user/${user.Id}/recentview`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
          });

          if (response.ok) {
              setWatchlistStatuses((prevStatuses) => ({
                  ...prevStatuses,
                  [itemId]: 'Add to Watchlist',
              }));
          } else {
              const errorData = await response.json();
              setWatchlistStatuses((prevStatuses) => ({
                  ...prevStatuses,
                  [itemId]: `Failed to remove: ${errorData.message || response.statusText}`,
              }));
          }
      } catch (error) {
          console.error('Error removing from watchlist:', error);
      }
  };

  // Chunk the data into groups of 5
  const chunkData = (data, chunkSize) => {
      const chunks = [];
      for (let i = 0; i < data.length; i += chunkSize) {
          chunks.push(data.slice(i, i + chunkSize));
      }
      return chunks;
  };

  const groupedData = chunkData(data, 5); // Group data into chunks of 5

  // Handle click event
  const handleClick = (titleType, itemId) => {
      if (titleType === 'movie') {
          navigate(`/movie/${itemId}`);
      } else if (titleType === 'series') {
          navigate(`/series/${itemId}`);
      } else if (titleType === 'episode') {
          navigate(`/episode/${itemId}`);
      }
  };

  if (data.length === 0) {
      return <div>Loading...</div>;
  }

  return (
      <div className="footer">
          <h2 className="watchlist">Top of the Week</h2>
          <div className="recently-viewed">
              <h3>Recently Viewed</h3>
              <div className="recently-viewed-list">
                  {groupedData.map((group, groupIndex) => (
                      <Carousel.Item key={groupIndex}>
                          <div className="d-flex justify-content-center">
                              {group.map((item, index) => (
                                  <div key={index} className="recently-viewed-item">
                                      <Card>
                                          <div className="poster-container">
                                              {/* Watchlist Button Section */}
                                              {watchlistStatuses[item.titleId] === 'Watchlisted' ? (
                                                  <button
                                                      className="poster-button"
                                                      onClick={() => handleRemoveFromWatchlist(item.titleId, item.titleType)}>
                                                      Watchlisted
                                                  </button>
                                              ) : (
                                                  <button
                                                      className="poster-button"
                                                      onClick={() => handleAddToWatchlist(item.titleId, item.titleType)}>
                                                      {watchlistStatuses[item.titleId] || 'Add to Watchlist'}
                                                  </button>
                                              )}
                                              {/* Rate Button */}
                                              <Button className='rate-button'>Rate</Button>
                                              {/* Poster Images */}
                                              {item.poster ? (
                                                  <Card.Img
                                                      className='recently-viewed-image'
                                                      variant="top"
                                                      src={item.poster}
                                                      alt={item.title}
                                                      onClick={() => handleClick(item.titleType, item.titleId)}
                                                  />
                                              ) : (
                                                  <Card.Img
                                                      className='recently-viewed-image'
                                                      variant="top"
                                                      src={Logo}
                                                      alt="Poster not available"
                                                      onClick={() => handleClick(item.titleType, item.titleId)}
                                                  />
                                              )}
                                          </div>
                                          <Card.Body>
                                              <p className="text-center">IMDb rating: {item.imdbRating}</p>
                                              <h6 className="text-center mt-2">{item.title}</h6>
                                          </Card.Body>
                                      </Card>
                                  </div>
                              ))}
                          </div>
                      </Carousel.Item>
                  ))}
              </div>
          </div>

          <div className="footnote">Your Footnote Text Here</div>
      </div>
  );
};

export default Footer;
