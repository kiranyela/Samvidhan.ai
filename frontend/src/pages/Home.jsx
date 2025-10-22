import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const applyAuth = () => setIsLoggedIn(localStorage.getItem("auth") === "true");
    applyAuth();
    const onStorage = (e) => {
      if (["auth","role","email"].includes(e.key)) applyAuth();
    };
    const onAuthChanged = () => applyAuth();
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  return (
    <main className="">
      <section className="text-center px-6 sm:px-12 md:px-20 pt-24 pb-24">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Know your Rights.&nbsp;
          <span className="text-emerald-600">Take Action Today</span>
        </motion.h1>

        <motion.p
          className="mt-3 text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Type your problem in simple words and go straight to the right article,
          authority and official portal.
        </motion.p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {!isLoggedIn && (
            <motion.button
              onClick={() => navigate("/roleselection")}
              className="rounded-xl bg-emerald-600 text-white px-6 py-3 text-base sm:text-lg font-medium shadow-md hover:bg-emerald-700 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Get Started →
            </motion.button>
          )}

          <motion.button
            onClick={() => navigate("/chat")}
            className="rounded-xl bg-white border border-emerald-600 text-emerald-700 px-6 py-3 text-base sm:text-lg font-medium shadow-md hover:bg-emerald-50 transition-all"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Try Now &gt;
          </motion.button>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      />
    </main>
  );
}
