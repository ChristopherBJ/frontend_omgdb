import React, { useState, useEffect } from 'react';
import { Carousel, Button, Card } from 'react-bootstrap';
import Logo from '../assets/Omg_main_logo.svg';
import '../styles/TopWeekly.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../components/AuthProvider";

const TopWeekly = () => {
    const [data, setData] = useState([]); // Store fetched data
    const [watchlistStatuses, setWatchlistStatuses] = useState({}); // Track watchlist status for each series/movie
    const [watchlistFetched, setWatchlistFetched] = useState(false); // Track if the watchlist data is fetched
    const [fetchingStatusFor, setFetchingStatusFor] = useState(null); // Track which item status is being fetched
    const navigate = useNavigate();
    const { user, token } = useAuth();

    // Fetch top weekly 
    useEffect(() => {
        fetch('https://localhost/api/topweekly?pageSize=30&sortBy=imdbRating')
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Check data structure
                setData(data); // Set data to state
                // Fetch initial watchlist statuses only once when the page loads
                fetchUserWatchlistStatuses(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Fetch user's watchlist status for each item eg. movie series and epi only once
    const fetchUserWatchlistStatuses = async (items) => {
        if (!user || !token) return;

        const statuses = {};
        // Loop through all items and fetch watchlist status for each
        for (let item of items) {
            const endpoint = item.titleType === 'movie'
                ? `movie/${item.titleId}`
                : item.titleType === 'series'
                    ? `series/${item.titleId}`
                    : `episode/${item.titleId}`;

            try {
                const response = await fetch(`https://localhost/api/user/${user.id}/watchlist/${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Set status to 'Watchlisted' if the item is in the watchlist
                const status = response.ok
                    ? 'Watchlisted'
                    : response.status === 404
                        ? 'Add to Watchlist'
                        : 'Error';

                statuses[item.titleId] = status;
            } catch (error) {
                console.error('Error fetching watchlist status:', error);
                statuses[item.titleId] = 'Error'; // Set status to 'Error' if any error occurs
            }
        }
        setWatchlistStatuses(statuses); // Set the watchlist statuses for all items
        setWatchlistFetched(true); // Say that watchlist data is fetched
    };

    // Add item (movie/series/epi) to watchlist
    const handleAddToWatchlist = async (itemId, titleType) => {
        if (!user || !token) {
            setWatchlistStatuses((prevStatuses) => ({
                ...prevStatuses,
                [itemId]: 'You need to be logged in to add to watchlist.',
            }));
            return;
        }

        // Determine the endpoint based on the title type
        const endpoint = titleType === 'movie'
            ? 'movie'
            : titleType === 'series'
                ? 'series'
                : 'episode';

        const watchlistData = {
            userId: user.id,
            [`${titleType}Id`]: itemId, // Use itemId with the correct type
        };

        try {
            const response = await fetch(`https://localhost/api/user/watchlist/${endpoint}`, {
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
                    [itemId]: 'Watchlisted', // Update status to 'Watchlisted'
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

    // Remove item (movie/series/epi) from watchlist
    const handleRemoveFromWatchlist = async (itemId, titleType) => {
        if (!user || !token) {
            setWatchlistStatuses((prevStatuses) => ({
                ...prevStatuses,
                [itemId]: 'You need to be logged in to remove from watchlist.',
            }));
            return;
        }

        // Determine the endpoint based on the title type
        const endpoint = titleType === 'movie'
            ? `movie/${itemId}`
            : titleType === 'series'
                ? `series/${itemId}`
                : `episode/${itemId}`;

        try {
            const response = await fetch(`https://localhost/api/user/${user.id}/watchlist/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // If the item is removed successfully, update the status to 'Add to Watchlist'
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

    // Fetch the watchlist status only for the item that the user interacts with
    const fetchWatchlistStatusForItem = async (itemId, titleType) => {
        if (!user || !token || fetchingStatusFor === itemId) return; // Don't refetch if already fetching

        setFetchingStatusFor(itemId); // Mark the item whose status we are fetching

        // Determine the endpoint based on the title type
        const endpoint = titleType === 'movie'
            ? `movie/${itemId}`
            : titleType === 'series'
                ? `series/${itemId}`
                : `episode/${itemId}`;

        try {
            const response = await fetch(`https://localhost/api/user/${user.id}/watchlist/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Set the status to 'Watchlisted' if the item is in the watchlist
            const status = response.ok
                ? 'Watchlisted'
                : response.status === 404
                    ? 'Add to Watchlist'
                    : 'Error';

            setWatchlistStatuses((prevStatuses) => ({
                ...prevStatuses,
                [itemId]: status,
            }));
        } catch (error) {
            console.error('Error fetching watchlist status for item:', error);
            setWatchlistStatuses((prevStatuses) => ({
                ...prevStatuses,
                [itemId]: 'Error',
            }));
        } finally {
            setFetchingStatusFor(null); // Reset fetching flag
        }
    };

    // Helper function to chunk data
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
        <div>
            <h2>Top of the Week</h2>
            <Carousel indicators={false} interval={null} className='carousel'>
                {groupedData.map((group, groupIndex) => (
                    <Carousel.Item key={groupIndex}>
                        <div className="d-flex justify-content-center">
                            {group.map((item, index) => (
                                <div key={index} className="poster-item mx-2">
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
                                                    className='poster-image'
                                                    variant="top"
                                                    src={item.poster}
                                                    alt={item.title}
                                                    onClick={() => handleClick(item.titleType, item.titleId)}
                                                />
                                            ) : (
                                                <Card.Img
                                                    className='default-image'
                                                    variant="top"
                                                    src={Logo}
                                                    alt="Poster not available"
                                                    onClick={() => handleClick(item.titleType, item.titleId)}
                                                />
                                            )}
                                        </div>
                                        <Card.Body>
                                            <p className="text-center">IMDb rating: {item.imdbRating}</p>
                                            <p className="text-center">OMGDB rating: {item.averageRating}</p>
                                            <h6 className="text-center mt-2">{item.title}</h6>

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

export default TopWeekly;