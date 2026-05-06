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

  const vegetables = [
    "carrot",
    "beans",
    "tomato",
    "leeks",
    "knolkhol",
    "cabbage",
    "radish",
  ];

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
      avg: Number(item.Predicted_Avg),
      min: parseFloat(item.Predicted_Min_Range.split("-")[0]),
      max: parseFloat(item.Predicted_Max_Range.split("-")[1]),
    }));
  }, [predictions]);

  const highestPrice =
    chartData.length > 0
      ? Math.max(...chartData.map((d) => d.max)).toFixed(1)
      : 0;

  const lowestPrice =
    chartData.length > 0
      ? Math.min(...chartData.map((d) => d.min)).toFixed(1)
      : 0;

  const averagePrice =
    chartData.length > 0
      ? (
          chartData.reduce((sum, d) => sum + d.avg, 0) / chartData.length
        ).toFixed(1)
      : 0;

  const priceChange =
    chartData.length > 1
      ? (chartData[chartData.length - 1].avg - chartData[0].avg).toFixed(1)
      : 0;

  const trend =
    priceChange > 0
      ? "Increasing 📈"
      : priceChange < 0
      ? "Decreasing 📉"
      : "Stable ➖";

  const recommendation =
    priceChange > 20
      ? `${
          vegetable.charAt(0).toUpperCase() + vegetable.slice(1)
        } prices are expected to rise steadily over the next 30 days. Farmers may benefit from delayed selling strategies to maximize profits.`
      : priceChange < -20
      ? `${
          vegetable.charAt(0).toUpperCase() + vegetable.slice(1)
        } prices are expected to decline gradually over the forecast period. Farmers may consider earlier selling strategies to reduce potential losses.`
      : `${
          vegetable.charAt(0).toUpperCase() + vegetable.slice(1)
        } prices are expected to remain relatively stable during the forecast period with only minor fluctuations anticipated.`;

  return (
    <>
      <div style={pageContainer}>
        <h1 style={title}>📊 Upcoming Price Predictions</h1>

        <div style={layout}>
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

            {loading && <p style={textBlack}>Loading predictions…</p>}

            {error && (
              <p style={{ ...textBlack, color: "red" }}>
                {error}
              </p>
            )}

            {!loading && !error && predictions.length > 0 && (
              <div style={tableWrapper}>
                <table border="1" cellPadding="6" style={table}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Date</th>
                      <th style={tableHeader}>Min (Rs)</th>
                      <th style={tableHeader}>Max (Rs)</th>
                      <th style={tableHeader}>Avg (Rs)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {predictions.map((item, index) => (
                      <tr key={index}>
                        <td style={tableCell}>{item.Date}</td>
                        <td style={tableCell}>{item.Predicted_Min_Range}</td>
                        <td style={tableCell}>{item.Predicted_Max_Range}</td>
                        <td style={tableCell}>{item.Predicted_Avg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={rightSide}>
            <div style={topSection}>
              <div style={statsGrid}>
                <div style={statCard}>
                  <p style={statLabel}>Highest Forecast</p>
                  <h3 style={statValue}>Rs {highestPrice}</h3>
                </div>

                <div style={statCard}>
                  <p style={statLabel}>Lowest Forecast</p>
                  <h3 style={statValue}>Rs {lowestPrice}</h3>
                </div>

                <div style={statCard}>
                  <p style={statLabel}>Average Forecast</p>
                  <h3 style={statValue}>Rs {averagePrice}</h3>
                </div>

                <div style={statCard}>
                  <p style={statLabel}>Market Trend</p>
                  <h3 style={statValue}>{trend}</h3>
                </div>
              </div>

              <div style={insightBox}>
                <h4 style={insightTitle}>📌 Forecast Insights</h4>

                <p>
                  Expected movement:
                  <strong> Rs {priceChange}</strong>
                </p>

                <p>
                  Market direction:
                  <strong> {trend}</strong>
                </p>

                <p>
                  Forecast includes minimum, average and maximum projected
                  prices.
                </p>
              </div>
            </div>

            <p style={recommendationText}>
              🌱 <strong>Smart Recommendation:</strong> {recommendation}
            </p>

            {chartData.length > 0 && (
              <>
                <h3 style={chartTitle}>
                  📈 {vegetable.charAt(0).toUpperCase() + vegetable.slice(1)}{" "}
                  Price Trend
                </h3>

                <ResponsiveContainer width="96%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#e5e7eb" />

                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />

                    <Tooltip
                      contentStyle={{
                        color: "#000",
                        fontSize: "12px",
                        borderRadius: "8px",
                      }}
                    />

                    <Line
                      type="monotone"
                      dataKey="max"
                      stroke="#93c5fd"
                      strokeWidth={2}
                      dot={false}
                    />

                    <Line
                      type="monotone"
                      dataKey="min"
                      stroke="#fca5a5"
                      strokeWidth={2}
                      dot={false}
                    />

                    <Line
                      type="monotone"
                      dataKey="avg"
                      stroke="#2e7d32"
                      strokeWidth={3}
                      dot={{ r: 3 }}
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

/* STYLES */

const textBlack = {
  color: "#000",
  fontSize: "12px",
};

const pageContainer = {
  padding: "38px 30px",
  minHeight: "80vh",
  color: "#000",
};

const title = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 24,
  color: "#000",
};

const layout = {
  display: "grid",
  gridTemplateColumns: "480px minmax(600px, 1fr)",
  gap: 20,
  alignItems: "start",
};

const leftSide = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  color: "#000",
};

const rightSide = {
  background: "#ffffff",
  padding: 6,
  borderRadius: 10,
  color: "#000",
  maxWidth: "1150px",
};

const label = {
  fontWeight: 600,
  color: "#000",
  fontSize: "13px",
};

const chartTitle = {
  marginBottom: 8,
  marginTop: 10,
  color: "#000",
  fontSize: "15px",
};

const input = {
  padding: 7,
  fontSize: 12,
  width: "100%",
  color: "#000",
};

const tableWrapper = {
  maxHeight: "500px",
  overflowY: "auto",
};

const table = {
  borderCollapse: "collapse",
  marginTop: 8,
  color: "#000",
  width: "100%",
  fontSize: "12px",
};

const tableHeader = {
  padding: "7px",
  fontSize: "12px",
  background: "#f3f4f6",
  color: "#000",
};

const tableCell = {
  padding: "5px 7px",
  fontSize: "11px",
  color: "#000",
};



const topSection = {
  display: "grid",
  gridTemplateColumns: "0.8fr 0.55fr",
  gap: "10px",
  alignItems: "start",
};



const statsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "6px",
};

const statCard = {
  background: "#f0fdf4",
  padding: "6px 8px",
  borderRadius: "7px",
  border: "1px solid #d1fae5",
  minHeight: "48px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const statLabel = {
  fontSize: "9px",
  color: "#4b5563",
  marginBottom: "1px",
};

const statValue = {
  fontSize: "12px",
  color: "#166534",
  fontWeight: "700",
};


const insightBox = {
  padding: "10px",
  background: "#f9fafb",
  borderRadius: "8px",
  fontSize: "11px",
  lineHeight: "1.5",
  color: "#111827",
  border: "1px solid #e5e7eb",
  height: "100%",
};

const insightTitle = {
  marginBottom: "6px",
  fontSize: "12px",
};



const recommendationText = {
  marginTop: "12px",
  marginBottom: "8px",
  fontSize: "12px",
  lineHeight: "1.6",
  color: "#b91c1c",
  fontWeight: "500",
};