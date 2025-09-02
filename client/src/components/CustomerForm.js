import React, { useState, useEffect } from 'react';

function CustomerForm({ initialData, onSubmit, isEditMode }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        addresses: [{ address_details: '', city: '', state: '', pin_code: '' }]
    });

    useEffect(() => {
        // Populate form if initialData is provided (for editing)
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        const newAddresses = [...formData.addresses];
        newAddresses[index][name] = value;
        setFormData(prev => ({ ...prev, addresses: newAddresses }));
    };

    const addAddress = () => {
        setFormData(prev => ({
            ...prev,
            addresses: [...prev.addresses, { address_details: '', city: '', state: '', pin_code: '' }]
        }));
    };
    
    const removeAddress = (index) => {
        const newAddresses = formData.addresses.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, addresses: newAddresses }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Pass the final form data to the parent handler
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
                <input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div>
                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
                <input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
            </div>
            <div>
                <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
                <input 
                    id="phone_number" 
                    name="phone_number" 
                    type="text" 
                    inputMode="numeric" 
                    pattern="[0-9]{10}" 
                    value={formData.phone_number} 
                    onChange={(e) => {
                        const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                        handleChange({
                            target: { name: "phone_number", value: onlyNums },
                        });
                    }} 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                    required 
                />
            </div>
            
            {!isEditMode && (
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Addresses</h3>
                    {formData.addresses.map((addr, index) => (
                        <div key={index} className="space-y-4 border p-4 rounded-lg mb-4 relative">
                            {formData.addresses.length > 1 && (
                                <button type="button" onClick={() => removeAddress(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold">&times;</button>
                            )}
                            <input name="address_details" value={addr.address_details} onChange={(e) => handleAddressChange(index, e)} placeholder="Address Details" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input name="city" value={addr.city} onChange={(e) => handleAddressChange(index, e)} placeholder="City" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                                <input name="state" value={addr.state} onChange={(e) => handleAddressChange(index, e)} placeholder="State" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" required />
                                <input 
                                    name="pin_code" 
                                    type="text" 
                                    inputMode="numeric" 
                                    pattern="[0-9]{6}" 
                                    value={addr.pin_code}
                                    onChange={(e) => {
                                        const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
                                        handleAddressChange(index, {
                                          target: { name: "pin_code", value: onlyNums },
                                        });
                                    }}
                                    placeholder="Pin Code" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addAddress} className="w-full text-blue-600 border border-blue-600 hover:bg-blue-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition">Add Another Address</button>
                </div>
            )}
            
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                {isEditMode ? 'Update Customer' : 'Save Customer'}
            </button>
        </form>
    );
}

export default CustomerForm;