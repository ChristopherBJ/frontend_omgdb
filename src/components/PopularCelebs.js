
import React, { useState, useEffect } from 'react';
import { Carousel, Card } from 'react-bootstrap';
import Logo from '../assets/Omg_main_logo.svg';
import '../styles/PopularCelebs.css';
import { useNavigate } from 'react-router-dom';

const PopularCelebs = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const APIKey = process.env.REACT_APP_API_KEY;

    // First useEffect: Fetch the list of people
    useEffect(() => {
        fetch('https://localhost/api/person?pageSize=30')
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched Data:", data);
                setData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);
    // Second useEffect: Fetch posters after the data has been set
    useEffect(() => {
        if (data.length > 0 && !data.some(person => person.poster !== undefined)) {
            const fetchPosters = async () => {
                const updatedData = await Promise.all(
                    data.map(async (person) => {
                        try {
                            const response = await fetch(
                                `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(person.name)}&api_key=${APIKey}`
                            );
                            const posterData = await response.json();
    
                            console.log(`Poster Data for ${person.name}:`, posterData);
    
                            const posterPath = posterData.results[0]?.profile_path;
    
                            return {
                                ...person,
                                poster: posterPath
                                    ? `https://image.tmdb.org/t/p/w500${posterPath}`
                                    : null,
                            };
                        } catch (error) {
                            console.error('Error fetching poster for:', person.name, error);
                            return { ...person, poster: null };
                        }
                    })
                );
    
                console.log("Updated Data with Posters:", updatedData);
    
                setData(updatedData); // Update data with posters
            };
    
            fetchPosters();
        }
    }, [data]); // Make sure this useEffect only runs when `data` is set

    if (data.length === 0) {
        return <div>Loading...</div>;
    }

    // Helper function to chunk data into groups of 5
    const chunkData = (data, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            chunks.push(data.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const groupedData = chunkData(data, 5);

    const handleClick = (id) => {
        navigate(`/person/${id}`);
    };

    return (
        <div>
            <h2>Most Popular Actors</h2>
            <Carousel indicators={false} interval={null} className="carousel">
                {groupedData.map((group, groupIndex) => (
                    <Carousel.Item key={groupIndex}>
                        <div className="d-flex justify-content-center">
                            {group.map((item, index) => (
                                <div key={index} className="poster-item mx-2">
                                    <Card>
                                        <div className="poster-container">
                                            {item.poster ? (
                                                <Card.Img
                                                    className="poster-image"
                                                    variant="top"
                                                    src={item.poster}
                                                    alt={item.name}
                                                    onClick={() => handleClick(item.id)}
                                                />
                                            ) : (
                                                <Card.Img
                                                    className="default-image"
                                                    variant="top"
                                                    src={Logo}
                                                    alt="Poster not available"
                                                    onClick={() => handleClick(item.id)}
                                                />
                                            )}
                                        </div>
                                        <Card.Body>
                                            <h6 className="text-center mt-2">{item.name}</h6>
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

export default PopularCelebs;
