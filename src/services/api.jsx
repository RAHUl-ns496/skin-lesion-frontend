import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

API.interceptors.response.use(
  response => response,
  error => {
    console.error("API ERROR:", error.response || error.message);
    throw error;
  }
);

export const predictImage = async (file, patient) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("patient_name", patient);

  const res = await API.post("/predict", formData);
  console.log("Predict response:", res.data);
  return res.data;
};

export const getHistory = () => API.get("/history");
export const getEvaluation = () => API.get("/evaluation");
export const getDashboard = () => API.get("/dashboard");
