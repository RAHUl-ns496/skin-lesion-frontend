import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (email === "doctor" && password === "12345") {
      localStorage.setItem("doctor", "true");
      window.location.href = "/dashboard";
    } else {
      alert("❌ Invalid Credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>👨‍⚕ Doctor Login</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(to right,#020617,#0f172a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 350,
    background: "#111827",
    padding: 30,
    borderRadius: 15,
    textAlign: "center",
    boxShadow: "0 0 15px #0ea5e9",
  },
  input: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    borderRadius: 8,
    border: "1px solid #1e293b",
    background: "#020617",
    color: "white",
  },
  button: {
    width: "100%",
    padding: 12,
    marginTop: 25,
    background: "#0ea5e9",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
