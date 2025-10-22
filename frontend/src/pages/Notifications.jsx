import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check } from "lucide-react";
import api from "../lib/api";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = (typeof window !== 'undefined' && localStorage.getItem("email")) || "";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/v1/notifications`, { params: { userEmail: email } });
      setItems(res?.data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchNotifications();
  }, [email]);

  const markRead = async (id) => {
    try {
      await api.patch(`/v1/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-emerald-600" />
          <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 divide-y">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No notifications</div>
          ) : (
            items.map((n) => (
              <motion.div key={n._id} className={`p-4 ${n.read ? 'bg-white' : 'bg-emerald-50/50'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()} • Status: {n.status}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => markRead(n._id)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs text-gray-700 hover:bg-gray-50">
                      <Check className="w-3.5 h-3.5" /> Mark read
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
