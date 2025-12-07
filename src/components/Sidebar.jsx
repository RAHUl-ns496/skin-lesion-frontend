import { Link } from "react-router-dom";

export default function Sidebar({ darkMode, setDarkMode }) {
  return (
    <div
      style={{
        width: "250px",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        minHeight: "100vh"
      }}
    >
      <h2>🧠 AI Doctor</h2>

      <nav style={{ marginTop: "30px" }}>
        <p><Link style={link} to="/predict">🩺 Predict</Link></p>
        <p><Link style={link} to="/history">📜 History</Link></p>
        <p><Link style={link} to="/evaluation">📊 Evaluation</Link></p>
        <p><Link style={link} to="/dashboard">📋 Dashboard</Link></p>
      </nav>

      <hr />

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          background: darkMode ? "#22c55e" : "#2563eb",
          padding: "8px",
          border: "none",
          color: "white",
          marginTop: "15px",
          width: "100%",
          cursor: "pointer"
        }}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}

const link = {
  textDecoration: "none",
  color: "white",
  fontSize: "16px"
};
