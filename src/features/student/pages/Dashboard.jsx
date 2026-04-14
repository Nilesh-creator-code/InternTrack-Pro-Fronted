import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  IndianRupee, 
  ChevronRight,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllInternships } from "../services/studentApi";

// Standard Badge component
const StatusBadge = ({ status }) => {
  const styles = {
    APPLIED: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    SHORTLISTED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  }[status] || "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles}`}>
      {status}
    </span>
  );
};

export const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Dummy stats
  const stats = [
    { title: "Total Applications", value: "12", icon: Briefcase, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { title: "Shortlisted", value: "3", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { title: "Accepted", value: "1", icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { title: "Rejected", value: "2", icon: XCircle, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
  ];

  const [internships, setInternships] = useState([]);

  useEffect(() => {
    // Fetch live internships to populate "Recommended for You" section
    const fetchInternships = async () => {
      try {
        const response = await getAllInternships(0, 3); // Top 3
        // If Backend returns Page object with content, or flat array
        const list = response.data.content || response.data;
        if (Array.isArray(list)) {
          // slice first 3 items just in case the backend didn't paginate perfectly
          setInternships(list.slice(0, 3)); 
        }
      } catch (err) {
        console.error("Failed to fetch internships on dashboard:", err);
      }
    };
    fetchInternships();
  }, []);

  // Dummy Applications
  const recentApplications = [
    { id: 101, title: "Software Eng Intern", company: "Google", date: "2 days ago", status: "SHORTLISTED" },
    { id: 102, title: "Backend Intern", company: "Amazon", date: "1 week ago", status: "APPLIED" },
    { id: 103, title: "UI/UX Intern", company: "Zomato", date: "2 weeks ago", status: "REJECTED" },
    { id: 104, title: "Data Sci Intern", company: "Microsoft", date: "1 month ago", status: "ACCEPTED" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      
      {/* ── Welcome Section ── */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center relative transition-colors duration-300">
        <div className="flex-1 text-center sm:pr-40">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Welcome back, {user?.name || "Student"}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-[15px]">
            You're making great progress. Keep applying to land your dream role.
          </p>
        </div>
        <div className="sm:absolute sm:right-8 bg-blue-50/80 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-6 py-4 rounded-xl flex items-center gap-4 border border-blue-100 dark:border-blue-800 shrink-0 mt-6 sm:mt-0">
          <div className="text-blue-600 dark:text-blue-400">
            <UserCheck size={24} />
          </div>
          <div className="flex flex-col w-32">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">PROFILE COMPLETION</span>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[70%] rounded-full"></div>
              </div>
              <span className="text-sm font-extrabold text-blue-800 dark:text-blue-300">70%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center transition-all hover:-translate-y-1 duration-300">
              <div className="flex flex-col justify-center max-w-[100px]">
                <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-snug">{stat.title}</p>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon className={stat.color} size={22} strokeWidth={2.5} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Left Column: Applications ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Applications Table */}
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Applications</h2>
              <Link to="/student/applications" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="border-b border-transparent text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                    <th className="px-1 py-4">ROLE</th>
                    <th className="px-4 py-4">COMPANY</th>
                    <th className="px-4 py-4">DATE</th>
                    <th className="px-4 py-4">STATUS</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="border-b border-slate-50 dark:border-slate-700/50 last:border-none hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-1 py-5 text-slate-900 dark:text-slate-100 max-w-[120px]">{app.title}</td>
                      <td className="px-4 py-5 font-normal text-slate-500 dark:text-slate-400">{app.company}</td>
                      <td className="px-4 py-5 font-normal text-slate-500 dark:text-slate-500 max-w-[80px]">{app.date}</td>
                      <td className="px-4 py-5">
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Application Progress Tracker */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors duration-300">
             <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">Current Active Track: Google</h2>
             
             <div className="relative flex justify-between items-center w-full max-w-lg mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
                {/* Active progress line up to shortlisting */}
                <div className="absolute top-1/2 left-0 w-1/3 h-1 bg-blue-500 dark:bg-blue-600 -translate-y-1/2 z-0"></div>
                
                {[
                  { label: "Applied", active: true },
                  { label: "Shortlisted", active: true },
                  { label: "Interview", active: false },
                  { label: "Offer", active: false },
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full border-4 ${step.active ? 'bg-blue-600 border-blue-100 dark:border-blue-900' : 'bg-slate-300 dark:bg-slate-600 border-white dark:border-slate-800'} flex items-center justify-center transition-all`}>
                      {step.active && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <span className={`text-xs font-semibold ${step.active ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{step.label}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* ── Right Column: Recommended Internships ── */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col h-full transition-colors duration-300">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center px-4 mb-6 leading-snug">Recommended for You</h2>
            <div className="flex-1 space-y-4">
              {internships.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm">No new internships found.</div>
              ) : (
                internships.map((internship) => (
                  <div key={internship.id} className="group border-none shadow-sm rounded-2xl p-6 transition-all duration-300 cursor-pointer bg-slate-50/50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 flex flex-col items-center text-center">
                    <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 px-2">{internship.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">{internship.domain}</p>
                    
                    <div className="flex flex-col gap-2 mt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium justify-center">
                        <MapPin size={14} className="text-slate-400 dark:text-slate-500" />
                        {internship.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium justify-center">
                        <IndianRupee size={14} className="text-slate-400 dark:text-slate-500" />
                        ₹{internship.stipend} / month
                      </div>
                    </div>

                  <button className="w-full mt-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-700 dark:hover:text-white font-medium hover:border-blue-200 dark:hover:border-blue-500 py-2 rounded-lg text-sm transition-all duration-200">
                    Apply Now
                  </button>
                </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 text-center">
              <Link to="/student/internships" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                Browse All ➔
              </Link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
