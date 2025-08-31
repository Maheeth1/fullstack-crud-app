import React from 'react';
import { Link } from 'react-router-dom';

function CustomerList({ customers, loading, handleDelete }) {
    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (customers.length === 0) {
        return <div className="text-center p-4 bg-white rounded-lg shadow-md">No customers found.</div>;
    }

    return (
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
                    {customers.map(customer => (
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
    );
}

export default CustomerList;