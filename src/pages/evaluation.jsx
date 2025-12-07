import React, { useEffect, useState } from "react";
import { getEvaluation } from "../services/api";

export default function Evaluation() {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvaluation()
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load evaluation data");
      });
  }, []);

  if (error) {
    return <h2 style={{color:"red", textAlign:"center"}}>{error}</h2>
  }

  if (!data) {
    return <h2 style={{color:"white", textAlign:"center"}}>Loading evaluation...</h2>
  }

  return (
    <div style={styles.container}>
      <h1>📊 Model Evaluation</h1>

      <div style={styles.statsRow}>
        <Stat label="Accuracy" value={data.accuracy + "%"} />
        <Stat label="Loss" value={data.loss} />
        <Stat label="Precision" value={data.precision} />
        <Stat label="Recall" value={data.recall} />
      </div>

      <div style={styles.images}>
        <EvalBox title="Confusion Matrix" img={data.confusion_matrix} />
        <EvalBox title="ROC Curve" img={data.roc_curve} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <h3>{label}</h3>
      <h2>{value}</h2>
    </div>
  );
}

function EvalBox({ title, img }) {
  return (
    <div style={styles.imageBox}>
      <h3>{title}</h3>
      {img ? (
        <img
          src={`data:image/png;base64,${img}`}
          alt={title}
          style={{ width: "100%", borderRadius: 10 }}
        />
      ) : (
        <p>No Image</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right,#020617,#0f172a)",
    color: "white",
    padding: 40,
  },
  statsRow: { 
    display: "flex", 
    gap: 20, 
    marginTop: 30 
  },
  statBox: {
    background: "#111827",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    minWidth: 180,
    boxShadow: "0 0 10px #0ea5e9",
  },
  images: {
    marginTop: 50,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30,
  },
  imageBox: {
    background: "#111827",
    padding: 20,
    borderRadius: 15,
  },
};
