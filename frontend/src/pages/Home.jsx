
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main>
      <section className="text-center px-4 py-16">
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

        <div className="mt-6 max-w-2xl mx-auto">
          <div className="flex items-stretch gap-2 py-4">
            <input
              type="text"
              placeholder="Type your problem… e.g. PF not updated, garbage not cleared"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-emerald-700">
              Find My Rights
            </button>
          </div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
      </motion.div>
    </main>
  );
}
