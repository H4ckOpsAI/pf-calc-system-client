import React from 'react';
import { Link } from 'react-router-dom';

const PayrollDashboard = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payroll Dashboard</h1>
            <p className="text-gray-600">Welcome to the Payroll Officer Dashboard.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Upload Wages</h2>
                    <p className="text-gray-500 mb-4">Upload monthly wage data via Excel.</p>
                    <Link to="/payroll/upload" className="bg-blue-600 text-white px-4 py-2 rounded inline-block">Go to Upload</Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Process PF</h2>
                    <p className="text-gray-500 mb-4">Calculate and finalize PF records.</p>
                    <Link to="/payroll/process" className="bg-green-600 text-white px-4 py-2 rounded inline-block">Go to Process</Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Manage PF Requests</h2>
                    <p className="text-gray-500 mb-4">Review and approve override/withdrawal requests.</p>
                    <Link to="/payroll/manage-pf" className="bg-purple-600 text-white px-4 py-2 rounded inline-block">Manage Requests</Link>
                </div>
            </div>
        </div>
    );
};

export default PayrollDashboard;
