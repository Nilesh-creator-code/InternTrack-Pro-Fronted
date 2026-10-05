import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, BookOpen, Building2, Loader2, RefreshCw } from "lucide-react";
import { getApiErrorMessage } from "../../auth/services/apiError";
import { getAllDepartments, getCoursesByDepartment } from "../services/collegeApi";

const responseList = (response) => {
  const data = response?.data?.data ?? response?.data;
  return Array.isArray(data) ? data : [];
};

const ErrorNotice = ({ message, onRetry }) => (
  <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200 sm:flex-row sm:items-center sm:justify-between">
    <p className="flex items-center gap-2"><AlertCircle size={18} />{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="inline-flex items-center gap-2 self-start font-semibold hover:underline sm:self-auto">
        <RefreshCw size={15} /> Try again
      </button>
    )}
  </div>
);

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState("");
  const [reloadDepartments, setReloadDepartments] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const courseRequestId = useRef(0);

  useEffect(() => {
    let active = true;
    setDepartmentsLoading(true);
    setDepartmentsError("");

    getAllDepartments()
      .then((response) => {
        if (active) setDepartments(responseList(response));
      })
      .catch((error) => {
        if (active) {
          setDepartmentsError(getApiErrorMessage(error, "Unable to load departments."));
        }
      })
      .finally(() => {
        if (active) setDepartmentsLoading(false);
      });

    return () => {
      active = false;
      courseRequestId.current += 1;
    };
  }, [reloadDepartments]);

  const selectDepartment = async (department) => {
    const requestId = ++courseRequestId.current;
    setSelectedDepartment(department);
    setCourses([]);
    setCoursesError("");
    setCoursesLoading(true);

    const departmentId = department.id ?? department.departmentId;
    if (departmentId == null) {
      setCoursesError("This department does not include an ID. Refresh the department list and try again.");
      setCoursesLoading(false);
      return;
    }

    try {
      const response = await getCoursesByDepartment(departmentId);
      if (requestId === courseRequestId.current) {
        setCourses(responseList(response));
      }
    } catch (error) {
      if (requestId === courseRequestId.current) {
        setCoursesError(getApiErrorMessage(error, "Unable to load courses for this department."));
      }
    } finally {
      if (requestId === courseRequestId.current) setCoursesLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-8">
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            <Building2 size={21} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Departments</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select a department to view its courses.</p>
          </div>
        </div>
      </header>

      {departmentsError && (
        <ErrorNotice message={departmentsError} onRetry={() => setReloadDepartments((value) => value + 1)} />
      )}

      {departmentsLoading ? (
        <div className="flex min-h-48 items-center justify-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400" role="status">
          <Loader2 className="animate-spin" size={20} /> Loading departments...
        </div>
      ) : departments.length === 0 && !departmentsError ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          No departments have been added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {departments.map((department, index) => {
            const selected = selectedDepartment?.id === department.id;
            return (
              <button
                key={department.id ?? department.name ?? index}
                type="button"
                onClick={() => selectDepartment(department)}
                aria-pressed={selected}
                className={`w-full rounded-xl border p-5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  selected
                    ? "border-violet-500 bg-violet-50 shadow-sm dark:border-violet-400 dark:bg-violet-950/30"
                    : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-700 dark:hover:bg-slate-800/80"
                }`}
              >
                <span className="block text-base font-bold text-slate-800 dark:text-slate-100">{department.name}</span>
                {department.headOfDepartment && (
                  <span className="mt-1 block text-sm font-semibold text-violet-700 dark:text-violet-300">{department.headOfDepartment}</span>
                )}
                {department.description && (
                  <span className="mt-3 block text-sm leading-6 text-slate-600 dark:text-slate-300">{department.description}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {selectedDepartment && (
        <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700" aria-live="polite">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Selected Department</p>
            <h2 className="mt-1 text-xl font-bold text-slate-800 dark:text-slate-100">{selectedDepartment.name}</h2>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
              <BookOpen size={19} className="text-violet-600 dark:text-violet-400" /> Courses
            </h3>
            {coursesError ? (
              <ErrorNotice message={coursesError} onRetry={() => selectDepartment(selectedDepartment)} />
            ) : coursesLoading ? (
              <div className="flex min-h-32 items-center justify-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400" role="status">
                <Loader2 className="animate-spin" size={20} /> Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                No courses are assigned to this department yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {courses.map((course, index) => (
                  <article key={course.id ?? course.code ?? course.name ?? index} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">{course.name}</h4>
                    {course.code && <p className="mt-1 text-xs font-semibold text-violet-700 dark:text-violet-300">{course.code}</p>}
                    {course.description && <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{course.description}</p>}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};