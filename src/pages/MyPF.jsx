import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MyPF = () => {
    const [pfData, setPfData] = useState(null);
    const [actions, setActions] = useState({ overrides: [], withdrawals: [], repayments: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [overrideForm, setOverrideForm] = useState({ type: 'increase', amount: '' });
    const [withdrawForm, setWithdrawForm] = useState({ type: 'part-final', amount: '' });
    const [actionMsg, setActionMsg] = useState('');

    useEffect(() => {
        const fetchMyPF = async () => {
            try {
                const res = await api.get('/pf/my');
                setPfData(res.data);
                const actRes = await api.get('/actions/my-actions');
                setActions(actRes.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch PF data');
            } finally {
                setLoading(false);
            }
        };

        fetchMyPF();
    }, []);

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'processed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-yellow-100 text-yellow-800'; // pending
        }
    };

    const fetchActions = async () => {
        try {
            const actRes = await api.get('/actions/my-actions');
            setActions(actRes.data);
        } catch (err) { console.error(err); }
    };

    const handleOverrideSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/actions/override', overrideForm);
            setActionMsg('Override requested successfully!');
            fetchActions();
        } catch (err) {
            setActionMsg(err.response?.data?.message || 'Failed to submit override');
        }
    };

    const handleWithdrawSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/actions/withdraw', withdrawForm);
            setActionMsg('Withdrawal requested successfully!');
            fetchActions();
        } catch (err) {
            setActionMsg(err.response?.data?.message || 'Failed to submit withdrawal');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading PF Details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (!pfData) return <div className="p-8 text-center text-gray-500">No PF Data Found</div>;

    const latestPF = pfData?.records?.[0]; 
    const rate = pfData?.pfScheme === 'CPF' ? 0.10 : 0.06;
    const baseContribution = latestPF ? Math.round(latestPF.basicPay * rate) : 0;

    const activeOverride = actions.overrides.find(ov => ov.status === 'approved');
    const currentContribution = activeOverride ? activeOverride.amount : baseContribution;

    let increaseCount = 0;
    let decreaseCount = 0;
    actions.overrides.forEach(ov => {
        if (ov.type === 'increase' && ov.status !== 'rejected') increaseCount++;
        if (ov.type === 'decrease' && ov.status !== 'rejected') decreaseCount++;
    });

    const remainingIncreases = Math.max(0, 2 - increaseCount);
    const remainingDecreases = Math.max(0, 1 - decreaseCount);

    const canIncrease = remainingIncreases > 0;
    const canDecrease = remainingDecreases > 0 && increaseCount > 0;

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

            {/* Actions Form Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Override Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Contribution Override (Max 40k)</h3>
                    
                    <div className="bg-gray-50 p-4 border rounded-xl mb-4 text-sm font-semibold">
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-500">Base Contribution:</span>
                            <span className="text-gray-800">₹{baseContribution.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-3 border-b pb-3">
                            <span className="text-gray-500">Current Contribution:</span>
                            <span className="text-green-700 font-bold">₹{currentContribution.toLocaleString()}</span>
                        </div>
                        {overrideForm.amount && (
                            <div className="flex justify-between mb-3 border-b pb-3 bg-blue-50 -mx-4 px-4 py-2">
                                <span className="text-blue-800 font-bold">After {overrideForm.type === 'increase' ? 'Increase' : 'Decrease'}:</span>
                                <span className="text-blue-800 font-bold">
                                    ₹{(overrideForm.type === 'increase' ? currentContribution + Number(overrideForm.amount) : currentContribution - Number(overrideForm.amount)).toLocaleString()}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-xs">
                            <span className={canIncrease ? "text-blue-600" : "text-red-500"}>Remaining Increases: {remainingIncreases}</span>
                            <span className={canDecrease ? "text-blue-600" : "text-red-500"}>Remaining Decreases: {remainingDecreases}</span>
                        </div>
                    </div>

                    <form onSubmit={handleOverrideSubmit} className="space-y-4">
                        <select className="w-full px-4 py-2 border rounded-lg" value={overrideForm.type} onChange={e => setOverrideForm({...overrideForm, type: e.target.value})}>
                            <option value="increase" disabled={!canIncrease}>Increase Contribution</option>
                            <option value="decrease" disabled={!canDecrease}>Decrease Contribution</option>
                        </select>
                        <input 
                            type="number" 
                            placeholder={overrideForm.type === 'increase' ? 'Increase Amount (₹)' : 'Decrease Amount (₹)'} 
                            className="w-full px-4 py-2 border rounded-lg" 
                            required 
                            min="1"
                            value={overrideForm.amount} 
                            onChange={e => setOverrideForm({...overrideForm, amount: e.target.value})} 
                        />
                        
                        <button 
                            type="submit" 
                            disabled={(overrideForm.type === 'increase' && !canIncrease) || (overrideForm.type === 'decrease' && !canDecrease)}
                            className="w-full bg-blue-600 disabled:bg-gray-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Submit Override
                        </button>
                    </form>
                    
                    <h4 className="mt-8 font-bold text-gray-700">Override History</h4>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        {actions.overrides.map(o => (
                            <li key={o._id} className="py-2 border-b flex justify-between items-center">
                                <span><span className="uppercase font-bold">{o.type}</span> - ₹{o.amount}</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${getStatusColor(o.status)}`}>{o.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Withdrawal Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Request Withdrawal</h3>
                    <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                        <select className="w-full px-4 py-2 border rounded-lg" value={withdrawForm.type} onChange={e => setWithdrawForm({...withdrawForm, type: e.target.value})}>
                            <option value="part-final">Part-Final (Max 80%)</option>
                            <option value="advance">Advance (36 Months EMI)</option>
                        </select>
                        <input type="number" placeholder="Amount (₹)" className="w-full px-4 py-2 border rounded-lg" required value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})} />
                        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Submit Withdrawal</button>
                    </form>
                    
                    <h4 className="mt-6 font-bold text-gray-700">Withdrawal History</h4>
                    <ul className="mt-2 text-sm text-gray-600">
                        {actions.withdrawals.map(w => (
                            <li key={w._id} className="py-2 border-b flex justify-between items-center">
                                <span><span className="uppercase font-bold">{w.type.split('-').join(' ')}</span> - ₹{w.amount}</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${getStatusColor(w.status)}`}>{w.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {actionMsg && (
                <div className="mt-4 p-4 text-center bg-yellow-100 text-yellow-800 font-bold rounded-xl animate-fade-in">
                    {actionMsg}
                </div>
            )}
        </div>
    );
};

export default MyPF;
