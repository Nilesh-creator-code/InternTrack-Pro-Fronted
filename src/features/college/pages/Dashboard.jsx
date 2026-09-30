import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRight, BookOpen, Briefcase, Building2, GraduationCap, Users, UserCheck, BarChart3, CalendarDays } from "lucide-react";

const StatCard = ({ title, value, subtitle, icon: Icon, accentClass }) => (
  <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center transition-all hover:-translate-y-1 duration-300">
    <div className="flex flex-col justify-center">
      <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-snug">{title}</p>
      <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
    </div>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${accentClass}`}>
      <Icon className="text-slate-700 dark:text-slate-200" size={22} strokeWidth={2.5} />
    </div>
  </div>
);

const ActivityItem = ({ title, time, tone = "violet" }) => (
  <div className="flex items-start gap-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-none">
    <div className={`mt-1 w-2.5 h-2.5 rounded-full ${tone === "violet" ? "bg-violet-500" : tone === "emerald" ? "bg-emerald-500" : tone === "amber" ? "bg-amber-500" : "bg-blue-500"}`} />
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-700 dark:text-slate-100">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{time}</p>
    </div>
  </div>
);

export const CollegeDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState([
    { title: "Departments", value: "--", subtitle: "Total departments", icon: Building2, accentClass: "bg-violet-100 dark:bg-violet-900/30" },
    { title: "Courses", value: "--", subtitle: "Active courses", icon: BookOpen, accentClass: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Teachers", value: "--", subtitle: "Total teachers", icon: Users, accentClass: "bg-amber-100 dark:bg-amber-900/30" },
    { title: "Students", value: "--", subtitle: "Total students", icon: GraduationCap, accentClass: "bg-emerald-100 dark:bg-emerald-900/30" },
  ]);

  useEffect(() => {
    const fetchCollegeMetrics = async () => {
      try {
        // The backend API is not yet present in this project, so the dashboard intentionally shows placeholders
        // until a real college metrics service exists.
        setStats([
          { title: "Departments", value: "8", subtitle: "Total departments", icon: Building2, accentClass: "bg-violet-100 dark:bg-violet-900/30" },
          { title: "Courses", value: "42", subtitle: "Active courses", icon: BookOpen, accentClass: "bg-blue-100 dark:bg-blue-900/30" },
          { title: "Teachers", value: "36", subtitle: "Total teachers", icon: Users, accentClass: "bg-amber-100 dark:bg-amber-900/30" },
          { title: "Students", value: "1,240", subtitle: "Total students", icon: GraduationCap, accentClass: "bg-emerald-100 dark:bg-emerald-900/30" },
        ]);
      } catch (error) {
        console.error("Unable to load college dashboard metrics", error);
      }
    };

    fetchCollegeMetrics();
  }, []);

  const enrollmentTrend = [
    { month: "Jan", value: 40 },
    { month: "Feb", value: 65 },
    { month: "Mar", value: 80 },
    { month: "Apr", value: 120 },
    { month: "May", value: 140 },
  ];

  const courseBreakdown = [
    { name: "Java", value: 120 },
    { name: "Python", value: 85 },
    { name: "React", value: 70 },
    { name: "Database", value: 55 },
  ];

  const departmentStats = [
    { name: "Computer Science", courses: 8, students: 350 },
    { name: "Information Technology", courses: 6, students: 270 },
    { name: "Electronics", courses: 4, students: 150 },
  ];

  const recentActivity = [
    { title: "New course created: Data Structures", time: "2 hours ago", tone: "violet" },
    { title: "New student enrolled in B.Tech CSE", time: "Today, 10:30 AM", tone: "emerald" },
    { title: "Teacher assigned to Web Development", time: "Yesterday", tone: "amber" },
    { title: "Certificate issued to 18 graduates", time: "2 days ago", tone: "blue" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center relative transition-colors duration-300">
        <div className="flex-1 text-center sm:text-left sm:pr-40">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Welcome back, {user?.collegeName || user?.name || "College"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-[15px]">
            Manage your departments, courses, teachers and students from one place.
          </p>
        </div>
        <div className="sm:absolute sm:right-8 bg-violet-50/80 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 px-6 py-4 rounded-xl flex items-center gap-4 border border-violet-100 dark:border-violet-800 shrink-0 mt-6 sm:mt-0">
          <div className="text-violet-600 dark:text-violet-400">
            <UserCheck size={24} />
          </div>
          <div className="flex flex-col w-32">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1">Campus Health</span>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-violet-200 dark:bg-violet-800 rounded-full overflow-hidden">
                <div className="h-full bg-violet-600 w-[82%] rounded-full"></div>
              </div>
              <span className="text-sm font-extrabold text-violet-800 dark:text-violet-300">82%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Student Enrollment Trend</h2>
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-semibold">
              <BarChart3 size={16} /> Overview
            </div>
          </div>

          <div className="flex items-end gap-4 h-52 mt-6">
            {enrollmentTrend.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full gap-3">
                <div className="w-full flex justify-center items-end h-40">
                  <div
                    className="w-full max-w-12 rounded-t-2xl bg-gradient-to-t from-violet-600 to-indigo-400"
                    style={{ height: `${Math.max(18, (item.value / 160) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-5">Course Enrollment</h2>
          <div className="space-y-5">
            {courseBreakdown.map((course) => (
              <div key={course.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{course.name}</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{course.value}</span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" style={{ width: `${(course.value / 140) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Department Statistics</h2>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Live overview</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                  <th className="py-3 pr-4">Department</th>
                  <th className="py-3 pr-4">Courses</th>
                  <th className="py-3 pr-4">Students</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((item) => (
                  <tr key={item.name} className="border-b border-slate-100 dark:border-slate-700 last:border-none">
                    <td className="py-3 pr-4 text-slate-700 dark:text-slate-100 font-semibold">{item.name}</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.courses}</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{item.students}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Activity</h2>
            <button className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400">
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div>
            {recentActivity.map((item) => (
              <ActivityItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CollegePlaceholderPage = ({ title, description, requiredApi }) => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-300">
          <CalendarDays size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{title}</h1>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-300 mb-6">{description}</p>

      <div className="rounded-2xl border border-dashed border-violet-300 bg-violet-50 dark:bg-violet-900/10 p-5 text-sm text-slate-700 dark:text-slate-200">
        <p className="font-semibold mb-2">Required backend endpoint:</p>
        <p>{requiredApi}</p>
      </div>
    </div>
  </div>
);
