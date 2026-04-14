import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

/* background images */
import beansImg from "../assets/vegetables/beans.jpg";
import carrotImg from "../assets/vegetables/carrot.jpg";
import tomatoImg from "../assets/vegetables/tomato.jpg";
import cabbageImg from "../assets/vegetables/cabbage.jpg";
import beetrootImg from "../assets/vegetables/beetroot.jpg";
import leeksImg from "../assets/vegetables/leeks.jpg";
import radishImg from "../assets/vegetables/radish.jpg";
import knolkholImg from "../assets/vegetables/knolkhol.jpg";

const vegBackgrounds = {
  beans: beansImg,
  carrot: carrotImg,
  tomato: tomatoImg,
  cabbage: cabbageImg,
  beetroot: beetrootImg,
  leeks: leeksImg,
  radish: radishImg,
  knolkhol: knolkholImg,
};

function VegetablePage() {
  const { vegName } = useParams();
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);

  const normalize = str =>
    str.toLowerCase().replace(/\s+/g, "").replace("raddish", "radish");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/diseases/")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          d =>
            d.vegetable_name &&
            normalize(d.vegetable_name).includes(normalize(vegName))
        );

        setDiseases(filtered);
        setSelectedDisease(filtered[0]);
      });
  }, [vegName]);

  const vegLabel =
    vegName.charAt(0).toUpperCase() + vegName.slice(1);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${vegBackgrounds[vegName]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "15px 30px", 
      }}
    >
      {/* TITLE */}
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "3px", fontSize: "26px" }}>
        {vegLabel}
      </h1>

      <p style={{ color: "#ccc", textAlign: "center", marginBottom: "15px", fontSize: "13px" }}>
        Diseases affecting {vegLabel} and recommended management practices.
      </p>

      {/* MAIN */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          maxWidth: "1100px",
          margin: "0 auto",
          alignItems: "flex-start",
        }}
      >
        {/* SIDEBAR */}
        <div
          style={{
            width: "260px",
            maxHeight: "60vh",
            overflowY: "auto",
            background: "linear-gradient(180deg, #1b5e20, #2e7d32)",
            borderRadius: "14px",
            padding: "14px",
            color: "#fff",
          }}
        >
          <h3 style={{ marginBottom: "10px", fontSize: "16px" }}>{vegLabel}</h3>

          {diseases.map(d => (
            <div
              key={d.id}
              onClick={() => setSelectedDisease(d)}
              style={{
                padding: "8px",
                marginBottom: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "12px",
                background:
                  selectedDisease?.id === d.id
                    ? "#66bb6a"
                    : "transparent",
              }}
            >
              {d.disease_name}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        {selectedDisease && (
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.95)",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <h2 style={{ color: "#1b5e20", fontSize: "18px", marginBottom: "6px" }}>
              {selectedDisease.disease_name}
            </h2>

            <span
              style={{
                background: "#e8f5e9",
                color: "#1b5e20",
                padding: "4px 8px",
                borderRadius: "20px",
                fontSize: "11px",
                marginBottom: "10px",
                display: "inline-block",
              }}
            >
              Cause: {selectedDisease.cause}
            </span>

            <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
              <p style={{ fontSize: "12px", lineHeight: "1.4", color: "#444", flex: 1 }}>
                {selectedDisease.description}
              </p>

              {selectedDisease.image && (
                <img
                  src={selectedDisease.image}
                  alt=""
                  style={{
                    width: "180px", 
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              <div style={{ background: "#f1f8f4", padding: "10px", borderRadius: "8px" }}>
                <h4 style={{ fontSize: "13px", marginBottom: "4px", color: "#1b5e20" }}>
                  Symptoms
                </h4>
                <p style={{ fontSize: "11px", color: "#000" }}>
                  {selectedDisease.symptoms}
                </p>
              </div>

              <div style={{ background: "#f1f8f4", padding: "10px", borderRadius: "8px" }}>
                <h4 style={{ fontSize: "13px", marginBottom: "4px", color: "#1b5e20" }}>
                  Favorable Conditions
                </h4>
                <p style={{ fontSize: "11px", color: "#000" }}>
                  Humid weather, poor drainage, continuous cropping
                </p>
              </div>

              <div style={{ background: "#f1f8f4", padding: "10px", borderRadius: "8px" }}>
                <h4 style={{ fontSize: "13px", marginBottom: "4px", color: "#1b5e20" }}>
                  Management
                </h4>
                <p style={{ fontSize: "11px", color: "#000" }}>
                  {selectedDisease.solutions}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VegetablePage;