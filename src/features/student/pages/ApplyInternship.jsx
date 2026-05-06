import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Code,
  Link2,
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { submitApplication } from "../services/studentApi";

/* ─────────────────────────────────────────────
   Small reusable field-wrapper
───────────────────────────────────────────── */
const Field = ({ label, required, hint, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
      {label}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
    )}
    {error && (
      <p className="text-xs text-rose-500 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

/* ─────────────────────────────────────────────
   Validators
───────────────────────────────────────────── */
const GITHUB_RE = /^https?:\/\/(www\.)?github\.com\/.+/i;
const LINKEDIN_RE =
  /^https?:\/\/(www\.)?linkedin\.com\/(in|company|pub)\/.+/i;

export const ApplyInternship = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // The internship title/company can be passed via router state (optional)
  const internshipTitle =
    location.state?.title || `Internship #${internshipId}`;
  const internshipCompany = location.state?.company || "";

  const [form, setForm] = useState({
    location: "",
    githubLink: "",
    linkedinLink: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, resume: "Only PDF files are allowed." }));
      setResumeFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size must be under 5 MB.",
      }));
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: "" }));
  };

  /* ── validation ── */
  const validate = () => {
    const errs = {};
    if (!form.location.trim()) errs.location = "Location is required.";
    if (!resumeFile) errs.resume = "Resume (PDF) is required.";
    if (form.githubLink && !GITHUB_RE.test(form.githubLink))
      errs.githubLink = "Enter a valid GitHub URL (e.g. https://github.com/username)";
    if (form.linkedinLink && !LINKEDIN_RE.test(form.linkedinLink))
      errs.linkedinLink =
        "Enter a valid LinkedIn URL (e.g. https://linkedin.com/in/username)";
    return errs;
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const fd = new FormData();
    fd.append("internshipId", internshipId);
    fd.append("location", form.location.trim());
    fd.append("resume", resumeFile);
    if (form.githubLink.trim()) fd.append("githubLink", form.githubLink.trim());
    if (form.linkedinLink.trim())
      fd.append("linkedinLink", form.linkedinLink.trim());

    setSubmitting(true);
    try {
      await submitApplication(fd);
      setSubmitted(true);
      toast.success("Application submitted successfully! 🎉");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        "Failed to submit application. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ────────────────────────────────────────
     SUCCESS STATE
  ──────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Application Submitted!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Your application for{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {internshipTitle}
              </span>{" "}
              has been received. We'll keep you updated on the status.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => navigate("/student/internships")}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-600/25"
            >
              Browse More
            </button>
            <button
              onClick={() => navigate("/student/applications")}
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all border border-slate-200 dark:border-slate-600"
            >
              My Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     FORM
  ──────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Internships
        </button>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          {/* Header banner */}
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-7">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Briefcase size={24} className="text-white" />
              </div>
              <div>
                <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-1">
                  Internship Application
                </p>
                <h1 className="text-white text-2xl font-extrabold leading-tight">
                  {internshipTitle}
                </h1>
                {internshipCompany && (
                  <p className="text-blue-200 text-sm mt-1">
                    {internshipCompany}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
            {/* Hidden internship ID indicator */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-400 text-sm font-medium">
              <CheckCircle2 size={16} className="shrink-0" />
              Internship ID <span className="font-bold ml-1">#{internshipId}</span>{" "}
              auto-linked to this application.
            </div>

            {/* Location */}
            <Field
              label="Current Location"
              required
              hint="City, State or Country where you are currently based."
              error={errors.location}
            >
              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="off"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={form.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${
                      errors.location
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-400/30"
                        : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    }`}
                />
              </div>
            </Field>

            {/* Resume Upload */}
            <Field
              label="Resume"
              required
              hint="Upload your latest resume. PDF only, max 5 MB."
              error={errors.resume}
            >
              <label
                htmlFor="resume"
                className={`cursor-pointer flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl py-8 px-6 transition-all
                  ${
                    resumeFile
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/15"
                      : errors.resume
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-900/10"
                      : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  }`}
              >
                {resumeFile ? (
                  <>
                    <FileText size={32} className="text-emerald-500" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {(resumeFile.size / 1024).toFixed(1)} KB · Click to replace
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={32} className="text-slate-400" />
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Click to upload resume
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF · Max 5 MB
                      </p>
                    </div>
                  </>
                )}
                <input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </Field>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-slate-200 dark:border-slate-700" />
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Optional Links
              </span>
              <hr className="flex-1 border-slate-200 dark:border-slate-700" />
            </div>

            {/* GitHub */}
            <Field
              label="GitHub Profile"
              hint="https://github.com/yourusername"
              error={errors.githubLink}
            >
              <div className="relative">
                <Code
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="githubLink"
                  name="githubLink"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={form.githubLink}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${
                      errors.githubLink
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-400/30"
                        : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    }`}
                />
              </div>
            </Field>

            {/* LinkedIn */}
            <Field
              label="LinkedIn Profile"
              hint="https://linkedin.com/in/yourusername"
              error={errors.linkedinLink}
            >
              <div className="relative">
                <Link2
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  id="linkedinLink"
                  name="linkedinLink"
                  type="url"
                  placeholder="https://linkedin.com/in/yourusername"
                  value={form.linkedinLink}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none transition-all
                    ${
                      errors.linkedinLink
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-400/30"
                        : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    }`}
                />
              </div>
            </Field>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Briefcase size={18} />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
