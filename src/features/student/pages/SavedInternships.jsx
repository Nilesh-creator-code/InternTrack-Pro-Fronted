import React from "react";
import { Bookmark, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SavedInternships = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Saved Internships</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        View internships you've bookmarked for later.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4">
                    <Bookmark size={36} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Saved Internships</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
                    You haven't saved any internships yet. Browse available internships and save them to apply later!
                </p>
                <button 
                    onClick={() => navigate('/student/internships')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                    Browse Internships <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};
