import {useState, useEffect} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Persons from './pages/Persons';
import Title from './pages/Title';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
  
function App() {
const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem('isLoggedIn') === 'true';
});

useEffect(() => {
  localStorage.setItem('isLoggedIn', isLoggedIn);
}, [isLoggedIn]);

  return (
    <BrowserRouter>
{isLoggedIn && <Navbar />}
    <Routes>
      {isLoggedIn ? (
        <>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/persons" element={<Persons />} />
      <Route path="/title" element={<Title />} />
      <Route path="*" element={<NoMatch/>} />
      </>
      ) : (
        <>
        <Route path="/login" element={<Login onLogin={()=>setIsLoggedIn(true)} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        </>
        
      )
      }
    </Routes>
    {isLoggedIn && <Footer />}
  </BrowserRouter>
  );
}

export default App;
