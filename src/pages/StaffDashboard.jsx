import React from 'react';
import { useAuth } from '../context/AuthContext';

const StaffDashboard = () => {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Staff Dashboard</h1>
                    <p className="text-gray-500 mt-2">View your Provident Fund details and status.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-sm font-medium text-gray-600">Active Member</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl transform transition-all hover:scale-[1.01]">
                    <h2 className="text-lg font-medium opacity-80 mb-1">Total Provident Fund Balance</h2>
                    <p className="text-5xl font-bold mb-6 tracking-tight">$0.00</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Employee Share</p>
                            <p className="text-xl font-semibold">$0.00</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Employer Share</p>
                            <p className="text-xl font-semibold">$0.00</p>
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        Recent Transactions
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center text-gray-500">
                            No recent transactions found.
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors">
                            View Statement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
