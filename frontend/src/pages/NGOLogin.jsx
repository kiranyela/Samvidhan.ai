import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NGOLogin() {

  const navigate = useNavigate();

  const [ngoId, setNgoId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if ( !email) {
      alert("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      // Example API call to request OTP
      await axios.post("/api/v1/ngos/request", { email });
      setOtpSent(true);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/ngos/verify", { email, otp }, { withCredentials: true });
      
    

      alert("Login successful!");
      navigate("/ngo-dashboard"); // redirect to NGO dashboard
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-emerald-50 to-white">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            NGO <span className="text-emerald-600">Login</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your dashboard
          </p>
        </motion.div>

        <motion.div
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NGO ID / Registration Number
            </label>
            <input
              type="text"
              value={ngoId}
              onChange={(e) => setNgoId(e.target.value)}
              placeholder="Enter your NGO ID or Registration Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              disabled={otpSent}
            />
            <p className="mt-1 text-xs text-gray-500">
              This can be from NGO Darpan or your internal ID
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter registered email or phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              disabled={otpSent}
            />
            <p className="mt-1 text-xs text-gray-500">
              Use the email you registered with
            </p>
          </div>

          {otpSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OTP
              </label>
              <input
                type="number"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to you"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                Check your email or phone for the OTP
              </p>
            </motion.div>
          )}

          <div className="space-y-3 pt-2">
            {!otpSent ? (
              <motion.button
                onClick={handleRequestOTP}
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 text-white px-6 py-3 text-base font-medium shadow-md hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Sending..." : "Request OTP"}
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-600 text-white px-6 py-3 text-base font-medium shadow-md hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {loading ? "Verifying..." : "Login / Verify"}
                </motion.button>

                <motion.button
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="w-full rounded-xl bg-white border border-emerald-600 text-emerald-700 px-6 py-3 text-sm font-medium shadow-sm hover:bg-emerald-50 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  Resend OTP
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
            >
              Register here
            </button>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}