import React, { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../../api/authApi";

const LoginPage = () => {
  const [email, setEmail] = useState("yasir.ghafar@gmail.com");
  const [password, setPassword] = useState("abcd@1234");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevent reload

    try {
      console.log(`Email: ${email} and Password: ${password}`);
      const data = await login(email, password);
      console.log("Login Response:", data);
      navigate("/home");
    } catch (error) {
      alert("Login Failed. Please check credentials");
    }
  };

  return (
    <div className="login-form">
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
