import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Logs from './pages/Logs';
import Reports from './pages/Reports';
import PayrollDashboard from './pages/PayrollDashboard';
import UploadPayroll from './pages/UploadPayroll';
import ProcessPayroll from './pages/ProcessPayroll';
import ManagePF from './pages/ManagePF';
import PFRequests from './pages/PFRequests';
import MyPF from './pages/MyPF';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute allowedRoles={['Admin', 'PayrollOfficer', 'Staff']} />}>
              <Route path="/" element={<HomeRedirect />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/users" element={<AdminDashboard />} />
              <Route path="/logs" element={<Logs />} />
            </Route>

            {/* Payroll Officer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['PayrollOfficer', 'Admin']} />}>
              <Route path="/payroll" element={<PayrollDashboard />} />
              <Route path="/payroll/upload" element={<UploadPayroll />} />
              <Route path="/payroll/process" element={<ProcessPayroll />} />
              <Route path="/payroll/manage-pf" element={<ManagePF />} />
              <Route path="/payroll/requests" element={<PFRequests />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Route>

            {/* Staff Routes (My PF) - Accessible to everyone basically, but logic inside MyPF handles data */}
            <Route element={<ProtectedRoute allowedRoles={['Staff', 'PayrollOfficer', 'Admin']} />}>
              <Route path="/my-pf" element={<MyPF />} />
            </Route>

            {/* Profile & Settings routes */}
            <Route element={<ProtectedRoute allowedRoles={['Staff', 'PayrollOfficer', 'Admin']} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/settings" element={<Settings />} />
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
