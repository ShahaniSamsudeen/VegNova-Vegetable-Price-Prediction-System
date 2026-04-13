import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";

/* Animation variant */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Pests",
      icon: "🐛",
      desc: "Identify common vegetable pests and learn effective control methods.",
      route: "/pests",
    },
    {
      title: "Planting Guides",
      icon: "🌱",
      desc: "Step-by-step guidance on planting seasons, spacing, and crop care.",
      route: "/planting-guides",
    },
    {
      title: "Diseases & Solutions",
      icon: "🦠",
      desc: "Detect plant diseases early and find recommended treatments.",
      route: "/diseases",
    },
    {
      title: "Market Prices",
      icon: "💰",
      desc: "View real-time vegetable prices from major markets.",
      route: "/market-prices",
    },
    {
      title: "Planting Planner",
      icon: "📐",
      desc: "Plan your land and visualize optimal plant spacing.",
      route: "/planting-planner",
    },
    {
      title: "Tomato Detection",
      icon: "🍅",
      desc: "Upload an image to detect ripe, unripe, and damaged tomatoes using AI.",
      route: "/tomato-detection",
    },
    {
      title: "Chat Assistant",
      icon: "🤖",
      desc: "Ask questions and get smart farming advice instantly.",
      route: "/chat",
    },
  ];

  return (
    <div style={{ overflowX: "hidden" }}>
      <HeroSection />

      <div style={{ backgroundColor: "#ffffff" }}>
        {/* DASHBOARD SECTION */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{
            width: "100%",
            backgroundColor: "#ffffff",
            padding: "60px 0",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1250px",
              margin: "0 auto",
              padding: "40px 24px",
            }}
          >
            {/* MAIN GRID */}
            <div
              style={{
                display: "flex",
                
                gap: "50px",
                alignItems: "start",
                overflowX: "auto",
              }}
            >
              {/* LEFT GREEN INFO BOX */}
              <motion.div
                variants={itemVariants}
                style={{
                  background: "linear-gradient(135deg, #1b5e20, #4caf50)",
                  color: "#ffffff",
                  padding: "48px 38px",
                  borderRadius: "12px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
                }}
              >
                <h2 style={{ fontSize: "30px", marginBottom: "22px" }}>
                  Grow Smarter with VegNova
                </h2>

                <div
                  style={{
                    width: "55px",
                    height: "3px",
                    backgroundColor: "#c8e6c9",
                    marginBottom: "22px",
                  }}
                />

                <p style={{ fontSize: "15.5px", lineHeight: "1.9" }}>
                  Practical tools to support better planting decisions, crop
                  protection, and informed vegetable trading.
                </p>
              </motion.div>

              {/* RIGHT FEATURES GRID */}
              <motion.div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 🔥 3 per row
    gap: "60px 40px",
    justifyItems: "center",
  }}
>
  {cards.map((card, index) => {
  if (index === 6) {
    return (
      <div key={index} style={{ gridColumn: "2", gridRow: "3" }}>
        <FeatureItem card={card} navigate={navigate} />
      </div>
    );
  }
  return <FeatureItem key={index} card={card} navigate={navigate} />;
})}
</motion.div>
            </div>
          </div>
        </motion.section>

        <div style={{ height: "1px", backgroundColor: "#ffffff" }} />
      </div>
    </div>
  );
}

/* FEATURE ITEM COMPONENT */
function FeatureItem({ card, col, navigate }) {
  return (
    <motion.div
      variants={itemVariants}
      onClick={() => navigate(card.route)}
      style={{
         
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "52px", marginBottom: "20px" }}>
        {card.icon}
      </div>
      <h3 style={{ color: "#1b5e20" }}>{card.title}</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>{card.desc}</p>
    </motion.div>
  );
}

export default Dashboard;