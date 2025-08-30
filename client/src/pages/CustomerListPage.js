// client/src/pages/CustomerListPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

function CustomerListPage() {
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({ search: '', city: '', state: '', pincode: '' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState({ sortBy: 'id', order: 'ASC' }); // State for sorting
    const [loading, setLoading] = useState(true);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const params = { ...filters, page, limit: 10, ...sort };
            const response = await axios.get(`${API_URL}/customers`, { params });
            setCustomers(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, page, sort]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ search: '', city: '', state: '', pincode: '' });
        setSort({ sortBy: 'id', order: 'ASC' });
        setPage(1);
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer? All associated addresses will also be removed.')) {
            try {
                await axios.delete(`${API_URL}/customers/${id}`);
                alert('Customer deleted successfully!');
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Failed to delete customer.');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Customer Management</h1>
            
            {/* Filter and Search Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search Name/Phone..." className="md:col-span-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <input name="city" value={filters.city} onChange={handleFilterChange} placeholder="City" className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <input name="state" value={filters.state} onChange={handleFilterChange} placeholder="State" className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                <button onClick={clearFilters} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">Clear</button>
            </div>
            
            {/* Customer Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Phone</th>
                            <th scope="col" className="px-6 py-3">Address Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center p-4">Loading...</td></tr>
                        ) : customers.map(customer => (
                            <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{customer.id}</td>
                                <td className="px-6 py-4">{customer.first_name} {customer.last_name}</td>
                                <td className="px-6 py-4">{customer.phone_number}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${customer.address_count > 1 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                      {customer.address_count > 1 ? `${customer.address_count} Addresses` : "Single Address"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    <Link to={`/customer/${customer.id}`} className="font-medium text-blue-600 hover:underline">View</Link>
                                    <Link to={`/edit/${customer.id}`} className="font-medium text-yellow-600 hover:underline">Edit</Link>
                                    <button onClick={() => handleDelete(customer.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
                <div className="flex gap-x-2">
                    <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CustomerListPage;