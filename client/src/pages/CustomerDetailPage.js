import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddressList from '../components/AddressList'; 
import AddressForm from '../components/AddressForm'; 
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

function CustomerDetailPage() {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchCustomerDetails = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/customers/${id}`);
            setCustomer(response.data.data);
        } catch (err) {
            setError('Failed to fetch customer details.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCustomerDetails();
    }, [fetchCustomerDetails]);

    const handleAddNewAddress = async (newAddress) => {
        try {
            await axios.post(`${API_URL}/customers/${id}/addresses`, newAddress);
            alert('New address added successfully!');
            setShowAddForm(false);
            fetchCustomerDetails(); // Refresh data
        } catch (err) {
            alert('Failed to add new address.');
        }
    };
    
    const handleAddressDelete = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await axios.delete(`${API_URL}/addresses/${addressId}`);
                alert('Address deleted successfully!');
                fetchCustomerDetails(); // Refresh data
            } catch (err) {
                alert('Failed to delete address.');
            }
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
    if (!customer) return <p className="text-center mt-8">No customer found.</p>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                    Back
                </button>
                <h2 className="text-3xl font-bold text-gray-800">{customer.first_name} {customer.last_name}</h2>
                <Link to={`/edit/${customer.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Edit Customer</Link>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h3>
                <p><strong className="font-medium text-gray-900">First Name:</strong> {customer.first_name}</p>
                <p><strong className="font-medium text-gray-900">Last Name:</strong> {customer.last_name}</p>
                <p><strong className="font-medium text-gray-900">Phone:</strong> {customer.phone_number}</p>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-gray-700">Addresses</h3>
                    <button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg text-sm">
                        {showAddForm ? 'Cancel' : '+ Add New Address'}
                    </button>
                </div>
                
                {showAddForm && <AddressForm customerId={id} onAddressAdded={handleAddNewAddress} />}
                
                <AddressList addresses={customer.addresses} onAddressDelete={handleAddressDelete} />
            </div>
        </div>
    );
}

export default CustomerDetailPage;