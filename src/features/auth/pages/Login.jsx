import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, Building2, Mail, Lock, Loader2 } from "lucide-react";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    
    // De-structure correct variables
    const { loading, handleLoginStudent, handleLoginIndustry } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
      if (!email) return setError("Email is required");
      if (!password) return setError("Password is required");
      setError("");
      return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validate()) return;

        if (role === "student") {
            await handleLoginStudent(email, password);
        } else {
            await handleLoginIndustry(email, password);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center font-sans tracking-wide bg-[#0f172a] text-slate-100 overflow-y-auto">
            
            {/* Background Decor */}
            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative w-full max-w-md p-6 xs:p-8 m-4 rounded-[2rem] bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl z-10 transition-all duration-300">
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Welcome Back</h2>
                <p className="text-slate-400 font-medium">Log in to your dashboard to continue</p>
              </div>

              {/* Role Selector Tabs (Replaced Dropdown) */}
              <div className="flex p-1 bg-slate-800/80 rounded-xl mb-8 border border-slate-700/50 shadow-inner">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 ${
                    role === "student" 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <User size={18} /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("industry")}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 ${
                    role === "industry" 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <Building2 size={18} /> Industry
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  
                  {/* Email Input */}
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="text-slate-500" size={18} />
                      </div>
                      <input 
                        type="email" 
                        placeholder="you@example.com" 
                        value={email} 
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if(error) setError("");
                        }} 
                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border ${error.includes("Email") ? "border-rose-500/50 focus:border-rose-500" : "border-slate-700 focus:border-slate-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all font-medium`}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="text-slate-500" size={18} />
                      </div>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if(error) setError("");
                        }} 
                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border ${error.includes("Password") ? "border-rose-500/50 focus:border-rose-500" : "border-slate-700 focus:border-slate-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all font-medium`}
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm font-bold text-center">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg mt-8 ${
                      role === "student" 
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25" 
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25"
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Log In Securely"}
                  </button>
              </form>

              {/* Footer Links */}
              <div className="mt-10 text-center border-t border-slate-700/50 pt-8">
                <p className="text-slate-400 text-sm font-medium mb-6">Don't have an account?</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/register-student")}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800/40 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-sm font-bold text-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <User size={16} className="text-blue-400" /> Register as Student
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/register-industry")}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800/40 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-sm font-bold text-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Building2 size={16} className="text-emerald-400" /> Register as Industry
                  </button>
                </div>
              </div>

            </div>
        </div>
    );
};