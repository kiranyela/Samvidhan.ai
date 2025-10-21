import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { motion } from "framer-motion";

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      setError("");
      const res = await api.post(
        "/v1/users/login",
        data,
      );

      // backend sets cookies (httpOnly) and returns { data: { user, accessToken, refreshToken }, ... }
      // Do NOT store tokens in localStorage if you rely on httpOnly cookies.
      // If you need the logged in user in frontend state, you can get res.data.data.user
      reset();
      navigate("/chat");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-emerald-600 hover:underline">
            Sign Up
          </Link>
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(login)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-600 text-white py-2 font-medium shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              window.location.href ="http://localhost:5000/api/v1/users/google";
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2 font-medium shadow-sm hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google Logo"
              className="h-5 w-5"
            />
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}
