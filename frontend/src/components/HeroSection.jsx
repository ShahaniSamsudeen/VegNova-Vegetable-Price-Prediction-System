import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import hero1 from "../assets/hero/hero1.jpg";
import hero2 from "../assets/hero/hero2.jpg";

const images = [hero1, hero2];

function HeroSection() {
  const [active, setActive] = useState(0);

  // 🔄 Change background image every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev === 0 ? 1 : 0));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
  style={{
    position: "relative",
    minHeight: "100vh",
    width: "100%", // 🔥 removes left gap
  }}
>
      
      {/* ================= BACKGROUND IMAGE ================= */}
      <AnimatePresence>
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${images[active]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* ================= DARK OVERLAY ================= */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65))",
          zIndex: 1,
        }}
      />

      {/* ================= TEXT CONTENT ================= */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",     // 🔥 moved UP
          padding: "120px 80px 0",      // 🔥 controls vertical position
        }}
      >
        <div style={{ maxWidth: "850px" }}>
          
          {/* ===== TITLE ===== */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              fontSize: "clamp(48px, 10vw, 140px)",       // 🔥 slightly reduced (better balance)
              color: "#d3e8d5",
              marginBottom: "10px",
              lineHeight: "1",
            }}
          >
            VegNova
          </motion.h1>

          {/* ===== SUBTITLE ===== */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            style={{
              fontSize: "clamp(18px, 3vw, 42px)",
              color: "#8bcf9c",
              marginBottom: "16px",
              whiteSpace: "nowrap",
            }}
          >
            Smart Vegetable Advisory Platform
          </motion.h2>

          {/* ===== DESCRIPTION ===== */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            style={{
              color: "#ddd",
              fontSize: "clamp(14px, 2vw, 22px)",
              lineHeight: "1.6",
              maxWidth: "700px",
            }}
          >
            Helping farmers and consumers make informed decisions through
            planting guidance, disease identification, and real-time
            market insights.
          </motion.p>

        </div>
      </div>
    </div>
  );
}

export default HeroSection;