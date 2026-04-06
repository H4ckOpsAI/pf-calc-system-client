import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
            <p className="text-lg text-gray-700 mb-6">You do not have permission to view this page.</p>
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Go to Dashboard
            </Link>
        </div>
    );
};

export default Unauthorized;
