import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const navigationPublic = [
  { name: "Home", to: "/" },
  { name: "Login", to: "/login" },
  { name: "Sign Up", to: "/signup" },
];

const navigationPrivate = [
  { name: "Home", to: "/" },
  { name: "Dashboard", to: "/dashboard" },
  { name: "Profile", to: "/profile" },
];

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check login status from backend (token or session)
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include", // include cookies if using sessions
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  const navigation = user ? navigationPrivate : navigationPublic;

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
          <div className="flex space-x-6">
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

            {/* Show Logout only when user is logged in */}
            {user && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
