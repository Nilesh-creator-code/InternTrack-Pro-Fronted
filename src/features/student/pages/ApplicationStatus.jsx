import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getStudentApplications } from "../services/studentApi";
import { Briefcase, Building2, Calendar, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ApplicationStatus = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await getStudentApplications();
            setApplications(res.data);
        } catch (err) {
            toast.error("Failed to load your applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case "ACCEPTED":
                return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-emerald-200 dark:border-emerald-800">Accepted</span>;
            case "REJECTED":
                return <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-rose-200 dark:border-rose-800">Rejected</span>;
            case "APPLIED":
            case "PENDING":
                return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-blue-200 dark:border-blue-800">Applied</span>;
            default:
                return <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-slate-200 dark:border-slate-700">{status || "Unknown"}</span>;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">My Applications</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Track the status of your internship applications.
                    </p>
                </div>
                <button 
                    onClick={fetchApplications}
                    className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
                >
                    ↻ Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4">
                        <Briefcase size={36} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Applications Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">It looks like you haven't applied to any internships. Start browsing to find your next opportunity!</p>
                    <button 
                        onClick={() => navigate('/student/internships')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
                    >
                        Browse Internships <ArrowRight size={18} />
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                    <th className="font-bold text-slate-600 dark:text-slate-300 text-sm uppercase px-6 py-4">Role / Domain</th>
                                    <th className="font-bold text-slate-600 dark:text-slate-300 text-sm uppercase px-6 py-4">Company</th>
                                    <th className="font-bold text-slate-600 dark:text-slate-300 text-sm uppercase px-6 py-4">Applied On</th>
                                    <th className="font-bold text-slate-600 dark:text-slate-300 text-sm uppercase px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                                                    <Briefcase size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{app.internshipTitle || "Unknown Role"}</p>
                                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{app.internshipDomain || "Unknown Domain"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                                <Building2 size={16} className="text-slate-400" />
                                                {app.industryName || "Unknown Company"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                                <Calendar size={16} className="text-slate-400" />
                                                {app.applicationDate || "Recently"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-medium">
                                            {getStatusBadge(app.status)}
                                        </td>
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
