import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const UploadPayroll = () => {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const navigate = useNavigate();

    const handleDownloadTemplate = async () => {
        try {
            const response = await api.get('/pf/template', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'payroll_template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
            alert('Failed to download template');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setErrors([]);
        setUploadSuccess(false);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setErrors([]);
        setPreviewData([]);

        try {
            const response = await api.post('/payroll/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setPreviewData(response.data.records);
            setUploadSuccess(true);
            alert(`Successfully uploaded ${response.data.count} records.`);
        } catch (error) {
            console.error('Upload Error:', error);
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([error.response?.data?.message || 'Failed to upload file.']);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Upload Wages</h1>
                <button
                    onClick={handleDownloadTemplate}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Template
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Select Excel File</label>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                {file && !uploadSuccess && (
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-bold transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}
                    >
                        {loading ? 'Uploading & Validating...' : 'Upload & Validate'}
                    </button>
                )}
            </div>

            {/* Error Display */}
            {errors.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm leading-5 font-medium text-red-800">
                                Upload Validation Failed ({errors.length} errors)
                            </h3>
                            <div className="mt-2 text-sm leading-5 text-red-700 max-h-40 overflow-y-auto">
                                <ul className="list-disc pl-5 space-y-1">
                                    {errors.map((err, index) => (
                                        <li key={index}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success / Preview Table */}
            {uploadSuccess && previewData.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-green-50">
                        <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Validation Successful
                        </h3>
                        <button
                            onClick={() => navigate('/payroll/process')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all flex items-center gap-2"
                        >
                            Proceed to Calculation
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Emp ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scheme</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Basic Pay</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {previewData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.employeeId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.staffName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.designation}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.department}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.staffCategory === 'Teaching' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {row.staffCategory}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.pfScheme === 'CPF' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                                                {row.pfScheme}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">₹{row.basicPay.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadPayroll;
