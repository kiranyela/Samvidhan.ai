import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, MoreHorizontal } from "lucide-react";
import api from "../lib/api";

export default function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [posts, setPosts] = useState([]);
  const email = (typeof window !== 'undefined' && localStorage.getItem("email")) || "";
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ description: "", category: "", location: "" });
  const [uploading, setUploading] = useState(false);

  const fetchMine = async () => {
    try {
      const res = await api.get("/v1/posts");
      const all = res?.data?.data || [];
      const mine = email ? all.filter((p) => (p.contactEmail || "").toLowerCase() === email.toLowerCase()) : [];
      setPosts(mine);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMine();
    const onPostsChanged = () => fetchMine();
    window.addEventListener("posts-changed", onPostsChanged);
    return () => window.removeEventListener("posts-changed", onPostsChanged);
  }, [email]);

  const filtered = posts.filter((p) => (p.status || "pending") === selectedTab);

  const counts = useMemo(() => {
    return {
      pending: posts.filter((p) => p.status === "pending").length,
      accepted: posts.filter((p) => p.status === "accepted").length,
      rejected: posts.filter((p) => p.status === "rejected").length,
    };
  }, [posts]);

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({ description: p.description || "", category: p.category || "", location: p.location || "" });
    setMenuOpenId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ description: "", category: "", location: "" });
  };

  const saveEdit = async (id) => {
    try {
      const payload = { ...form };
      await api.patch(`/v1/posts/${id}`, payload);
      setPosts((prev) => prev.map((p) => (p._id === id ? { ...p, ...payload } : p)));
      try { window.dispatchEvent(new Event("posts-changed")); } catch {}
      cancelEdit();
    } catch (e) {
      console.error(e);
      alert("Failed to update post");
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this post permanently?")) return;
    try {
      await api.delete(`/v1/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      try { window.dispatchEvent(new Event("posts-changed")); } catch {}
    } catch (e) {
      console.error(e);
      alert("Failed to delete post");
    }
  };

  const addFiles = async (id, files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("attachments", f));
      const res = await api.post(`/v1/posts/${id}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updated = res?.data?.data;
      if (updated) {
        setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)));
        try { window.dispatchEvent(new Event("posts-changed")); } catch {}
      }
    } catch (e) {
      console.error(e);
      alert("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = async (id, publicId) => {
    try {
      const res = await api.delete(`/v1/posts/${id}/attachments/${publicId}`);
      const updated = res?.data?.data;
      if (updated) {
        setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)));
        try { window.dispatchEvent(new Event("posts-changed")); } catch {}
      }
    } catch (e) {
      console.error(e);
      alert("Failed to remove file");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <motion.div
          className="bg-white border-b border-gray-200 rounded-t-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex">
            <button
              onClick={() => setSelectedTab("pending")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${selectedTab === "pending" ? "text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Pending {counts.pending ? `(${counts.pending})` : ""}
              {selectedTab === "pending" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" layoutId="activeTab" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab("accepted")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${selectedTab === "accepted" ? "text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Accepted {counts.accepted ? `(${counts.accepted})` : ""}
              {selectedTab === "accepted" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" layoutId="activeTab" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab("rejected")}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${selectedTab === "rejected" ? "text-gray-900" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Rejected {counts.rejected ? `(${counts.rejected})` : ""}
              {selectedTab === "rejected" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" layoutId="activeTab" />
              )}
            </button>
          </div>
        </motion.div>

        <div className="bg-white border-x border-gray-200 divide-y divide-gray-200">
          {filtered.map((p) => (
            <motion.article
              key={p._id}
              className="p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{(p.description || "").slice(0, 64)}{(p.description || "").length > 64 ? "..." : ""}</h3>
                  {p.category && <p className="text-xs text-gray-500">Category: {p.category}</p>}
                  <p className="text-xs text-gray-500">Posted on {new Date(p.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId((id) => (id === p._id ? null : p._id))}
                    className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {menuOpenId === p._id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow z-10">
                      <button
                        onClick={() => startEdit(p)}
                        className="w-full text-left text-sm px-3 py-2 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(p._id)}
                        className="w-full text-left text-sm px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {p.status === 'accepted' && p.acceptedBy && (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <div className="text-xs font-semibold text-emerald-800 mb-1">Assigned NGO</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-800">
                    {p.acceptedBy.ngoName && (
                      <div>
                        <span className="text-gray-500 text-xs">Name: </span>
                        <span className="font-medium">{p.acceptedBy.ngoName}</span>
                      </div>
                    )}
                    {p.acceptedBy.ngoEmail && (
                      <div>
                        <span className="text-gray-500 text-xs">Email: </span>
                        <a href={`mailto:${p.acceptedBy.ngoEmail}`} className="font-medium text-emerald-700 underline">
                          {p.acceptedBy.ngoEmail}
                        </a>
                      </div>
                    )}
                    {p.acceptedBy.ngoPhone && (
                      <div>
                        <span className="text-gray-500 text-xs">Phone: </span>
                        <a href={`tel:${p.acceptedBy.ngoPhone}`} className="font-medium text-emerald-700">
                          {p.acceptedBy.ngoPhone}
                        </a>
                      </div>
                    )}
                    {p.acceptedBy.ngoAddress && (
                      <div className="sm:col-span-2">
                        <span className="text-gray-500 text-xs">Address: </span>
                        <span className="font-medium break-words">{p.acceptedBy.ngoAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {editingId === p._id ? (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      rows={5}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  {/* Manage attachments */}
                  <div className="space-y-2">
                    {p.attachments?.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="col-span-full text-xs text-gray-500">Current files</div>
                        {p.attachments.map((a) => (
                          <div key={a.publicId} className="flex items-center justify-between gap-2 rounded border px-2 py-1">
                            <a href={a.url} target="_blank" rel="noreferrer" className="text-sm text-emerald-700 underline truncate flex-1">
                              {a.originalName || a.url}
                            </a>
                            <button
                              type="button"
                              onClick={() => removeAttachment(p._id, a.publicId)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Add files</label>
                      <input
                        type="file"
                        multiple
                        disabled={uploading}
                        onChange={(e) => {
                          const files = e.target.files;
                          e.target.value = null;
                          addFiles(p._id, files);
                        }}
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => saveEdit(p._id)}
                      className="rounded-xl bg-emerald-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-emerald-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-xl border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {p.attachments?.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {p.attachments.map((a, idx) => (
                    <a key={idx} href={a.url} target="_blank" rel="noreferrer" className="text-sm text-emerald-700 underline truncate">
                      {a.originalName || a.url}
                    </a>
                  ))}
                </div>
              )}
            </motion.article>
          ))}

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No posts in this category</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-b-2xl px-4 py-3 text-xs text-gray-500">
          Status shows where your query is in the review process.
        </div>
      </div>
    </main>
  );
}
