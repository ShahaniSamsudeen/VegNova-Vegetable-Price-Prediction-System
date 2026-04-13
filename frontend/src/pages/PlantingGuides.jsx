import { useEffect, useState } from "react";

function PlantingGuides() {
  const vegetables = [
    "Beans",
    "Carrot",
    "Leeks",
    "Beetroot",
    "Raddish",
    "Cabbage",
    "Tomato",
    "Knolkhol",
  ];

  const [guides, setGuides] = useState([]);
  const [selectedVeg, setSelectedVeg] = useState("Beans");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/planting-guides/")
      .then(res => res.json())
      .then(data => setGuides(data));
  }, []);

  const selectedGuide = guides.find(
    g => g.vegetable_name === selectedVeg
  );

  const parseSections = (text) => {
    if (!text) return [];

    const rawSections = text.split(/\n(?=[A-Za-z ]+:)/);

    return rawSections.map(section => {
      const [titleLine, ...rest] = section.split("\n");
      const title = titleLine.replace(":", "").trim();
      const content = rest.join("\n");

      return { title, content };
    });
  };

  const plantingSections = parseSections(selectedGuide?.planting_guide);
  const harvestSections = parseSections(selectedGuide?.harvest_guide);

  const climateSection = plantingSections.find(sec =>
    sec.title.toLowerCase().includes("climate")
  );

  const otherSections = plantingSections.filter(
    sec => !sec.title.toLowerCase().includes("climate")
  );

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("climate")) return "☀️";
    if (t.includes("soil")) return "🌱";
    if (t.includes("seed")) return "🌾";
    if (t.includes("sow")) return "🌿";
    if (t.includes("water")) return "💧";
    if (t.includes("fertil")) return "🧪";
    if (t.includes("harvest")) return "🌽";
    return "🌿";
  };

  return (
    <div
      style={{
        padding: "40px 15px", // 🔥 reduced
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #edf7ed, #f6fbf6)",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#2e7d32", fontSize: "26px", marginBottom: "5px" }}>
          {selectedVeg.toUpperCase()}
        </h1>
        <p style={{ color: "#6b8f71", fontSize: "13px" }}>
          Complete planting and cultivation guide
        </p>
      </div>

      {/* BUTTONS */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {vegetables.map(veg => (
          <button
            key={veg}
            onClick={() => setSelectedVeg(veg)}
            style={{
              margin: "4px",
              padding: "6px 12px", // 🔥 smaller
              borderRadius: "15px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              background: selectedVeg === veg ? "#2e7d32" : "#ddd",
              color: selectedVeg === veg ? "#fff" : "#333",
            }}
          >
            {veg}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {selectedGuide && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}> {/* 🔥 smaller width */}

          {/* 🌤️ CLIMATE */}
          {climateSection && (
            <div
              style={{
                background: "#ffffff",
                padding: "18px", // 🔥 reduced
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ color: "#2e7d32", fontSize: "16px" }}>
                ☀️ {climateSection.title}
              </h3>

              <p
                style={{
                  whiteSpace: "pre-line",
                  color: "#222",
                  fontSize: "13px", // 🔥 smaller
                  lineHeight: "1.5",
                }}
              >
                {climateSection.content}
              </p>
            </div>
          )}

          {/* 🌱 GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // 🔥 tighter
              gap: "15px",
            }}
          >
            {otherSections.map((sec, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  padding: "16px", // 🔥 reduced
                  borderRadius: "15px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
                }}
              >
                <h4 style={{ color: "#2e7d32", fontSize: "14px" }}>
                  {getIcon(sec.title)} {sec.title}
                </h4>

                <p
                  style={{
                    whiteSpace: "pre-line",
                    color: "#222",
                    fontSize: "12.5px",
                    lineHeight: "1.5",
                  }}
                >
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* 🌾 HARVEST */}
          <div style={{ marginTop: "25px" }}>
            <h3 style={{ color: "#2e7d32", fontSize: "16px" }}>
              Harvest Guide
            </h3>

            {harvestSections.map((sec, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  padding: "16px",
                  borderRadius: "15px",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
                  marginTop: "10px",
                }}
              >
                <h4 style={{ color: "#2e7d32", fontSize: "14px" }}>
                  {getIcon(sec.title)} {sec.title}
                </h4>

                <p
                  style={{
                    whiteSpace: "pre-line",
                    color: "#222",
                    fontSize: "12.5px",
                    lineHeight: "1.5",
                  }}
                >
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default PlantingGuides;