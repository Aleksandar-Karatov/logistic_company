// src/components/EmployeeList.js
import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';
import { Link } from 'react-router-dom';

function EmployeeList({ employees }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [employeesData, setEmployeesData] = useState(employees || []);
    const apiUrl = getApiUrl();
    useEffect(() => {
        if (!employees) {
            const fetchEmployees = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${apiUrl}/api/v1/employee`, { headers: getAuthHeaders() });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setEmployeesData(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchEmployees();
        } else {
            setEmployeesData(employees);
        }
    }, [employees,apiUrl]);

    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Employee List</h2>
            <Link to="/create-employee" className="btn btn-primary mb-3">Create Employee</Link>
            {employeesData.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Office</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeesData.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.phone}</td>
                                <td>{employee.company?.name}</td>
                                <td>{employee.office?.location}</td>
                                <td>
                                    <Button variant="primary" size="sm" as={Link} to={`/employees/${employee.id}`}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => {/* Implement delete logic */ }}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No employees found.</p>
            )}
        </div>
    );
}

export default EmployeeList;