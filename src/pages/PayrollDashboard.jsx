import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const PayrollDashboard = () => {
    const [pfRecords, setPfRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPFList = async () => {
            try {
                const response = await api.get('/pf-tax/all-details');
                const sorted = response.data.sort((a, b) => b.pf_amount - a.pf_amount);
                setPfRecords(sorted);
            } catch (error) {
                console.error("Error fetching PF records", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPFList();
    }, []);

    const maxPFRecord = pfRecords.length > 0 ? pfRecords[0] : null; // Sorted descending
    const minPFRecord = pfRecords.length > 0 ? pfRecords[pfRecords.length - 1] : null;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Payroll Dashboard</h1>
            <p className="text-gray-600">Welcome to the Payroll Officer Dashboard.</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
                    <h2 className="text-xl font-bold mb-2">Upload Wages</h2>
                    <p className="text-gray-500 mb-4">Upload monthly wage data via Excel.</p>
                    <Link to="/payroll/upload" className="bg-blue-600 text-white px-4 py-2 rounded inline-block hover:bg-blue-700">Go to Upload</Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                    <h2 className="text-xl font-bold mb-2">Process PF</h2>
                    <p className="text-gray-500 mb-4">Calculate and finalize PF records.</p>
                    <Link to="/payroll/process" className="bg-green-600 text-white px-4 py-2 rounded inline-block hover:bg-green-700">Go to Process</Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
                    <h2 className="text-xl font-bold mb-2">Manage PF Requests</h2>
                    <p className="text-gray-500 mb-4">Review and approve override/withdrawal requests.</p>
                    <Link to="/payroll/manage-pf" className="bg-purple-600 text-white px-4 py-2 rounded inline-block hover:bg-purple-700">Manage Requests</Link>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">PF Calculation Summary</h2>
                {loading ? (
                    <p className="text-gray-500">Loading PF stats...</p>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {pfRecords.length > 0 && (
                            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 border-b border-gray-200">
                                <div className="text-center md:text-left mb-4 md:mb-0">
                                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Maximum Cumulative PF</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        ₹{maxPFRecord.pf_amount.toLocaleString()} <span className="text-sm font-medium text-gray-500">({maxPFRecord.user_id?.name})</span>
                                    </p>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Minimum Cumulative PF</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        ₹{minPFRecord.pf_amount.toLocaleString()} <span className="text-sm font-medium text-gray-500">({minPFRecord.user_id?.name})</span>
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cumulative Total PF</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Bracket</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net PF</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pfRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No cumulative PF records found.</td>
                                        </tr>
                                    ) : (
                                        pfRecords.map((record) => (
                                            <tr key={record._id} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.user_id?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.user_id?.employeeId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">₹{record.pf_amount.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {record.tax_percentage === 0 ? (
                                                        <span className="text-gray-400 italic bg-gray-100 px-3 py-1 rounded border border-gray-200 shadow-inner inline-block min-w-[60px] text-center" title="No tax needed as PF is < 7L">&nbsp;</span>
                                                    ) : (
                                                        <span className="text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">₹{record.tax_amount.toLocaleString()} ({record.tax_percentage}%)</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                    ₹{record.net_pf.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollDashboard;
