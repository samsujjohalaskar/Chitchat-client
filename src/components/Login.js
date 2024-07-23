import React, { useState } from "react";
import { login } from "../services/auth";

const Login = ({ setUser }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(identifier, password);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.jwt);
      setUser(response.data.user);
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="mb-3">
        <label htmlFor="identifier" className="form-label">
          Username or Email
        </label>
        <input
          type="text"
          className="form-control"
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>
    </form>
  );
};

export default Login;
