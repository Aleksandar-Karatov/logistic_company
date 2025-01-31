import React, { useState, useEffect, useCallback } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';

function EmployeeList({ userRole }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiUrl = getApiUrl();

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/api/v1/employee`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);  // getAuthHeaders removed from dependency array

    useEffect(() => {
        if (userRole === 'admin' || userRole === 'employee') {
            fetchEmployees();
        } else {
            setLoading(false);
            setError("You are not authorized to view this list.");
        }
    }, [userRole, fetchEmployees]);

    const handleRefreshClick = () => {
        if (userRole === 'admin' || userRole === 'employee') {
            fetchEmployees();
        }
    };

    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return (
            <>
                <Alert variant="danger">{error}</Alert>
                {(userRole === 'admin' || userRole === 'employee') && (
                    <Button onClick={handleRefreshClick}>Refresh Employees</Button>
                )}
            </>
        );
    }

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Company ID</th>
                        <th>Office ID</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phone}</td>
                            <td>{employee.role}</td>
                            <td>{employee.companyId}</td>
                            <td>{employee.officeId}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {(userRole === 'admin' || userRole === 'employee') && (
                <Button onClick={handleRefreshClick}>Refresh Employees</Button>
            )}
        </>
    );
}

export default EmployeeList;