import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CompanyList from './components/CompanyList';
import CreateClientForm from './components/CreateClientForm'; // Add this line
import CreateEmployeeForm from './components/CreateEmployeeForm';
import CreatePackageForm from './components/CreatePackageForm';
import PackageList from './components/PackageList';
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import {getApiUrl, getAuthHeaders } from './components/utils';
import ClientPackageTables from './components/ClientPackageTables';
import EmployeeList from './components/EmployeeList';
import OfficeList from './components/OfficeList';
import ClientList from './components/ClientList';
import CreateCompanyForm from './components/CreateCompanyForm';
import CreateOfficeForm from './components/CreateOfficeForm';

function App() {
    const [companies, setCompanies] = useState([]);
    const [clients, setClients] = useState([]);
    const [offices, setOffices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null); // Store user ID
    const apiUrl = getApiUrl();

    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        setIsAuthenticated(!!jwtToken);
    }, [jwtToken]);

    useEffect(() => {
        console.log("API URL inside handleSubmit:", apiUrl); // Log the URL *inside* handleSubmit
        const fetchData = async () => {
            try {
                if (!isAuthenticated) return; // Don't fetch if not authenticated

                const userInfoResponse = await fetch(`${apiUrl}/api/v1/user-info`, { headers: getAuthHeaders() });
                if (!userInfoResponse.ok) throw new Error("Failed to fetch user info");
                const userData = await userInfoResponse.json();
                setUserRole(userData.role);
                setUserId(userData.id); // Set user ID

                const fetchCalls = [];

                if (userRole === 'employee') {
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/company`, { headers: getAuthHeaders() }).then(res => res.json()));
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/client`, { headers: getAuthHeaders() }).then(res => res.json()));
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/office`, { headers: getAuthHeaders() }).then(res => res.json()));
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/employee`, { headers: getAuthHeaders() }).then(res => res.json()));
                } else if (userRole === 'client') {
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/client/${userId}`, { headers: getAuthHeaders() }).then(res => res.json())); // Fetch client data
                }

                const results = await Promise.all(fetchCalls);

                if (userRole === 'employee') {
                    setCompanies(results[0]);
                    setClients(results[1]);
                    setOffices(results[2]);
                    setEmployees(results[3]);
                } else if (userRole === 'client') {
                    setClients([results[0]]); // Set client data as an array
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, userRole, userId, apiUrl]); // Add userRole and userId to dependency array


    if (loading) return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <BrowserRouter>
            <Navigation userRole={userRole} /> {/* Pass userRole to Navigation */}
            <Container>
                <Routes>
                    <Route path="/" element={
                        isAuthenticated ? (
                            userRole === 'employee' ? (
                                <PackageList userRole={userRole} />
                            ) : userRole === 'client' ? (
                                <ClientPackageTables userRole={userRole} userId={userId} />
                            ) : null
                        ) : <Navigate to="/login" replace />
                    } />

                    {/* Employee Routes */}
                    {userRole === 'employee' && (
                        <>
                            <Route path="/companies" element={<CompanyList companies={companies} />} />
                            <Route path="/create-company" element={<CreateCompanyForm />} />
                            <Route path="/employees" element={<EmployeeList employees={employees} />} />
                            <Route path="/create-employee" element={<CreateEmployeeForm companies={companies} offices={offices} />} />
                            <Route path="/offices" element={<OfficeList offices={offices} />} />
                            <Route path="/create-office" element={<CreateOfficeForm companies={companies} />} />
                            <Route path="/clients" element={<ClientList clients={clients} />} />
                            <Route path="/create-client" element={<CreateClientForm companies={companies} />} />
                            <Route path="/packages" element={<PackageList userRole={userRole} />} />
                            <Route path="/create-package" element={<CreatePackageForm companies={companies} clients={clients} offices={offices} employees={employees} />} />
                        </>
                    )}

                    {/* Client Routes */}
                    {userRole === 'client' && (
                        <>
                            <Route path="/packages" element={<ClientPackageTables userRole={userRole} userId={userId} />} />
                        </>
                    )}

                    <Route path="/login" element={<LoginForm />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
}

export default App;