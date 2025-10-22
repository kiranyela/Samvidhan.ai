import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api";

export default function PostProblem() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState(localStorage.getItem("email") || "");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please add a description of your problem.");
      return;
    }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("description", description.trim());
      if (category) form.append("category", category);
      if (location) form.append("location", location);
      if (contactEmail) form.append("contactEmail", contactEmail);
      for (const f of files) form.append("attachments", f);

      const res = await api.post("/v1/posts", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        try { window.dispatchEvent(new Event("posts-changed")); } catch {}
        alert("Posted successfully");
        navigate("/chat");
      } else {
        alert("Failed to post. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Post a Problem / Query</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Describe your legal issue, context, and what help you need..."
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Employment Rights, Civil Rights"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email (optional)</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (documents, images)</label>
              <input
                type="file"
                multiple
                onChange={handleFiles}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {files.length > 0 && (
                <p className="mt-1 text-xs text-gray-500">{files.length} file(s) selected</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-emerald-600 text-white px-6 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-xl bg-white border border-gray-300 text-gray-700 px-6 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
