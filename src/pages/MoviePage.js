import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Logo from '../assets/Omg_main_logo.svg';
import { useAuth } from "../components/AuthProvider";
import StarRating from "../components/StarRating"; 
import '../styles/MoviePage.css';

const MoviePage = () => {
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
  const [watchlist, setWatchlist] = useState(0); // User's watchlist


  const navigate = useNavigate();
  const { user, token } = useAuth();

  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Fetch movie data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [titleResponse, genreResponse, actorResponse] = await Promise.all([
          fetch(`https://localhost/api/movie/${titleId}`),
          fetch(`https://localhost/api/movie/${titleId}/genre`),
          fetch(`https://localhost/api/movie/${titleId}/actors`),
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
      const response = await fetch(`https://localhost/api/user/${user.id}/ratings/movie/${titleId}`, {
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

  const handleRatingChange = (newRating) => {
    setRating(newRating); // Update the selected rating
  };

  const handleRatingSubmit = async () => {
    if (!user || !token) {
      setRatingStatus('You need to be logged in to submit a rating.');
      return;
    }

    const ratingData = {
      userId: user.id,
      movieId: titleId,
      rating,
    };

    try {
      const response = await fetch('https://localhost/api/user/ratings/movie', {
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
      } else {
        const errorData = await response.json();
        setRatingStatus(`Failed to submit rating: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setRatingStatus('Failed to submit rating.');
    }
  };

  const fetchUserWatchlist = async () => {
    if (!user || !token || watchlistFetched) return;

    try {
      const response = await fetch(`https://localhost/api/user/${user.id}/watchlist/movie/${titleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWatchlistStatus('Watchlisted'); // If movie is in watchlist, set status
      } else if (response.status === 404) {
        setWatchlistStatus('Add to Watchlist'); // Movie is not in watchlist
      } else {
        console.error(`Failed to fetch user watchlist: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching user watchlist:', error);
    } finally {
      setWatchlistFetched(true);
    }
  };

  // Add movie to the watchlist
  const handleAddToWatchlist = async () => {
    if (!user || !token) {
      setWatchlistStatus('You need to be logged in to add to watchlist.');
      return;
    }

    const watchlistData = {
      userId: user.id,
      movieId: titleId,
    };

    try {
      const response = await fetch('https://localhost/api/user/watchlist/movie', {
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
      console.error('Error adding movie to watchlist:', error);
      setWatchlistStatus('Failed to add to watchlist.');
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
          <img src={titleData.poster || Logo} alt={titleData.title} />
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
            <p>Your rating on this movie:</p>
            <StarRating value={rating} onChange={handleRatingChange} />

            <Button className='submit-button' onClick={handleRatingSubmit}>
              Submit Rating
            </Button>

            {ratingStatus && <p>{ratingStatus}</p>}

            {/* Watchlist Section */}
            <div className="watchlist">
            <Button className="watchlist-button" onClick={handleAddToWatchlist}>
              {watchlistStatus || 'Add to Watchlist'}
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;