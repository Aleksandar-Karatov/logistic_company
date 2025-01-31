import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

function Navigation({ userRole }) {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Logistics Company</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>

                        {/* Conditionally render links based on user role */}
                        {userRole === 'employee' && (
                            <>
                                <Nav.Link as={NavLink} to="/companies">Companies</Nav.Link>
                                <Nav.Link as={NavLink} to="/employees">Employees</Nav.Link>
                                <Nav.Link as={NavLink} to="/offices">Offices</Nav.Link>
                                <Nav.Link as={NavLink} to="/clients">Clients</Nav.Link>
                                <Nav.Link as={NavLink} to="/packages">Packages</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-package">Create Package</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-company">Create Company</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-employee">Create Employee</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-office">Create Office</Nav.Link>
                            </>
                        )}

                        {userRole === 'client' && (
                            <>
                                <Nav.Link as={NavLink} to="/packages">Packages</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;