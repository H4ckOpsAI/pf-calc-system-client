import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MyPF = () => {
    const [pfData, setPfData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyPF = async () => {
            try {
                const res = await api.get('/pf/my');
                setPfData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch PF data');
            } finally {
                setLoading(false);
            }
        };

        fetchMyPF();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading PF Details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (!pfData) return <div className="p-8 text-center text-gray-500">No PF Data Found</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">My Provident Fund</h1>

            {/* Employee Summary Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">{pfData.name}</h2>
                        <p className="opacity-90 font-medium">{pfData.designation}</p>
                        <p className="opacity-75 text-sm">Employee ID: {pfData.employeeId}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20">
                        <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">Total Contribution</p>
                        <p className="text-3xl font-bold mt-1">₹ {pfData.totalContribution?.toLocaleString()}</p>
                    </div>
                    <div>
                        <span className="inline-block px-4 py-2 bg-white text-blue-700 rounded-lg font-bold text-sm shadow-sm">
                            Scheme: {pfData.pfScheme}
                        </span>
                    </div>
                </div>
            </div>

            {/* PF Records Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">Use this table to view your monthly breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Period</th>
                                <th className="px-6 py-4 font-semibold">Basic Pay</th>
                                <th className="px-6 py-4 font-semibold">My Share</th>
                                <th className="px-6 py-4 font-semibold">Employer Share</th>
                                <th className="px-6 py-4 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pfData.records && pfData.records.length > 0 ? (
                                pfData.records.map((record) => (
                                    <tr key={record._id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                            {record.month}/{record.year}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            ₹ {record.basicPay?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-green-600 font-medium">
                                            ₹ {record.employeePF?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                                            ₹ {record.employerPF?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                            ₹ {record.totalPF?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                                        No contribution records found used.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyPF;
