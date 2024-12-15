import React from "react";
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
import './App.css';




function App() {
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




  