import React, { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../../api/authApi";
//import "./login_page.css";
import { useUser } from "../../context/UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setUserData } = useUser();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(`Email: ${email} and Password: ${password}`);

      const response = await login(email, password);
      console.log("Login Response:", response);

      if (response.success) {
        setUserData(response.data);
      }

      // ✅ Check if backend returned role
      if (!response || (response.data.role !== "admin" && response.data.role !== "manager")) {
        setLoading(false);
        alert("Access Denied: You are not an admin.");
        return;
      }

      // ✅ Proceed if admin
      setLoading(false);
      navigate("/home/locations");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage("Login Failed. Please check credentials");
      //alert("Login Failed. Please check credentials");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-blue-bg">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>

          <div className="flex items-center">
            <input
              id="showPassword"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="h-4 w-4 text-brand-blue rounded border-gray-300"
            />
            <label htmlFor="showPassword" className="ml-2 text-sm text-gray-600">
              Show password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-brand-cta py-2 font-semibold text-white hover:bg-brand-dark transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );

};

export default LoginPage;
