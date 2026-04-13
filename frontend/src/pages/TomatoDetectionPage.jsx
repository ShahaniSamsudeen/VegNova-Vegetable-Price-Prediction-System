import React, { useState } from "react";


import tomatoGif from "../assets/tomato.gif";
import "./TomatoDetectionPage.css";

function TomatoDashboard() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setFileName(selected ? selected.name : "");
    setPreview(selected ? URL.createObjectURL(selected) : null);
    setResults(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://127.0.0.1:8000/detect/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResults(data);
    } catch {
      setError("Backend not running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     

      <div className="container">
        <div className="wrapper">

          <h1 className="title">Tomato Detection System </h1>

          <img src={tomatoGif} alt="Tomato" className="tomato-big" />

          <p className="subtitle">
            Upload an image and I’ll detect and categorize your tomatoes.
          </p>

          <div className="upload-box">
            <input type="file" onChange={handleFileChange} />
            <span>{fileName}</span>

            <button onClick={handleUpload}>
              {loading ? "Analyzing..." : "Upload & Detect"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="content">

            <div className="left">
              {preview ? (
                <img src={preview} alt="preview" className="preview" />
              ) : (
                <div className="placeholder" />
              )}
            </div>

            <div className="right">

              <p className="result-text">
                {results
                  ? "In this picture we can see:"
                  : "Results will appear here"}
              </p>

              <div className="results">
                {results ? (
                  <>
                    <h3>Results</h3>
                    <p>Total No of Tomatoes: {results.total}</p>
                    <p className="ripe">Ripe: {results.ripe}</p>
                    <p className="unripe">Unripe: {results.unripe}</p>
                    <p className="damaged">Damaged: {results.damaged}</p>
                  </>
                ) : (
                  <p className="no-results">.</p>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      
    </>
  );
}

export default TomatoDashboard;