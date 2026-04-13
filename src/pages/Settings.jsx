import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();

    // Profile update state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });
    const [profileMsg, setProfileMsg] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);

    // Change password state
    const [pwData, setPwData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [pwMsg, setPwMsg] = useState('');
    const [pwLoading, setPwLoading] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMsg('');
        try {
            await api.put('/users/profile', formData);
            setProfileMsg('Profile updated successfully!');
        } catch (error) {
            setProfileMsg(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPwMsg('');

        if (pwData.newPassword !== pwData.confirmPassword) {
            return setPwMsg('New passwords do not match.');
        }
        if (pwData.newPassword.length < 6) {
            return setPwMsg('New password must be at least 6 characters.');
        }

        setPwLoading(true);
        try {
            const res = await api.put('/users/change-password', {
                currentPassword: pwData.currentPassword,
                newPassword: pwData.newPassword
            });
            setPwMsg(res.data.message);
            setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setPwMsg(error.response?.data?.message || 'Failed to change password.');
        } finally {
            setPwLoading(false);
        }
    };

    const isProfileSuccess = profileMsg.includes('successfully');
    const isPwSuccess = pwMsg.includes('successfully');

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Account Settings</h1>

            {/* ── Profile Information ─────────────────── */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-700 mb-6 border-b pb-3">Profile Information</h2>

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your full name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="e.g. +91 98765 43210"
                        />
                    </div>

                    {profileMsg && (
                        <div className={`p-3 rounded-lg text-sm font-semibold ${isProfileSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {profileMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={profileLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
                    >
                        {profileLoading ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>

            {/* ── Change Password ─────────────────────── */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-700 mb-6 border-b pb-3">Change Password</h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={pwData.currentPassword}
                            onChange={(e) => setPwData({ ...pwData, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                            autoComplete="current-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={pwData.newPassword}
                            onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
                            placeholder="Enter new password (min 6 characters)"
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={pwData.confirmPassword}
                            onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
                            placeholder="Re-enter new password"
                            autoComplete="new-password"
                        />
                    </div>

                    {pwMsg && (
                        <div className={`p-3 rounded-lg text-sm font-semibold ${isPwSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {pwMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={pwLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
                    >
                        {pwLoading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
