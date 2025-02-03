import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { AuthProvider } from './components/authContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CompanyList from './components/CompanyList';
import CreateClientForm from './components/CreateClientForm';
import CreateEmployeeForm from './components/CreateEmployeeForm';
import CreatePackageForm from './components/CreatePackageForm';
import PackageList from './components/PackageList';
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import { getApiUrl, getAuthHeaders } from './components/utils';
import ClientPackageTables from './components/ClientPackageTables';
import EmployeeList from './components/EmployeeList';
import OfficeList from './components/OfficeList';
import ClientList from './components/ClientList';
import CreateCompanyForm from './components/CreateCompanyForm';
import CreateOfficeForm from './components/CreateOfficeForm';
import PrivateRoute from './components/PrivateRoute';
import EmployeeListByCompany from './components/EmployeeListByCompany';
import CourierPackageList from './components/CourierPackageList';

function App() {
    const [companies, setCompanies] = useState([]);
    const [clients, setClients] = useState([]);
    const [offices, setOffices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [userId, setUserId] = useState(null);
    const apiUrl = getApiUrl();
    const [loadingUserRole, setLoadingUserRole] = useState(true);

    useEffect(() => {
        const handleStorageChange = () => {
            setUserRole(localStorage.getItem('userRole'));
            setIsAuthenticated(!!localStorage.getItem('jwtToken'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isAuthenticated) return;

                const userInfoResponse = await fetch(`${apiUrl}/api/v1/user-info`, { headers: getAuthHeaders() });
                if (!userInfoResponse.ok) {
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userEmail');
                    setIsAuthenticated(false);
                    setUserRole(null);
                    return;
                }
                const userData = await userInfoResponse.json();
                setUserRole(userData.role);
                setUserId(userData.id);

                const fetchCalls = [];

                if (userRole === 'employee' || userRole === 'admin' || userRole === 'courrier') {
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/company`, { headers: getAuthHeaders() }).then(res => res.json()));
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/client`, { headers: getAuthHeaders() }).then(res => res.json()));
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/office`, { headers: getAuthHeaders() }).then(res => res.json()));
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/employee`, { headers: getAuthHeaders() }).then(res => res.json()));
                } else if (userRole === 'client') {
                    fetchCalls.push(fetch(`${apiUrl}/api/v1/client/${userId}`, { headers: getAuthHeaders() }).then(res => res.json()));
                }

                const results = await Promise.all(fetchCalls);

                if (userRole === 'employee' || userRole === 'admin') {
                    setCompanies(results[0]);
                    setClients(results[1]);
                    setOffices(results[2]);
                    setEmployees(results[3]);
                } else if (userRole === 'client') {
                    setClients([results[0]]);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setLoadingUserRole(false);
            }
        };

        fetchData();
    }, [isAuthenticated, userRole, userId, apiUrl]);

    if (loading || loadingUserRole) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <AuthProvider>
            <BrowserRouter>
                <Navigation userRole={userRole} />
                <Container>
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/" element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                {userRole === 'admin' ? (
                                    <PackageList userRole={userRole} />
                                ) : userRole === 'employee' ? (
                                    <PackageList userRole={userRole} />
                                ) : userRole === 'client' ? (
                                    <ClientPackageTables userRole={userRole} userId={userId} />
                                ) : userRole === 'courrier'?(
                                    <CourierPackageList userRole={userRole} userId ={userId}/>
                                ) : null}
                            </PrivateRoute>
                        } />

                        <Route path="/packages" element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                {userRole === 'admin' ? (
                                    <PackageList userRole={userRole} />
                                ) : userRole === 'employee' ? (
                                    <PackageList userRole={userRole} />
                                ) : userRole === 'client' ? (
                                    <ClientPackageTables userRole={userRole} userId={userId} />
                                ) : userRole === 'courrier'?(
                                    <CourierPackageList userRole={userRole} userId ={userId}/>
                                ) : null}
                            </PrivateRoute>
                        } />

                        {}
                        {userRole === 'admin' && (
                            <>
                                <Route path="/companies" element={<PrivateRoute><CompanyList companies={companies} userRole={userRole} /></PrivateRoute>} />
                                <Route path="/create-company" element={<PrivateRoute><CreateCompanyForm /></PrivateRoute>} />
                                <Route path="/company/:companyId/employees" element={<PrivateRoute><EmployeeListByCompany /></PrivateRoute>} />
                                <Route path="/employees" element={<PrivateRoute><EmployeeList userRole={userRole} /></PrivateRoute>} />
                                <Route path="/create-employee" element={<PrivateRoute><CreateEmployeeForm companies={companies} offices={offices} /></PrivateRoute>} />
                                <Route path="/offices" element={<PrivateRoute><OfficeList offices={offices} /></PrivateRoute>} />
                                <Route path="/create-office" element={<PrivateRoute><CreateOfficeForm companies={companies} /></PrivateRoute>} />
                                <Route path="/clients" element={<PrivateRoute><ClientList clients={clients} /></PrivateRoute>} />
                                <Route path="/create-client" element={<PrivateRoute><CreateClientForm companies={companies} /></PrivateRoute>} />
                            </>
                        )}

                        {}
                        {userRole === 'employee' && (
                            <>
                                <Route path="/employees" element={<PrivateRoute><EmployeeList userRole={userRole} /></PrivateRoute>} />
                            </>
                        )}

                        <Route path="/create-package" element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <CreatePackageForm companies={companies} clients={clients} offices={offices} employees={employees} />
                            </PrivateRoute>
                        } />
                    </Routes>
                </Container>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;