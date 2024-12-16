import React, { useState, useEffect } from 'react';
import { Carousel, Button, Card} from 'react-bootstrap'; // Import Carousel from React Bootstrap
import Logo from '../assets/Omg_main_logo.svg';
import '../styles/TopWeekly.css'; // Import the custom CSS
import { useNavigate } from 'react-router-dom';

const TopWeekly = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    // Fetch data from the API
    useEffect(() => {
        fetch('https://localhost/api/topweekly?pageSize=30&sortBy=imdbRating')
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Check data structure
                setData(data); // Set the entire array of items
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    if (data.length === 0) {
        return <div>Loading...</div>; // Show loading message if data is still being fetched
    }
    

    // Helper function to group data into chunks of 4
    const chunkData = (data, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            chunks.push(data.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const groupedData = chunkData(data, 5); // Group data into chunks of 4


    // Function to handle image click
    const handleClick = (titleType, titleId) => {
        if (titleType === 'movie') {
        navigate(`/movie/${titleId}`); // Navigate to the title page
        } else if (titleType === 'series') {
        navigate(`/series/${titleId}`); // Navigate to the series page
        } else if (titleType === 'episode') {
        navigate(`/episode/${titleId}`); // Navigate to the episode page
        }
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
                                    <Card >
                                        <div className="poster-container">
                                            <button className="poster-button" onClick={() => alert(`Watchlist ${item.title}`)}>
                                                Watchlist
                                            </button>
                                            {item.poster ? (
                                                <Card.Img className='poster-image'
                                                    variant="top"
                                                    src={item.poster}
                                                    alt={item.title}
                                                    onClick={() => handleClick(item.titleType, item.titleId)}
                                                

                                                />
                                            ) : (
                                                <Card.Img className='default-image'
                                                    variant="top"
                                                    src={Logo} // Fallback image in case poster is missing
                                                    alt="Poster not available"
                                                    onClick={() => handleClick(item.titleType, item.titleId)}
                                                />
                                            )}
                                        </div>
                                        <Card.Body>
                                            <p className="text-center">IMDb rating: {item.imdbRating}</p>
                                            <h6 className="text-center mt-2">{item.title}</h6>

                                            <Button className='rate-button'>Rate</Button>
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