import React, { useState, useEffect } from 'react';
import { Carousel, Button, Card, Modal } from 'react-bootstrap';
import Logo from '../assets/Omg_main_logo.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../components/AuthProvider";
import StarRating from "../components/StarRating";
import '../styles/TopWeekly.css';

const TopWeekly = () => {
    const [data, setData] = useState([]); // Store fetched data
    const [watchlistStatuses, setWatchlistStatuses] = useState({}); // Track watchlist status for each series/movie
    const [watchlistFetched, setWatchlistFetched] = useState(false); // Track if the watchlist data is fetched
    const [fetchingStatusFor, setFetchingStatusFor] = useState(null); // Track which item status is being fetched
    const [ratingStatuses, setRatingStatuses] = useState({}); // Track rating status for each item
    const [userRatings, setUserRatings] = useState({}); // Track user ratings for each item
    const [showModal, setShowModal] = useState(false); // Track if the modal is open
    const [selectedItem, setSelectedItem] = useState(null); // Item selected for rating
    const [rating, setRating] = useState(0); // User's selected rating
    const [ratingStatus, setRatingStatus] = useState(null); // Feedback message
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
                fetchUserRatingStatuses(data);


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
    // Fetch user's rating status for each item
    const fetchUserRatingStatuses = async (items) => {
        if (!user || !token) return;

        const statuses = {};
        // Loop through all items and fetch rating status for each
        for (let item of items) {
            const endpoint = item.titleType === 'movie'
                ? `movie/${item.titleId}`
                : item.titleType === 'series'
                    ? `series/${item.titleId}`
                    : `episode/${item.titleId}`;

            try {
                const response = await fetch(`https://localhost/api/user/${user.id}/ratings/${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json(); // Parse the JSON response
                    const rating = data.rating; // Extract the 'rating' value from the response

                    statuses[item.titleId] = `★ ${rating}`; // Display the rating value
                } else if (response.status === 404) {
                    statuses[item.titleId] = 'Rate'; // No rating exists
                } else {
                    statuses[item.titleId] = 'Error'; // Handle other response errors
                };
            } catch (error) {
                console.error('Error fetching rating status:', error);
                statuses[item.titleId] = 'Error'; // Set status to 'Error' if any error occurs
            }
        }
        setRatingStatuses(statuses); // Set the rating statuses for all items
    };

    // Handle rating submission
    const handleRatingSubmit = async () => {
        if (!user || !token) {
            setRatingStatus('You need to be logged in to rate.');
            return;
        }

        const endpoint = selectedItem.titleType === 'movie'
            ? 'movie'
            : selectedItem.titleType === 'series'
                ? 'series'
                : 'episode';

        const ratingData = {
            userId: user.id,
            [`${selectedItem.titleType}Id`]: selectedItem.titleId, // Use itemId with the correct type
            rating,
        };

        try {
            const response = await fetch(`https://localhost/api/user/ratings/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(ratingData),
            });

            if (response.ok) {
                setRatingStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [selectedItem.titleId]: `★ ${rating}`, // Update status to show the rating value
                }));
                setUserRatings((prevRatings) => ({
                    ...prevRatings,
                    [selectedItem.titleId]: rating, // Store user's rating
                }));
                setRatingStatus('Rating submitted successfully!');
            } else {
                const errorData = await response.json();
                setRatingStatus(`Failed to submit: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            setRatingStatus('Error submitting rating.');
        }
    };

    // Handle rating removal
    const handleRemoveRating = async () => {
        if (!user || !token) {
            setRatingStatus('You need to be logged in to remove rating.');
            return;
        }

        const endpoint = selectedItem.titleType === 'movie'
            ? `movie/${selectedItem.titleId}`
            : selectedItem.titleType === 'series'
                ? `series/${selectedItem.titleId}`
                : `episode/${selectedItem.titleId}`;

        try {
            const response = await fetch(`https://localhost/api/user/${user.id}/ratings/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setRatingStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [selectedItem.titleId]: 'Rate', // Update status to 'Rate'
                }));
                setUserRatings((prevRatings) => ({
                    ...prevRatings,
                    [selectedItem.titleId]: 0, // Remove user's rating
                }));
                setRatingStatus('Rating removed successfully!');
            } else {
                const errorData = await response.json();
                setRatingStatus(`Failed to remove rating: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error removing rating:', error);
            setRatingStatus('Error removing rating.');
        }
    };

    const handleUpdateRating = async (newRating) => {
        if (!user || !token) {
            setRatingStatus('You need to be logged in to update rating.');
            return;
        }
    
        const endpoint = selectedItem.titleType === 'movie'
            ? `movie/${selectedItem.titleId}`
            : selectedItem.titleType === 'series'
                ? `series/${selectedItem.titleId}`
                : `episode/${selectedItem.titleId}`;
    
        const ratingData = {
            userId: user.id,
            [`${selectedItem.titleType}Id`]: selectedItem.titleId, 
            rating: newRating, // Send the new rating value here
        };
    
        try {
            const response = await fetch(`https://localhost/api/user/${user.id}/ratings/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(ratingData), // Include the rating data in the body
            });
    
            if (response.ok) {
                setRatingStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [selectedItem.titleId]: `★ ${newRating}`, // Update the rating status with the new rating
                }));
                setUserRatings((prevRatings) => ({
                    ...prevRatings,
                    [selectedItem.titleId]: newRating, // Update user's rating in the state
                }));
                setRatingStatus(`Rating updated to ${newRating} stars!`);
            } else {
                const errorData = await response.json();
                setRatingStatus(`Failed to update rating: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating rating:', error);
            setRatingStatus('Error updating rating.');
        }
    };

    const fetchRatingStatusForItem = async (itemId, titleType) => {
        if (!user || !token || fetchingStatusFor === itemId) return;

        setFetchingStatusFor(itemId);

        const endpoint = titleType === 'movie'
            ? `movie/${itemId}`
            : titleType === 'series'
                ? `series/${itemId}`
                : `episode/${itemId}`;

        try {
            const response = await fetch(`https://localhost/api/user/${user.id}/ratings/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json(); // Fetch rating value from API response
                const userRating = data.rating;     // Assuming 'data.rating' holds the rating value

                setRatingStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [itemId]: `You rated ${userRating} stars`, // Show the rating value
                }));
            } else if (response.status === 404) {
                setRatingStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [itemId]: 'Rate', // No rating exists
                }));
            } else {
                setRatingStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [itemId]: 'Error',
                }));
            }
        } catch (error) {
            console.error('Error fetching rating status for item:', error);
            setRatingStatuses((prevStatuses) => ({
                ...prevStatuses,
                [itemId]: 'Error',
            }));
        } finally {
            setFetchingStatusFor(null);
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
    // Handle the modal open for rating
    const handleShowModal = (item) => {
        setSelectedItem(item);
        setRating(userRatings[item.titleId] || 0); // Set the rating in modal
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setRatingStatus(null);
    };

    return (
        <div>
            <h2>Top of the Week</h2>
            <Carousel indicators={false} interval={null} className='carousel'>
                {groupedData.map((group, groupIndex) => (
                    <Carousel.Item key={groupIndex}>
                        <div className="d-flex justify-content-center">
                            {group.map((item, index) => (
                                <div key={index} className="poster-item mx-2">
                                    <Card className='poster-card'>
                                        <div className="poster-container">
                                            {/* Watchlist Button Section */}
                                            {watchlistStatuses[item.titleId] === 'Watchlisted' ? (
                                                <button
                                                    className="poster-button-watchlisted"
                                                    onClick={() => handleRemoveFromWatchlist(item.titleId, item.titleType)}>
                                                    Watchlisted
                                                </button>
                                            ) : (
                                                <button
                                                    className="poster-button"
                                                    onClick={() => handleAddToWatchlist(item.titleId, item.titleType)}>
                                                    Add to Watchlist
                                                </button>
                                            )}
                                            {ratingStatuses[item.titleId]?.startsWith('★') ? (
                                                <button
                                                    className="rate-button-rated"
                                                    onClick={() => handleShowModal(item)}>
                                                    {ratingStatuses[item.titleId]} {/* Displays something like "★ 6" */}
                                                </button>
                                            ) : (
                                                <button
                                                    className="rate-button"
                                                    onClick={() => handleShowModal(item)}>
                                                    Rate
                                                </button>
                                            )}

                                            {item.poster ? (
                                                <Card.Img
                                                    className='poster-image'
                                                    variant="top"
                                                    src={item.poster}
                                                    alt={item.title}
                                                    onClick={() => handleClick(item.titleType, item.titleId)}
                                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <Card.Img
                                                    className='default-image'
                                                    variant="top"
                                                    src={Logo}
                                                    alt="Poster not available"
                                                    onClick={() => handleClick(item.titleType, item.titleId)}
                                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
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
            {/* Modal */}
            <Modal className="modal-view" show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header className="modal-view-header"  closeButton>
                    <Modal.Title>
                        {ratingStatuses[selectedItem?.titleId]?.startsWith('★')
                            ? 'Update Your Rating'
                            : `Rate: ${selectedItem?.title}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-view-body">
                    <StarRating value={rating} onChange={setRating} />
                </Modal.Body>
                <Modal.Footer className="modal-view-footer">
                    
                    {ratingStatuses[selectedItem?.titleId]?.startsWith('★') ? (
                        <>
                         <Button className='modal-button' onClick={() => handleUpdateRating(rating)}>
                         Update Rating
                       </Button>
                        <Button className='modal-remove-button' onClick={handleRemoveRating}>
                            Remove Rating
                        </Button>
                        </>
                    ) : (
                        <Button className='modal-button' onClick={handleRatingSubmit}>
                            Submit Rating
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TopWeekly;