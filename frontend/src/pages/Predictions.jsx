

import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Predictions() {
  const [vegetable, setVegetable] = useState("carrot");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const vegetables = ["carrot","beans","tomato","leeks","knolkhol","cabbage", "radish" ];
   // add more later

  useEffect(() => {
    fetchPredictions();
  }, [vegetable]);

  const fetchPredictions = async () => {
    setLoading(true);
    setError("");
    setPredictions([]);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/forecast/${vegetable}/range/`
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to load predictions");
      } else {
        setPredictions(data);
      }
    } catch {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    return predictions.map((item) => ({
      date: item.Date,
      avg: item.Predicted_Avg,
    }));
  }, [predictions]);

  return (
    <>
      

      <div style={pageContainer}>
        <h1 style={title}>📊 Upcoming Price Predictions</h1>

        <div style={layout}>
          {/* LEFT SIDE */}
          <div style={leftSide}>
            <label style={label}>Select Vegetable</label>

            <select
              value={vegetable}
              onChange={(e) => setVegetable(e.target.value)}
              style={input}
            >
              {vegetables.map((veg) => (
                <option key={veg} value={veg}>
                  {veg.charAt(0).toUpperCase() + veg.slice(1)}
                </option>
              ))}
            </select>

            {loading && (
              <p style={textBlack}>Loading predictions…</p>
            )}

            {error && (
              <p style={{ ...textBlack, color: "red" }}>
                {error}
              </p>
            )}

            {!loading && !error && predictions.length > 0 && (
              <table border="1" cellPadding="8" style={table}>
                <thead>
                  <tr>
                    <th style={textBlack}>Date</th>
                    <th style={textBlack}>Min (Rs)</th>
                    <th style={textBlack}>Max (Rs)</th>
                    <th style={textBlack}>Avg (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((item, index) => (
                    <tr key={index}>
                      <td style={textBlack}>{item.Date}</td>
                      <td style={textBlack}>{item.Predicted_Min_Range}</td>
                      <td style={textBlack}>{item.Predicted_Max_Range}</td>
                      <td style={textBlack}>{item.Predicted_Avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div style={rightSide}>
            {chartData.length > 0 && (
              <>
                <h3 style={chartTitle}>
                  📈 {vegetable.charAt(0).toUpperCase() + vegetable.slice(1)} Price Trend
                </h3>

                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#ddd" />
                    <XAxis dataKey="date" stroke="#000" />
                    <YAxis stroke="#000" />
                    <Tooltip
                      contentStyle={{ color: "#000" }}
                      labelStyle={{ color: "#000" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avg"
                      stroke="#2e7d32"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </div>
      </div>

     
    </>
  );
}

export default Predictions;

/* ================= STYLES ================= */

const textBlack = {
  color: "#000",
};

const pageContainer = {
  padding: "70px 40px",
  minHeight: "80vh",
  color: "#000",
};

const title = {
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 40,
  color: "#000",
};

const layout = {
  display: "grid",
  gridTemplateColumns: "500px 1fr",
  gap: 60,
};

const leftSide = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  color: "#000",
};

const rightSide = {
  background: "#ffffff",
  padding: 20,
  borderRadius: 16,
  color: "#000",
};

const label = {
  fontWeight: 600,
  color: "#000",
};

const chartTitle = {
  marginBottom: 20,
  color: "#000",
};

const input = {
  padding: 10,
  fontSize: 14,
  width: "100%",
  color: "#000",
};

const table = {
  borderCollapse: "collapse",
  marginTop: 20,
  color: "#000",
};
