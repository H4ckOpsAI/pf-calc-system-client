import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ACTION_COLORS = {
    // Auth
    LOGIN_SUCCESS:            'bg-blue-100 text-blue-700',
    LOGIN_FAILED:             'bg-red-100 text-red-700',
    LOGOUT:                   'bg-gray-100 text-gray-600',
    // Password
    CHANGE_PASSWORD:          'bg-indigo-100 text-indigo-700',
    FORGOT_PASSWORD_REQUEST:  'bg-yellow-100 text-yellow-700',
    PASSWORD_RESET_SUCCESS:   'bg-emerald-100 text-emerald-700',
    PASSWORD_RESET_FAILED:    'bg-red-100 text-red-700',
    // User mgmt
    USER_CREATION:            'bg-purple-100 text-purple-700',
    PROFILE_UPDATE:           'bg-slate-100 text-slate-600',
    // PF
    PROCESS_PAYROLL:          'bg-green-100 text-green-700',
    REQUEST_OVERRIDE:         'bg-yellow-100 text-yellow-700',
    APPROVE_OVERRIDE:         'bg-emerald-100 text-emerald-700',
    REJECT_OVERRIDE:          'bg-red-100 text-red-700',
    REQUEST_WITHDRAWAL:       'bg-orange-100 text-orange-700',
    APPROVE_WITHDRAWAL:       'bg-emerald-100 text-emerald-700',
    REJECT_WITHDRAWAL:        'bg-red-100 text-red-700',
};

const formatDate = (ts) => {
    const d = new Date(ts);
    return (
        d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' ' +
        d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    );
};

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/users/logs')
            .then(res => setLogs(res.data))
            .catch(err => setError(err.response?.data?.message || 'Failed to load logs.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading activity logs...</div>;
    if (error)   return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Activity Logs</h1>
                    <p className="text-gray-500 mt-1 text-sm">{logs.length} event{logs.length !== 1 ? 's' : ''} recorded</p>
                </div>
            </div>

            {logs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow border border-gray-100 p-16 text-center text-gray-400">
                    No activity recorded yet.
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider border-b">
                            <tr>
                                <th className="px-5 py-4">Timestamp</th>
                                <th className="px-5 py-4">User</th>
                                <th className="px-5 py-4">Role</th>
                                <th className="px-5 py-4">Action</th>
                                <th className="px-5 py-4">Target</th>
                                <th className="px-5 py-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap text-xs font-mono">
                                        {formatDate(log.timestamp)}
                                    </td>
                                    <td className="px-5 py-3">
                                        {log.userId ? (
                                            <div>
                                                <p className="font-semibold text-gray-800 text-xs">{log.userId.name || '—'}</p>
                                                <p className="text-xs text-gray-400">{log.userId.employeeId || log.userId.email}</p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">Unknown</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full uppercase">
                                            {log.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${ACTION_COLORS[log.action] || 'bg-slate-100 text-slate-600'}`}>
                                            {log.action?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500 text-xs">
                                        {log.targetUserId ? (
                                            <div>
                                                <p className="font-semibold text-gray-700">{log.targetUserId.name || '—'}</p>
                                                <p className="text-gray-400">{log.targetUserId.employeeId || log.targetUserId.email}</p>
                                            </div>
                                        ) : '—'}
                                    </td>
                                    <td className="px-5 py-3 text-gray-600 max-w-xs truncate text-xs" title={log.details}>
                                        {log.details || '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Logs;
