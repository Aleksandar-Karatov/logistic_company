import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CompanyList from './components/CompanyList';
import CreateEmployeeForm from './components/CreateEmployeeForm';
import CreatePackageForm from './components/CreatePackageForm';
import PackageList from './components/PackageList';
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import { getAuthHeaders } from './components/utils'; // Import auth utils

function App() {
    const [companies, setCompanies] = useState([]);
    const [clients, setClients] = useState([]);
    const [offices, setOffices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken')); // Check auth on mount

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientsResponse = await fetch('/api/v1/client', { headers: getAuthHeaders() });
                if (!clientsResponse.ok) throw new Error("Failed to fetch clients");
                const clientsData = await clientsResponse.json();
                setClients(clientsData);

                const officesResponse = await fetch('/api/v1/office', { headers: getAuthHeaders() });
                if (!officesResponse.ok) throw new Error("Failed to fetch offices");
                const officesData = await officesResponse.json();
                setOffices(officesData);

                const employeesResponse = await fetch('/api/v1/employee', { headers: getAuthHeaders() });
                if (!employeesResponse.ok) throw new Error("Failed to fetch employees");
                const employeesData = await employeesResponse.json();
                setEmployees(employeesData);

                const companiesResponse = await fetch('/api/v1/company', { headers: getAuthHeaders() });
                if (!companiesResponse.ok) throw new Error("Failed to fetch companies");
                const companiesData = await companiesResponse.json();
                setCompanies(companiesData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('jwtToken')); // Update auth status when token changes
    }, [localStorage.getItem('jwtToken')]); // Add localStorage.getItem as dependency

    const PrivateRoute = ({ children }) => {
        return isAuthenticated ? children : <Navigate to="/login" />;
    };

    if (loading) return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Router>
            <Navigation />
            <Container>
                <Routes>
                    <Route path="/" element={<PrivateRoute><PackageList userRole={isAuthenticated ? 'employee' : 'client'} senderId={clients.find(c => c.email === localStorage.getItem('userEmail'))?.id} /></PrivateRoute>} />
                    <Route path="/packages" element={<PrivateRoute><PackageList userRole={isAuthenticated ? 'employee' : 'client'} senderId={clients.find(c => c.email === localStorage.getItem('userEmail'))?.id} /></PrivateRoute>} />
                    <Route path="/create-package" element={<PrivateRoute><CreatePackageForm companies={companies} clients={clients} offices={offices} employees={employees} /></PrivateRoute>} />
                    <Route path="/companies" element={<PrivateRoute><CompanyList /></PrivateRoute>} />
                    <Route path="/create-employee" element={<PrivateRoute><CreateEmployeeForm companies={companies} offices={offices} /></PrivateRoute>} />
                    <Route path="/login" element={<LoginForm />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;