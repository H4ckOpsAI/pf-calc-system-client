import React, { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle, Award, Briefcase, GraduationCap, DollarSign, Link as LinkIcon, User, RefreshCw } from 'lucide-react';
import api from '../services/api';

const InputSection = ({ title, pfScheme, data, onChange }) => (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex-1 transition-all hover:shadow-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center gap-2">
            <User className="text-blue-500" /> {title}
        </h2>
        <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full mb-6">
            PF Scheme: {pfScheme}
        </span>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Candidate Name</label>
                <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} placeholder="John Doe" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><LinkIcon size={16} /> Resume Link</label>
                <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" value={data.link} onChange={e => onChange({ ...data, link: e.target.value })} placeholder="https://..." />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><GraduationCap size={16} /> Education</label>
                <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" value={data.education} onChange={e => onChange({ ...data, education: e.target.value })} placeholder="B.Tech, MBA..." />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><CheckCircle size={16} /> Skills (comma separated)</label>
                <textarea className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" rows="2" value={data.skills} onChange={e => onChange({ ...data, skills: e.target.value })} placeholder="React, Node.js, Python..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><Briefcase size={16} /> Experience (Years)</label>
                    <input type="number" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" value={data.experience} onChange={e => onChange({ ...data, experience: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><DollarSign size={16} /> Monthly Salary</label>
                    <input type="number" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" value={data.salary} onChange={e => onChange({ ...data, salary: e.target.value })} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1"><Award size={16} /> Certifications (comma sep)</label>
                <textarea className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" rows="2" value={data.certifications} onChange={e => onChange({ ...data, certifications: e.target.value })} placeholder="AWS, PMP..." />
            </div>
        </div>
    </div>
);

const ResumeComparison = () => {
    const [cand1, setCand1] = useState({
        name: '', link: '', education: '', skills: '', experience: '', certifications: '', salary: '', pfScheme: 'GPF'
    });
    const [cand2, setCand2] = useState({
        name: '', link: '', education: '', skills: '', experience: '', certifications: '', salary: '', pfScheme: 'CPF'
    });

    const [comparisonResult, setComparisonResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCompare = async () => {
        setLoading(true);
        try {
            const response = await api.post('/pf/compare', { cand1, cand2 });
            setComparisonResult(response.data);
        } catch (error) {
            console.error("Comparison Error", error);
            alert("Failed to analyze candidates.");
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, val1, val2, diff, prefix = "", suffix = "", diffPrefix = "" }) => {
        const isPositive = diff > 0;
        const isNegative = diff < 0;
        const color = isPositive ? 'text-green-700 bg-green-100' : (isNegative ? 'text-orange-700 bg-orange-100' : 'text-gray-500 bg-gray-100');
        return (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transition-all group-hover:w-2"></div>
                <h4 className="text-gray-500 text-sm font-semibold mb-2">{title}</h4>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-white p-2 border border-gray-100 rounded">
                        <span className="text-xs text-slate-500">{cand1.name || "Cand 1"}</span>
                        <span className="font-bold text-gray-800">{prefix}{val1}{suffix}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 border border-gray-100 rounded">
                        <span className="text-xs text-slate-500">{cand2.name || "Cand 2"}</span>
                        <span className="font-bold text-gray-800">{prefix}{val2}{suffix}</span>
                    </div>
                    {diff !== 0 && (
                        <div className={`mt-2 flex items-center justify-center gap-1 font-bold text-xs px-2 py-1.5 rounded-full ${color}`}>
                            Gap: {diff > 0 ? '+' : ''}{diffPrefix}{prefix}{diff}{suffix} ({cand2.name || "Cand 2"} vs {cand1.name || "Cand 1"})
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 pt-6 font-sans">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Candidate Evaluation & Rules Engine Analysis</h1>
                    <p className="text-slate-500">Secure backend comparison implementing PF organization logic caps.</p>
                </div>
                <button 
                    onClick={handleCompare}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all"
                >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <Calculator size={20} />}
                    {loading ? 'Analyzing...' : 'Run System Analysis'}
                </button>
            </header>

            <div className="flex flex-col xl:flex-row gap-8 mb-10">
                <InputSection title="Candidate 1" pfScheme="GPF (6%)" data={cand1} onChange={setCand1} />
                <div className="flex flex-col items-center justify-center -mx-4 z-10 hidden xl:flex">
                    <div className="bg-blue-600 rounded-full p-3 shadow-lg border-4 border-white text-white">
                        <ArrowRight size={24} />
                    </div>
                </div>
                <InputSection title="Candidate 2" pfScheme="CPF (10% + Match)" data={cand2} onChange={setCand2} />
            </div>

            {comparisonResult && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
                    {/* Comparison Dashboard */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Calculator className="text-blue-500" /> Computed System Analytics
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            <StatCard 
                                title="Monthly Salary" 
                                val1={comparisonResult.cand1.salary} 
                                val2={comparisonResult.cand2.salary} 
                                diff={comparisonResult.analysis.salaryDiff} 
                                prefix="₹" 
                            />
                            <StatCard 
                                title="Total PF Accrual" 
                                val1={comparisonResult.cand1.totalPF} 
                                val2={comparisonResult.cand2.totalPF} 
                                diff={comparisonResult.analysis.pfDiff} 
                                prefix="₹" 
                            />
                            <StatCard 
                                title="Experience" 
                                val1={comparisonResult.cand1.experience} 
                                val2={comparisonResult.cand2.experience} 
                                diff={comparisonResult.analysis.expDiff} 
                                suffix=" yrs" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                    <CheckCircle size={16} /> Unique Identified Skills
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">{cand1.name || "Candidate 1"} Exclusives</p>
                                        <div className="flex flex-wrap gap-2">
                                            {comparisonResult.analysis.c1UniqueSkills.length ? comparisonResult.analysis.c1UniqueSkills.map(s => <span key={s} className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm shadow-sm">{s}</span>) : <span className="text-gray-500 text-sm">None</span>}
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-blue-200">
                                        <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wider">{cand2.name || "Candidate 2"} Exclusives</p>
                                        <div className="flex flex-wrap gap-2">
                                            {comparisonResult.analysis.c2UniqueSkills.length ? comparisonResult.analysis.c2UniqueSkills.map(s => <span key={s} className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm shadow-sm">{s}</span>) : <span className="text-gray-500 text-sm">None</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 items-start justify-center flex flex-col">
                               <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2"><Briefcase size={16} /> Skill Matrix</h4>
                               <div className="w-full flex flex-col gap-3">
                                   <div className="bg-white p-3 rounded-lg border border-purple-200">
                                       <div className="text-xs font-bold text-slate-500">{cand1.name || "Candidate 1"}</div>
                                       <div className="text-sm text-slate-700">{comparisonResult.cand1.skills.join(', ') || 'N/A'}</div>
                                   </div>
                                   <div className="bg-white p-3 rounded-lg border border-purple-200">
                                       <div className="text-xs font-bold text-slate-500">{cand2.name || "Candidate 2"}</div>
                                       <div className="text-sm text-slate-700">{comparisonResult.cand2.skills.join(', ') || 'N/A'}</div>
                                   </div>
                               </div>
                            </div>
                        </div>
                    </div>

                    {/* Final Result Section */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-2xl p-6 text-white relative flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-[80px] opacity-40"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-40"></div>
                        
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 z-10">
                            <Award className="text-yellow-400" /> Comparison Verdict
                        </h3>
                        
                        <div className="flex-1 z-10 flex flex-col">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-black text-white">
                                    {cand1.name && cand2.name ? `${cand1.name} vs ${cand2.name}` : "Candidate Analysis"}
                                </h2>
                            </div>

                            <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                                <h4 className="font-semibold text-yellow-300 border-b border-white/10 pb-2 text-sm">PF Limit Insights</h4>
                                <p className="text-sm text-gray-200 leading-relaxed mb-2">
                                    {cand2.name || "Cand 2"} generates <strong className="text-green-300">₹{comparisonResult.cand2.totalPF}</strong> monthly using the {cand2.pfScheme} system architecture.
                                </p>
                                <p className="text-sm text-gray-200 leading-relaxed">
                                    {cand1.name || "Cand 1"} generates <strong className="text-orange-300">₹{comparisonResult.cand1.totalPF}</strong> monthly using standard {cand1.pfScheme}.
                                </p>
                                
                                {(comparisonResult.cand1.employeePF === 40000 || comparisonResult.cand2.employeePF === 40000) && (
                                    <div className="mt-2 bg-red-500/20 text-red-200 text-xs p-2 rounded border border-red-500/30">
                                        ⚠️ Maximum monthly PF cap (₹40,000) applied by rules engine.
                                    </div>
                                )}
                            </div>

                             <div className="space-y-3 mt-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md flex-1">
                                <h4 className="font-semibold text-blue-300 border-b border-white/10 pb-2 text-sm">Metrics Advantage ({cand2.name || "Cand 2"})</h4>
                                <ul className="space-y-2">
                                    {comparisonResult.analysis.c2UniqueSkills.length > 0 && (
                                        <li className="flex items-start gap-2 text-xs">
                                            <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                                            <span>Brings {comparisonResult.analysis.c2UniqueSkills.length} unique organizational skills.</span>
                                        </li>
                                    )}
                                    {comparisonResult.analysis.expDiff > 0 && (
                                        <li className="flex items-start gap-2 text-xs">
                                            <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                                            <span>Seniority advantage of {comparisonResult.analysis.expDiff} years.</span>
                                        </li>
                                    )}
                                    {comparisonResult.analysis.salaryDiff < 0 && (
                                        <li className="flex items-start gap-2 text-xs">
                                            <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                                            <span>More cost-effective structure (₹{Math.abs(comparisonResult.analysis.salaryDiff)} less).</span>
                                        </li>
                                    )}
                                    {comparisonResult.analysis.c2UniqueSkills.length === 0 && comparisonResult.analysis.expDiff <= 0 && comparisonResult.analysis.salaryDiff >= 0 && (
                                        <li className="text-xs text-gray-400 italic">No clear statistical advantage over Candidate 1.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeComparison;
