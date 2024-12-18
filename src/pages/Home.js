import React from 'react';
import { Carousel, Container, Row, Col, Spinner } from 'react-bootstrap';
import '../styles/Home.css'; // Import the custom CSS
import TopWeekly from '../components/TopWeekly';
import PopluarCelebs from '../components/PopularCelebs';
import Watchlisted from '../components/Watchlisted';


const Home = () => {

  return (

    // Show top weekly movies and series
    

    <Container>
      {/* Featured Today Carousel */}
    <TopWeekly />

      {/* Actors Carousel */}
    
    <PopluarCelebs />

      {/* Movies Carousel */}
    <Watchlisted />

      {/* Series Carousel */}

    </Container>
  );
};

export default Home;