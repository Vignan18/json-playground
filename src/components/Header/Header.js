import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaGithub, FaInfo } from 'react-icons/fa';
import logo from '../../assets/favicon.png';
import './header.css'; // Import your custom CSS file

const Header = () => {
  const [selected, setSelected] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setSelected(location.pathname);
  }, [location]);

  const handleClick = (path) => {
    setSelected(path);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand>
        <Image src={logo} alt="Logo" height="30" className="d-inline-block align-top" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/parse" onClick={() => handleClick('/parse')} className={`custom-nav-link ${selected === '/parse' ? 'active' : ''}`}>Parse</Nav.Link>
          <Nav.Link as={Link} to="/compare" onClick={() => handleClick('/compare')} className={`custom-nav-link ${selected === '/compare' ? 'active' : ''}`}>Compare</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link className='social-icon' href="https://github.com/gaurav-7-7/json-playground" target="_blank" rel="noopener noreferrer">
            <FaGithub size={25} />
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
