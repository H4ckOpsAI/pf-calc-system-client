import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ManagePF = () => {
    const [staffPF, setStaffPF] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllStaff = async () => {
            try {
                const res = await api.get('/pf/all');
                setStaffPF(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch staff PF structure');
            } finally {
                setLoading(false);
            }
        };

        fetchAllStaff();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Staff Ledger...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">Manage PF (Ledger View)</h1>
            
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="w-full text-left bg-white">
                    <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider border-b">
                        <tr>
                            <th className="px-6 py-4">Employee ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Scheme</th>
                            <th className="px-6 py-4">Current PF Balance</th>
                            <th className="px-6 py-4">Last Mth Contribution</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {staffPF.map(emp => (
                            <tr key={emp._id} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm">{emp.employeeId}</td>
                                <td className="px-6 py-4 font-semibold text-gray-800">{emp.name}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{emp.department || 'N/A'}</td>
                                <td className="px-6 py-4 font-bold text-blue-600 text-sm">{emp.pfScheme}</td>
                                <td className="px-6 py-4 font-bold text-green-700">₹{emp.currentBalance?.toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600">₹{emp.lastContribution?.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <button className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition" onClick={() => alert('View Details functionality pending.')}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagePF;
