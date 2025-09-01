import React, { useState } from 'react';

function AddressForm({ customerId, onAddressAdded }) {
    const [address, setAddress] = useState({
        address_details: '',
        city: '',
        state: '',
        pin_code: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddressAdded(address); // Pass the new address data to the parent
        // Reset form after submission
        setAddress({ address_details: '', city: '', state: '', pin_code: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 mb-6 border border-gray-200 rounded-lg space-y-4">
            <h4 className="text-lg font-medium text-gray-800">New Address Details</h4>
            <input name="address_details" value={address.address_details} onChange={handleChange} placeholder="Address Details" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="city" value={address.city} onChange={handleChange} placeholder="City" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                <input name="state" value={address.state} onChange={handleChange} placeholder="State" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                <input name="pin_code" type="text" inputMode="numeric" maxLength="6" value={address.pin_code}
                    onChange={(e) => {
                        const onlyNums = e.target.value.replace(/[^0-9]/g, ""); // keep only digits
                        handleChange({
                        target: { name: "pin_code", value: onlyNums },
                        });
                    }}
                    placeholder="Pin Code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    required
                />

            </div>
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Address</button>
        </form>
    );
}

export default AddressForm;