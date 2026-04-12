import React, { useEffect, useState } from 'react';
import api from '../services/api';

const PFRequests = () => {
    const [pendingActions, setPendingActions] = useState({ pendingOverrides: [], pendingWithdrawals: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await api.get('/actions/pending');
            setPendingActions(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch pending actions');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (endpoint, id) => {
        try {
            await api.post(`/actions/${endpoint}`, { id });
            setMsg(`Action completed successfully.`);
            fetchPending();
        } catch (err) {
            setMsg(err.response?.data?.message || 'Action failed.');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading pending requests...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">PF Requests Approval</h1>
            
            {msg && <div className="mb-4 p-4 text-center bg-blue-100 text-blue-800 font-bold rounded-xl">{msg}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contribution Overrides */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Pending Contribution Requests</h3>
                    {pendingActions.pendingOverrides.length === 0 ? (
                        <p className="text-gray-500 italic">No pending requests.</p>
                    ) : (
                        <ul className="space-y-4">
                            {pendingActions.pendingOverrides.map(o => (
                                <li key={o._id} className="p-4 border rounded-xl bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">{o.requestedBy?.name}</span>
                                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-bold uppercase">{o.type}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Amount Requested: <strong className="text-xl text-gray-800">₹{o.amount}</strong></p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAction('override/approve', o._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Approve</button>
                                        <button onClick={() => handleAction('override/reject', o._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Reject</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Withdrawals */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Pending Withdrawal Requests</h3>
                    {pendingActions.pendingWithdrawals.length === 0 ? (
                        <p className="text-gray-500 italic">No pending requests.</p>
                    ) : (
                        <ul className="space-y-4">
                            {pendingActions.pendingWithdrawals.map(w => (
                                <li key={w._id} className="p-4 border rounded-xl bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">{w.requestedBy?.name}</span>
                                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-bold uppercase">{w.type.split('-').join(' ')}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Amount Requested: <strong className="text-xl text-gray-800">₹{w.amount}</strong></p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAction('withdraw/approve', w._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Approve</button>
                                        <button onClick={() => handleAction('withdraw/reject', w._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Reject</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PFRequests;
