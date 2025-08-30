// client/src/pages/CustomerDetailPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function CustomerDetailPage() {
    // State for customer data, loading, and errors
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the "Add Address" form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address_details: '',
        city: '',
        state: '',
        pin_code: '',
    });

    // Hooks for routing and getting URL parameters
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetches the latest customer details from the server
    const fetchCustomerDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/customers/${id}`);
            setCustomer(response.data.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch customer details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCustomerDetails();
    }, [fetchCustomerDetails]);

    // Handles changes in the new address form fields
    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    // Submits the new address to the backend
    const handleAddNewAddress = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!newAddress.address_details || !newAddress.city || !newAddress.state || !newAddress.pin_code) {
            alert('Please fill out all address fields.');
            return;
        }

        try {
            await axios.post(`${API_URL}/customers/${id}/addresses`, newAddress);
            alert('New address added successfully!');
            setShowAddForm(false); // Hide the form
            setNewAddress({ address_details: '', city: '', state: '', pin_code: '' }); // Reset form
            fetchCustomerDetails(); // Refresh the customer data to show the new address
        } catch (err) {
            alert('Failed to add new address.');
            console.error('Error adding address:', err);
        }
    };
    
    // Deletes an existing address
    const handleAddressDelete = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await axios.delete(`${API_URL}/addresses/${addressId}`);
                alert('Address deleted successfully!');
                fetchCustomerDetails(); // Refresh the customer data
            } catch (err) {
                alert('Failed to delete address.');
            }
        }
    };

    if (loading) return <p className="text-center mt-8">Loading customer details...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
    if (!customer) return <p className="text-center mt-8">No customer found.</p>;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header with Back Button */}
            <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
                <h2 className="text-3xl font-bold text-gray-800">{customer.first_name} {customer.last_name}</h2>
                <Link to={`/edit/${customer.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    Edit Customer
                </Link>
            </div>

            {/* Personal Info Card */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
                <p className="text-gray-600 mb-2"><strong className="font-medium text-gray-900">First Name:</strong> {customer.first_name}</p>
                <p className="text-gray-600 mb-2"><strong className="font-medium text-gray-900">Last Name:</strong> {customer.last_name}</p>
                <p className="text-gray-600"><strong className="font-medium text-gray-900">Phone:</strong> {customer.phone_number}</p>
            </div>

            {/* Addresses Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-gray-700">Addresses</h3>
                    <button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition duration-300">
                        {showAddForm ? 'Cancel' : '+ Add New Address'}
                    </button>
                </div>
                
                {/* Add New Address Form (Conditional) */}
                {showAddForm && (
                    <form onSubmit={handleAddNewAddress} className="bg-white p-4 mb-6 border border-gray-200 rounded-lg space-y-4">
                        <h4 className="text-lg font-medium text-gray-800">New Address Details</h4>
                        <input name="address_details" value={newAddress.address_details} onChange={handleNewAddressChange} placeholder="Address Details" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input name="city" value={newAddress.city} onChange={handleNewAddressChange} placeholder="City" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                            <input name="state" value={newAddress.state} onChange={handleNewAddressChange} placeholder="State" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                            <input name="pin_code" value={newAddress.pin_code} onChange={handleNewAddressChange} placeholder="Pin Code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                        </div>
                        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Address</button>
                    </form>
                )}

                {/* Existing Addresses List */}
                {customer.addresses.length > 0 ? (
                    <div className="space-y-4">
                        {customer.addresses.map(address => (
                            <div key={address.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{address.address_details}</p>
                                    <p className="text-gray-600">{address.city}, {address.state} - {address.pin_code}</p>
                                </div>
                                <div className="flex gap-x-2">
                                    <button onClick={() => handleAddressDelete(address.id)} className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md transition duration-300">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="bg-white rounded-lg p-4 text-gray-500">No addresses found for this customer.</p>
                )}
            </div>
        </div>
    );
}

export default CustomerDetailPage;