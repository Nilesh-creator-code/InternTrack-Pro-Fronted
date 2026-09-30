import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../auth/store/authSlice";
import {
  Home,
  Search,
  Building2,
  BookOpen,
  Users,
  ClipboardList,
  CalendarDays,
  Award,
  BarChart3,
  User,
  Settings,
  LogOut,
  Bell,
  Moon,
  Sun,
} from "lucide-react";

export const CollegeLayout = () => {
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
    { name: "Dashboard", path: "/college/dashboard", icon: Home },
    { name: "Departments", path: "/college/departments", icon: Building2 },
    { name: "Courses", path: "/college/courses", icon: BookOpen },
    { name: "Teachers", path: "/college/teachers", icon: Users },
    { name: "Students", path: "/college/students", icon: User },
    { name: "Enrollments", path: "/college/enrollments", icon: ClipboardList },
    { name: "Events", path: "/college/events", icon: CalendarDays },
    { name: "Certificates", path: "/college/certificates", icon: Award },
    { name: "Analytics", path: "/college/analytics", icon: BarChart3 },
    { name: "Profile", path: "/college/profile", icon: User },
    { name: "Settings", path: "/college/settings", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 w-full h-full flex bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 text-left">
      <aside className="w-[260px] bg-[#0f172a] border-r border-slate-800 flex-col hidden md:flex z-20 transition-all text-white">
        <div className="h-20 flex items-center px-6 border-b border-slate-800/80">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            SmartEdu College
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
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 z-10 transition-colors duration-300">
          <div className="flex-1 max-w-xl">
            <div className="relative flex items-center w-full h-11 rounded-full focus-within:shadow-sm bg-slate-100 dark:bg-slate-900 overflow-hidden transition-all border border-transparent focus-within:border-violet-300 dark:focus-within:border-violet-600 px-4 gap-3">
              <div className="text-slate-400 dark:text-slate-500 flex items-center">
                <Search size={18} />
              </div>
              <input
                className="flex-1 h-full outline-none text-sm text-slate-700 dark:text-slate-200 bg-transparent placeholder-slate-400"
                type="text"
                id="college-search"
                placeholder="Search department, courses, students..."
              />
            </div>
          </div>

          <div className="flex items-center gap-5 ml-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="relative p-2.5 text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-full">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>

            <div className="flex items-center gap-3 cursor-pointer pl-6 border-l border-slate-200 dark:border-slate-700 ml-1">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-0.5">
                  {user?.collegeName || user?.name || "College"}
                </p>
                <p className="text-xs text-slate-500">College Account</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900 border border-violet-200 dark:border-violet-700 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold shadow-sm shrink-0">
                {(user?.collegeName || user?.name || "C")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6 md:p-8 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
