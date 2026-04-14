import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, CheckCircle, PlusCircle, Calendar } from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock Data (Can be replaced with actual API calls)
  const [stats] = useState({
    totalPosted: 12,
    totalApplications: 48,
    activeInternships: 5
  });

  const [recentInternships] = useState([
    { id: 1, title: 'Frontend Developer React', location: 'Remote', deadline: '2026-05-15', status: 'Active', applications: 14 },
    { id: 2, title: 'Backend Node.js Engineer', location: 'New York, NY', deadline: '2026-04-30', status: 'Active', applications: 32 },
    { id: 3, title: 'UI/UX Designer', location: 'San Francisco, CA', deadline: '2026-04-20', status: 'Closed', applications: 2 }
  ]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Welcome, Industry Partner</h1>
            <p className="text-slate-600 dark:text-slate-400">Here's what's happening with your internship postings today.</p>
          </div>
          <button 
            onClick={() => navigate('/industry/post-internship')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 shrink-0"
          >
            <PlusCircle size={20} />
            Post New Internship
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
            <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Briefcase size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Posted</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{stats.totalPosted}</h3>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
            <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applications</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{stats.totalApplications}</h3>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
            <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <CheckCircle size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Internships</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{stats.activeInternships}</h3>
            </div>
          </div>
        </div>

        {/* Recent Internships Table */}
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Internships</h2>
            <button 
              onClick={() => navigate('/industry/post-internship')}
              className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-4 px-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                  <th className="py-4 px-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="py-4 px-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applications</th>
                  <th className="py-4 px-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Deadline</th>
                  <th className="py-4 px-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInternships.map(intern => (
                  <tr key={intern.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group">
                    <td className="py-4 px-2 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/40 dark:group-hover:text-emerald-400 transition-colors">
                        <Briefcase size={20} />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{intern.title}</span>
                    </td>
                    <td className="py-4 px-2 text-slate-600 dark:text-slate-400 font-medium">{intern.location}</td>
                    <td className="py-4 px-2">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                        {intern.applications} Applicants
                      </span>
                    </td>
                    <td className="py-4 px-2 text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2">
                      <Calendar size={16} /> {intern.deadline}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                        intern.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {intern.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
