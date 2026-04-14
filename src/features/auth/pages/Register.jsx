import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("student");
    const { loading, handleRegisterStudent, handleRegisterIndustry } = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (role === "student") {
            handleRegisterStudent({ email, password });
        } else {
            handleRegisterIndustry({ email, password });
        }
    };
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="industry">Industry</option>
                </select>
                <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
            </form>
        </div>
    );
};