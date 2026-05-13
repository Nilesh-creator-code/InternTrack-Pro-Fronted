import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllInternships, searchInternshipsByDomain, getInternshipDetails } from "../services/studentApi";
import { Search, Briefcase, MapPin, IndianRupee, Clock, ChevronLeft, ChevronRight, Loader2, X, CheckCircle } from "lucide-react";

export const InternshipList = () => {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchDomain, setSearchDomain] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchInternships = async (p = 0) => {
        setLoading(true);
        try {
            const res = await getAllInternships(p, 10);
            if (res.data) {
                setInternships(res.data.content || res.data); // Handle Page vs List
                setTotalPages(res.data.totalPages || 1);
                setPage(p);
            }
        } catch {
            toast.error("Failed to load internships");
            setInternships([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchDomain.trim()) {
            fetchInternships(0);
            return;
        }
        setLoading(true);
        try {
            const res = await searchInternshipsByDomain(searchDomain);
            setInternships(res.data.content || res.data || []);
            setTotalPages(1); // Searches typically return flat lists
        } catch {
            toast.error("Failed to search. Domain may not exist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    const handleViewDetails = async (id) => {
        setIsModalOpen(true);
        setModalLoading(true);
        setSelectedInternship(null); // Reset until loaded
        try {
            const res = await getInternshipDetails(id);
            setSelectedInternship(res.data);
        } catch {
            toast.error("Failed to fetch internship details.");
            setIsModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    const handleApplyClick = (internship) => {
        setIsModalOpen(false);
        navigate(`/student/internships/apply/${internship.id}`, {
            state: { title: internship.title, company: internship.company },
        });
    };

    const selectedSkills = selectedInternship?.skillRequired || selectedInternship?.skillsRequired || [];
    const selectedResponsibilities = selectedInternship?.responsibilities || [];

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                        Available Internships
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px]">
                        Explore and apply to internships matching your career goals.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <form onSubmit={handleSearch} className="flex gap-4 items-center w-full">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            className="box-border w-full max-w-md pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 dark:text-slate-200 transition-all text-sm font-medium"
                            placeholder="Search by domain (e.g., Cyber Security)..."
                            value={searchDomain}
                            onChange={(e) => setSearchDomain(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors disabled:opacity-70 h-[46px] shrink-0"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Search"}
                    </button>
                    {searchDomain && (
                        <button
                            type="button"
                            onClick={() => { setSearchDomain(""); fetchInternships(0); }}
                            className="px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors shrink-0"
                        >
                            Reset
                        </button>
                    )}
                </form>
            </div>

            {/* Internship List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                    </div>
                ) : internships.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
                        <Briefcase size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No internships found</h3>
                        <p className="text-slate-500 dark:text-slate-400">Try adjusting your search domain or check back later for new postings.</p>
                    </div>
                ) : (
                    internships.map((internship) => (
                        <div key={internship.id} className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:-translate-y-1 hover:shadow-md duration-300">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 line-clamp-1">{internship.title}</h2>
                                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-lg tracking-wide uppercase shrink-0">
                                        {internship.domain}
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] mb-4 max-w-2xl">
                                    {internship.shortDescription}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                                        <MapPin size={16} className="text-blue-500" /> {internship.location}
                                    </div>
                                    <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                                        <IndianRupee size={16} className="text-emerald-500" /> {internship.stipend} / month
                                    </div>
                                    <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900">
                                        <Clock size={16} className="text-purple-500" /> Apply by: {internship.lastDateToApply}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleViewDetails(internship.id)}
                                className="w-full md:w-auto px-8 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl font-bold transition-all shrink-0 border border-slate-200 dark:border-slate-600"
                            >
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {!searchDomain && totalPages > 1 && internships.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        disabled={page === 0}
                        onClick={() => fetchInternships(page - 1)}
                        className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => fetchInternships(page + 1)}
                        className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Application Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Internship Details</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar text-left text-slate-700 dark:text-slate-300">
                            {modalLoading ? (
                                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                                    <Loader2 className="animate-spin text-blue-600" size={40} />
                                    <p className="text-slate-500 font-medium">Fetching details...</p>
                                </div>
                            ) : selectedInternship ? (
                                <div className="space-y-6">
                                    {/* Header Section */}
                                    <div>
                                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                                            {selectedInternship.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wide">
                                                {selectedInternship.domain}
                                            </span>
                                            <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wide">
                                                {selectedInternship.type || 'Internship'}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {selectedInternship.shortDescription || "No short description provided."}
                                        </p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Domain</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedInternship.domain || "Not specified"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Type</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedInternship.type || "Not specified"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Stipend</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">&#8377; {selectedInternship.stipend || "Not specified"} / month</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Location</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedInternship.location || "Not specified"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Start Date</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedInternship.startDate || "Not specified"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">End Date</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedInternship.endDate || "Not specified"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Apply By</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200 text-rose-600 dark:text-rose-400">{selectedInternship.lastDateToApply || "Not specified"}</p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                            <Briefcase size={20} className="text-blue-500" /> About The Role
                                        </h4>
                                        <p className="text-15px leading-relaxed bg-white dark:bg-slate-800 rounded-lg whitespace-pre-wrap">
                                            {selectedInternship.fullDescription || selectedInternship.shortDescription}
                                        </p>
                                    </div>

                                    {/* Skills */}
                                    {selectedSkills.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Skills Required</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSkills.map((skill, index) => (
                                                    <span key={index} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-lg text-sm font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Responsibilities */}
                                    {selectedResponsibilities.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Responsibilities</h4>
                                            <ul className="space-y-2">
                                                {selectedResponsibilities.map((resp, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                                        <span className="leading-relaxed">{resp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-red-500 font-bold">Could not load internship details.</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-end gap-4 shrink-0">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-600"
                            >
                                Cancel
                            </button>
                            <button 
                                disabled={modalLoading || !selectedInternship}
                                onClick={() => handleApplyClick(selectedInternship)}
                                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
