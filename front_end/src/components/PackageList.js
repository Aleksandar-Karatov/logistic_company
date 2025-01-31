import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';

function PackageList({ userRole }) {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = getApiUrl();
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/package`, { headers: getAuthHeaders() }); // Fetch all packages
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPackages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [apiUrl]); // Fetch packages once on component mount

    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Package List</h2>
            {packages.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Weight</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Delivery Address</th>
                            {/* Add other relevant columns */}
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(pkg => (
                            <tr key={pkg.id}>
                                <td>{pkg.id}</td>
                                <td>{pkg.weight}</td>
                                <td>{pkg.sender?.name}</td>
                                <td>{pkg.receiver?.name}</td>
                                <td>{pkg.deliveryAddress}</td>
                                {/* Add other table cells */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No packages found.</p>
            )}
        </div>
    );
}

export default PackageList;