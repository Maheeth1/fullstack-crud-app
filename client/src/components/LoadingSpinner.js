import React from 'react';

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center p-8">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
    );
}

export default LoadingSpinner;