import React, { useState, useEffect } from "react";
import { X, Loader2, Edit2, Check, User, MapPin, Phone, Building2, AlignLeft, Info, Calendar } from "lucide-react";
import { getIndustryProfile, updateIndustryProfile } from "../services/industryApi";

export const IndustryProfileModal = ({ isOpen, onClose, onProfileUpdate }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadProfile();
      setIsEditing(false);
    }
  }, [isOpen]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await getIndustryProfile();
      setProfileData(data);
      setFormData(data || {});
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const responseMsg = await updateIndustryProfile(formData);
      setProfileData(formData);
      setIsEditing(false);
      setSuccessMessage(typeof responseMsg === 'string' ? responseMsg : "Profile updated successfully!");
      if (onProfileUpdate) {
        onProfileUpdate(formData.name || formData.companyName || formData.industryName);
      }
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Failed to update profile", error);
      setErrorMessage(error?.response?.data || error?.message || "Failed to update profile");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch(e) {
      return dateTimeStr;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <User className="text-emerald-500" />
            Industry Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700 dark:text-slate-300">
          
          {/* Status Messages */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2">
              <Check size={16} />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-xl text-sm font-medium flex items-center gap-2">
              <X size={16} />
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-sm text-slate-500">Loading your profile...</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Not Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Company Name</label>
                  <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                    <Building2 size={16} className="text-emerald-500" />
                    {profileData?.name || "N/A"}
                  </div>
                  <p className="text-xs text-rose-500 mt-1 italic opacity-80">* Name cannot be changed</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Account Created</label>
                  <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                    <Calendar size={16} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{formatDateTime(profileData?.localDateTime)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 italic opacity-80">* System generated</p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Profile Details</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800 focus:outline-none"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                       Title
                    </label>
                    {isEditing ? (
                      <input 
                        type="text"
                        name="title"
                        value={formData?.title || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                        placeholder="Enter company title (e.g. Software Development Company)"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm">
                        <Info size={14} className="text-slate-400" />
                        {profileData?.title || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      Contact Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contactNumber"
                        value={formData?.contactNumber || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                        placeholder="Enter contact number"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm">
                        <Phone size={14} className="text-slate-400" />
                        {profileData?.contactNumber || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData?.address || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                        placeholder="Enter address"
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm">
                        <MapPin size={14} className="text-slate-400" />
                        {profileData?.address || "Not provided"}
                      </div>
                    )}
                  </div>

                  {/* About Us */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      About Us
                    </label>
                    {isEditing ? (
                      <textarea
                        name="aboutUs"
                        value={formData?.aboutUs || ""}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm resize-none"
                        placeholder="Short description about your company"
                      />
                    ) : (
                      <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm">
                        <AlignLeft size={14} className="text-slate-400 mt-1 shrink-0" />
                        <p className="leading-relaxed">{profileData?.aboutUs || "Not provided"}</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      Detailed Description
                    </label>
                    {isEditing ? (
                      <textarea
                        name="description"
                        value={formData?.description || ""}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm resize-none"
                        placeholder="Comprehensive details of what you do"
                      />
                    ) : (
                      <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm">
                        <AlignLeft size={14} className="text-slate-400 mt-1 shrink-0" />
                        <p className="leading-relaxed">{profileData?.description || "Not provided"}</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        {isEditing && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(profileData || {});
              }}
              disabled={saving}
              className="px-5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-70"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryProfileModal;
