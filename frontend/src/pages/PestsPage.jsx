import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function PestsPage() {
  const navigate = useNavigate();

  const vegetables = [
    { key: "beans", label: "Beans", emoji: "🌱" },
    { key: "carrot", label: "Carrot", emoji: "🥕" },
    { key: "leeks", label: "Leeks", emoji: "🧅" },
    { key: "beetroot", label: "Beetroot", emoji: "🍠" },
    { key: "radish", label: "Radish", emoji: "🧄" },
    { key: "cabbage", label: "Cabbage", emoji: "🥬" },
    { key: "tomato", label: "Tomato", emoji: "🍅" },
    { key: "knolkhol", label: "Knol Khol", emoji: "🥦" },
  ];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #e8f5e9, #f4fbf6)",
        overflow: "hidden",
      }}
    >
      {/* 🔥 SECTION REVEAL */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{
          duration: 0.9,
          ease: [0.77, 0, 0.18, 1],
        }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          zIndex: 5,
        }}
      />

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.6,
          ease: "easeOut",
        }}
        style={{
          padding: "30px 20px 60px",
          textAlign: "center",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            color: "#2e7d32",
            marginBottom: "6px",
            fontWeight: "600",
          }}
        >
          Select a Vegetable
        </h1>

        {/* ✅ ONE LINE TEXT */}
        <p
          style={{
            color: "#5f7d63",
            marginBottom: "30px",
            whiteSpace: "nowrap", 
          }}
        >
          Choose a vegetable to view common pests and learn how to protect your crops effectively.
        </p>

        {/* LIST */}
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "20px",
            rowGap: "28px",
          }}
        >
          {vegetables.map((veg) => (
            <motion.div
              key={veg.key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/pests/${veg.key}`)}
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
              {/* LEFT */}
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

              {/* ARROW */}
              <span style={{ fontSize: "20px", color: "#9e9e9e" }}>
                →
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default PestsPage;