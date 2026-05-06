import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MarketPrices() {

  const navigate = useNavigate(); 

const today = new Date("2024-07-05");

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [day, setDay] = useState(today.getDate());

// default vegetable
  const [vegetable, setVegetable] = useState("Cabbage");
  const [priceData, setPriceData] = useState(null);
  const [multiYearData, setMultiYearData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const vegetables = [
     
    "Beans",
    "Carrot",
    "Cabbage",
    "Tomato",
    "Radish",
    "Leeks",
    "Knolkhol",
  ];

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selectedDate =
    day &&
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const fetchPrices = async () => {
    if (!selectedDate || !vegetable) {
      setError("Please select year, month, date, and vegetable");
      return;
    }

    setLoading(true);
    setError("");
    setPriceData(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/market-prices/?veg=${vegetable}&date=${selectedDate}`
      );
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to fetch data");
      } else {
        setPriceData(data);
      }
    } catch {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyPrices = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/monthly-prices/?veg=${vegetable}&month=${month + 1}`
      );

      const data = await res.json();

      setMultiYearData(data);

    } catch {
      console.log("Monthly chart fetch failed");
    }
  };

  useEffect(() => {
  fetchPrices();
}, [year, month, day, vegetable]);

  useEffect(() => {
    fetchMonthlyPrices();
  }, [vegetable, month]);

  const insight = useMemo(() => {
    if (!priceData) return null;

    const spread = priceData.max - priceData.min;
    let trend = "Moderate prices";
    if (priceData.avg > 300) trend = "High prices";
    if (priceData.avg < 200) trend = "Low prices";

    const message =
      spread > 100
        ? "Wide price spread may indicate supply instability or transport cost variation."
        : "Narrow price spread suggests stable supply and consistent market conditions.";

    return { spread, trend, message };
  }, [priceData]);

  const dailyChartData = useMemo(() => {
  if (!multiYearData || multiYearData.length === 0) return [];

  return multiYearData.map((item) => ({
    day: item.day,
    avg: item[`y${year}`],
  }));
}, [multiYearData, year]);

  return (
    <>
      

      <div style={{ color: "#000" }}>
        <h1 style={pageTitle}>💰 Market Prices</h1>

        <div style={page}>
          <div style={leftPanel}>

            {/* BUTTON */}
            <button
              onClick={() => navigate("/predictions")}
              style={upcomingBtn}
            >
              📈 Upcoming Prices
            </button>

            <div style={box}>
              <h3 style={{ fontSize: 14, marginBottom: 6 }}>Year</h3>
              <div style={grid4}>
                {[2020,2021,2022, 2023, 2024, 2025, 2026].map(y => (
                  <button
                    key={y}
                    onClick={() => {
  setYear(y);
  setHasChanges(true);
}}
                    style={y === year ? activeBtn : btn}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div style={box}>
              <h3 style={{ fontSize: 14, marginBottom: 6 }}>Month</h3>
              <div style={grid4}>
                {months.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => {
  setMonth(i);
  setHasChanges(true);
}}
                    
                    style={i === month ? activeBtn : btn}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div style={box}>
              <h3 style={{ fontSize: 14, marginBottom: 6 }}>Date</h3>
              <div style={grid7}>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
  setDay(i + 1);
  setHasChanges(true);
}}
                    style={day === i + 1 ? activeBtn : btn}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={rightPanel}>
            <div style={topRow}>
              <div style={topLeft}>
                <p style={{ fontSize: 12, marginBottom: 6 }}><strong>Selected Date:</strong> {selectedDate || "—"}</p>

                <label style={{ fontSize: 12, marginBottom: 4 , marginRight: 8 }}>Vegetable</label>
                <select
                  value={vegetable}
                  onChange={e => {
  setVegetable(e.target.value);
  setHasChanges(true);
}}
                  style={input}
                >
                  <option value="">Select vegetable</option>
                  {vegetables.map(v => <option key={v}>{v}</option>)}
                </select>

                <p
  style={{
    fontSize: 11,
    color: "#666",
    marginTop: -10,
    marginBottom: 18,
  }}
>
  Prices update automatically based on selected filters.
</p>
                {error && <p style={{ color: "#000" }}>{error}</p>}

                {priceData && (
                  <div style={sideInfoWrapper}>
                    <div style={miniResultBox}>
                      <p><strong>Min:</strong> Rs. {priceData.min}</p>
                      <p><strong>Max:</strong> Rs. {priceData.max}</p>
                      <p><strong>Avg:</strong> Rs. {priceData.avg}</p>
                    </div>

                    <div style={miniInsightBox}>
                      <p><strong>Trend:</strong> {insight.trend}</p>
                      <p><strong>Spread:</strong> Rs. {insight.spread}</p>
                      <p style={{ fontSize: 12 }}>{insight.message}</p>
                    </div>
                  </div>
                )}
              </div>

              {priceData && (
                <div style={topRight}>
                  <h4 style={{ fontSize: 14 }}>📈 Daily Average Price (This Month)</h4>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={dailyChartData}>
                      <CartesianGrid stroke="#ddd" />
                      <XAxis dataKey="day" stroke="#000" />
                      <YAxis stroke="#000" />
                      <Tooltip contentStyle={{ color: "#000" }} />
                      <Line dataKey="avg" stroke="#1b5e20" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>

                  <h4 style={{ marginTop: 20, fontSize: 14 }}>
                    📊 {months[month]} Daily {vegetable || "Vegetable"} Prices (2020–2026)
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={multiYearData}>
                      <CartesianGrid stroke="#ddd" />
                      <XAxis dataKey="day" stroke="#000" />
                      <YAxis stroke="#000" />
                      <Tooltip contentStyle={{ color: "#000" }} />
                      <Legend wrapperStyle={{ color: "#000" }} />
                      <Line dataKey="y2020" stroke="#1f77b4" />
                      <Line dataKey="y2021" stroke="#ff7f0e" />
                      <Line dataKey="y2022" stroke="#2ca02c" />
                      <Line dataKey="y2023" stroke="#d62728" />
                      <Line dataKey="y2024" stroke="#9467bd" strokeWidth={3} />
                      <Line dataKey="y2025" stroke="#8c564b" />
                      <Line dataKey="y2026" stroke="#e377c2" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
}

/* == STYLES ==*/

const pageTitle = { textAlign: "center", fontSize: 26, fontWeight: 700, color: "#000" };
const page = { display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, padding: 16 };
const leftPanel = { display: "flex", flexDirection: "column", gap: 6 };
const rightPanel = { padding: 10 };
const topRow = { display: "flex", gap: 12 };
const topLeft = { maxWidth: 500 };
const topRight = { flex: 1 };
const box = { padding: 8, borderRadius: 10, background: "#fff", color: "#000" };
const grid4 = { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 };
const grid7 = { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5 };

const btn = {
  padding: 5,
  fontSize: 11,
  background: "#e0e0e0",
  border: "none",
  borderRadius: 8,
  color: "#000",
};

const activeBtn = {
  ...btn,
  background: "#1b5e20",
  fontWeight: 700,
  color: "#000",
};

const input = {
  width: "50%",
  padding: 6,
  fontSize: 12,
  marginBottom: 8,
  color: "#000",
  marginBottom: 18,
};

const button = {
  padding: 8,
  fontSize: 12,
  background: "#1b5e20",
  border: "none",
  width: "70%",
  color: "#000",
  marginBottom: 18,
};

const upcomingBtn = {
  padding: 10,
  fontSize: 13,
  background: "#2e7d32",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  color: "#000",
  cursor: "pointer",
};

const sideInfoWrapper = {
  marginTop: 10,
  display: "flex",
  flexDirection: "column",
  gap: 26,
  width: "70%",
};

const miniResultBox = {
  background: "#f1f8e9",
  padding: "6px 8px",
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1.4,
  color: "#000",
};

const miniInsightBox = {
  border: "1px solid #c8e6c9",
  padding: "6px 8px",
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1.4,
  color: "#000",
};