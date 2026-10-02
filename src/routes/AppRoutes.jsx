import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../features/auth/pages/AuthPage";
import { Login } from "../features/auth/pages/Login";
import { RegisterStudent } from "../features/auth/pages/RegisterStudent";
import { RegisterIndustry } from "../features/auth/pages/RegisterIndustry";
import { RegisterCollege } from "../features/auth/pages/RegisterCollege";
import { RegisterRolePicker } from "../features/auth/pages/RegisterRolePicker";
import { PrivateRoute } from "./PrivateRoute";

import { IndustryLayout } from "../features/industry/components/IndustryLayout";
import { Dashboard as IndustryDashboard } from "../features/industry/pages/Dashboard";
import { PostInternship } from "../features/industry/pages/PostInternship";
import { MyInternships } from "../features/industry/pages/MyInternships";
import { Applications } from "../features/industry/pages/Applications";
import { InternshipDetails } from "../features/industry/pages/InternshipDetails";

import { StudentLayout } from "../features/student/components/StudentLayout";
import { Dashboard as StudentDashboard } from "../features/student/pages/Dashboard";
import { InternshipList } from "../features/student/pages/InternshipList";
import { ApplicationStatus } from "../features/student/pages/ApplicationStatus";
import { SavedInternships } from "../features/student/pages/SavedInternships";
import { Profile } from "../features/student/pages/Profile";
import { ApplyInternship } from "../features/student/pages/ApplyInternship";

import { CollegeLayout } from "../features/college/components/CollegeLayout";
import { CollegeDashboard, CollegePlaceholderPage } from "../features/college/pages/Dashboard";

// Mock other components for now if they don't exist
const Home = () => <Navigate to="/login" />;

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterRolePicker />} />
            <Route path="/register-student" element={<RegisterStudent />} />
            <Route path="/register-industry" element={<RegisterIndustry />} />
            <Route path="/register-college" element={<RegisterCollege />} />

            {/* Student Dashboard Routes */}
            <Route element={<PrivateRoute allowedRoles={["STUDENT"]} />}>
              <Route path="/student" element={<StudentLayout />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="internships" element={<InternshipList />} />
                <Route path="applications" element={<ApplicationStatus />} />
                <Route path="saved" element={<SavedInternships />} />
                <Route path="profile" element={<Profile />} />
                <Route path="internships/apply/:internshipId" element={<ApplyInternship />} />
              </Route>
            </Route>
            
            {/* Industry Dashboard Routes */}
            <Route element={<PrivateRoute allowedRoles={["INDUSTRY"]} />}>
              <Route path="/industry" element={<IndustryLayout />}>
                <Route path="dashboard" element={<IndustryDashboard />} />
                <Route path="post-internship" element={<PostInternship />} />
                <Route path="my-internships" element={<MyInternships />} />
                <Route path="internships/view/:id" element={<InternshipDetails />} />
                <Route path="applications" element={<Applications />} />
              </Route>
            </Route>

            {/* College Dashboard Routes */}
            <Route element={<PrivateRoute allowedRoles={["COLLEGE"]} />}>
              <Route path="/college" element={<CollegeLayout />}>
                <Route path="dashboard" element={<CollegeDashboard />} />
                <Route path="departments" element={<CollegePlaceholderPage title="Departments" description="This section will connect to the college departments API once the backend endpoint is available." requiredApi="GET /api/college/departments" />} />
                <Route path="courses" element={<CollegePlaceholderPage title="Courses" description="This section will connect to the college courses API once the backend endpoint is available." requiredApi="GET /api/college/courses" />} />
                <Route path="teachers" element={<CollegePlaceholderPage title="Teachers" description="This section will connect to the college teachers API once the backend endpoint is available." requiredApi="GET /api/college/teachers" />} />
                <Route path="students" element={<CollegePlaceholderPage title="Students" description="This section will connect to the college students API once the backend endpoint is available." requiredApi="GET /api/college/students" />} />
                <Route path="enrollments" element={<CollegePlaceholderPage title="Enrollments" description="This section will connect to the college enrollments API once the backend endpoint is available." requiredApi="GET /api/college/enrollments" />} />
                <Route path="events" element={<CollegePlaceholderPage title="Events" description="This section will connect to the college events API once the backend endpoint is available." requiredApi="GET /api/college/events" />} />
                <Route path="certificates" element={<CollegePlaceholderPage title="Certificates" description="This section will connect to the college certificates API once the backend endpoint is available." requiredApi="GET /api/college/certificates" />} />
                <Route path="analytics" element={<CollegePlaceholderPage title="Analytics" description="This section will connect to the college analytics API once the backend endpoint is available." requiredApi="GET /api/college/analytics" />} />
                <Route path="profile" element={<CollegePlaceholderPage title="Profile" description="This section will connect to the authenticated college profile API once the backend endpoint is available." requiredApi="GET /api/college/profile" />} />
                <Route path="settings" element={<CollegePlaceholderPage title="Settings" description="This section will connect to the college settings API once the backend endpoint is available." requiredApi="GET /api/college/settings" />} />
              </Route>
            </Route>
        </Routes>
    );
};