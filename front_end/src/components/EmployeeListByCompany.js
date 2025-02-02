import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Spinner, Alert, Button } from 'react-bootstrap'; 
import { getApiUrl, getAuthHeaders } from './utils';

function EmployeeListByCompany() {
    const { id: companyId } = useParams(); 
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = getApiUrl();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${apiUrl}/api/v1/employee/company/${companyId}`, { 
                    headers: getAuthHeaders(),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error("Error fetching employees:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [companyId, apiUrl]); 

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Employees for Company {companyId}</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        {}
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}> {}
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            {}
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={() => navigate(-1)}>Go Back</Button> {}
        </div>
    );
}

export default EmployeeListByCompany;