import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Features from "./components/Features";
import UserTimeline from "./components/UserTimeline";
import NgoTimeline from "./components/Ngotimeline";
import Footer from "./components/footer";
import RoleSelection from "./pages/RoleSelection";
import NGOSignup from "./pages/NGOSignup";
import NGOLogin from "./pages/NGOLogin";
import NGODashboard from "./pages/NGODashboard";

function AppContent() {
  const [authStatus] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Header authStatus={authStatus} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/roleselection" element={<RoleSelection/>}/>
        <Route path="/ngosignup" element={<NGOSignup/>}/>
        <Route path="/ngologin" element={<NGOLogin/>}/>
        <Route path="/ngodashboard" element={<NGODashboard/>}/>
        <Route path="/chat" element={<Chat />} />
      </Routes>
      {isHomePage && (
        <>
          <Features />
          <UserTimeline />
          <NgoTimeline />
          <Footer />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
