import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/users/profile')
            .then(res => setProfile(res.data))
            .catch(err => {
                console.error('Get Profile Error:', err);
                setError('Failed to load profile.');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!profile) return null;

    const avatarInitial = profile.name ? profile.name.charAt(0).toUpperCase() : '?';

    const fields = [
        { label: 'Full Name', value: profile.name },
        { label: 'Email', value: profile.email },
        { label: 'Employee ID', value: profile.employeeId, mono: true },
        { label: 'Role', value: profile.role, badge: true },
        { label: 'Department', value: profile.department },
        { label: 'Designation', value: profile.designation },
        { label: 'PF Scheme', value: profile.pfScheme },
        { label: 'Phone', value: profile.phone },
    ];

    return (
        <div className="p-8 max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">User Profile</h1>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
                {/* Header gradient bar */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

                {/* Avatar */}
                <div className="absolute top-16 left-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-extrabold text-blue-700 shadow-lg border-4 border-white uppercase">
                        {avatarInitial}
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    {/* Name + Edit button row */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                            <p className="text-gray-500 font-medium">{profile.role}</p>
                        </div>
                        <button
                            onClick={() => navigate('/profile/settings')}
                            className="bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm"
                        >
                            Edit in Settings
                        </button>
                    </div>

                    {/* Profile fields */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b pb-3">
                            Profile Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.map(({ label, value, mono, badge }) => (
                                <div key={label}>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        {label}
                                    </label>
                                    {badge ? (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                            {value || 'N/A'}
                                        </span>
                                    ) : (
                                        <div className={`text-gray-900 font-semibold ${mono ? 'font-mono' : ''}`}>
                                            {value || 'N/A'}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
