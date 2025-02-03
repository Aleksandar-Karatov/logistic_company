import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { getAuthHeaders, getApiUrl } from './utils';

function CourierPackageList({ userId }) {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = getApiUrl();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/package/employee/${userId}`, { headers: getAuthHeaders() });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const remappedPackages = data.map(pkg => ({
                    ...pkg,
                    sender: pkg.sender_navigation || pkg.sender,
                    receiver: pkg.receiver_navigation || pkg.receiver,
                    officeAcceptedAt: pkg.office_accepted_at_navigation || pkg.officeAcceptedAt,
                    officeDeliveredAt: pkg.office_delivered_at_navigation || pkg.officeDeliveredAt,
                    company: pkg.company_navigation || pkg.company,
                    deliveryLocation: pkg.delivery_location || pkg.deliveryLocation,
                }));

                setPackages(remappedPackages);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId && apiUrl) { // Check if userId and apiUrl exist
            fetchPackages();
        } else {
            setLoading(false); // Set loading to false if userId or apiUrl is missing
        }

    }, [userId, apiUrl]); // userId and apiUrl are dependencies


    if (loading) {
        return <div className="d-flex justify-content-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div>
            <h2>Courier Packages</h2>
            {packages.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Weight</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>Delivery Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(pkg => (
                            <tr key={pkg.id}>
                                <td>{pkg.id}</td>
                                <td>{pkg.weight}</td>
                                <td>{pkg.sender?.name}</td>
                                <td>{pkg.receiver?.name}</td>
                                <td>{pkg.deliveryLocation}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No packages found for this courier.</p>
            )}
        </div>
    );
}

export default CourierPackageList;