import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm'; // Import the new component

const API_URL = 'http://localhost:5000/api';

function CustomerFormPage() {
    const [initialData, setInitialData] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            axios.get(`${API_URL}/customers/${id}`)
                .then(response => {
                    const { addresses, ...customerData } = response.data.data;
                    setInitialData(customerData); // We only edit customer details here
                })
                .catch(error => console.error("Error fetching customer data:", error));
        }
    }, [id, isEditMode]);

    const handleSubmit = async (formData) => {
        try {
            if (isEditMode) {
                await axios.put(`${API_URL}/customers/${id}`, formData);
                alert('Customer updated successfully!');
            } else {
                await axios.post(`${API_URL}/customers`, formData);
                alert('Customer created successfully!');
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving customer:', error);
            alert(`Error: ${error.response?.data?.error || 'Could not save customer.'}`);
        }
    };

    // Render loading state while fetching data for edit mode
    if (isEditMode && !initialData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{isEditMode ? 'Edit Customer' : 'Create New Customer'}</h2>
            <CustomerForm 
                initialData={initialData}
                onSubmit={handleSubmit}
                isEditMode={isEditMode}
            />
        </div>
    );
}

export default CustomerFormPage;