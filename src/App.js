import React, {useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./components/AuthProvider";
import Login from "./pages/Login";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Persons from './pages/Persons';
import Title from './pages/Title';
import NoMatch from './pages/NoMatch';
import SignUp from "./pages/SignUp";
import MoviePage from "./pages/MoviePage";
import EpisodePage from "./pages/EpisodePage";
import SeriesPage from "./pages/SeriesPage";
import GenrePage from "./pages/GenrePage";
import PersonPage from "./pages/PersonPage";
import './App.css';
import TopWeekly from "./components/TopWeekly";
import PopluarCelebs from "./components/PopularCelebs";
import Watchlisted from "./components/Watchlisted";


function App() {
  useEffect(() => {
    // Set background color
    document.body.style.backgroundColor = "#333";
  }, []);

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              {/* Shared Layout for Protected Routes */}
              <Route
                element={
                  <>
                    <Navbar />
                    <Outlet />
                    <Footer />
                  </>
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/persons" element={<Persons />} />
                <Route path="/title" element={<Title />} />
                <Route path="/movie/:titleId" element={<MoviePage />} />
                <Route path="/episode/:titleId" element={<EpisodePage />} />
                <Route path="/series/:titleId" element={<SeriesPage />} />
                <Route path="/genre" element={<GenrePage />} />
                <Route path="/genre/:genrename" element={<GenrePage />} />
                <Route path="/person/:personId" element={<PersonPage />} />
                <Route path="/top-weekly" element={<TopWeekly/>} />
                <Route path="/popularcelebs" element={<PopluarCelebs/>} />
                <Route path="/watchlist" element={<Watchlisted/>} />
              </Route>
            </Route>

            {/* Catch-All Route */}
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;




  