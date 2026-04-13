 import { useState } from "react";

function TomatoDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://127.0.0.1:8000/detect/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.total === 0) {
        setError("No tomatoes detected in this image.");
        setResult(null);
      } else {
        setResult(data);
      }

    } catch (err) {
      setError("Backend not running or error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Tomato Detection System</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button onClick={handleUpload} style={styles.button}>
        {loading ? "Processing..." : "Upload & Detect"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {result && (
        <div style={styles.resultBox}>
          <h2>Results</h2>
          <p><strong>Total Tomatoes:</strong> {result.total}</p>
          <p style={{ color: "green" }}><strong>Ripe:</strong> {result.ripe}</p>
          <p style={{ color: "orange" }}><strong>Unripe:</strong> {result.unripe}</p>
          <p style={{ color: "red" }}><strong>Damaged:</strong> {result.damaged}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "80px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "40px",
    padding: "20px",
    border: "1px solid #ccc",
    display: "inline-block",
  },
  error: {
    color: "red",
    marginTop: "20px",
  },
};

export default TomatoDetection;