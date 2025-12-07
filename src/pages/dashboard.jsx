import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";

export default function Dashboard() {

  const [stats, setStats] = useState({
    total_cases: 0,
    total_diseases: 0,
    max_confidence: 0,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then(res => {
        setStats(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load dashboard data");
      });
  }, []);

  if (error) {
    return <h2 style={{color:"red", textAlign:"center"}}>{error}</h2>
  }

  return (
    <div style={{ padding: 40, color:"white" }}>
      <h1>🩺 Doctor Dashboard</h1>

      <div style={{ display: "flex", gap: 20, marginTop:30 }}>
        <Card title="Total Cases" value={stats.total_cases}/>
        <Card title="Unique Diseases" value={stats.total_diseases}/>
        <Card title="Max Confidence" value={stats.max_confidence + "%"}/>
      </div>
    </div>
  );
}

function Card({title, value}){
  return (
    <div style={{
      background:"#111827",
      padding:20,
      borderRadius:10,
      width:200,
      textAlign:"center",
      boxShadow:"0 0 10px #0ea5e9"
    }}>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  )
}
