import { useEffect, useState } from "react";

export default function TestForecast() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/market-prices/?veg=carrot&date=2025-01-10"

        );

        if (!res.ok) {
          throw new Error("API returned an error");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError("Failed to load forecast data");
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, []);

  
  if (loading) {
    return <p style={{ padding: 20 }}>Loading forecast…</p>;
  }

  if (error) {
    return <p style={{ padding: 20, color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🧪 Forecast API Test</h2>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 15,
          borderRadius: 6,
          overflowX: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
