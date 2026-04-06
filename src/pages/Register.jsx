import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', formData);
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Create Account</h2>
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow" role="alert"><p>{error}</p></div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition duration-200"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition duration-200"
                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition duration-200"
                            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required
                        />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-200 transform hover:-translate-y-1">
                        Register
                    </button>
                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Already have an account? Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
