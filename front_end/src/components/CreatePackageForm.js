import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { getApiUrl, getAuthHeaders } from './utils';

function CreatePackageForm({ employees, clients, offices, companies }) {
    const [senderID, setSenderID] = useState('');
    const [receiverID, setReceiverID] = useState('');
    const [weight, setWeight] = useState('');
    const [isDeliveredToOffice, setIsDeliveredToOffice] = useState(false);
    const [deliveryStatus, setDeliveryStatus] = useState('Pending');
    const [registeredByID, setRegisteredByID] = useState('');
    const [courrierID, setCourrierID] = useState('');
    const [officeAcceptedAtID, setOfficeAcceptedAtID] = useState('');
    const [deliveryLocation, setDeliveryLocation] = useState('');
    const [officeDeliveredAtID, setOfficeDeliveredAtID] = useState('');
    const [companyID, setCompanyID] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [destinationOffice, setDestinationOffice] = useState(null);
    const apiUrl = getApiUrl();

    const handleIsDeliveredToOfficeChange = (e) => {
        setIsDeliveredToOffice(e.target.checked);
        if (e.target.checked) {
            setDestinationOffice(offices && offices.find(office => office.id === officeDeliveredAtID));
        } else {
            setDestinationOffice(null);
        }
    };

    const handleOfficeDeliveredAtChange = (e) => {
        setOfficeDeliveredAtID(e.target.value);
        if (isDeliveredToOffice) {
            setDestinationOffice(offices && offices.find(office => office.id === e.target.value));
        }
    };

    const handleSelectChange = (event, setID) => {
        const selectedId = event.target.value;
        setID(selectedId);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${apiUrl}/api/v1/package`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    senderID: senderID,
                    receiverID: receiverID,
                    weight: parseFloat(weight),
                    isDeliveredToOffice: isDeliveredToOffice,
                    deliveryStatus: deliveryStatus,
                    registeredByID: registeredByID,
                    courrierID: courrierID,
                    officeAcceptedAtID: officeAcceptedAtID,
                    deliveryLocation: deliveryLocation,
                    officeDeliveredAtID: officeDeliveredAtID,
                    companyID: companyID,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            setSuccess(true);
            setSenderID('');
            setReceiverID('');
            setWeight('');
            setIsDeliveredToOffice(false);
            setDeliveryStatus('Pending');
            setRegisteredByID('');
            setCourrierID('');
            setOfficeAcceptedAtID('');
            setDeliveryLocation('');
            setOfficeDeliveredAtID('');
            setCompanyID('');
        } catch (error) {
            console.error("Error creating package:", error);
            setError(error.message);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Package created successfully!</Alert>}
    
            <Form.Group controlId="senderID">
                <Form.Label>Sender</Form.Label>
                <Form.Control as="select" value={senderID} onChange={(e) => handleSelectChange(e, setSenderID)}>
                    <option value="">Select Sender</option>
                    {clients && clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
    
            <Form.Group controlId="receiverID">
                <Form.Label>Receiver</Form.Label>
                <Form.Control as="select" value={receiverID} onChange={(e) => handleSelectChange(e, setReceiverID)}>
                    <option value="">Select Receiver</option>
                    {clients && clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
    
            <Form.Group controlId="weight">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                />
            </Form.Group>
    
            <Form.Group controlId="isDeliveredToOffice">
                <Form.Check
                    type="checkbox"
                    label="Delivered to Office"
                    checked={isDeliveredToOffice}
                    onChange={handleIsDeliveredToOfficeChange}
                />
            </Form.Group>
    
            <Form.Group controlId="deliveryStatus">
                <Form.Label>Delivery Status</Form.Label>
                <Form.Control as="select" value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                </Form.Control>
            </Form.Group>
    
            <Form.Group controlId="registeredByID">
                <Form.Label>Registered By</Form.Label>
                <Form.Control as="select" value={registeredByID} onChange={(e) => handleSelectChange(e, setRegisteredByID)}>
                    <option value="">Select Employee</option>
                    {employees && employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
    
            <Form.Group controlId="courrierID">
                <Form.Label>Courier</Form.Label>
                <Form.Control as="select" value={courrierID} onChange={(e) => handleSelectChange(e, setCourrierID)}>
                    <option value="">Select Courier</option>
                    {employees && employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
    
            <Form.Group controlId="officeAcceptedAtID">
                <Form.Label>Office Accepted At</Form.Label>
                <Form.Control as="select" value={officeAcceptedAtID} onChange={(e) => handleSelectChange(e, setOfficeAcceptedAtID)}>
                    <option value="">Select Office</option>
                    {offices && offices.map(office => (
                        <option key={office.id} value={office.id}>
                            {office.location}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
    
            <Form.Group controlId="officeDeliveredAtID">
                <Form.Label>Office Delivered At</Form.Label>
                <Form.Control as="select" value={officeDeliveredAtID} onChange={handleOfficeDeliveredAtChange}>
                    <option value="">Select Office</option>
                    {offices && offices.map(office => (
                        <option key={office.id} value={office.id}>
                            {office.location}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
    
            <Form.Group controlId="deliveryLocation">
                <Form.Label>Delivery Location</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter delivery location"
                    value={isDeliveredToOffice && destinationOffice ? destinationOffice.location : deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    required={!isDeliveredToOffice}
                    disabled={isDeliveredToOffice}
                />
            </Form.Group>
    
    
            <Form.Group controlId="companyID">
                <Form.Label>Company</Form.Label>
                <Form.Control as="select" value={companyID} onChange={(e) => handleSelectChange(e, setCompanyID)}>
                    <option value="">Select Company</option>
                    {companies && companies.map(company => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
    
            <Button variant="primary" type="submit">
                Create Package
            </Button>
        </Form>
    );
    
}

export default CreatePackageForm;