import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Persons from './pages/Persons';
import Title from './pages/Title';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/persons" element={<Persons />} />
      <Route path="/title" element={<Title />} />
      
    </Routes>
    <Footer />
  </BrowserRouter>
  );
}

export default App;
