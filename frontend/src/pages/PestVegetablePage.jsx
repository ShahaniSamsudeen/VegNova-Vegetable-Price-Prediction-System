import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function PestVegetablePage() {
  const { vegName } = useParams();
  const [pests, setPests] = useState([]);
  const [selectedPest, setSelectedPest] = useState(null);

  const normalize = str =>
    str
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace("raddish", "radish");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/pests/")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          p =>
            p.vegetable_name &&
            normalize(p.vegetable_name) === normalize(vegName)
        );
        setPests(filtered);
      });
  }, [vegName]);

  return (
    <div
      style={{
        padding: "40px 20px",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #edf7ed, #f6fbf6)",
      }}
    >
      {/* TITLE */}
       <div style={{ textAlign: "center", marginBottom: "30px" }}>
  <h1
    style={{
      color: "#1b5e20",
      fontSize: "22px",
      marginBottom: "6px",
    }}
  >
    {vegName.toUpperCase()}
  </h1>

  <p
    style={{
      fontSize: "13px",
      color: "#5f7d63",
    }}
  >
    Pests affecting {vegName} and recommended management practices.
  </p>
</div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        {pests.map(pest => (
          <motion.div
            key={pest.id}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedPest(pest)}
            style={{
              background: "rgba(255,255,255,0.9)",
              padding: "14px",
              borderRadius: "14px",
              cursor: "pointer",
              minHeight: "90px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              border: "1px solid rgba(46,125,50,0.08)",
            }}
          >
            <h3
              style={{
                color: "#1b5e20",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              {pest.pest_name}
            </h3>

            <p style={{ fontSize: "11px", color: "#777" }}>
              <strong>Cause:</strong> {pest.cause}
            </p>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      {selectedPest && (
        <div
          onClick={() => setSelectedPest(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              color: "#1e1e1e",
              borderRadius: "12px",
              width: "420px",
              maxWidth: "95%",
              maxHeight: "85vh", 
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* SCROLLABLE CONTENT */}
            <div
              style={{
                padding: "16px",
                overflowY: "auto", 
              }}
            >
              <h2
                style={{
                  color: "#1b5e20",
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
              >
                {selectedPest.pest_name}
              </h2>

              {/* IMAGE */}
              {selectedPest.image && (
                <img
                  src={selectedPest.image}
                  alt={selectedPest.pest_name}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              )}

              <p style={{ fontSize: "13px" }}>
                <strong>Cause:</strong> {selectedPest.cause}
              </p>

              <p style={{ fontSize: "13px", marginTop: "6px" }}>
                <strong>Symptoms:</strong> {selectedPest.symptoms}
              </p>

              <p
                style={{
                  fontSize: "13px",
                  marginTop: "6px",
                  whiteSpace: "pre-line",
                }}
              >
                <strong>Management:</strong> {selectedPest.management}
              </p>
            </div>

            {/* FIXED FOOTER BUTTON */}
            <div
              style={{
                padding: "12px",
                borderTop: "1px solid #eee",
                textAlign: "right",
              }}
            >
              <button
                onClick={() => setSelectedPest(null)}
                style={{
                  background: "#1b5e20",
                  color: "#fff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PestVegetablePage;