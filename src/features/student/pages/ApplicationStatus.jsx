import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Code,
  Eye,
  FileText,
  Link2,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { getStudentApplications } from "../services/studentApi";

export const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getStudentApplications();
      setApplications(res.data || []);
    } catch (err) {
      toast.error("Failed to load your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getValue = (app, keys, fallback = "Not provided") => {
    for (const key of keys) {
      const value = app?.[key];
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        return value;
      }
    }
    return fallback;
  };

  const formatDate = (value) => {
    if (!value) return "Recently";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getResumeUrl = (app) =>
    getValue(app, ["resumeUrl", "resumeLink", "resumePath", "resume", "resumeFileUrl"], "");

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return (
          <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-emerald-200 dark:border-emerald-800">
            Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-rose-200 dark:border-rose-800">
            Rejected
          </span>
        );
      case "APPLIED":
      case "PENDING":
        return (
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-blue-200 dark:border-blue-800">
            Applied
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-slate-200 dark:border-slate-700">
            {status || "Unknown"}
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            My Applications
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track the status of your internship applications.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
        >
          Refresh
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
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            No Applications Yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            It looks like you haven't applied to any internships. Start browsing to find your next opportunity!
          </p>
          <button
            onClick={() => navigate("/student/internships")}
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
                  <th className="font-bold text-slate-600 dark:text-slate-300 text-sm uppercase px-6 py-4">
                    Role / Domain
                  </th>
                  <th className="font-bold text-slate-600 dark:text-slate-300 text-sm uppercase px-6 py-4">
                    Company
                  </th>
                  <th className="font-bold text-slate-600 dark:text-slate-300 text-sm uppercase px-6 py-4">
                    Applied On
                  </th>
                  <th className="font-bold text-slate-600 dark:text-slate-300 text-sm uppercase px-6 py-4 text-center">
                    Status
                  </th>
                  <th className="font-bold text-slate-600 dark:text-slate-300 text-sm uppercase px-6 py-4 text-right">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {applications.map((app) => (
                  <tr
                    key={getValue(app, ["id", "applicationId"], `${app.internshipTitle}-${app.applicationDate}`)}
                    onClick={() => setSelectedApplication(app)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {getValue(app, ["internshipTitle", "title"], "Unknown Role")}
                          </p>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {getValue(app, ["internshipDomain", "domain"], "Unknown Domain")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                        <Building2 size={16} className="text-slate-400" />
                        {getValue(app, ["industryName", "company", "companyName"], "Unknown Company")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                        <Calendar size={16} className="text-slate-400" />
                        {formatDate(getValue(app, ["applicationDate", "appliedOn", "createdAt"], ""))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApplication(app);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-sm transition-colors"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                  Application Details
                </p>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {getValue(selectedApplication, ["internshipTitle", "title"], "Unknown Role")}
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {getValue(selectedApplication, ["industryName", "company", "companyName"], "Unknown Company")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(selectedApplication.status)}
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  {getValue(selectedApplication, ["internshipDomain", "domain"], "Unknown Domain")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                    Application ID
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    #{getValue(selectedApplication, ["id", "applicationId"], "N/A")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                    Applied On
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(getValue(selectedApplication, ["applicationDate", "appliedOn", "createdAt"], ""))}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                    Current Location
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    {getValue(selectedApplication, ["location", "studentLocation", "currentLocation"])}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/40">
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
                    Internship ID
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    #{getValue(selectedApplication, ["internshipId", "internshipID"], "N/A")}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Submitted Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <a
                    href={getValue(selectedApplication, ["githubLink", "githubUrl"], "#")}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4 font-bold transition-colors ${
                      getValue(selectedApplication, ["githubLink", "githubUrl"], "")
                        ? "text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        : "text-slate-400 pointer-events-none bg-slate-50 dark:bg-slate-900/40"
                    }`}
                  >
                    <Code size={18} />
                    GitHub
                  </a>
                  <a
                    href={getValue(selectedApplication, ["linkedinLink", "linkedinUrl", "linkedInLink"], "#")}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4 font-bold transition-colors ${
                      getValue(selectedApplication, ["linkedinLink", "linkedinUrl", "linkedInLink"], "")
                        ? "text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        : "text-slate-400 pointer-events-none bg-slate-50 dark:bg-slate-900/40"
                    }`}
                  >
                    <Link2 size={18} />
                    LinkedIn
                  </a>
                  <a
                    href={getResumeUrl(selectedApplication) || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4 font-bold transition-colors ${
                      getResumeUrl(selectedApplication)
                        ? "text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        : "text-slate-400 pointer-events-none bg-slate-50 dark:bg-slate-900/40"
                    }`}
                  >
                    <FileText size={18} />
                    Resume
                  </a>
                </div>
              </div>

              {(selectedApplication.shortDescription ||
                selectedApplication.fullDescription ||
                selectedApplication.description) && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Internship Description
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                    {getValue(selectedApplication, ["fullDescription", "description", "shortDescription"])}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
