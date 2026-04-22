import { useState } from 'react';
import { createInternship } from '../services/industryApi';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const PostInternship = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    shortDescription: '',
    fullDescription: '',
    domain: '',
    type: '',
    stipend: '',
    location: '',
    startDate: '',
    endDate: '',
    lastDateToApply: '',
    skillsRequired: '',
    responsibilities: ''
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error message when user starts typing
    if (errorMsg) setErrorMsg('');
  };

  const validateForm = () => {
    // Required fields validation
    if (!formData.name.trim()) {
      setErrorMsg('Internship Name is required');
      return false;
    }
    if (!formData.title.trim()) {
      setErrorMsg('Title is required');
      return false;
    }
    if (!formData.shortDescription.trim()) {
      setErrorMsg('Short Description is required');
      return false;
    }
    if (!formData.domain.trim()) {
      setErrorMsg('Domain is required');
      return false;
    }
    if (!formData.type.trim()) {
      setErrorMsg('Type is required');
      return false;
    }
    if (!formData.stipend || parseFloat(formData.stipend) <= 0) {
      setErrorMsg('Stipend must be a positive number');
      return false;
    }
    if (!formData.location.trim()) {
      setErrorMsg('Location is required');
      return false;
    }
    if (!formData.startDate) {
      setErrorMsg('Start Date is required');
      return false;
    }
    if (!formData.endDate) {
      setErrorMsg('End Date is required');
      return false;
    }
    if (!formData.lastDateToApply) {
      setErrorMsg('Last Date to Apply is required');
      return false;
    }

    // Date validations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const lastDateToApply = new Date(formData.lastDateToApply);

    if (startDate < today) {
      setErrorMsg('Start date must be today or in the future');
      return false;
    }
    if (endDate <= startDate) {
      setErrorMsg('End date must be after start date');
      return false;
    }
    if (endDate <= today) {
      setErrorMsg('End date must be in the future');
      return false;
    }
    if (lastDateToApply < today) {
      setErrorMsg('Last date to apply must be today or in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Parse comma-separated strings into arrays for backend requirements
      const skillsArray = formData.skillsRequired
        ? formData.skillsRequired.split(',').map(skill => skill.trim()).filter(Boolean)
        : [];

      const responsibilitiesArray = formData.responsibilities
        ? formData.responsibilities.split(',').map(resp => resp.trim()).filter(Boolean)
        : [];

      const payload = {
        name: formData.name,
        title: formData.title,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        domain: formData.domain,
        type: formData.type,
        stipend: parseFloat(formData.stipend),
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.endDate,
        lastDateToApply: formData.lastDateToApply,
        skillsRequired: skillsArray,
        responsibilities: responsibilitiesArray
      };

      await createInternship(payload);
      
      setLoading(false);
      setSuccessMsg('Internship posted successfully!');
      setFormData({
        name: '',
        title: '',
        shortDescription: '',
        fullDescription: '',
        domain: '',
        type: '',
        stipend: '',
        location: '',
        startDate: '',
        endDate: '',
        lastDateToApply: '',
        skillsRequired: '',
        responsibilities: ''
      });
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setLoading(false);
      console.error("Full Error Response:", error.response?.data);
      
      let errMsg = 'Failed to create internship. Please try again.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errMsg = error.response.data;
        } else if (error.response.data.message) {
          errMsg = error.response.data.message;
        } else if (error.response.data.errors || typeof error.response.data === 'object') {
          // Flatten spring validation errors
          errMsg = JSON.stringify(error.response.data);
        }
      }
      
      setErrorMsg(errMsg);
    }
  };

  const inputClass = "box-border w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:focus:ring-emerald-400 transition-all text-left";

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Post a New Internship</h1>
          <p className="text-slate-600 dark:text-slate-400">Fill in all the details to create an internship posting</p>
        </div>

        {successMsg && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
            <span className="text-green-800 dark:text-green-200 font-medium">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
            <span className="text-red-800 dark:text-red-200 font-medium">{errorMsg}</span>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Internship Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  id="name" 
                  name="name" 
                  className={inputClass}
                  placeholder="e.g. TechNova Solutions" 
                  value={formData.name} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Internship Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  id="title" 
                  name="title" 
                  className={inputClass}
                  placeholder="e.g. Frontend Developer" 
                  value={formData.title} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  id="type" 
                  name="type" 
                  className={inputClass}
                  placeholder="e.g. Full-time, Part-time" 
                  value={formData.type} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="domain" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Domain <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  id="domain" 
                  name="domain" 
                  className={inputClass}
                  placeholder="e.g. IT, Finance, Healthcare" 
                  value={formData.domain} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  id="location" 
                  name="location" 
                  className={inputClass}
                  placeholder="e.g. Remote, New York" 
                  value={formData.location} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stipend" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Stipend (per month) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number"
                  id="stipend" 
                  name="stipend" 
                  className={inputClass}
                  step="0.01"
                  placeholder="e.g. 5000" 
                  value={formData.stipend} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                id="shortDescription" 
                name="shortDescription" 
                placeholder="Brief description of the internship (1-2 lines)"
                value={formData.shortDescription}
                onChange={handleChange}
                className={inputClass}
                rows="2"
              ></textarea>
            </div>

            <div>
              <label htmlFor="fullDescription" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Full Description
              </label>
              <textarea 
                id="fullDescription" 
                name="fullDescription" 
                placeholder="Detailed description of the internship, responsibilities, and expectations"
                value={formData.fullDescription}
                onChange={handleChange}
                className={inputClass}
                rows="4"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date"
                  id="startDate" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date"
                  id="endDate" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lastDateToApply" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Last Date to Apply <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date"
                  id="lastDateToApply" 
                  name="lastDateToApply" 
                  value={formData.lastDateToApply} 
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="skillsRequired" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Skills Required (comma-separated)
              </label>
              <textarea 
                id="skillsRequired" 
                name="skillsRequired" 
                placeholder="e.g. React, Node.js, MongoDB"
                value={formData.skillsRequired}
                onChange={handleChange}
                className={inputClass}
                rows="2"
              ></textarea>
            </div>

            <div>
              <label htmlFor="responsibilities" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Responsibilities (comma-separated)
              </label>
              <textarea 
                id="responsibilities" 
                name="responsibilities" 
                placeholder="e.g. Build UI components, Write unit tests, Code reviews"
                value={formData.responsibilities}
                onChange={handleChange}
                className={inputClass}
                rows="2"
              ></textarea>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? 'Creating Internship...' : 'Create Internship'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
