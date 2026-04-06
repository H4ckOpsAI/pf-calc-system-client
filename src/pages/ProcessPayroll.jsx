import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProcessPayroll = () => {
    const [stats, setStats] = useState({ count: 0, totalBasic: 0 });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTempData();
    }, []);

    const fetchTempData = async () => {
        try {
            const response = await api.get('/payroll/temp');
            const records = response.data;
            const totalBasic = records.reduce((acc, curr) => acc + curr.basicPay, 0);
            setStats({ count: records.length, totalBasic });
        } catch (error) {
            console.error('Failed to fetch temp data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async () => {
        if (!window.confirm('Are you sure you want to process PF for these records? This action cannot be undone.')) {
            return;
        }

        setProcessing(true);
        try {
            const response = await api.post('/payroll/process');
            setSuccess(true);
            alert(`Success! Processed ${response.data.count} records.`);
            // Navigate to specific calculated view or dash
        } catch (error) {
            console.error('Processing failed', error);
            alert('Failed to process payroll. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading pending records...</div>;

    if (success) {
        return (
            <div className="p-8 text-center">
                <div className="bg-green-100 p-8 rounded-xl shadow-md inline-block">
                    <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h2 className="text-2xl font-bold text-green-800 mb-2">Calculation Complete</h2>
                    <p className="text-green-700 mb-6">Provident Fund contributions have been calculated and saved.</p>
                    <button
                        onClick={() => navigate('/payroll')}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Process PF Calculation</h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                    <h2 className="text-xl font-semibold text-gray-800">Pending Upload Summary</h2>
                </div>

                <div className="p-8 text-center">
                    {stats.count === 0 ? (
                        <div className="text-gray-500 py-8">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <p className="text-lg">No pending records found.</p>
                            <button
                                onClick={() => navigate('/payroll/upload')}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                ← Go to Upload
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">Total Employees</p>
                                    <p className="text-4xl font-extrabold text-blue-900">{stats.count}</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                    <p className="text-sm text-purple-600 font-bold uppercase tracking-wider mb-1">Total Basic Pay</p>
                                    <p className="text-2xl font-bold text-purple-900 mt-2">₹{stats.totalBasic.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <button
                                    onClick={handleProcess}
                                    disabled={processing}
                                    className={`w-full max-w-md mx-auto py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 ${processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'}`}
                                >
                                    {processing ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                            Calculate PF Contributions
                                        </>
                                    )}
                                </button>
                                <p className="mt-4 text-sm text-gray-500">
                                    Applying Rules: CPF (10% + 10%), GPF (6% + 0%)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProcessPayroll;
