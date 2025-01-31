// src/components/OfficeList.js
import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';
import { Link } from 'react-router-dom';

function OfficeList({ offices }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [officesData, setOfficesData] = useState(offices || []);
    const apiUrl = getApiUrl();
    useEffect(() => {
        if (!offices) {
            const fetchOffices = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${apiUrl}/api/v1/office`, { headers: getAuthHeaders() });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setOfficesData(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchOffices();
        } else {
            setOfficesData(offices);
        }
    }, [offices,apiUrl]);

    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Office List</h2>
            <Link to="/create-office" className="btn btn-primary mb-3">Create Office</Link>
            {officesData.length > 0? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Location</th>
                            <th>Company</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {officesData.map(office => (
                            <tr key={office.id}>
                                <td>{office.id}</td>
                                <td>{office.location}</td>
                                <td>{office.company?.name}</td>
                                <td>
                                    <Button variant="primary" size="sm" as={Link} to={`/offices/${office.id}`}>Edit</Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => {/* Implement delete logic */ }}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ): (
                <p>No offices found.</p>
            )}
        </div>
    );
}

export default OfficeList;