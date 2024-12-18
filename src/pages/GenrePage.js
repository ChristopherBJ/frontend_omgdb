import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import { Carousel, Card } from 'react-bootstrap'; // Import Carousel and Card from Bootstrap
import Logo from '../assets/Omg_main_logo.svg'; // Import logo
import '../styles/GenrePage.css'; // Import custom styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const GenrePage = () => {
    // State to store the genres and fetched data for the selected genre
    const [genres, setGenres] = useState([]);
    const [currentGenre, setCurrentGenre] = useState('');
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const sliderRef = useRef(null);
    const navigate = useNavigate(); // Get the navigate function from the useNavigate hook

    // Fetch genres when the component mounts
    useEffect(() => {
        fetch('https://localhost/api/genre?pageSize=32')
            .then((response) => response.json())
            .then((data) => {
                setGenres(data); // Set genres data to the state
            })
            .catch((error) => console.error('Error fetching genres:', error));
    }, []); // Empty dependency array means this runs once on component mount

    // Fetch movies, series, and episodes when the current genre changes
    useEffect(() => {
        if (!currentGenre) return;

        const fetchGenreDetails = async () => {
            try {
                // Fetch movies for the current genre
                const moviesResponse = await fetch(`https://localhost/api/genre/${currentGenre}/movies`);
                const moviesData = await moviesResponse.json();
                setMovies(moviesData);

                // Fetch series for the current genre
                const seriesResponse = await fetch(`https://localhost/api/genre/${currentGenre}/series`);
                const seriesData = await seriesResponse.json();
                setSeries(seriesData);

                // Fetch episodes for the current genre
                const episodesResponse = await fetch(`https://localhost/api/genre/${currentGenre}/episodes`);
                const episodesData = await episodesResponse.json();
                setEpisodes(episodesData);

            } catch (error) {
                console.error('Error fetching genre details:', error);
            }
        };

        fetchGenreDetails(); // Call fetch when the current genre changes
    }, [currentGenre]); // This effect depends on the currentGenre

    // Helper function to chunk data
    const chunkData = (data, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            chunks.push(data.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const groupedMovie = chunkData(movies, 5); // Group movies into chunks of 5
    const groupedSeries = chunkData(series, 5); // Group series into chunks of 5
    const groupedEpisodes = chunkData(episodes, 5); // Group episodes into chunks of 5

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


    // Scroll functions for genres
    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -500, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 500, behavior: 'smooth' });
        }
    };

    return (
        <div className="showGenrecontainer">
            <div className="genre-head">
                <h1 className="genre-title">Genres</h1>
                <div className="genre-line-setup">
                    <button className="arrow-button left-arrow" onClick={scrollLeft}>
                        &#8592;
                    </button>

                    <div className="genre-slider" ref={sliderRef}>
                        {genres.map((genre, index) => (
                            <Link
                                key={index}
                                to={`/genre/${genre.genreName}`}
                                className="btn btn-primary genre-button"
                                onClick={() => setCurrentGenre(genre.genreName)} // Update the selected genre
                            >
                                {genre.genreName}
                            </Link>
                        ))}
                    </div>

                    <button className="arrow-button right-arrow" onClick={scrollRight}>
                        &#8594;
                    </button>
                </div>
                <h1 className="genre-title">
                    {currentGenre ? `Current Genre: ${currentGenre}` : 'Select a Genre'}
                </h1>
            </div>
            {/* Display lists of movies, series, and episodes */}
            {currentGenre && (
                <div className="genre-details">
                    <h2>Movies</h2>
                    <Carousel indicators={false} interval={null} className="carousel">
                        {groupedMovie.length > 0 ? (
                            groupedMovie.map((group, groupIndex) => (
                                <Carousel.Item key={groupIndex}>
                                    <div className="d-flex justify-content-center">
                                        {group.map((movie, index) => (
                                            <div key={index} className="poster-item mx-2">
                                                <Card className="poster-card">
                                                    <div className="poster-container">
                                                        {movie.poster ? (
                                                            <Card.Img
                                                                className="poster-image"
                                                                variant="top"
                                                                src={movie.poster}
                                                                alt={movie.title}
                                                                onClick={() => handleClick(navigate(`/movie/${movie.id}`))} // Update the selected genre
                                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <Card.Img
                                                                className="default-image"
                                                                variant="top"
                                                                src={Logo} // Use a default logo if no poster is available
                                                                alt="Poster not available"
                                                                onClick={() => handleClick(navigate(`/movie/${movie.id}`))} 
                                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <Card.Body>
                                                        <p className="text-center">IMDb rating: {movie.imdbRating}</p>
                                                        <p className="text-center">Title: {movie.title}</p>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </Carousel.Item>
                            ))
                        ) : (
                            <p>No movies found for this genre.</p>
                        )}
                    </Carousel>


                    <h2>Series</h2>
                    <Carousel indicators={false} interval={null} className="carousel">
                        {groupedSeries.length > 0 ? (
                            groupedSeries.map((group, groupIndex) => (
                                <Carousel.Item key={groupIndex}>
                                    <div className="d-flex justify-content-center">
                                        {group.map((series, index) => (
                                            <div key={index} className="poster-item mx-2">
                                                <Card className="poster-card">
                                                    <div className="poster-container">
                                                        {series.poster ? (
                                                            <Card.Img
                                                                className="poster-image"
                                                                variant="top"
                                                                src={series.poster}
                                                                alt={series.title}
                                                                onClick={() => handleClick(navigate(`/series/${series.id}`))}
                                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <Card.Img
                                                                className="default-image"
                                                                variant="top"
                                                                src={Logo} // Use a default logo if no poster is available
                                                                alt="Poster not available"
                                                                onClick={() => handleClick(navigate(`/series/${series.id}`))}
                                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <Card.Body>
                                                        <p className="text-center">IMDb rating: {series.imdbRating}</p>
                                                        <p className="text-center">Title: {series.title}</p>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </Carousel.Item>
                            ))
                        ) : (
                            <p>No series found for this genre.</p>
                        )}
                    </Carousel>

                    <h2>Episodes</h2>
                    <Carousel indicators={false} interval={null} className="carousel">
                        {groupedEpisodes.length > 0 ? (
                            groupedEpisodes.map((group, groupIndex) => (
                                <Carousel.Item key={groupIndex}>
                                    <div className="d-flex justify-content-center">
                                        {group.map((episodes, index) => (
                                            <div key={index} className="poster-item mx-2">
                                                <Card className="poster-card">
                                                    <div className="poster-container">
                                                        {episodes.poster ? (
                                                            <Card.Img
                                                                className="poster-image"
                                                                variant="top"
                                                                src={episodes.poster}
                                                                alt={episodes.title}
                                                                onClick={() => handleClick(navigate(`/episode/${episodes.id}`))}
                                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <Card.Img
                                                                className="default-image"
                                                                variant="top"
                                                                src={Logo} // Use a default logo if no poster is available
                                                                alt="Poster not available"
                                                                onClick={() => handleClick(navigate(`/episode/${episodes.id}`))}
                                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <Card.Body>
                                                        <p className="text-center">IMDb rating: {episodes.imdbRating}</p>
                                                        <p className="text-center">OMGDB rating: {episodes.averageRating}</p>
                                                        <p className="text-center">Season: {episodes.season}</p>
                                                        <p className="text-center">Title: {episodes.title}</p>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </Carousel.Item>
                            ))
                        ) : (
                            <p>No episodes found for this genre.</p>
                        )}
                    </Carousel>

                </div>
            )}
        </div>
    );
};

export default GenrePage;