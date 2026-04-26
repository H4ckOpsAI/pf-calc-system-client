import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [logs, setLogs] = useState([]);
    const [taxDetails, setTaxDetails] = useState([]);
    const [taxFilter, setTaxFilter] = useState('All');
    const [showUserModal, setShowUserModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Staff', employeeId: '', designation: '', department: '', staffCategory: 'Teaching', pfScheme: 'CPF' });

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'permissions') fetchPermissions();
        if (activeTab === 'logs') fetchLogs();
        if (activeTab === 'tax') fetchTaxDetails();
    }, [activeTab]);

    const fetchTaxDetails = async () => {
        try {
            const res = await api.get('/pf-tax/all-details');
            setTaxDetails(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPermissions = async () => {
        try {
            const res = await api.get('/users/permissions');
            setPermissions(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await api.get('/users/logs');
            setLogs(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            await api.post('/users', formData);
            setShowUserModal(false);
            fetchUsers();
            setFormData({ name: '', email: '', password: '', role: 'Staff', employeeId: '', designation: '', department: '', staffCategory: 'Teaching', pfScheme: 'CPF' });
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating user');
        }
    };

    // ... (keep existing helper functions) ...
    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put('/users/role', { userId, role: newRole });
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
        try {
            await api.put('/users/status', { userId, isActive: !currentStatus });
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const handlePermissionChange = async (role, field, value) => {
        const perm = permissions.find(p => p.role === role);
        const newPerms = { ...perm, [field]: value };
        const payloadPermissions = {
            canViewPayroll: newPerms.canViewPayroll,
            canCalculatePayroll: newPerms.canCalculatePayroll,
            canConfigureRules: newPerms.canConfigureRules,
            canManageUsers: newPerms.canManageUsers
        };
        payloadPermissions[field] = value;

        try {
            await api.put('/users/permissions', { role, permissions: payloadPermissions });
            fetchPermissions();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8">
            {/* ... (Keep header and tabs) ... */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-2">Manage users, permissions, and system logs.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-8 py-4 font-semibold text-sm transition-all duration-300 ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users Management
                    </button>
                    <button
                        className={`px-8 py-4 font-semibold text-sm transition-all duration-300 ${activeTab === 'permissions' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('permissions')}
                    >
                        Access Control
                    </button>
                    <button
                        className={`px-8 py-4 font-semibold text-sm transition-all duration-300 ${activeTab === 'logs' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        System Logs
                    </button>
                    <button
                        className={`px-8 py-4 font-semibold text-sm transition-all duration-300 ${activeTab === 'tax' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('tax')}
                    >
                        PF Tax & Limits
                    </button>
                </div>

                <div className="p-6 min-h-[500px]">
                    {activeTab === 'users' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">All Users</h3>
                                <button
                                    onClick={() => setShowUserModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
                                >
                                    <span className="text-xl font-light">+</span> Create New User
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name/ID</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {users.map(user => (
                                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm font-medium text-gray-800">
                                                    {user.name}
                                                    <span className="block text-xs text-gray-500">{user.employeeId}</span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm">
                                                    <div className="relative">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                            className="block w-full bg-white border border-gray-300 hover:border-gray-400 px-3 py-1.5 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                            disabled={user.role === 'Admin' && user.email === 'admin@example.com'}
                                                        >
                                                            <option value="Admin">Admin</option>
                                                            <option value="PayrollOfficer">Payroll Officer</option>
                                                            <option value="Staff">Staff</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm">
                                                    <span
                                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                    >
                                                        {user.isActive ? 'Active' : 'Disabled'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm">
                                                    <button
                                                        onClick={() => handleStatusChange(user._id, user.isActive)}
                                                        className={`font-medium transition-colors duration-200 ${user.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}
                                                        disabled={user.role === 'Admin' && user.email === 'admin@example.com'}
                                                    >
                                                        {user.isActive ? 'Disable Access' : 'Enable Access'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* ... (Permissions Tab) ... */}
                    {activeTab === 'permissions' && (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Role Permissions</h3>
                            <div className="border rounded-xl overflow-hidden shadow-sm">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">View Payroll</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Calculate Payroll</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Configure Rules</th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Manage Users</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {permissions.map(perm => (
                                            <tr key={perm._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-800">{perm.role}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={perm.canViewPayroll}
                                                        onChange={(e) => handlePermissionChange(perm.role, 'canViewPayroll', e.target.checked)}
                                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={perm.canCalculatePayroll}
                                                        onChange={(e) => handlePermissionChange(perm.role, 'canCalculatePayroll', e.target.checked)}
                                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={perm.canConfigureRules}
                                                        onChange={(e) => handlePermissionChange(perm.role, 'canConfigureRules', e.target.checked)}
                                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={perm.canManageUsers}
                                                        onChange={(e) => handlePermissionChange(perm.role, 'canManageUsers', e.target.checked)}
                                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'logs' && (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Activity Logs</h3>
                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {logs.map(log => (
                                            <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm font-medium text-gray-800">
                                                    {log.userId ? log.userId.name : 'Unknown'}
                                                    {log.userId && <span className="block text-xs text-gray-500">{log.userId.employeeId}</span>}
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm text-gray-600">{log.role}</td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm font-bold text-blue-600">{log.action}</td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm text-gray-600">{log.details}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'tax' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">PF Tax & Increment Usage</h3>
                                <select
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none"
                                    value={taxFilter}
                                    onChange={(e) => setTaxFilter(e.target.value)}
                                >
                                    <option value="All">All Users</option>
                                    <option value="7%">7% Tax Slab</option>
                                    <option value="5%">5% Tax Slab</option>
                                    <option value="3%">3% Tax Slab</option>
                                </select>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">PF Amount</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Net PF</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tax Slab</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tax Amount</th>
                                            <th className="px-6 py-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Increments Used</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {taxDetails.filter(t => {
                                            if (taxFilter === 'All') return true;
                                            if (taxFilter === '7%') return t.tax_percentage === 7;
                                            if (taxFilter === '5%') return t.tax_percentage === 5;
                                            if (taxFilter === '3%') return t.tax_percentage === 3;
                                            return true;
                                        }).map(detail => (
                                            <tr key={detail._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm font-medium text-gray-800">
                                                    {detail.user_id?.name}
                                                    <span className="block text-xs text-gray-500">{detail.user_id?.email}</span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm text-gray-600">₹{detail.pf_amount.toLocaleString()}</td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm font-bold text-green-600">₹{detail.net_pf.toLocaleString()}</td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm font-bold text-gray-800">{detail.tax_percentage}%</td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm font-bold text-red-500">₹{detail.tax_amount.toLocaleString()}</td>
                                                <td className="px-6 py-4 border-b border-gray-100 text-sm">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${detail.increments_used >= 3 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {detail.increments_used} / 3
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showUserModal && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 animate-fade-in-up overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
                            <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} required placeholder="e.g. EMP001" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} placeholder="e.g. Professor" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. CSE" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="Admin">Admin</option>
                                    <option value="PayrollOfficer">Payroll Officer</option>
                                    <option value="Staff">Staff</option>
                                </select>
                            </div>

                            {formData.role !== 'Admin' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Staff Category</label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white" value={formData.staffCategory} onChange={e => setFormData({ ...formData, staffCategory: e.target.value })}>
                                            <option value="Teaching">Teaching</option>
                                            <option value="NonTeaching">Non-Teaching</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">PF Scheme</label>
                                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white" value={formData.pfScheme} onChange={e => setFormData({ ...formData, pfScheme: e.target.value })}>
                                            <option value="CPF">CPF</option>
                                            <option value="GPF">GPF</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowUserModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
    // ... rest of the component

};

export default AdminDashboard;
