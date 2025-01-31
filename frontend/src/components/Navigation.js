import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navigation() {
    const isAuthenticated = !!localStorage.getItem('jwtToken'); // Check if a token exists

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Logistics Company</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/packages">Packages</Nav.Link>
                        <Nav.Link as={Link} to="/create-package">Create Package</Nav.Link>
                        <Nav.Link as={Link} to="/companies">Companies</Nav.Link>
                        <Nav.Link as={Link} to="/create-employee">Create Employee</Nav.Link>

                         {/* Conditionally render Login/Logout */}
                        {isAuthenticated ? (
                            <Nav.Link as={Link} to="/logout" onClick={() => {
                                localStorage.removeItem('jwtToken'); // Clear token
                                window.location.href = '/'; // Force a full page reload to update context
                            }}>Logout</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;