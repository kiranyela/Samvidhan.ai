import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function NGOSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ngoName: "",
    darpanUid: "",
    registeredState: "",
    registeredDistrict: "",
    ngoType: "",
    sector: "",
    registrationNumber: "",
    email: "",
    contact: "",
    
    officialwebsiteURL: "",
    registrationCertificate: null
  });

  const [isSectorOpen, setIsSectorOpen] = useState(false);
  const [sectorSearch, setSectorSearch] = useState("");
  const sectorDropdownRef = useRef(null);

  const sectors = [
    "Aged/Elderly",
    "Agriculture",
    "Animal Husbandry, Dairying and Fisheries",
    "Animal Welfare",
    "Art and Culture",
    "Biotechnology",
    "Children",
    "Civic Issues",
    "Dalit Upliftment",
    "Differently Abled",
    "Disaster Management",
    "Drinking Water",
    "Education and Literacy",
    "Environment and Forest",
    "Food Processing",
    "Health and Family Welfare",
    "HIV/AIDS",
    "Housing",
    "Human Rights",
    "Information and Communication Technology",
    "Labour and Employment",
    "Land Resources",
    "Legal Awareness and Aid",
    "Micro Finance (SHG)",
    "Micro, Small and Medium Enterprises",
    "Minority Issues",
    "New and Renewable Energy",
    "Nutrition",
    "Panchayati Raj",
    "Prisoner's Issues",
    "Religious",
    "Right to Information and Advocacy",
    "Rural Development and Poverty Alleviation",
    "Science & Technology",
    "Skill Development",
    "Sports",
    "Tourism",
    "Tribal Affairs",
    "Urban Development & Poverty Alleviation",
    "Vocational Training",
    "Water Resources",
    "Women Development and Empowerment",
    "Youth Affairs"
  ];

  const filteredSectors = sectors.filter(sector =>
    sector.toLowerCase().includes(sectorSearch.toLowerCase())
  );

  const [isNgoTypeOpen, setIsNgoTypeOpen] = useState(false);
  const [ngoTypeSearch, setNgoTypeSearch] = useState("");
  const ngoTypeDropdownRef = useRef(null);

  const ngoTypes = ["Trust", "Society", "Section 8 Company", "Other"];

  const filteredNgoTypes = ngoTypes.filter(type =>
    type.toLowerCase().includes(ngoTypeSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target)) {
        setIsSectorOpen(false);
      }
      if (ngoTypeDropdownRef.current && !ngoTypeDropdownRef.current.contains(event.target)) {
        setIsNgoTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      registrationCertificate: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    for (const key in formData) {
        data.append(key, formData[key]);
    }

    try {
        const response = await api.post("/v1/ngos/register", data);
        if (response.status === 201) {
          console.log("Form submitted:", response.data);
          alert("NGO registered successfully.");
          navigate('/ngologin');
        } else {
          console.warn("Unexpected response:", response);
          alert(`Unexpected response: ${response.status}`);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        const msg = error?.response?.data?.message || "Error submitting form.";
        alert(msg);
    }
  };

  const handleLoginClick = () => {
    navigate('/ngologin');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="px-6 sm:px-12 md:px-20 pt-16 pb-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Register Your <span className="text-emerald-600">NGO</span>
          </h1>
          <p className="mt-3 text-gray-600">
            Join our platform to connect with citizens who need your services
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* NGO/NGO Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NGO Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ngoName"
              required
              value={formData.ngoName}
              onChange={handleInputChange}
              placeholder="e.g., Sanskar Medical Education and Welfare Trust"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none hover:border-emerald-400"
            />
          </div>

          {/* DARPAN Unique ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DARPAN Unique ID (UIN) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="darpanUid"
              required
              value={formData.darpanUid}
              onChange={handleInputChange}
              placeholder="e.g., MH/2022/0326622"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none hover:border-emerald-400"
            />
            <p className="mt-1 text-xs text-gray-500">
              This unique ID helps verify your organization on the Darpan portal
            </p>
          </div>

          {/* State & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="registeredState"
                required
                value={formData.registeredState}
                onChange={handleInputChange}
                placeholder="e.g., Maharashtra"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none hover:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="registeredDistrict"
                required
                value={formData.registeredDistrict}
                onChange={handleInputChange}
                placeholder="e.g., Nashik"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none hover:border-emerald-400"
              />
            </div>
          </div>

          {/* NGO Type - CUSTOM DROPDOWN */}
          <div ref={ngoTypeDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NGO Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNgoTypeOpen(!isNgoTypeOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white text-left flex items-center justify-between hover:border-emerald-400"
              >
                <span className={formData.ngoType ? "text-gray-900" : "text-gray-400"}>
                  {formData.ngoType || "Select type"}
                </span>
                <ChevronDown className={`w-5 h-5 text-emerald-500 transition-transform duration-200 ${isNgoTypeOpen ? "rotate-180" : ""}`} />
              </button>

              {isNgoTypeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input
                        type="text"
                        placeholder="Search types..."
                        value={ngoTypeSearch}
                        onChange={(e) => setNgoTypeSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm hover:border-emerald-400"
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-64">
                    {filteredNgoTypes.length > 0 ? (
                      filteredNgoTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, ngoType: type }));
                            setIsNgoTypeOpen(false);
                            setNgoTypeSearch("");
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors text-sm ${
                            formData.ngoType === type ? "bg-emerald-100 text-emerald-700 font-medium" : "text-gray-700"
                          }`}
                        >
                          {type}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        No types found matching "{ngoTypeSearch}"
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sector / Key Issues - CUSTOM DROPDOWN */}
          <div ref={sectorDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector / Key Issues <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSectorOpen(!isSectorOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white text-left flex items-center justify-between hover:border-emerald-400"
              >
                <span className={formData.sector ? "text-gray-900" : "text-gray-400"}>
                  {formData.sector || "Select sector"}
                </span>
                <ChevronDown className={`w-5 h-5 text-emerald-500 transition-transform duration-200 ${isSectorOpen ? "rotate-180" : ""}`} />
              </button>

              {isSectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input
                        type="text"
                        placeholder="Search sectors..."
                        value={sectorSearch}
                        onChange={(e) => setSectorSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm hover:border-emerald-400"
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-64">
                    {filteredSectors.length > 0 ? (
                      filteredSectors.map((sector) => (
                        <button
                          key={sector}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, sector }));
                            setIsSectorOpen(false);
                            setSectorSearch("");
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors text-sm ${
                            formData.sector === sector ? "bg-emerald-100 text-emerald-700 font-medium" : "text-gray-700"
                          }`}
                        >
                          {sector}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        No sectors found matching "{sectorSearch}"
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Helps citizens find organizations based on their needs
            </p>
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="registrationNumber"
              required
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="e.g., E-1056/Nashik"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none hover:border-emerald-400"
            />
          </div>

          {/* Contact Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="info@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none hover:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="contact"
                required
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none hover:border-emerald-400"
              />
            </div>
          </div>

          {/* Password
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none hover:border-emerald-400"
            />
          </div> */}

          {/* Website URL (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Official Website URL (Optional)
            </label>
            <input
              type="url"
              name="officialwebsiteURL"
              value={formData.officialwebsiteURL}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none hover:border-emerald-400"
            />
          </div>

          {/* Registration Certificate Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Certificate Upload <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-emerald-400 transition-all">
              <div className="space-y-2 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      name="registrationCertificate"
                      required
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                {formData.registrationCertificate && (
                  <p className="text-sm text-emerald-600 font-medium mt-2">
                    ✓ {formData.registrationCertificate.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 text-white px-6 py-4 text-base sm:text-lg font-medium shadow-md hover:bg-emerald-700 transition-all mt-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Register Organization →
          </motion.button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already registered?{" "}
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </motion.form>
      </section>
    </main>
  );
}