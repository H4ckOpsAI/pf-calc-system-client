import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Card = ({ label, value, sub, color = 'blue' }) => {
    const colors = {
        blue:   'from-blue-500 to-blue-700',
        green:  'from-emerald-500 to-emerald-700',
        purple: 'from-purple-500 to-purple-700',
        orange: 'from-orange-500 to-orange-700',
        red:    'from-red-500 to-red-700',
        slate:  'from-slate-500 to-slate-700',
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} text-white p-6 rounded-2xl shadow-lg`}>
            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-extrabold mt-2">{value}</p>
            {sub && <p className="text-xs mt-1 opacity-70">{sub}</p>}
        </div>
    );
};

const SectionTitle = ({ children }) => (
    <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 uppercase tracking-wider">{children}</h2>
);

const Reports = () => {
    const [summary, setSummary] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [compliance, setCompliance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [sumRes, empRes, deptRes, compRes] = await Promise.all([
                    api.get('/reports/summary'),
                    api.get('/reports/employees'),
                    api.get('/reports/departments'),
                    api.get('/reports/compliance'),
                ]);
                setSummary(sumRes.data);
                setEmployees(empRes.data);
                setDepartments(deptRes.data);
                setCompliance(compRes.data);
            } catch (err) {
                console.error('Report Fetch Error:', err);
                setError(err.response?.data?.message || 'Failed to load reports.');
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading reports...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const downloadCSV = async (endpoint, filename) => {
        try {
            const res = await api.get(endpoint, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('CSV Download Error:', err);
        }
    };

    const tabs = [
        { key: 'summary',    label: 'Summary' },
        { key: 'employees',  label: 'Employee Report' },
        { key: 'departments', label: 'Department Report' },
        { key: 'compliance', label: 'Compliance' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Audit, Reporting & Compliance</h1>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-1">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-all ${
                            activeTab === t.key
                                ? 'bg-white text-blue-700 border border-b-0 border-gray-200 shadow-sm -mb-px'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ─── SUMMARY ───────────────────────────── */}
            {activeTab === 'summary' && summary && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <Card label="Total Employees" value={summary.totalEmployees} color="blue" />
                        <Card label="Total Contribution" value={`₹${summary.totalContribution.toLocaleString()}`} sub={`Emp: ₹${summary.totalEmployeeShare.toLocaleString()} | Employer: ₹${summary.totalEmployerShare.toLocaleString()}`} color="green" />
                        <Card label="Total Withdrawals" value={`₹${summary.totalWithdrawals.toLocaleString()}`} sub={`Advance: ₹${summary.totalAdvance.toLocaleString()} | Part-Final: ₹${summary.totalPartFinal.toLocaleString()}`} color="orange" />
                        <Card label="Net System Balance" value={`₹${(summary.totalContribution - summary.totalWithdrawals).toLocaleString()}`} color="purple" />
                    </div>
                    <div className="flex justify-end">
                        <button onClick={() => downloadCSV('/reports/export/summary', 'pf_summary_report.csv')} className="bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                            ⬇ Download Summary CSV
                        </button>
                    </div>
                </div>
            )}

            {/* ─── EMPLOYEE REPORT ────────────────────── */}
            {activeTab === 'employees' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="flex justify-between items-center px-6 pt-5">
                        <SectionTitle>Employee PF Report</SectionTitle>
                        <button onClick={() => downloadCSV('/reports/export/employees', 'pf_employee_report.csv')} className="bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition-all mb-4">
                            ⬇ Download CSV
                        </button>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider border-b">
                            <tr>
                                <th className="px-5 py-3">Employee ID</th>
                                <th className="px-5 py-3">Name</th>
                                <th className="px-5 py-3">Dept</th>
                                <th className="px-5 py-3 text-right">Total PF</th>
                                <th className="px-5 py-3 text-right">Withdrawals</th>
                                <th className="px-5 py-3 text-right">Net Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employees.map(e => (
                                <tr key={e.employeeId} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3 font-mono text-xs">{e.employeeId}</td>
                                    <td className="px-5 py-3 font-semibold text-gray-800">{e.name}</td>
                                    <td className="px-5 py-3 text-gray-500">{e.department}</td>
                                    <td className="px-5 py-3 text-right font-bold text-green-700">₹{e.totalContribution.toLocaleString()}</td>
                                    <td className="px-5 py-3 text-right font-bold text-red-600">₹{e.totalWithdrawal.toLocaleString()}</td>
                                    <td className="px-5 py-3 text-right font-extrabold text-blue-700">₹{e.netBalance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ─── DEPARTMENT REPORT ──────────────────── */}
            {activeTab === 'departments' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="flex justify-between items-center px-6 pt-5">
                        <SectionTitle>Department-wise Report</SectionTitle>
                        <button onClick={() => downloadCSV('/reports/export/departments', 'pf_department_report.csv')} className="bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition-all mb-4">
                            ⬇ Download CSV
                        </button>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider border-b">
                            <tr>
                                <th className="px-5 py-3">Department</th>
                                <th className="px-5 py-3 text-right">Employees</th>
                                <th className="px-5 py-3 text-right">Total PF</th>
                                <th className="px-5 py-3 text-right">Avg Contribution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {departments.map(d => (
                                <tr key={d.department} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3 font-semibold text-gray-800">{d.department}</td>
                                    <td className="px-5 py-3 text-right">{d.totalEmployees}</td>
                                    <td className="px-5 py-3 text-right font-bold text-green-700">₹{d.totalPF.toLocaleString()}</td>
                                    <td className="px-5 py-3 text-right font-bold text-blue-600">₹{d.avgContribution.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ─── COMPLIANCE ────────────────────────── */}
            {activeTab === 'compliance' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="flex justify-between items-center px-6 pt-5">
                        <SectionTitle>Statutory Compliance Check</SectionTitle>
                        <button onClick={() => downloadCSV('/reports/export/compliance', 'pf_compliance_report.csv')} className="bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition-all mb-4">
                            ⬇ Download CSV
                        </button>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider border-b">
                            <tr>
                                <th className="px-5 py-3">Employee</th>
                                <th className="px-5 py-3 text-center">Status</th>
                                <th className="px-5 py-3">Issues</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {compliance.map(c => (
                                <tr key={c.employeeId} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <p className="font-semibold text-gray-800">{c.name}</p>
                                        <p className="text-xs text-gray-400 font-mono">{c.employeeId}</p>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                            c.status === 'COMPLIANT'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {c.status === 'COMPLIANT' ? '✓ Compliant' : '✗ Non-Compliant'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-600 text-xs">
                                        {c.issues.length === 0 ? (
                                            <span className="text-gray-400 italic">No issues</span>
                                        ) : (
                                            <ul className="list-disc list-inside space-y-0.5">
                                                {c.issues.map((issue, i) => (
                                                    <li key={i} className="text-red-600">{issue}</li>
                                                ))}
                                            </ul>
                                        )}
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

export default Reports;
