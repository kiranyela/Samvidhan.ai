import { NavLink } from "react-router-dom";

const navigation = [
  { name: "Home", to: "/" },
  { name: "Login", to: "/login" },
  { name: "Sign Up", to: "/signup" },
];

export default function Header() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo + Text */}
          <div className="flex items-center space-x-2">
            <img
              className="h-7 w-auto"
              src="./public/header_logo.png"
              alt="Logo"
            />
            <span className="text-base font-semibold text-gray-900">
              Samvidhan.ai
            </span>
          </div>

          {/* Navigation Links */}
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
          </div>
        </div>
      </div>
    </nav>
  );
}
