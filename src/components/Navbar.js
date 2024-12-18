import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import Logo from '../assets/Omg_main_logo.svg';
import '../styles/Navbar.css';
import { useAuth } from "./AuthProvider";





function NavBar() {

  
  const { user, logOut } = useAuth(); // Access logOut from AuthProvider

  const handleLogout = () => {
    logOut(); // Call the logOut function from AuthContext
  };

  return (
    <Navbar expand="lg" className='navbar-expand-lg'>
      <Container fluid>
        <Nav className='d-flex'>
          <Navbar.Brand href="/">
            <Image className="Logo" src={Logo} alt="OMGDB Logo" />
          </Navbar.Brand>

          <NavDropdown title="Menu" className="cusnav">
            <NavDropdown.Item href="/title">Movie</NavDropdown.Item>
            <NavDropdown.Item href="/title">Series</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/persons">Actors</NavDropdown.Item>
            <NavDropdown.Item href="/top-weekly">Top Weekly</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Form className="d-flex input-group me-2 small-searchbar">
          <Form.Control
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <Button variant="outline-dark" className='custom-button'>Search</Button>
        </Form>
        <Nav>
          <Navbar.Toggle className='hamburger' />
          <Navbar.Collapse >
            <Nav.Link href="/" className='cusnavRight'>Home</Nav.Link>
            <NavDropdown title={user && user.name ? user.name : 'Guest'} className='cusnav'>
              <Nav.Link onClick={handleLogout} className='logout-link'>Log out</Nav.Link>
            </NavDropdown>
          </Navbar.Collapse>
        </Nav>
      </Container>
    </Navbar>


  );
}
export default NavBar;
/*
function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">
        <Image className="Logo" src={Logo} alt="OMGDB Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link onClick={handleLogout}>Log out</Nav.Link>
            <NavDropdown title="Menu" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/title">Movie</NavDropdown.Item>
              <NavDropdown.Item href="/title">Series</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/persons">Actors</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
*/




/*
import React, { useState } from 'react';
import logo from '../assets/Omg_main_logo.svg';
import '../styles/Navbar.css';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className='navbar'>
      <div className='leftSide'>
        <a href="/"><img src={logo} alt='OMGDB Logo' /></a>
        <div 
          className='dropdown' 
          onMouseEnter={toggleDropdown} 
          onMouseLeave={toggleDropdown}
        >
          <button className='dropdownButton'>Menu</button>
          {dropdownOpen && (
            <div className='dropdownContent'>
              <a href="/Title">Movies</a>
              <a href="/Title">Series</a>
              <a href="/Persons">Actors</a>
            </div>
          )}
        </div>
      </div>
      <div className='center'>
        <input className='searchbar' type='text' placeholder='Search OMGDB' />
      </div>
      <div className='rightSide'>
        <button className='watchlist'>Watchlist</button>
        <button className='signin'>Sign In</button>
        </div>
      </div>
  );
}

export default Navbar;
*/
