import React, { useState, useEffect } from 'react';
import { getMyInternships } from '../services/industryApi';
import { Briefcase, Calendar, MapPin, DollarSign, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyInternships();
  }, []);

  const fetchMyInternships = async () => {
    try {
      setLoading(true);
      const data = await getMyInternships();
      setInternships(data);
      setErrorMsg("");
    } catch (error) {
      console.error("Failed to fetch internships:", error.response?.data || error.message);
      setErrorMsg("Failed to load your internship postings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (startDate, endDate) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < today) return <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Closed</span>;
    if (start > today) return <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Upcoming</span>;
    return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>;
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">My Internships</h1>
            <p className="text-slate-600 dark:text-slate-400">View and manage all the internship positions you've posted.</p>
          </div>
          <button 
            onClick={() => navigate('/industry/post-internship')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            + Post New Internship
          </button>
        </div>

        {/* Error Handling */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500 dark:text-slate-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
          </div>
        ) : internships.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Briefcase size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Internships Found</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              You haven't posted any internships yet. Start building your team by posting an opportunity!
            </p>
            <button 
              onClick={() => navigate('/industry/post-internship')}
              className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Post your first Internship
            </button>
          </div>
        ) : (
          /* Data Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <div 
                key={internship.id} 
                className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md hover:-translate-y-1 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                        {internship.title}
                      </h3>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {internship.domain}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 line-clamp-2 min-h-[40px]">
                  {internship.shortDescription || internship.fullDescription || "No description provided."}
                </p>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <DollarSign size={16} className="text-slate-400" />
                    <span className="font-medium">₹ {internship.stipend} / month</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="font-medium">{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="font-medium">App. Deadline: {internship.lastDateToApply}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  {getStatusBadge(internship.startDate, internship.endDate)}
                  
                  <button 
                    onClick={() => navigate(`/industry/internships/view/${internship.id}`)} 
                    className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <Eye size={16} /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
