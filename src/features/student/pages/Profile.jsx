import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getStudentProfile, updateStudentProfile } from "../services/studentApi";
import { setUser } from "../../auth/store/authSlice";
import { User, Phone, MapPin, Building, GraduationCap, Save, Loader2 } from "lucide-react";

export const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    contactNumber: "",
    department: "",
    collegeName: "",
    educationStatus: "",
    enrollmentIds: []
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfile();
        // Fallback to redux user state if profile fields are empty
        setFormData({
          id: res.data.id || user?.id || "",
          name: res.data.name || user?.name || "",
          email: res.data.email || user?.email || "",
          contactNumber: res.data.contactNumber || user?.contactNumber || "",
          department: res.data.department || user?.department || "",
          collegeName: res.data.collegeName || user?.collegeName || "",
          educationStatus: res.data.educationStatus || user?.educationStatus || "",
          enrollmentIds: res.data.enrollmentIds || []
        });
      } catch (err) {
        if (user) {
          setFormData({
            id: user.id || "",
            name: user.name || "",
            email: user.email || "",
            contactNumber: user.contactNumber || "",
            department: user.department || "",
            collegeName: user.collegeName || "",
            educationStatus: user.educationStatus || "",
            enrollmentIds: []
          });
        }
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateStudentProfile(formData);
      toast.success("Profile updated successfully!");
      if (res.data) {
        dispatch(setUser({ ...user, ...res.data }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                My Profile
                {formData.id && <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">ID: #{formData.id}</span>}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your personal and educational information.</p>
            </div>
          </div>

          {formData.enrollmentIds?.length > 0 && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Active Enrollments</span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{formData.enrollmentIds.length}</span>
            </div>
          )}
        </div>

        <hr className="my-6 border-slate-100 dark:border-slate-700" />

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <User size={16} className="text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                className="box-border w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <span className="text-slate-400">@</span> Email Address
              </label>
              <input
                type="email"
                name="email"
                disabled
                className="box-border w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 cursor-not-allowed transition-all text-left"
                value={formData.email}
                title="Email address cannot be changed."
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Phone size={16} className="text-slate-400" /> Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                className="box-border w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            {/* College Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Building size={16} className="text-slate-400" /> College Name
              </label>
              <input
                type="text"
                name="collegeName"
                className="box-border w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="Indian Institute of Technology"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" /> Department
              </label>
              <input
                type="text"
                name="department"
                className="box-border w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-left"
                value={formData.department}
                onChange={handleChange}
                placeholder="Computer Science"
              />
            </div>

            {/* Education Status */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <GraduationCap size={16} className="text-slate-400" /> Education Status
              </label>
              <select
                name="educationStatus"
                className="box-border w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-left"
                value={formData.educationStatus}
                onChange={handleChange}
              >
                <option value="" disabled>Select your status...</option>
                <option value="SCHOOL">School</option>
                <option value="DIPLOMA">Diploma</option>
                <option value="UNDERGRADUATE">Undergraduate</option>
                <option value="POSTGRADUATE">Postgraduate</option>
                <option value="PHD">PhD</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-slate-100 dark:border-slate-700 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

