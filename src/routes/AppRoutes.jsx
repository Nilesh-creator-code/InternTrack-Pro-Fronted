import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "../features/auth/pages/AuthPage";
import { Login } from "../features/auth/pages/Login";
import { RegisterStudent } from "../features/auth/pages/RegisterStudent";
import { RegisterIndustry } from "../features/auth/pages/RegisterIndustry";
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

            {/* Student Dashboard Routes */}
            <Route element={<PrivateRoute allowedRoles={["STUDENT"]} />}>
              <Route path="/student" element={<StudentLayout />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="internships" element={<InternshipList />} />
                <Route path="applications" element={<ApplicationStatus />} />
                <Route path="saved" element={<SavedInternships />} />
                <Route path="profile" element={<Profile />} />
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
        </Routes>
    );
};