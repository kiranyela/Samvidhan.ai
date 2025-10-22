import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const navigationPublic = [
  { name: "Home", to: "/" },
  { name: "Login", to: "/roleselection" },
  { name: "Sign Up", to: "/roleselection" },
];

const navigationPrivate = [
  { name: "Home", to: "/" },
  { name: "Dashboard", to: "/dashboard" },
  { name: "Profile", to: "/profile" },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isChat = location.pathname.startsWith("/chat");

  // Initialize from localStorage and keep in sync
  useEffect(() => {
    const applyLocalAuth = () => {
      const isAuth = localStorage.getItem("auth") === "true";
      if (isAuth) {
        const role = localStorage.getItem("role") || "user";
        const email = localStorage.getItem("email") || null;
        setUser({ role, email });
      } else {
        setUser(null);
      }
    };

    applyLocalAuth();

    // Best-effort backend check (optional)
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/v1/users/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) setUser(data.user);
        }
      } catch {}
    };
    fetchUser();

    // Listen for auth changes across tabs (storage) and same-tab (custom event)
    const onStorage = (e) => {
      if (e.key === "auth" || e.key === "role" || e.key === "email") {
        applyLocalAuth();
      }
    };
    const onAuthChanged = () => applyLocalAuth();
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/users/logout", { method: "POST", credentials: "include" });
    } catch {}
    localStorage.removeItem("auth");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setUser(null);
    navigate("/");
  };

  // Build navigation depending on role
  const dashboardTo = user?.role === "ngo" ? "/ngodashboard" : "/dashboard";
  const navigation = user
    ? [
        { name: "Home", to: "/" },
        { name: "Dashboard", to: dashboardTo },
      ]
    : navigationPublic;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              className="h-7 w-auto"
              src="/header_logo.png"
              alt="Logo"
            />
            <span className="text-base font-semibold text-gray-900">
              Samvidhan.ai
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-6 relative">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition
                  ${
                    isActive
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {isChat && (
              <button
                onClick={() => navigate("/post")}
                className="inline-flex items-center px-3 py-1 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
              >
                Post
              </button>
            )}

            {/* Avatar dropdown for logged-in user */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow hover:bg-emerald-700"
                  title={user.email || "Account"}
                >
                  {(user.email || "U").split("@")[0]
                    .split(/[\s._-]+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((s) => s[0]?.toUpperCase())
                    .join("") || "U"}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(dashboardTo);
                      }}
                    >
                      Dashboard
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/chat");
                      }}
                    >
                      Chat
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
