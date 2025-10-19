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

function AppContent() {
  const [authStatus] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {isHomePage && <Header authStatus={authStatus} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      {isHomePage && <Features />}
      {isHomePage && <UserTimeline />}
      {isHomePage && <NgoTimeline />}
      {isHomePage && <Footer />}
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
