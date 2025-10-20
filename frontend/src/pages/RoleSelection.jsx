import { motion } from "framer-motion";
import { useState } from "react";
import { User, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === "user") {
      navigate("/signup");
    } else if (role === "ngo") {
      navigate("/ngosignup");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="text-center px-6 sm:px-12 md:px-20 pt-24 pb-24">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Choose Your&nbsp;
          <span className="text-emerald-600">Role</span>
        </motion.h1>

        <motion.p
          className="mt-3 text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Select how you want to continue to access the platform
        </motion.p>

        <div className="mt-12 flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
          <motion.div
            onClick={() => handleRoleSelect("user")}
            className="group cursor-pointer bg-white rounded-2xl border-2 border-gray-200 hover:border-emerald-600 p-8 w-full sm:w-80 shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 group-hover:bg-emerald-600 p-4 rounded-full transition-all duration-300">
                <User className="w-12 h-12 text-emerald-600 group-hover:text-white transition-all duration-300" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              User
            </h2>
            <p className="text-gray-600 mb-6">
              Common people seeking legal rights information and assistance
            </p>
            <button className="rounded-xl bg-emerald-600 text-white px-6 py-3 text-base sm:text-lg font-medium shadow-md hover:bg-emerald-700 transition-all w-full group-hover:shadow-lg">
              Continue as User →
            </button>
          </motion.div>

          <motion.div
            onClick={() => handleRoleSelect("ngo")}
            className="group cursor-pointer bg-white rounded-2xl border-2 border-gray-200 hover:border-emerald-600 p-8 w-full sm:w-80 shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 group-hover:bg-emerald-600 p-4 rounded-full transition-all duration-300">
                <Building2 className="w-12 h-12 text-emerald-600 group-hover:text-white transition-all duration-300" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              NGO
            </h2>
            <p className="text-gray-600 mb-6">
              Organizations providing legal aid and support services
            </p>
            <button className="rounded-xl bg-emerald-600 text-white px-6 py-3 text-base sm:text-lg font-medium shadow-md hover:bg-emerald-700 transition-all w-full group-hover:shadow-lg">
              Continue as NGO →
            </button>
          </motion.div>
        </div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-emerald-600 transition-colors text-sm sm:text-base"
          >
            ← Back to Home
          </button>
        </motion.div>
      </section>
    </main>
  );
}