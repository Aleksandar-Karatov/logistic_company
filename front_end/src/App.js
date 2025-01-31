import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { AuthProvider } from './components/authContext';
import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom';
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

                if (userRole === 'employee' || userRole === 'admin') {
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

                        {/* General/Shared Routes (Accessible to all authenticated users) */}
                        <Route path="/" element={<Navigate to="/packages" />} /> {/* Redirect to /packages */}
                        <Route path="/packages" element={
                            <PrivateRoute isAuthenticated={isAuthenticated}>
                                <PackageList userRole={userRole} />
                            </PrivateRoute>
                        } />

                        {/* Admin Routes */}
                        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={['admin']} />}>
                            <Route path="/companies" element={<CompanyList companies={companies} userRole={userRole} />} />
                            <Route path="/create-company" element={<CreateCompanyForm />} />
                            <Route path="/company/:companyId/employees" element={<EmployeeListByCompany />} />
                            <Route path="/employees" element={<EmployeeList userRole={userRole} />} />
                            <Route path="/create-employee" element={<CreateEmployeeForm companies={companies} offices={offices} />} />
                            <Route path="/offices" element={<OfficeList offices={offices} />} />
                            <Route path="/create-office" element={<CreateOfficeForm companies={companies} />} />
                            <Route path="/clients" element={<ClientList clients={clients} />} />
                            <Route path="/create-client" element={<CreateClientForm companies={companies} />} />
                        </Route>

                        {/* Employee Routes */}
                        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={['employee']} />}>
                            <Route path="/create-package" element={<CreatePackageForm companies={companies} clients={clients} offices={offices} employees={employees} />} />
                            <Route path="/employees" element={<EmployeeList userRole={userRole} />} /> {/* Keep this if employees can see other employees */}
                        </Route>

                        {/* Client Routes */}
                        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} allowedRoles={['client']} />}>
                            <Route path="/client-packages" element={<ClientPackageTables userRole={userRole} userId={userId} />} /> {/* More descriptive path */}
                        </Route>

                    </Routes>
                </Container>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;