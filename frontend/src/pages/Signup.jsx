import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function UserRegister() {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        // backend returned created user under result.data
        alert("✅ Registration successful!");
        // do NOT store tokens here: backend currently returns tokens only at login
        reset();
        navigate("/chat");
      } else {
        alert("❌ " + (result?.message || "Registration failed"));
      }
    } catch (err) {
      console.error("Register Error:", err);
      alert("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline">
            Login
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-emerald-400 transition"
            {...register("fullName", { required: "Full name is required" })}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-emerald-400 transition"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-emerald-400 transition"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min length is 6" },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent hover:border-emerald-400 transition"
            {...register("confirmPassword", {
              required: "Confirm your password",
            })}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 text-white py-2 font-medium shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
          >
            Register
          </button>
        </form>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:5000/api/v1/users/google";
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition"
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
