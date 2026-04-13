import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function DiseasesPage() {
  const navigate = useNavigate();

  const vegetables = [
    { key: "beans", label: "Beans", emoji: "🌱" },
    { key: "carrot", label: "Carrot", emoji: "🥕" },
    { key: "leeks", label: "Leeks", emoji: "🧅" },
    { key: "beetroot", label: "Beetroot", emoji: "🟥" },
    { key: "radish", label: "Radish", emoji: "🧄" }, // ✅ FIXED
    { key: "cabbage", label: "Cabbage", emoji: "🥬" },
    { key: "tomato", label: "Tomato", emoji: "🍅" },
    { key: "knolkhol", label: "Knol Khol", emoji: "🥦" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px 20px",
        background: "linear-gradient(to bottom right, #e8f5e9, #f4fbf6)",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <h1
        style={{
          color: "#2e7d32",
          marginBottom: "6px", // ✅ REDUCED GAP
          fontWeight: "600",
        }}
      >
        Vegetable Diseases & Solutions
      </h1>

      <p
        style={{
          color: "#5f7d63",
          marginBottom: "30px", // ✅ tighter spacing
        }}
      >
        Select a vegetable to find common diseases and their solutions
      </p>

      {/* List */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "20px",
          rowGap: "28px", // ✅ MORE SPACE BETWEEN ROWS
        }}
      >
        {vegetables.map((veg) => (
          <motion.div
            key={veg.key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/diseases/${veg.key}`)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 22px",
              borderRadius: "16px",
              cursor: "pointer",

              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            {/* Left */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "26px" }}>{veg.emoji}</span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#2e7d32",
                }}
              >
                {veg.label}
              </span>
            </div>

            {/* Arrow */}
            <span
              style={{
                fontSize: "20px",
                color: "#9e9e9e",
              }}
            >
              →
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default DiseasesPage;