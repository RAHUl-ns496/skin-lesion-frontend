import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Predict from "./pages/predict";
import History from "./pages/history";
import Evaluation from "./pages/evaluation";
import Dashboard from "./pages/dashboard";

import "./styles.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <BrowserRouter>
      <div className={darkMode ? "app dark" : "app"}>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Predict />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/history" element={<History />} />
            <Route path="/evaluation" element={<Evaluation />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
