import React, { useEffect, useState } from "react";
import { login, register } from "../services/auth";

const InputField = ({ id, type, value, onChange, placeholder, required }) => (
  <div>
    <input
      type={type}
      className="bg-slate-200 w-full p-2 rounded-full"
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
    />
  </div>
);

const Auth = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    fullname: "",
    username: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    setFormData({
      identifier: "",
      password: "",
      fullname: "",
      username: "",
      phone: "",
      email: "",
    });
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const response = await login(formData.identifier, formData.password);
        if (response.status === 200) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("token", response.data.jwt);
          setUser(response.data.user);
        } else {
          setError(response.error.message);
        }
      } else {
        const response = await register(
          formData.username,
          formData.fullname,
          formData.phone,
          formData.email,
          formData.password
        );
        if (response.status === 200) {
          alert("Registration successful");
          setIsLogin(true);
        } else {
          setError(response.error.message);
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-slate-200 min-h-dvh">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white p-6 rounded-lg"
      >
        {!isLogin && (
          <>
            <InputField
              id="fullname"
              type="text"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter full name"
              required={!isLogin}
            />
            <InputField
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required={!isLogin}
            />
            <InputField
              id="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required={!isLogin}
            />
            <InputField
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required={!isLogin}
            />
          </>
        )}
        {isLogin && (
          <InputField
            id="identifier"
            type="text"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Enter email or username"
            required
          />
        )}
        <InputField
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
        {error && (
          <p className="text-sm text-red-600 max-w-60 break-words">{error}</p>
        )}
        <button
          type="submit"
          className={`bg-theme text-white w-full p-2 rounded-full mt-2 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="loader mr-2"></div>
              {isLogin ? "Logging in..." : "Registering..."}
            </div>
          ) : isLogin ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>
        <p className="text-slate-500">
          {isLogin ? (
            <>
              New here?{" "}
              <span
                className="cursor-pointer hover:underline"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
              >
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="cursor-pointer hover:underline"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
              >
                Login
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Auth;
