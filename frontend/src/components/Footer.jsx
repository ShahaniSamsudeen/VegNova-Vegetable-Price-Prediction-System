import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      style={{
        background: "#1b5e20",
        color: "#e8f5e9",
        padding: "16px 18px 8px", 
      }}
    >
      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr 1fr",
          gap: "20px", 
        }}
      >
        {/* LEFT - ABOUT */}
        <div>
          <h3 style={title}>🌱 VegNova</h3>

          <p style={text}>
            VegNova is a smart vegetable advisory platform designed to support
            farmers and consumers with planting guidance, disease management,
            weather insights, and market price information.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4 style={heading}>Quick Links</h4>

           <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px 30px",
  }}
>
  <span onClick={() => navigate("/")} style={link}>Home</span>
  <span onClick={() => navigate("/planting-planner")} style={link}>Planting Planner</span>

  <span onClick={() => navigate("/pests")} style={link}>Pests</span>
  <span onClick={() => navigate("/market-prices")} style={link}>Market Prices</span>

  <span onClick={() => navigate("/diseases")} style={link}>Diseases & Solutions</span>
  <span onClick={() => navigate("/chat")} style={link}>Chat Assistant</span>

  <span onClick={() => navigate("/planting-guides")} style={link}>Planting Guides</span>
  <span onClick={() => navigate("/tomato-detection")} style={link}>Tomato Detection</span>
</div>
        </div>

        {/* DATA */}
        <div>
          <h4 style={heading}>Data & Insights</h4>

          <p style={text}>
            Market prices and weather information are provided for educational
            purposes only to support informed decision-making. Data may vary
            based on location and time.
          </p>
        </div>
      </div>

      {/* BOTTOM */}
      <div style={bottom}>
        © 2026 VegNova • Academic Project
      </div>
    </footer>
  );
}


const title = {
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "8px",
  color: "#ffffff",
};

const heading = {
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "10px", 
  color: "#ffffff",
};

const text = {
  fontSize: "12.8px", 
  lineHeight: "1.4", 
  color: "#cfe8d5",
};

const list = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  lineHeight: "1.4", 
};

const link = {
  cursor: "pointer",
  color: "#cfe8d5",
  fontSize: "12.8px", 
  transition: "0.2s",
};

const bottom = {
  marginTop: "10px", 
  paddingTop: "6px", 
  borderTop: "1px solid rgba(255,255,255,0.2)",
  textAlign: "center",
  fontSize: "11.5px", 
  color: "#cfe8d5",
};

export default Footer;