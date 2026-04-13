import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Farm3D from "./Farm3D";

/* 🌱 SVG ICONS */
const CarrotSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M12 22c1-6 1-10 0-14" stroke="#2e7d32" strokeWidth="2" />
    <path d="M10 6l-2-4M14 6l2-4" stroke="#2e7d32" strokeWidth="2" />
    <path d="M12 14c-3 0-5 3-5 6h10c0-3-2-6-5-6z" fill="#f57c00" />
  </svg>
);

const LeafSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M12 22V10" stroke="#2e7d32" strokeWidth="2" />
    <path
      d="M12 10c-4-2-6-6-6-6s4-1 6 2c2-3 6-2 6-2s-2 4-6 6z"
      fill="#66bb6a"
    />
  </svg>
);

export default function PlantingPlanner() {
  const [data, setData] = useState([]);
  const [veg, setVeg] = useState(null);
  const [perches, setPerches] = useState("");

  /* 🔥 NEW RESULT STATE */
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/smart-planting/")
      .then(res => res.json())
      .then(setData);
  }, []);

  const ready = veg && perches;

  const avgPlantSpacing =
    veg &&
    Math.round(
      (veg.plant_spacing_min_cm +
        (veg.plant_spacing_max_cm ?? veg.plant_spacing_min_cm)) / 2
    );

  /* 🔥 BUTTON CLICK CALCULATION */
  const handleCalculate = () => {
    const plantCount = Math.floor(
      (perches * 25.29) /
        (((veg.plant_spacing_min_cm +
          (veg.plant_spacing_max_cm ?? veg.plant_spacing_min_cm)) /
          2) /
          100 *
          ((veg.row_spacing_min_cm +
            (veg.row_spacing_max_cm ?? veg.row_spacing_min_cm)) /
            2) /
            100)
    );

    setResult({
      count: plantCount,
      spacing: avgPlantSpacing,
      area: (perches * 25.29).toFixed(2),
    });
  };

  const VISUAL_PLANTS = Math.min(result?.count || 0, 300);

  const PlantIcon =
    veg?.vegetable_name === "Carrot" ? CarrotSVG : LeafSVG;

  return (
    <>
    

      <div
  style={{
    ...page,
    transform: "scale(0.80)",
    transformOrigin: "top center",
  }}
>
        <h1 style={title}>🌱 Planting Calculator</h1>
        <p style={subtitle}>
          Calculate the optimal number of plants for your garden space
        </p>

        <div style={layout}>
          {/* LEFT PANEL */}
          <div style={panel}>
            <h3 style={panelTitle}>Garden Dimensions</h3>

            <label style={label}>Vegetable</label>
            <select
              style={input}
              value={veg?.vegetable_name || ""}
              onChange={(e) =>
                setVeg(
                  data.find(v => v.vegetable_name === e.target.value) || null
                )
              }
            >
              <option value="">Select vegetable</option>
              {data.map(v => (
                <option key={v.vegetable_name}>{v.vegetable_name}</option>
              ))}
            </select>

            <label style={{ ...label, marginTop: 16 }}>
              Land size (perches)
            </label>
            <input
              type="number"
              style={input}
              value={perches}
              onChange={(e) => setPerches(e.target.value)}
              placeholder="e.g. 100"
            />

            <button
              style={{
                ...button,
                opacity: ready ? 1 : 0.6,
                cursor: ready ? "pointer" : "not-allowed",
                background: ready ? "#16a34a" : "#9ca3af",
              }}
              disabled={!ready}
              onClick={handleCalculate}
            >
              {result ? "Recalculate Layout" : "Calculate Planting Layout"}
            </button>

            {result && (
              <div style={summary}>
                <h4 style={{ marginBottom: 10 }}>Results Summary</h4>
                <p><strong>Total Plants:</strong> {result.count.toLocaleString()}</p>
                <p><strong>Garden Area:</strong> {result.area} m²</p>
                <p><strong>Spacing:</strong> {result.spacing} cm</p>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div style={visualPanel}>
            {result ? (
              <>
                <h3 style={panelTitle}>Your Planting Layout</h3>
                <p style={layoutInfo}>
                  {result.count.toLocaleString()} {veg.vegetable_name} plants
                  with {result.spacing}cm spacing
                </p>

                <Farm3D 
                  count={VISUAL_PLANTS} 
                  type={veg?.vegetable_name}
                  spacing={result.spacing}
                />
              </>
            ) : (
              <div style={placeholder}>
                Enter details and calculate to see layout 🌿
              </div>
            )}
          </div>
        </div>
      </div>

      
    </>
  );
}

/* 🎨 STYLES — UNCHANGED */
const page = { padding: "30px 16px", background: "#ffffff" };
const title = { textAlign: "center", fontSize: "36px", color: "#1b5e20" };
const subtitle = { textAlign: "center", color: "#6b7280", marginBottom: "50px" };
const layout = { maxWidth: "1050px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" };
const panel = { background: "#ffffff", padding: "28px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" };
const visualPanel = { background: "#f0fdf4", padding: "20px",  height: "500px",overflow: "hidden",borderRadius: "16px", border: "1px solid #bbf7d0" };
const panelTitle = { marginBottom: "18px", fontSize: "18px", color: "#000" };
const label = { fontWeight: 600, marginBottom: 6, display: "block", color: "#1b5e20" };
const input = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" };
const button = { marginTop: "24px", width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: "#16a34a", color: "#fff", fontWeight: 700 };
const summary = { marginTop: "24px", padding: "16px", background: "#dcfce7", borderRadius: "12px", fontSize: "14px", color: "#000" };
const layoutInfo = { marginBottom: "16px", color: "#000", fontWeight: 600 };
const placeholder = { textAlign: "center", color: "#6b7280", padding: "80px 20px" };