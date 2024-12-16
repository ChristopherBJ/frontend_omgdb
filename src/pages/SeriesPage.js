import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Logo from '../assets/Omg_main_logo.svg';

import '../styles/MoviePage.css';

const MoviePage = () => {
  const { titleId } = useParams();
  const [titleData, setTitleData] = useState(null);
  const [genreData, setGenreData] = useState(null);
  const [actorData, setActorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  useEffect(() => {
    // Fetch data concurrently using Promise.all
    const fetchData = async () => {
      try {
        const [titleResponse, genreResponse, actorResponse] = await Promise.all([
          fetch(`https://localhost/api/series/${titleId}`), // First fetch
          fetch(`https://localhost/api/series/${titleId}/genre`), // Second fetch
          fetch(`https://localhost/api/series/${titleId}/actors`), // Third fetch
        ]);

        if (!titleResponse.ok) {
          throw new Error('Failed to fetch title data');
        }
        if (!genreResponse.ok) {
          throw new Error('Failed to fetch genre data');
        }
        if (!actorResponse.ok) {
          throw new Error('Failed to fetch actor data');
        }

        const [titleData, genreData, actorData] = await Promise.all([
          titleResponse.json(), // Parse first response
          genreResponse.json(), // Parse second response
          actorResponse.json(), // Parse third response
        ]);

        setTitleData(titleData); // Set title data
        setGenreData(genreData); // Set genre data
        setActorData(actorData); // Set actor data
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [titleId]);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!titleData || !genreData || !actorData) {
    return <div>Data not found</div>; // Error state
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
          <img
            src={titleData.poster || Logo}
            alt={titleData.title}
          />
        </div>

        <div className="details">
          <p><strong>IMDb Rating:</strong> {titleData.imdbRating || 'N/A'} </p>
          <p><strong>Average Rating:</strong> {titleData.averageRating || 'N/A'}</p>
          <p><strong>Popularity:</strong> {titleData.popularity || 'N/A'}</p>
          <p>
            <strong>Genres:</strong>{' '}
            {genreData.map((genre, index) => (
              <span key={index}>
                <a className='links' href={`/genre/${genre.genreName}`}>
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
                <a className='links' href={`/actor/${actor.id}`}>
                  {actor.name}
                </a>{' '}
                as {actor.character}
                {index < actorData.length - 1 && ', '}
              </span>
            )) || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;