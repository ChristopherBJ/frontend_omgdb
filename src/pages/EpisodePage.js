import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Logo from '../assets/Omg_main_logo.svg';
import { useAuth } from "../components/AuthProvider";
import StarRating from "../components/StarRating";
import '../styles/MoviePage.css';

const EpisodePage = () => {
  const { titleId } = useParams();
  const [titleData, setTitleData] = useState(null);
  const [genreData, setGenreData] = useState(null);
  const [actorData, setActorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0); // User's rating
  const [ratingFetched, setRatingFetched] = useState(false); // Track if rating was fetched
  const [ratingStatus, setRatingStatus] = useState(null); // Feedback message
  const [watchlistStatus, setWatchlistStatus] = useState(null); // Feedback message
  const [watchlistFetched, setWatchlistFetched] = useState(false); // Track if watchlist was fetched
  


  const navigate = useNavigate();
  const { user, token } = useAuth();

  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Fetch episode data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [titleResponse, genreResponse, actorResponse] = await Promise.all([
          fetch(`https://localhost/api/episode/${titleId}`),
          fetch(`https://localhost/api/episode/${titleId}/genre`),
          fetch(`https://localhost/api/episode/${titleId}/actors`),
        ]);

        if (!titleResponse.ok || !genreResponse.ok || !actorResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [titleData, genreData, actorData] = await Promise.all([
          titleResponse.json(),
          genreResponse.json(),
          actorResponse.json(),
        ]);

        setTitleData(titleData);
        setGenreData(genreData);
        setActorData(actorData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [titleId]);
  // Fetch user rating
  const fetchUserRating = async () => {
    if (!user || !token || ratingFetched) return;

    try {
      const response = await fetch(`https://localhost/api/user/${user.id}/ratings/episode/${titleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { rating: userRating } = await response.json();
        setRating(userRating); // Set the user's rating
        setRatingFetched(true); // Mark as fetched
      } else if (response.status === 404) {
        setRating(0); // Default to 0 if no rating found
        setRatingFetched(true);
      } else {
        console.error(`Failed to fetch user rating: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  useEffect(() => {
    fetchUserRating(); // Trigger the rating fetch when the component loads
  }, [titleId, user, token, ratingFetched]);

  // Handle rating change locally
  const handleRatingChange = (newRating) => {
    setRating(newRating); // Update the selected rating
  };

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (!user || !token) {
      setRatingStatus('You need to be logged in to submit a rating.');
      return;
    }

    const ratingData = {
      userId: user.id,
      episodeId: titleId,
      rating,
    };

    try {
      const response = await fetch('https://localhost/api/user/ratings/episode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ratingData),
      });

      if (response.ok) {
        setRatingStatus('Rating submitted successfully!');
        setRatingFetched(false); // Allow re-fetch after submission
      } else if (response.status === 409) {
        setRatingStatus('You already rated this episode.');
      } else {
        const errorData = await response.json();
        setRatingStatus(`Failed to submit rating: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  // Handle rating deletion
  const handleRemoveRating = async () => {
    if (!user || !token) {
      setRatingStatus('You need to be logged in to remove your rating.');
      return;
    }

    try {
      const response = await fetch(`https://localhost/api/user/${user.id}/ratings/episode/${titleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRating(0); // Reset rating to 0
        setRatingStatus('Your rating has been removed.');
        setRatingFetched(false); // Allow re-fetch after deletion
      } else {
        const errorData = await response.json();
        setRatingStatus(`Failed to remove rating: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error removing rating:', error);
    }
  };


  const fetchUserWatchlist = async () => {
    if (!user || !token || watchlistFetched) return;

    try {
      const response = await fetch(`https://localhost/api/user/${user.id}/watchlist/episode/${titleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWatchlistStatus('Watchlisted'); // If episode is in watchlist, set status
      } else if (response.status === 404) {
        setWatchlistStatus('Add to Watchlist'); // episode is not in watchlist
      } else {
        console.error(`Failed to fetch user watchlist: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching user watchlist:', error);
    } finally {
      setWatchlistFetched(true);
    }
  };

  // Add episode to the watchlist
  const handleAddToWatchlist = async () => {
    if (!user || !token) {
      setWatchlistStatus('You need to be logged in to add to watchlist.');
      return;
    }

    const watchlistData = {
      userId: user.id,
      episodeId: titleId,
    };

    try {
      const response = await fetch('https://localhost/api/user/watchlist/episode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(watchlistData),
      });

      if (response.ok) {
        setWatchlistStatus('Watchlisted'); // Change status to "Watchlisted" upon successful addition
      } else {
        const errorData = await response.json();
        setWatchlistStatus(`Failed to add to watchlist: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error adding episode to watchlist:', error);
    }
  };

  // Remove episode from the watchlist
  const handleRemoveFromWatchlist = async () => {
    if (!user || !token) {
      setWatchlistStatus('You need to be logged in to remove from watchlist.');
      return;
    }

    try {
      const response = await fetch(`https://localhost/api/user/${user.id}/watchlist/episode/${titleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWatchlistStatus('Add to Watchlist'); // Change status to "Add to Watchlist" upon successful removal
      } else {
        const errorData = await response.json();
        setWatchlistStatus(`Failed to remove from watchlist: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error removing episode from watchlist:', error);
    }
  };

  // Fetch the user watchlist status when the component mounts
  useEffect(() => {
    fetchUserWatchlist(); // Fetch watchlist status
  }, [titleId, user, token, watchlistFetched]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!titleData || !genreData || !actorData) {
    return <div>Data not found</div>;
  }

  return (
    <div className="showcontainer">
      <Button className="buttonBack" onClick={goBack}>
        ← Go Back
      </Button>

      <div className="header">
        <h1>{titleData.title}</h1>
        <p className="subheader">
          {titleData.releaseYear || `${titleData.startYear} - ${titleData.endYear}`} |{' '}
          {titleData.titleType || 'N/A'}
        </p>
      </div>

      <div className="content">

        <div className="poster">
          {/* Watchlist Section */}
          {watchlistStatus === 'Watchlisted' ? (
            <button className="watchlist-button" onClick={handleRemoveFromWatchlist}>
              Watchlisted
            </button>
          ) : (
            <button className="watchlist-button" onClick={handleAddToWatchlist}>
              {watchlistStatus || 'Add to Watchlist'}
            </button>
          )}


          <img className='posterImg' src={titleData.poster || Logo} alt={titleData.title} />

        </div>

        <div className="details">
          <p><strong>IMDb Rating:</strong> {titleData.imdbRating || 'N/A'}</p>
          <p><strong>OMGDB Rating:</strong> {titleData.averageRating || 'N/A'}</p>
          <p><strong>Popularity:</strong> {titleData.popularity || 'N/A'}</p>
          <p>
            <strong>Genres:</strong>{' '}
            {genreData.map((genre, index) => (
              <span key={index}>
                <a className="links" href={`/genre/${genre.genreName}`}>
                  {genre.genreName}
                </a>
                {index < genreData.length - 1 && ', '}
              </span>
            )) || 'N/A'}
          </p>

          <p><strong>Runtime:</strong> {titleData.runTime || 'Unknown'}</p>
          <p><strong>Plot:</strong> {titleData.plot || 'No description available'}</p>
          <p>
            <strong>Actors:</strong>{' '}
            {actorData.map((actor, index) => (
              <span key={index}>
                <a className="links" href={`/person/${actor.personId}`}>
                  {actor.name}
                </a>{' '}
                as {actor.character}
                {index < actorData.length - 1 && ', '}
              </span>
            )) || 'N/A'}
          </p>

          {/* Rating Section */}

          <div className="rating">
            <p>Your rating on this episode:</p>

            {/* Display star rating component */}
            <StarRating value={rating} onChange={handleRatingChange} />

            <Button className="submit-button --bs-btn-active-bg: #ffffff;" onClick={handleRatingSubmit}>
              Submit Rating
            </Button>

            {rating > 0 && (
              <Button className="remove-button" onClick={handleRemoveRating}>
                Remove Rating
              </Button>
            )}

            {/* Show rating status message */}
            {ratingStatus && <p>{ratingStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodePage;