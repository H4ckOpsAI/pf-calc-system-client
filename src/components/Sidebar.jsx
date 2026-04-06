import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;


    const menuItems = {
        Admin: [
            { name: 'Users', icon: '👥', path: '/users' },
            { name: 'Roles & Permissions', icon: '🛡️', path: '/users' }, // Reuse users page for now or separate
            { name: 'Login Logs', icon: '📜', path: '/logs' }
        ],
        PayrollOfficer: [
            { name: 'Dashboard', icon: '📊', path: '/payroll' },
            { name: 'Upload Wages', icon: '📤', path: '/payroll/upload' },
            { name: 'Process PF', icon: '⚙️', path: '/payroll/process' },
            { name: 'My PF', icon: '💰', path: '/my-pf' }
        ],
        Staff: [
            { name: 'My PF', icon: '💰', path: '/my-pf' },
            { name: 'Profile', icon: '👤', path: '/my-pf' } // Profile can be same as My PF for now
        ]
    };

    const currentMenu = menuItems[user.role] || [];

    return (
        <div className="bg-slate-900 text-white w-72 min-h-screen flex flex-col shadow-2xl z-20 font-sans">
            <div className="p-6 flex items-center gap-3 border-b border-gray-800 bg-slate-950">
                <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">PF MANAGER</h1>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Menu</p>

                {currentMenu.map((item) => (
                    <Link key={item.path} to={item.path} className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:shadow-lg group">
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium text-gray-300 group-hover:text-white">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800 bg-slate-950">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 hover:bg-red-600 hover:text-white text-red-400 p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
