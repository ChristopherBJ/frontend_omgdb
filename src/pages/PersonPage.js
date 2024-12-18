import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/MoviePage.css';
import { Link } from 'react-router-dom';

const PersonPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Grab the personId from the route parameters
    const APIKey = process.env.REACT_APP_API_KEY;

    const goBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    const [person, setPerson] = useState(null); // Store a single person's data
    const [loading, setLoading] = useState(true); // Loading state for the single person
    const [knownFor, setKnownFor] = useState(null); // Store a single person's data

    // Fetch the person by ID when the component mounts or personId changes
    useEffect(() => {
        fetch(`https://localhost/api/person/${id}`) // Adjust the endpoint to fetch by ID
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched Person Data:', data);
                setPerson(data); // Set the person data
                setLoading(false); // Set loading to false
            })
            .catch((error) => {
                console.error('Error fetching person data:', error);
                setLoading(false);
            });
    }, [id]); // Re-run effect if personId changes

    // Fetch poster after the person data is loaded
    useEffect(() => {
        if (person && !person.poster) {
            const fetchPoster = async () => {
                try {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(person.name)}&api_key=${APIKey}`
                    );
                    const posterData = await response.json();
                    const posterPath = posterData.results[0]?.profile_path;
                    setPerson((prevPerson) => ({
                        ...prevPerson,
                        poster: posterPath
                            ? `https://image.tmdb.org/t/p/w500${posterPath}`
                            : null,
                    }));
                } catch (error) {
                    console.error('Error fetching poster:', error);
                }
            };

            fetchPoster();
        }
    }, [person, APIKey]); // This effect runs when person data is available

    useEffect(() => {
        fetch(`https://localhost/api/person/${id}/credit`) // Adjust the endpoint to fetch by ID
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched Person Data:', data);
                setKnownFor(data); // Set the person data
                setLoading(false); // Set loading to false
            })
            .catch((error) => {
                console.error('Error fetching person data:', error);
                setLoading(false);
            });
    }, [id]); // Re-run effect if personId changes

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="showcontainer">
            <Button className="buttonBack" onClick={goBack}>
                ← Go Back
            </Button>

            <div className="content">
                <div className="header">
                    <h1>{person.name}</h1>
                    <p className="subheader">{person.primaryProfession || 'N/A'}</p>
                </div>
                <p>

                    <strong>Birth Year:</strong> {person.birthYear || 'N/A'}
                </p>
                <p>
                    <strong>Known For:</strong>{' '}
                    {knownFor && knownFor.length > 0 ? (
                        <ul>
                            {knownFor.map((item, index) => (
                                <li key={index}>
                                    <Link to={`/${item.titleType}/${item.titleId}`} key={index}>
                                        {item.title || item.name || 'No Title Available'}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        'N/A'
                    )}
                </p>
                <div className="poster">
                    {person.poster ? (
                        <img className="posterImg" src={person.poster} alt={person.name} />
                    ) : (
                        <div>No poster available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonPage;