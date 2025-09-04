import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Features from "./components/Features";


export default function App() {
  const [authStatus] = useState(false); // you can change to true for testing

  return (
    <Router>
      <Header authStatus={authStatus} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
      <Features/>
      
    </Router>
  );
}
