import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../auth/store/authSlice";
import { 
  Home, 
  Search, 
  Briefcase,
  FileText,
  Building2,
  LogOut, 
  Bell,
  Moon,
  Sun,
  ClipboardList
} from "lucide-react";

export const IndustryLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const navLinks = [
    { name: "Dashboard", path: "/industry/dashboard", icon: Home },
    { name: "My Internships", path: "/industry/my-internships", icon: ClipboardList },
    { name: "Post Internship", path: "/industry/post-internship", icon: FileText },
    { name: "Applications", path: "/industry/applications", icon: Briefcase },
  ];

  return (
    <div className="fixed inset-0 w-full h-full flex bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 text-left">
      
      {/* ── Sidebar (Dark Navy to feel corporate/industry) ── */}
      <aside className="w-[260px] bg-[#0f172a] border-r border-slate-800 flex flex-col hidden md:flex z-20 transition-all text-white">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80">
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
            <Building2 size={24} className="text-emerald-400" /> SmartEdu
          </span>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`
                }
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-800/50 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors font-medium text-sm border border-slate-700/50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* ── Top Navbar ── */}
        <header className="h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 z-10 transition-colors duration-300">
          
          <div className="flex-1 max-w-xl">
            <div className="relative flex items-center w-full h-11 rounded-full focus-within:shadow-sm bg-slate-100 dark:bg-slate-900 overflow-hidden transition-all border border-transparent focus-within:border-emerald-300 dark:focus-within:border-emerald-600 px-4 gap-3">
              <div className="text-slate-400 dark:text-slate-500 flex items-center">
                <Search size={18} />
              </div>
              <input
                className="box-border flex-1 h-full outline-none text-sm text-slate-700 dark:text-slate-200 bg-transparent placeholder-slate-400 text-left"
                type="text"
                id="search"
                placeholder="Search candidates or applications..." 
              />
            </div>
          </div>

          <div className="flex items-center gap-5 ml-4">
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification */}
            <button className="relative p-2.5 text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer pl-6 border-l border-slate-200 dark:border-slate-700 ml-1">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-0.5">
                  {user?.companyName || user?.name || "Company Org"}
                </p>
                <p className="text-xs text-slate-500">
                  Industry Partner
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold shadow-sm shrink-0">
                {(user?.companyName || user?.name || "C")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content Area ── */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6 md:p-8 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
};

