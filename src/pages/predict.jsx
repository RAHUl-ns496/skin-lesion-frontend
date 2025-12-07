import React, { useRef, useState, useEffect } from "react";

export default function Predict() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  const [capturedBlob, setCapturedBlob] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const API_BASE = "http://127.0.0.1:8000";

  /* ========== CAMERA ========= */
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setStream(s);
      setCameraOn(true);
    } catch (e) {
      console.error("Camera error:", e);
      setErrorMsg("❌ Camera access denied. Upload image instead.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
    setCameraOn(false);
  };

  /* ========== CAPTURE PHOTO ========= */
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        setCapturedBlob(blob);
        setFileInput(null);
      },
      "image/jpeg",
      0.9
    );
  };

  /* ========== FILE UPLOAD ========= */
  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setFileInput(e.target.files[0]);
      setCapturedBlob(null);
      setResult(null);
    }
  };

  /* ========== PREVIEW HANDLER ========= */
  useEffect(() => {
    if (capturedBlob || fileInput) {
      const objUrl = URL.createObjectURL(capturedBlob || fileInput);
      setPreviewURL(objUrl);

      return () => URL.revokeObjectURL(objUrl);
    }
  }, [capturedBlob, fileInput]);

  /* ========== SEND TO BACKEND ========= */
  const sendForPrediction = async () => {
    setErrorMsg(null);
    setResult(null);

    if (!patientName.trim()) {
      setErrorMsg("⚠ Please enter patient name");
      return;
    }

    const fileToSend = capturedBlob || fileInput;

    if (!fileToSend) {
      setErrorMsg("⚠ Please select or capture an image");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", fileToSend, "lesion.jpg");
      form.append("patient_name", patientName);

      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Server Error: " + res.status);

      const data = await res.json();

      setResult({
        class: data.class || "Unknown",
        confidence: data.confidence || 0,
        description: data.description,
        recommendation: data.recommendation,
        heatmapBase64: data.heatmap_base64,
      });

      stopCamera();
    } catch (e) {
      console.error(e);
      setErrorMsg("❌ Prediction failed. Check FastAPI server.");
    } finally {
      setLoading(false);
    }
  };

  /* ========== CLEANUP ========= */
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /* ========== UI ========= */
  return (
    <div style={UI.page}>
      <h1>🩺 AI Skin Lesion Detection</h1>

      <div style={UI.grid}>
        {/* LEFT */}
        <div style={UI.cardBlue}>
          <h2>👨 Patient</h2>

          <input
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            style={UI.input}
          />

          <input type="file" accept="image/*" onChange={onFileChange} />

          <div style={UI.btnGroup}>
            <button onClick={cameraOn ? stopCamera : startCamera} className="btn-blue">
              {cameraOn ? "Stop Camera" : "Open Camera"}
            </button>

            {cameraOn && <button onClick={capturePhoto} className="btn-green">Capture</button>}

            <button
              onClick={() => {
                setCapturedBlob(null);
                setFileInput(null);
                setPreviewURL(null);
                setResult(null);
              }}
              className="btn-red"
            >
              Clear
            </button>
          </div>

          {cameraOn && <video ref={videoRef} autoPlay style={UI.video} />}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {/* RIGHT */}
        <div style={UI.cardGreen}>
          <h2>🧠 Result</h2>

          <button
            onClick={sendForPrediction}
            disabled={loading}
            className="btn-main"
          >
            {loading ? "Analyzing..." : "Start Analysis"}
          </button>

          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          {previewURL && <img src={previewURL} style={UI.preview} />}

          {result && (
            <>
              <div style={UI.resultCard}>
                <h3>Prediction: {result.class}</h3>
                <p>Confidence: {result.confidence}%</p>
                <p>{result.description}</p>
                <p>{result.recommendation}</p>
              </div>

              {result.heatmapBase64 && (
                <img
                  src={`data:image/jpeg;base64,${result.heatmapBase64}`}
                  style={UI.preview}
                />
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .btn-main{background:#0ea5e9;color:white;padding:12px;border:none;border-radius:8px;}
        .btn-blue{background:#2563eb;color:white;padding:8px 12px;border:none;border-radius:8px;}
        .btn-green{background:#16a34a;color:white;padding:8px 12px;border:none;border-radius:8px;}
        .btn-red{background:#dc2626;color:white;padding:8px 12px;border:none;border-radius:8px;}
      `}</style>
    </div>
  );
}

/* ========= STYLES ========= */
const UI = {
  page: {
    background: "linear-gradient(120deg,#0f172a,#020617)",
    minHeight: "100vh",
    padding: 30,
    color: "white",
    fontFamily: "Segoe UI",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30,
  },
  cardBlue: {
    background: "#111827",
    padding: 25,
    borderRadius: 15,
    boxShadow: "0 0 10px #0ea5e9",
  },
  cardGreen: {
    background: "#111827",
    padding: 25,
    borderRadius: 15,
    boxShadow: "0 0 10px #22c55e",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
  },
  video: {
    width: "100%",
    marginTop: 20,
    borderRadius: 12,
  },
  preview: {
    width: "100%",
    borderRadius: 12,
    marginTop: 10,
  },
  resultCard: {
    background: "#020617",
    padding: 15,
    marginTop: 15,
    borderRadius: 10,
  },
  btnGroup: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
};
