import React from 'react';

function AddressList({ addresses, onAddressDelete }) {
    if (addresses.length === 0) {
        return <p className="bg-white rounded-lg p-4 text-gray-500">No addresses found for this customer.</p>;
    }

    return (
        <div className="space-y-4">
            {addresses.map(address => (
                <div key={address.id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-800">{address.address_details}</p>
                        <p className="text-gray-600">{address.city}, {address.state} - {address.pin_code}</p>
                    </div>
                    <div className="flex gap-x-2">
                        <button onClick={() => onAddressDelete(address.id)} className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md transition duration-300">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AddressList;