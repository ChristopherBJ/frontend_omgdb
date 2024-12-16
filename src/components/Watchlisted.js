import React, { useState, useEffect } from 'react';
import { Carousel, Button, Card } from 'react-bootstrap';
import Logo from '../assets/Omg_main_logo.svg';
import '../styles/Watchlisted.css';
import { useNavigate } from 'react-router-dom';

const Watchlisted = ({ token }) => {
    const [watchlistStatus, setWatchlistStatus] = useState('');
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost/api/user/watchlist/movie', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log("API Response Data:", responseData);
                    // Format data if necessary
                    const formattedData = responseData.map((item) => ({
                        title: item.movieName || 'Unknown',
                        titleId: item.id || 'N/A',
                        titleType: item.type || 'movie',
                        imdbRating: item.rating || 'N/A',
                        poster: item.posterPath || Logo, // Fallback poster
                    }));
                    setData(formattedData);
                    setWatchlistStatus('Watchlisted');
                } else {
                    const errorData = await response.json();
                    console.error('API Error:', errorData);
                    setWatchlistStatus(`Failed to fetch data: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Error fetching watchlist data:', error);
                setWatchlistStatus('Failed to fetch data.');
            }
        };

        fetchData();
    }, [token]);

    if (data.length === 0) {
        return <div>Loading your watchlist...</div>; // Show loading or empty watchlist message
    }

    const handleClick = (titleType, titleId) => {
        if (titleType === 'movie') {
            navigate(`/movie/${titleId}`);
        } else if (titleType === 'series') {
            navigate(`/series/${titleId}`);
        } else if (titleType === 'episode') {
            navigate(`/episode/${titleId}`);
        }
    };

    return (
        <div>
            <h2>Watchlisted</h2>
            <Carousel indicators={false} interval={null} className='carousel'>
                {data.map((item, index) => (
                    <Carousel.Item key={index}>
                        <div className="d-flex justify-content-center">
                            <Card className="poster-item mx-2">
                                <div className="poster-container">
                                    <Card.Img
                                        className='poster-image'
                                        variant="top"
                                        src={item.poster}
                                        alt={item.title}
                                        onClick={() => handleClick(item.titleType, item.titleId)}
                                    />
                                </div>
                                <Card.Body>
                                    <p className="text-center">IMDb rating: {item.imdbRating}</p>
                                    <h6 className="text-center mt-2">{item.title}</h6>
                                    <Button className='rate-button'>Rate</Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default Watchlisted;
