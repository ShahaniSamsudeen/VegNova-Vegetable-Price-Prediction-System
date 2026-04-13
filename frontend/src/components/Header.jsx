import { NavLink } from "react-router-dom";

function Header() {
  const linkStyle = ({ isActive }) => ({
    padding: "clamp(6px, 1vw, 10px) clamp(10px, 1.5vw, 18px)", // ✅ responsive
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "clamp(12px, 1.2vw, 15px)", // ✅ responsive text
    color: isActive ? "#ffffff" : "#2e7d32",
    backgroundColor: isActive ? "#2e7d32" : "transparent",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  });

  return (
    <header
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          minHeight: "clamp(55px, 6vw, 70px)", // ✅ responsive height
          padding: "0 clamp(10px, 3vw, 30px)", // ✅ responsive padding
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "clamp(15px, 4vw, 50px)", // ✅ responsive gap
        }}
      >
        {/* LOGO */}
        <img
          src="/logo.png"
          alt="VegNova Logo"
          style={{
            height: "clamp(40px, 5vw, 60px)", // ✅ responsive logo
            width: "auto",
          }}
        />

        {/* MENU */}
        <nav
          style={{
            display: "flex",
            gap: "clamp(6px, 1vw, 14px)", // ✅ responsive spacing
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          <NavLink to="/" style={linkStyle}>Home</NavLink>
          <NavLink to="/pests" style={linkStyle}>Pests</NavLink>
          <NavLink to="/diseases" style={linkStyle}>Diseases & Solutions</NavLink>
          <NavLink to="/planting-guides" style={linkStyle}>Planting Guides</NavLink>
          <NavLink to="/planting-planner" style={linkStyle}>Planting Planner</NavLink>
          <NavLink to="/market-prices" style={linkStyle}>Market Prices</NavLink>
          <NavLink to="/chat" style={linkStyle}>Chat Assistant</NavLink>
          <NavLink to="/tomato-detection" style={linkStyle}>Tomato Detection</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;