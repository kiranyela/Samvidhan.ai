import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  MapPin,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  Search,
} from "lucide-react";
import api from "../lib/api";

// Moved static data outside the component
const initialCases = [
  {
    id: 1,
    title: "Workplace Discrimination Case",
    description:
      "I have been facing discrimination at my workplace based on my gender. My employer has repeatedly denied me promotions despite having better qualifications than my male colleagues. This has been happening for over 2 years now.",
    category: "Employment Rights",
    severity: "High",
    location: "Mumbai, Maharashtra",
    submittedDate: "2025-10-18",
    userName: "Priya S.",
    avatar: "PS",
    status: "pending",
    pilEligible: true,
    comments: 12,
    likes: 45,
  },
  {
    id: 2,
    title: "Land Acquisition Dispute",
    description:
      "The government has forcibly acquired our agricultural land without proper compensation. Multiple families in our village are affected. We have been farming this land for generations.",
    category: "Property Rights",
    severity: "Critical",
    location: "Rural Karnataka",
    submittedDate: "2025-10-17",
    userName: "Rajesh K.",
    avatar: "RK",
    status: "pending",
    pilEligible: true,
    comments: 28,
    likes: 89,
  },
  {
    id: 3,
    title: "Educational Institution Denial",
    description:
      "My child was denied admission to a public school despite having all the necessary documents and meeting eligibility criteria. The school officials are not providing any proper reason.",
    category: "Education Rights",
    severity: "Medium",
    location: "Delhi",
    submittedDate: "2025-10-19",
    userName: "Amit P.",
    avatar: "AP",
    status: "pending",
    pilEligible: false,
    comments: 8,
    likes: 23,
  },
  {
    id: 4,
    title: "Environmental Pollution by Factory",
    description:
      "A nearby factory is releasing toxic waste into our water supply, affecting the health of residents in three villages. Children are falling sick regularly and we have no clean water source.",
    category: "Environmental Rights",
    severity: "Critical",
    location: "Kollam, Kerala",
    submittedDate: "2025-10-16",
    userName: "Anonymous User",
    avatar: "AU",
    status: "accepted",
    pilEligible: true,
    comments: 56,
    likes: 203,
  },
  {
    id: 5,
    title: "Police Harassment Complaint",
    description:
      "Local police have been harassing street vendors without proper legal procedures or documentation. Daily they threaten us and take our earnings as bribes.",
    category: "Civil Rights",
    severity: "High",
    location: "Bangalore, Karnataka",
    submittedDate: "2025-10-15",
    userName: "Ramesh M.",
    avatar: "RM",
    status: "rejected",
    pilEligible: false,
    comments: 15,
    likes: 34,
  },
];

 

export default function NGODashboard() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [cases, setCases] = useState(initialCases);
  const ngoEmail = (typeof window !== 'undefined' && localStorage.getItem("email")) || "";
  const ngoName = ngoEmail ? ngoEmail.split("@")[0] : "";
  const [previewSrc, setPreviewSrc] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isSevOpen, setIsSevOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const catRef = useRef(null);
  const sevRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailsCase, setDetailsCase] = useState(null);

  const isImage = (a) => {
    const mt = a?.mimeType || "";
    const url = a?.url || "";
    return mt.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);
  };

  const downloadAttachments = async (attachments = []) => {
    for (let i = 0; i < attachments.length; i++) {
      const a = attachments[i];
      const fname = a?.originalName || `attachment-${i+1}`;
      try {
        const res = await fetch(a.url, { mode: 'cors' });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fname;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (e) {
        try { window.open(a.url, '_blank'); } catch {}
      }
    }
  };

  useEffect(() => {
    const onClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setIsCatOpen(false);
      if (sevRef.current && !sevRef.current.contains(e.target)) setIsSevOpen(false);
      // close per-item menu if clicking outside of any menu button
      if (!e.target.closest?.('[data-menu-root="true"]')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const exportToCSV = (rows, filename = "cases.csv") => {
    try {
      const headers = [
        "id","title","description","category","severity","location","status","submittedDate","acceptedByEmail"
      ];
      const lines = [headers.join(",")].concat(
        rows.map(r => [
          r.id,
          JSON.stringify(r.title || ""),
          JSON.stringify(r.description || ""),
          r.category || "",
          r.severity || "",
          r.location || "",
          r.status || "",
          r.submittedDate || "",
          r.acceptedBy?.ngoEmail || ""
        ].join(","))
      );
      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to export CSV");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const bulkUpdate = async (status) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    for (const id of ids) {
      try { await updateCaseStatus(id, status); } catch {}
    }
    setSelectedIds(new Set());
  };
  const isPDF = (a) => {
    const mt = a?.mimeType || "";
    const url = a?.url || "";
    return mt === "application/pdf" || /\.pdf$/i.test(url);
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get("/v1/posts", { params: { onlyVerifiedUsers: true } });
      const posts = res?.data?.data || [];
      const mapped = posts.map((p) => {
        const userName = p.contactEmail
          ? p.contactEmail.split("@")[0]
          : (p.authorType || "user");
        const avatar = userName
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase())
          .join("")
          .slice(0, 2) || "US";
        return {
          id: p._id,
          title: (p.description || "User Query").slice(0, 40) + (p.description && p.description.length > 40 ? "..." : ""),
          description: p.description || "",
          category: p.category || "General",
          severity: (p.urgency || "medium").charAt(0).toUpperCase() + (p.urgency || "medium").slice(1),
          location: p.location || "",
          submittedDate: p.createdAt || new Date().toISOString(),
          userName,
          avatar,
          status: p.status || "pending",
          acceptedBy: p.acceptedBy || null,
          userEmail: p.contactEmail || "",
          userPhone: p.contactPhone || "",
          attachments: Array.isArray(p.attachments) ? p.attachments : [],
          pilEligible: false,
          comments: 0,
          likes: 0,
        };
      });
      setCases(mapped);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCases = useMemo(() => {
    // Base by tab
    let base = [];
    if (selectedTab === "accepted") {
      base = cases.filter((c) => {
        if (c.status !== "accepted") return false;
        if (c.acceptedBy && c.acceptedBy.ngoEmail) return c.acceptedBy.ngoEmail === ngoEmail;
        return true;
      });
    } else {
      base = cases.filter((c) => c.status === selectedTab);
    }
    // Apply filters
    const cat = filterCategory;
    const sev = filterSeverity;
    const q = search.trim().toLowerCase();
    return base.filter((c) => {
      const okCat = cat === "All" || (c.category || "").toLowerCase() === cat.toLowerCase();
      const okSev = sev === "All" || (c.severity || "").toLowerCase() === sev.toLowerCase();
      const okQ = !q || [c.title, c.description, c.location, c.category]
        .map((v) => (v || "").toLowerCase())
        .some((v) => v.includes(q));
      return okCat && okSev && okQ;
    });
  }, [cases, selectedTab, ngoEmail, filterCategory, filterSeverity, search]);

  const { pendingCount, acceptedCount, pilCount } = useMemo(() => {
    return {
      pendingCount: cases.filter((c) => c.status === "pending").length,
      acceptedCount: cases.filter((c) => c.status === "accepted").length,
      pilCount: cases.filter((c) => c.pilEligible).length,
    };
  }, [cases]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const updateCaseStatus = async (caseId, status) => {
    try {
      // optimistic update
      setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, status } : c)));
      await api.patch(`/v1/posts/${caseId}/status`, { status, ngoName, ngoEmail });
      // notify same-tab listeners and refresh
      try { window.dispatchEvent(new Event("posts-changed")); } catch {}
      fetchPosts();
    } catch (e) {
      console.error(e);
      // revert on error by refetching
      try {
        await fetchPosts();
      } catch {}
      alert("Failed to update status");
    }
  };

  const handleFilePIL = (caseId) => {
    alert(`Initiating PIL filing process for Case #${caseId}`);
  };

  useEffect(() => {
    fetchPosts();
    const id = setInterval(fetchPosts, 10000); // poll every 10s
    const onPostsChanged = () => fetchPosts();
    window.addEventListener("posts-changed", onPostsChanged);
    const onKey = (e) => { if (e.key === 'Escape') setPreviewSrc(null); };
    window.addEventListener('keydown', onKey);
    return () => {
      clearInterval(id);
      window.removeEventListener("posts-changed", onPostsChanged);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto flex gap-6 px-4 py-4">
        {/* Sidebar */}
        <motion.aside
          className="hidden lg:block w-64 sticky top-20 h-fit"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl p-4 border border-gray-200">
            <h2 className="font-bold text-lg mb-4 text-gray-900">Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 text-sm">Pending</span>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {pendingCount}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 text-sm">Accepted</span>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {acceptedCount}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 text-sm">PIL Eligible</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {pilCount}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 mt-4">
            <h2 className="font-bold text-sm mb-3 text-gray-900">
              Quick Actions
            </h2>
            <button
              onClick={() => exportToCSV(filteredCases, `cases_${selectedTab}.csv`)}
              className="w-full text-left text-sm text-gray-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors"
            >
              Export Cases (current view)
            </button>
            <button className="w-full text-left text-sm text-gray-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors">
              Generate Report
            </button>
            <button className="w-full text-left text-sm text-gray-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors">
              Settings
            </button>
          </div>
        </motion.aside>

        {/* Main Feed */}
        <div className="flex-1 max-w-2xl">
          {/* Tabs */}
          <motion.div
            className="bg-white border-b border-gray-200 rounded-t-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex">
              <button
                onClick={() => setSelectedTab("pending")}
                className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                  selectedTab === "pending"
                    ? "text-gray-900"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Pending Review
                {selectedTab === "pending" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full"
                    layoutId="activeTab"
                  />
                )}

      {/* Details Modal */}
      {detailsCase && (
        <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4" onClick={() => setDetailsCase(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Case Details</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setDetailsCase(null)}>Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">User</div>
                <div className="font-medium text-gray-900">{detailsCase.userName}</div>
              </div>
              {detailsCase.userEmail && (
                <div>
                  <div className="text-gray-500">User Email</div>
                  <div className="font-medium text-gray-900">
                    <a href={`mailto:${detailsCase.userEmail}`} className="text-emerald-700 underline">{detailsCase.userEmail}</a>
                  </div>
                </div>
              )}
              {detailsCase.userPhone && (
                <div>
                  <div className="text-gray-500">User Phone</div>
                  <div className="font-medium text-gray-900">
                    <a href={`tel:${detailsCase.userPhone}`} className="text-emerald-700">{detailsCase.userPhone}</a>
                  </div>
                </div>
              )}
              <div>
                <div className="text-gray-500">Submitted</div>
                <div className="font-medium text-gray-900">{new Date(detailsCase.submittedDate).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-500">Category</div>
                <div className="font-medium text-gray-900">{detailsCase.category}</div>
              </div>
              <div>
                <div className="text-gray-500">Severity</div>
                <div className="font-medium text-gray-900">{detailsCase.severity}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-gray-500">Location</div>
                <div className="font-medium text-gray-900">{detailsCase.location || '-'}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-gray-500">Description</div>
                <div className="font-medium text-gray-900 whitespace-pre-wrap">{detailsCase.description}</div>
              </div>
              {Array.isArray(detailsCase.attachments) && detailsCase.attachments.length > 0 && (
                <div className="sm:col-span-2">
                  <div className="text-gray-500 mb-1">Attachments</div>
                  <div className="flex flex-wrap gap-2">
                    {detailsCase.attachments.map((a, idx) => (
                      <a key={idx} href={a.url} target="_blank" rel="noreferrer" className="text-emerald-700 underline break-all">{a.originalName || a.url}</a>
                    ))}
                  </div>
                </div>
              )}
              {selectedTab === 'accepted' && (
                <div className="sm:col-span-2 text-sm text-gray-500">Accepted case</div>
              )}
            </div>

          </div>
        </div>
      )}
              </button>
              <button
                onClick={() => setSelectedTab("accepted")}
                className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                  selectedTab === "accepted"
                    ? "text-gray-900"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Accepted
                {selectedTab === "accepted" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full"
                    layoutId="activeTab"
                  />
                )}
              </button>
              <button
                onClick={() => setSelectedTab("rejected")}
                className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                  selectedTab === "rejected"
                    ? "text-gray-900"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Rejected
                {selectedTab === "rejected" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full"
                    layoutId="activeTab"
                  />
                )}
              </button>
            </div>
          </motion.div>

          {/* Filters/Search */}
          <div className="bg-white border-x border-gray-200 px-4 py-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-end justify-between">
            <div className="flex gap-4 flex-1">
              {/* Category custom dropdown */}
              <div className="flex-1 min-w-[180px]" ref={catRef}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCatOpen(v => !v)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white text-left flex items-center justify-between hover:border-emerald-400"
                  >
                    <span className={filterCategory !== 'All' ? 'text-gray-900' : 'text-gray-400'}>
                      {filterCategory || 'All'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-emerald-500 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isCatOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          <input
                            type="text"
                            value={catSearch}
                            onChange={(e) => setCatSearch(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm hover:border-emerald-400"
                          />
                        </div>
                      </div>
                      <div className="max-h-56 overflow-y-auto">
                        {['All', ...Array.from(new Set(cases.map(c => c.category).filter(Boolean)))
                          .filter(c => c.toLowerCase().includes(catSearch.toLowerCase()))
                        ].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => { setFilterCategory(c); setIsCatOpen(false); setCatSearch(''); }}
                            className={`w-full text-left px-3 py-2 hover:bg-emerald-50 transition-colors text-sm ${
                              filterCategory === c ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Severity custom dropdown */}
              <div className="flex-1 min-w-[160px]" ref={sevRef}>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Severity</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSevOpen(v => !v)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white text-left flex items-center justify-between hover:border-emerald-400"
                  >
                    <span className={filterSeverity !== 'All' ? 'text-gray-900' : 'text-gray-400'}>
                      {filterSeverity}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-emerald-500 transition-transform duration-200 ${isSevOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSevOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                    >
                      {['All','Critical','High','Medium'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setFilterSeverity(s); setIsSevOpen(false); }}
                          className={`w-full text-left px-3 py-2 hover:bg-emerald-50 transition-colors text-sm ${
                            filterSeverity === s ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[260px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, description, location..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Posts Feed */}
          {/* Bulk bar */}
          {selectedTab === 'pending' && selectedIds.size > 0 && (
            <div className="bg-emerald-50 border-x border-b border-emerald-200 px-4 py-2 flex items-center justify-between sticky top-12 z-10">
              <div className="text-sm text-emerald-800 font-medium">{selectedIds.size} selected</div>
              <div className="flex gap-2">
                <button onClick={() => bulkUpdate('accepted')} className="px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Accept</button>
                <button onClick={() => bulkUpdate('rejected')} className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700">Reject</button>
                <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 text-sm rounded-md border">Clear</button>
              </div>
            </div>
          )}

          <div className="bg-white border-x border-gray-200 divide-y divide-gray-200">
            {filteredCases.map((caseItem, index) => (
              <motion.article
                key={caseItem.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => setDetailsCase(caseItem)}
              >
                <div className="flex gap-3">
                  {/* Select checkbox for bulk on Pending */}
                  {selectedTab === 'pending' && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(caseItem.id)}
                      onChange={() => toggleSelect(caseItem.id)}
                      className="mt-2 w-4 h-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {caseItem.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm hover:underline">
                          {caseItem.userName}
                        </span>
                        <span className="text-gray-500 text-sm">·</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(
                            caseItem.submittedDate,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {caseItem.pilEligible && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                            PIL
                          </span>
                        )}
                      </div>
                      <button
                        className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors relative"
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === caseItem.id ? null : caseItem.id); }}
                        data-menu-root="true"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                        {openMenuId === caseItem.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              {/* Context aware items */}
                              <button
                                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                onClick={() => { setDetailsCase(caseItem); setOpenMenuId(null); }}
                              >
                                View details
                              </button>
                              {selectedTab === 'pending' ? (
                                <>
                                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { updateCaseStatus(caseItem.id, 'accepted'); setOpenMenuId(null); }}>Accept</button>
                                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { updateCaseStatus(caseItem.id, 'rejected'); setOpenMenuId(null); }}>Reject</button>
                                </>
                              ) : (
                                <>
                                  {selectedTab === 'accepted' && (
                                    <>
                                      <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { updateCaseStatus(caseItem.id, 'rejected'); setOpenMenuId(null); }}>Move to Rejected</button>
                                    </>
                                  )}
                                  {selectedTab === 'rejected' && (
                                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { updateCaseStatus(caseItem.id, 'pending'); setOpenMenuId(null); }}>Reopen as Pending</button>
                                  )}
                                </>
                              )}
                              <div className="h-px bg-gray-100 my-1" />
                              {Array.isArray(caseItem.attachments) && caseItem.attachments.length > 0 && (
                                <button
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                  onClick={async () => {
                                    await downloadAttachments(caseItem.attachments);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Download attachments
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </button>
                    </div>

                    <div className="mt-2">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {caseItem.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed break-words max-h-24 overflow-hidden">
                        {caseItem.description}
                      </p>
                    </div>

                    {Array.isArray(caseItem.attachments) && caseItem.attachments.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {caseItem.attachments.map((a, idx) => (
                          <div key={idx} onClick={(e) => e.stopPropagation()} className="group">
                            {isImage(a) ? (
                              <img
                                src={a.url}
                                alt={a.originalName || `attachment-${idx}`}
                                className="w-full h-40 object-cover rounded-lg border hover:opacity-95 cursor-zoom-in"
                                loading="lazy"
                                onClick={() => setPreviewSrc(a.url)}
                              />
                            ) : isPDF(a) ? (
                              <embed
                                src={a.url}
                                type="application/pdf"
                                className="w-full h-64 rounded-lg border"
                              />
                            ) : (
                              <a
                                href={a.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-emerald-700 underline truncate inline-block"
                              >
                                {a.originalName || a.url}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{caseItem.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getSeverityColor(
                            caseItem.severity,
                          )}`}
                        />
                        <span>{caseItem.severity}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span>{caseItem.category}</span>
                    </div>

                    {/* Social Interaction Bar removed */}

                    {/* Action Buttons */}
                    {selectedTab === "pending" && (
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCaseStatus(caseItem.id, "accepted");
                          }}
                        >
                          Accept Case
                        </button>
                        {caseItem.pilEligible && (
                          <button
                            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFilePIL(caseItem.id);
                            }}
                          >
                            File PIL
                          </button>
                        )}
                        <button
                          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCaseStatus(caseItem.id, "rejected");
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {selectedTab === "accepted" && (
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold border border-green-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Case In Progress
                        </button>
                        {caseItem.pilEligible && (
                          <button
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFilePIL(caseItem.id);
                            }}
                          >
                            File PIL
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}

            {filteredCases.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  No cases in this category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Image Lightbox */}
      {previewSrc && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 flex items-center justify-center p-4"
          onClick={() => setPreviewSrc(null)}
        >
          <div className="max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewSrc}
              alt="preview"
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
            />
            <div className="text-center mt-2 text-gray-200 text-sm">Press Esc or click outside to close</div>
          </div>
        </div>
      )}
    </main>
  );
}