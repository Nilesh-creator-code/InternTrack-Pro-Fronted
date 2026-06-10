import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Briefcase,
  ExternalLink,
  FileText,
  GitBranch,
  GraduationCap,
  Link2,
  Loader2,
  Mail,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import {
  getAllApplications,
  updateIndustryApplicationStatus,
} from '../services/industryApi';

const STATUS_OPTIONS = ['APPROVED', 'REJECTED', 'ONGOING'];

const getValue = (item, keys, fallback = 'N/A') => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item[key] !== null && item[key] !== '') {
      return item[key];
    }
  }

  return fallback;
};

const extractApplications = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.content)) return response.data.content;
  return [];
};

const statusBadgeClasses = {
  APPROVED: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/35 dark:text-emerald-300 dark:border-emerald-800',
  REJECTED: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/35 dark:text-rose-300 dark:border-rose-800',
  ONGOING: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/35 dark:text-amber-300 dark:border-amber-800',
  APPLIED: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/35 dark:text-blue-300 dark:border-blue-800',
};

const getStatusBadge = (status = 'ONGOING') => (
  <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${statusBadgeClasses[status] || statusBadgeClasses.ONGOING}`}>
    {status}
  </span>
);

const DetailLine = ({ icon, children }) => (
  <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
    {icon}
    <span className="min-w-0 truncate">{children}</span>
  </div>
);

const LinkButton = ({ href, icon, label }) => {
  if (!href) {
    return (
      <span className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-500">
        {icon}
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300"
    >
      {icon}
      {label}
      <ExternalLink size={12} className="opacity-60" />
    </a>
  );
};

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllApplications();
      setApplications(extractApplications(response));
      setErrorMsg('');
    } catch (error) {
      console.error('Failed to fetch applications:', error.response?.data || error.message);
      setErrorMsg('Failed to load applications. Please try again.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const getApplicationId = (application) =>
    getValue(application, ['id', 'applicationId', 'applicationID'], null);

  const getApplicationStatus = (application) =>
    getValue(application, ['applicationStatus', 'status'], 'ONGOING');

  const getResumeUrl = (application) =>
    getValue(application, ['resumeUrl', 'resumeURL', 'resumeLink', 'resume', 'resumePath'], '');

  const handleStatusChange = async (application, status) => {
    const applicationId = getApplicationId(application);

    if (!applicationId) {
      toast.error('Application ID is missing.');
      return;
    }

    const previousApplications = applications;

    try {
      setUpdatingId(applicationId);
      setApplications((prev) =>
        prev.map((app) =>
          getApplicationId(app) === applicationId
            ? { ...app, applicationStatus: status, status }
            : app
        )
      );

      const updatedApplication = await updateIndustryApplicationStatus(applicationId, status);

      if (updatedApplication && typeof updatedApplication === 'object') {
        setApplications((prev) =>
          prev.map((app) =>
            getApplicationId(app) === applicationId
              ? {
                  ...app,
                  ...updatedApplication,
                  applicationStatus: updatedApplication.applicationStatus || updatedApplication.status || status,
                  status: updatedApplication.status || updatedApplication.applicationStatus || status,
                }
              : app
          )
        );
      }

      toast.success(`Application status updated to ${status}.`);
    } catch (error) {
      console.error('Failed to update application status:', error.response?.data || error.message);
      setApplications(previousApplications);
      toast.error('Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatusSelect = (app) => {
    const applicationId = getApplicationId(app);
    const status = getApplicationStatus(app);
    const isUpdating = updatingId === applicationId;

    return (
      <div className="relative">
        <select
          value={STATUS_OPTIONS.includes(status) ? status : ''}
          disabled={isUpdating}
          onChange={(event) => handleStatusChange(app, event.target.value)}
          className="h-11 w-full min-w-[150px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-bold text-slate-700 shadow-sm outline-none transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-emerald-700"
        >
          {!STATUS_OPTIONS.includes(status) && (
            <option value="" disabled>
              Select status
            </option>
          )}
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {isUpdating && (
          <Loader2 size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-emerald-500" />
        )}
      </div>
    );
  };

  const renderLinks = (app) => {
    const resumeUrl = getResumeUrl(app);
    const githubLink = getValue(app, ['githubLink', 'githubUrl'], '');
    const linkedinLink = getValue(app, ['linkedinLink', 'linkedinUrl', 'linkedInLink'], '');

    return (
      <div className="flex flex-wrap gap-2">
        <LinkButton href={resumeUrl} icon={<FileText size={15} />} label="Resume" />
        <LinkButton href={githubLink} icon={<GitBranch size={15} />} label="GitHub" />
        <LinkButton href={linkedinLink} icon={<Link2 size={15} />} label="LinkedIn" />
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 text-left">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            Industry Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl">
            Manage Applications
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Review candidate profiles, open portfolio links, and update each application status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchApplications}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
        >
          <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Applications
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {applications.length} total application{applications.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full min-w-[1180px] border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:bg-slate-900/45 dark:text-slate-400">
                <th className="w-[22%] px-6 py-4 text-left">Applicant</th>
                <th className="w-[20%] px-6 py-4 text-left">Education</th>
                <th className="w-[10%] px-6 py-4 text-left">Location</th>
                <th className="w-[20%] px-6 py-4 text-left">Internship</th>
                <th className="w-[14%] px-6 py-4 text-left">Links</th>
                <th className="w-[7%] px-6 py-4 text-left">Status</th>
                <th className="w-[7%] px-6 py-4 text-left">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                    <Loader2 className="mx-auto mb-3 animate-spin text-emerald-500" size={28} />
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app) => {
                  const applicationId = getApplicationId(app);
                  const status = getApplicationStatus(app);

                  return (
                    <tr key={applicationId || `${getValue(app, ['studentEmail', 'email'], '')}-${getValue(app, ['title'], '')}`} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-700/35">
                      <td className="px-6 py-5 align-top">
                        <div className="min-w-0">
                          <p className="truncate text-base font-extrabold text-slate-900 dark:text-white">
                            {getValue(app, ['studentName', 'applicantName', 'name', 'fullName'])}
                          </p>
                          <DetailLine icon={<Mail size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />}>
                            {getValue(app, ['studentEmail', 'email', 'applicantEmail'])}
                          </DetailLine>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <p className="font-bold text-slate-800 dark:text-slate-100">
                          {getValue(app, ['department'])}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {getValue(app, ['collegeName'])}
                        </p>
                        <DetailLine icon={<GraduationCap size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />}>
                          {getValue(app, ['educationStatus'])}
                        </DetailLine>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <DetailLine icon={<MapPin size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />}>
                          {getValue(app, ['location'])}
                        </DetailLine>
                      </td>
                      <td className="px-6 py-5 align-top">
                        <p className="font-extrabold leading-snug text-slate-900 dark:text-white">
                          {getValue(app, ['internshipTitle', 'title', 'appliedRole', 'role'])}
                        </p>
                        <DetailLine icon={<Briefcase size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />}>
                          {getValue(app, ['domain'])}
                        </DetailLine>
                      </td>
                      <td className="px-6 py-5 align-top">
                        {renderLinks(app)}
                      </td>
                      <td className="px-6 py-5 align-top">
                        {getStatusBadge(status)}
                      </td>
                      <td className="px-6 py-5 align-top">
                        {renderStatusSelect(app)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                    No applications received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 p-4 xl:hidden sm:p-5">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
              <Loader2 className="mx-auto mb-3 animate-spin text-emerald-500" size={28} />
              Loading applications...
            </div>
          ) : applications.length > 0 ? (
            applications.map((app) => {
              const applicationId = getApplicationId(app);
              const status = getApplicationStatus(app);

              return (
                <article key={applicationId || `${getValue(app, ['studentEmail', 'email'], '')}-${getValue(app, ['title'], '')}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/45">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {getValue(app, ['studentName', 'applicantName', 'name', 'fullName'])}
                      </p>
                      <DetailLine icon={<Mail size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />}>
                        {getValue(app, ['studentEmail', 'email', 'applicantEmail'])}
                      </DetailLine>
                    </div>
                    {getStatusBadge(status)}
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Education
                      </p>
                      <p className="mt-2 font-bold text-slate-900 dark:text-white">
                        {getValue(app, ['department'])}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {getValue(app, ['collegeName'])}
                      </p>
                      <DetailLine icon={<GraduationCap size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />}>
                        {getValue(app, ['educationStatus'])}
                      </DetailLine>
                      <DetailLine icon={<MapPin size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />}>
                        {getValue(app, ['location'])}
                      </DetailLine>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Internship
                      </p>
                      <p className="mt-2 font-bold text-slate-900 dark:text-white">
                        {getValue(app, ['internshipTitle', 'title', 'appliedRole', 'role'])}
                      </p>
                      <DetailLine icon={<Briefcase size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />}>
                        {getValue(app, ['domain'])}
                      </DetailLine>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {renderLinks(app)}
                    <div className="w-full sm:w-[180px]">
                      {renderStatusSelect(app)}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
              No applications received yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
