import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInternshipDetails } from '../services/industryApi';
import { Briefcase, Calendar, MapPin, DollarSign, Clock, LayoutDashboard, ChevronLeft, CheckCircle2 } from 'lucide-react';

export const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchInternshipDetails = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getInternshipDetails(id);
      const internshipData = response.data || response;

      setInternship(internshipData);
      setErrorMsg("");
    } catch (error) {
      console.error(
        "Failed to fetch internship details:",
        error.response?.data || error.message
      );

      setErrorMsg(
        "Failed to load internship details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInternshipDetails();
  }, [fetchInternshipDetails]);

  const getStatusBadge = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const today = new Date();
    today.setHours(0,0,0,0);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < today) return <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">Closed</span>;
    if (start > today) return <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">Upcoming</span>;
    return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">Active</span>;
  };

  const requiredSkills = internship?.skillRequired || internship?.skillsRequired || [];
  const responsibilities = internship?.responsibilities || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh] bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-200 border-t-emerald-600 dark:border-slate-700 dark:border-t-emerald-400"></div>
      </div>
    );
  }

  if (errorMsg || !internship) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] bg-slate-50 dark:bg-slate-900 px-6">
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400 max-w-lg text-center shadow-sm">
          <p className="font-semibold text-lg">{errorMsg || "Internship not found"}</p>
          <button 
            onClick={() => navigate('/industry/my-internships')}
            className="mt-4 px-6 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/industry/my-internships')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-medium transition-colors mb-6 group w-fit"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to My Internships
        </button>

        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-5">
              <div className="h-16 w-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20">
                <Briefcase size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {internship.title}
                  </h1>
                  {getStatusBadge(internship.startDate, internship.endDate)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base">
                  <span className="flex items-center gap-1.5"><LayoutDashboard size={18} className="text-emerald-500" /> {internship.domain}</span>
                  <span className="hidden md:inline text-slate-300 dark:text-slate-600">&bull;</span>
                  <span className="flex items-center gap-1.5"><Clock size={18} className="text-emerald-500" /> {internship.type || 'Full-time'}</span>
                  <span className="hidden md:inline text-slate-300 dark:text-slate-600">&bull;</span>
                  <span className="flex items-center gap-1.5"><MapPin size={18} className="text-emerald-500" /> {internship.location}</span>
                </div>
                {internship.shortDescription && (
                  <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300 leading-relaxed">
                    {internship.shortDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Short Description */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Briefcase size={22} className="text-emerald-500" /> Short Description
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {internship.shortDescription || "No short description provided for this internship."}
              </p>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <LayoutDashboard size={22} className="text-emerald-500" /> About The Role
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {internship.fullDescription || internship.shortDescription || "No detailed description provided for this internship."}
              </div>
            </div>

            {/* Skills & Responsibilities */}
            {(requiredSkills.length > 0 || responsibilities.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {requiredSkills.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Skills Required</h2>
                    <ul className="space-y-3">
                      {requiredSkills.map((skill, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {responsibilities.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Responsibilities</h2>
                    <ul className="space-y-3">
                      {responsibilities.map((resp, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Overview</h2>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                    <LayoutDashboard size={20} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Domain</p>
                    <p className="font-bold text-slate-900 dark:text-white">{internship.domain || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Type</p>
                    <p className="font-bold text-slate-900 dark:text-white">{internship.type || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Location</p>
                    <p className="font-bold text-slate-900 dark:text-white">{internship.location || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                    <DollarSign size={20} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stipend</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">
                      {internship.stipend ? (
                        <>
                          &#8377; {internship.stipend} <span className="text-sm font-normal text-slate-500">/ month</span>
                        </>
                      ) : (
                        'Not specified'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Start Date</p>
                    <p className="font-bold text-slate-900 dark:text-white">{internship.startDate || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">End Date</p>
                    <p className="font-bold text-slate-900 dark:text-white">{internship.endDate || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Application Deadline</p>
                    <p className="font-bold text-rose-600 dark:text-rose-400">{internship.lastDateToApply || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
