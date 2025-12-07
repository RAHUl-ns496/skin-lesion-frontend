import React, { useEffect, useState } from "react";
import { getHistory } from "../services/api";

export default function History() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHistory()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRecords(res.data);
        } else {
          setRecords([]);
        }
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load history from server");
      });
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center" }}>📜 Prediction History</h1>

      {error && <p style={{color:"red", textAlign:"center"}}>{error}</p>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Disease</th>
              <th>Confidence</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {records.length > 0 ? (
              records.map((rec, index) => (
                <tr key={index}>
                  <td>{rec.patient_name || "-"}</td>
                  <td>{rec.prediction || "-"}</td>
                  <td>{rec.confidence ? `${rec.confidence}%` : "-"}</td>
                  <td>{rec.time || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right,#020617,#0f172a)",
    padding: 40,
    color: "white",
  },
  tableWrapper: {
    background: "#111827",
    padding: 20,
    borderRadius: 15,
    marginTop: 30,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center"
  }
};
