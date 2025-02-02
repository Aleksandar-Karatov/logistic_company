import React, { useContext } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom'; 
import AuthContext from './authContext';
import { handleLogout, getApiUrl } from './utils'; 

function Navigation() {
    const { isLoggedIn, userRole, setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate(); 
    const apiUrl = getApiUrl();

    const handleLogoutNav = async () => {  
        try {
            await handleLogout(apiUrl);
            setIsLoggedIn(false);
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Logistics Company</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>

                        {userRole === 'admin' && (
                            <>
                                <Nav.Link as={NavLink} to="/packages">Packages</Nav.Link>
                                <Nav.Link as={NavLink} to="/companies">Companies</Nav.Link>
                                <Nav.Link as={NavLink} to="/employees">Employees</Nav.Link>
                                <Nav.Link as={NavLink} to="/offices">Offices</Nav.Link>
                                <Nav.Link as={NavLink} to="/clients">Clients</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-package">Create Package</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-company">Create Company</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-employee">Create Employee</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-office">Create Office</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-client">Create Client</Nav.Link>
                            </>
                        )}

                        {userRole === 'employee' && (
                            <>
                                <Nav.Link as={NavLink} to="/packages">Packages</Nav.Link>
                                <Nav.Link as={NavLink} to="/companies">Companies</Nav.Link>
                                <Nav.Link as={NavLink} to="/employees">Employees</Nav.Link>
                                <Nav.Link as={NavLink} to="/offices">Offices</Nav.Link>
                                <Nav.Link as={NavLink} to="/clients">Clients</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-package">Create Package</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-company">Create Company</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-employee">Create Employee</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-office">Create Office</Nav.Link>
                                <Nav.Link as={NavLink} to="/create-client">Create Client</Nav.Link>
                            </>
                        )}

                        {userRole === 'client' && (
                            <Nav.Link as={NavLink} to="/client-packages">Client Packages</Nav.Link>
                        )}

                        {isLoggedIn ? ( 
                            <Nav.Link onClick={handleLogoutNav}>Logout</Nav.Link>
                        ) : (
                            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;