import React, { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../../api/authApi";
import "./login_page.css";
import { useUser } from "../../context/UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (!response || (response.data.role !== "admin" && response.data.role !== "manager"))  {
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
      alert("Login Failed. Please check credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to Admin Panel</h1>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-dialog">
            <div className="loader"></div>
            <p>Logging in, please wait....</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
