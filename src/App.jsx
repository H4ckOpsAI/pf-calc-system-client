import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PayrollDashboard from './pages/PayrollDashboard';
import UploadPayroll from './pages/UploadPayroll';
import ProcessPayroll from './pages/ProcessPayroll';
import MyPF from './pages/MyPF';
import Unauthorized from './pages/Unauthorized';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'Admin') return <Navigate to="/users" replace />;
  if (user?.role === 'PayrollOfficer') return <Navigate to="/payroll" replace />;
  if (user?.role === 'Staff') return <Navigate to="/my-pf" replace />; // Default staff page
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute allowedRoles={['Admin', 'PayrollOfficer', 'Staff']} />}>
              <Route path="/" element={<HomeRedirect />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/users" element={<AdminDashboard />} />
              <Route path="/logs" element={<div className="p-8">Activity Logs (Coming Soon)</div>} />
            </Route>

            {/* Payroll Officer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['PayrollOfficer', 'Admin']} />}>
              <Route path="/payroll" element={<PayrollDashboard />} />
              <Route path="/payroll/upload" element={<UploadPayroll />} />
              <Route path="/payroll/process" element={<ProcessPayroll />} />
            </Route>

            {/* Staff Routes (My PF) - Accessible to everyone basically, but logic inside MyPF handles data */}
            <Route element={<ProtectedRoute allowedRoles={['Staff', 'PayrollOfficer', 'Admin']} />}>
              <Route path="/my-pf" element={<MyPF />} />
            </Route>

            {/* Profile - Placeholder */}
            <Route element={<ProtectedRoute allowedRoles={['Staff', 'PayrollOfficer', 'Admin']} />}>
              <Route path="/profile" element={<div className="p-8">User Profile (Coming Soon)</div>} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
