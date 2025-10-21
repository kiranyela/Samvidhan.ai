import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  MapPin,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

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
  const [cases] = useState(initialCases);

  const filteredCases = cases.filter((c) => c.status === selectedTab);

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

  const handleAcceptCase = (caseId) => {
    alert(`Case #${caseId} has been accepted. The user will be notified.`);
  };

  const handleFilePIL = (caseId) => {
    alert(`Initiating PIL filing process for Case #${caseId}`);
  };

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
            <button className="w-full text-left text-sm text-gray-600 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors">
              Export Cases
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

          {/* Posts Feed */}
          <div className="bg-white border-x border-gray-200 divide-y divide-gray-200">
            {filteredCases.map((caseItem, index) => (
              <motion.article
                key={caseItem.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex gap-3">
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
                        className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {caseItem.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {caseItem.description}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
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

                    {/* Social Interaction Bar */}
                    <div className="flex items-center justify-between text-gray-500 mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-sm hover:text-blue-500"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="hidden sm:flex items-center gap-1.5 text-sm hover:text-yellow-500"
                      >
                        <Bookmark className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    {selectedTab === "pending" && (
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptCase(caseItem.id);
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
                            alert(`Case #${caseItem.id} rejected`);
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
    </main>
  );
}