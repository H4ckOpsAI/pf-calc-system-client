import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ManagePF = () => {
    const [staffPF, setStaffPF] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployeePF, setSelectedEmployeePF] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

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

    const handleViewDetails = async (employeeId) => {
        setIsModalOpen(true);
        setLoadingDetails(true);
        setSelectedEmployeePF(null);
        try {
            const res = await api.get(`/pf/${employeeId}`);
            setSelectedEmployeePF(res.data);
        } catch (err) {
            console.error('View Details Error:', err);
            alert('Failed to fetch detailed records.');
            setIsModalOpen(false);
        } finally {
            setLoadingDetails(false);
        }
    };

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
                                    <button 
                                        className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition" 
                                        onClick={() => handleViewDetails(emp.employeeId)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Employee PF Details</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition font-bold text-xl">&times;</button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto w-full">
                            {loadingDetails ? (
                                <div className="text-center text-gray-500 py-10 font-medium">Fetching secure records...</div>
                            ) : selectedEmployeePF && (
                                <div className="space-y-8 animate-fade-in">
                                    
                                    {/* SECTION 1: Employee Summary */}
                                    <section className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                                        <h3 className="text-sm uppercase font-bold text-blue-800 mb-4 tracking-wiider">Summary</h3>
                                        <div className="grid grid-cols-2 gap-4 text-lg">
                                            <div>
                                                <span className="text-gray-500 text-sm block">Employee ID</span>
                                                <span className="font-mono font-bold text-gray-800">{selectedEmployeePF.employeeId}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-sm block">Current Balance</span>
                                                <span className="font-bold text-green-700">₹{(selectedEmployeePF.pfRecords[0]?.cumulativeBalance || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </section>

                                    {/* SECTION 2: Monthly PF Table */}
                                    <section>
                                        <h3 className="text-sm uppercase font-bold text-gray-800 mb-3 border-b pb-2">Monthly Processing History</h3>
                                        {selectedEmployeePF.pfRecords.length === 0 ? (
                                            <p className="text-gray-400 text-sm italic">No records found.</p>
                                        ) : (
                                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                                                        <tr>
                                                            <th className="p-3">Period</th>
                                                            <th className="p-3 text-right">Emp Share</th>
                                                            <th className="p-3 text-right">Employer Share</th>
                                                            <th className="p-3 text-right text-blue-600">Total PF</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {selectedEmployeePF.pfRecords.map((rec) => (
                                                            <tr key={rec._id} className="hover:bg-gray-50">
                                                                <td className="p-3 font-semibold text-gray-700">{rec.month}/{rec.year}</td>
                                                                <td className="p-3 text-right">₹{rec.employeePF.toLocaleString()}</td>
                                                                <td className="p-3 text-right">₹{rec.employerPF.toLocaleString()}</td>
                                                                <td className="p-3 text-right font-bold text-blue-600">₹{rec.totalPF.toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </section>

                                    {/* SECTION 3: Overrides History */}
                                    <section>
                                        <h3 className="text-sm uppercase font-bold text-gray-800 mb-3 border-b pb-2">Overrides History</h3>
                                        {selectedEmployeePF.overrides.length === 0 ? (
                                            <p className="text-gray-400 text-sm italic">No contribution overrides explicitly requested.</p>
                                        ) : (
                                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-orange-50 text-orange-800 font-semibold border-b border-orange-100">
                                                        <tr>
                                                            <th className="p-3">Requirement</th>
                                                            <th className="p-3 text-right">Amount Threshold</th>
                                                            <th className="p-3 text-center">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {selectedEmployeePF.overrides.map((ov) => (
                                                            <tr key={ov._id} className="hover:bg-orange-50/30">
                                                                <td className="p-3 font-semibold text-gray-700 uppercase text-xs">{ov.type}</td>
                                                                <td className="p-3 text-right font-bold">₹{ov.amount.toLocaleString()}</td>
                                                                <td className="p-3 text-center">
                                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ov.status === 'approved' ? 'bg-green-100 text-green-700' : ov.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                        {ov.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </section>

                                    {/* SECTION 4: Withdrawals History */}
                                    <section>
                                        <h3 className="text-sm uppercase font-bold text-gray-800 mb-3 border-b pb-2">Withdrawals & Transfers</h3>
                                        {selectedEmployeePF.withdrawals.length === 0 ? (
                                            <p className="text-gray-400 text-sm italic">No extraction activity.</p>
                                        ) : (
                                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-red-50 text-red-800 font-semibold border-b border-red-100">
                                                        <tr>
                                                            <th className="p-3">Execution Type</th>
                                                            <th className="p-3 text-right">Deducted Bound</th>
                                                            <th className="p-3 text-center">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {selectedEmployeePF.withdrawals.map((wd) => (
                                                            <tr key={wd._id} className="hover:bg-red-50/30">
                                                                <td className="p-3 font-semibold text-gray-700 uppercase text-xs">{wd.type}</td>
                                                                <td className="p-3 text-right font-bold">₹{wd.amount.toLocaleString()}</td>
                                                                <td className="p-3 text-center">
                                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${wd.status === 'processed' ? 'bg-slate-200 text-slate-700' : wd.status === 'approved' ? 'bg-green-100 text-green-700' : wd.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                        {wd.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </section>
                                    
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePF;
