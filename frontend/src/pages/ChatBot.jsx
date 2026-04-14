import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

import Lottie from "lottie-react";
import Fuse from "fuse.js";
import robotWave from "../assets/Gif/robot-wave.json";

function ChatBot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [lastIntent, setLastIntent] = useState(null);
  const [lastVeg, setLastVeg] = useState(null);
  const [lastMonth, setLastMonth] = useState(null);
  const [lastYear, setLastYear] = useState(null);

  const chatContainerRef = useRef(null);

  const vegetables = [
  "carrot",
  "tomato",
  "beans",
  "cabbage",
  "radish",
  "raddish",   // keep both for safety
  "knolkhol",
  "beetroot",
  "leek",
  "leeks",
  "potato",
  "pepper",
  "chili",
  "capsicum",
  "brinjal"
];
  const normalizeVeg = (veg) => {
  if (veg === "raddish") return "radish";
  if (veg === "leeks") return "leek";
  return veg;
};

  const fuse = new Fuse(vegetables, { threshold: 0.4 });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 🧠 intent detection
  const detectIntent = (msg) => {
    if (msg.includes("pest")) return "pests";
    if (msg.includes("disease")) return "diseases";
    if (msg.includes("price")) return "price";
    if (msg.includes("plant")) return "planting";
    if (msg.includes("info")) return "info";
    return null;
  };

  //vegetable detection
  const detectVegetable = (msg) => {
    const found = vegetables.find((v) => msg.includes(v));
    if (found) return found;

    const result = fuse.search(msg);
    return result.length ? result[0].item : null;
  };

  // month detection
  const detectMonth = (msg) => {
    const months = {
      january: "01", february: "02", march: "03", april: "04",
      may: "05", june: "06", july: "07", august: "08",
      september: "09", october: "10", november: "11", december: "12"
    };

    for (let m in months) {
      if (msg.includes(m)) return months[m];
    }
    return null;
  };

  // year detection
  const detectYear = (msg) => {
    const match = msg.match(/\b(20\d{2})\b/);
    return match ? match[0] : null;
  };

  //  full month detection (strong)
  const detectFullMonth = (msg) => {
    const keywords = [
      "full", "whole", "entire", "monthly", "month", "30", "31", "all"
    ];
    return keywords.some(word => msg.includes(word));
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const rawMsg = message;
    const msg = message.toLowerCase().trim();

    const intent = detectIntent(msg);
    const veg = detectVegetable(msg);
    const month = detectMonth(msg);
    const year = detectYear(msg);
    const isFullMonth = detectFullMonth(msg);

    //  memory logic
    let finalIntent = intent || lastIntent;
    const finalVeg = normalizeVeg(veg || lastVeg);
    const finalMonth = month || lastMonth;
    const finalYear = year || lastYear;

   
    if (isFullMonth && !intent) {
      finalIntent = "price";
    }

   
    if (intent) setLastIntent(intent);
    if (veg) setLastVeg(veg);
    if (month) setLastMonth(month);
    if (year) setLastYear(year);

   
    if (finalIntent && !finalVeg) {
      setMessages((prev) => [
        ...prev,
        { type: "user", text: rawMsg },
        {
          type: "bot",
          text: "🌱 Which vegetable are you asking about? (e.g., carrot, tomato)",
        },
      ]);
      setMessage("");
      return;
    }

    // SMART MESSAGE 
    let smartMessage = msg;

    if (finalIntent && finalVeg) {
      if (finalIntent === "price") {

        // 🔥 FULL MONTH (FIXED PROPERLY)
        if (isFullMonth) {
          const useYear = finalYear || lastYear;
          const useMonth = finalMonth || lastMonth;

          if (useYear && useMonth) {
            smartMessage = `${finalVeg} price-month ${useYear}-${useMonth}`;
          } else {
            smartMessage = `${finalVeg} price`;
          }
        }

        // single day
        else if (finalYear && finalMonth) {
          smartMessage = `${finalVeg} price ${finalYear}-${finalMonth}-01`;
        }

        else if (finalYear) {
          smartMessage = `${finalVeg} price ${finalYear}`;
        }

        else {
          smartMessage = `${finalVeg} price`;
        }

      } else {
        smartMessage = `${finalVeg} ${finalIntent}`;
      }
    }

    console.log("SMART MESSAGE:", smartMessage);

    // show user message
    setMessages((prev) => [...prev, { type: "user", text: rawMsg }]);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: smartMessage }),
      });

      const data = await res.json();

      const botMessage = {
        type: "bot",
        text:
          data.reply ||
          "🤔 I didn’t quite get that.\nTry:\n- carrot pests\n- tomato price January 2023\n- full month prices",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "⚠️ Connection failed. Backend not running.",
        },
      ]);
    }
  };

  return (
    <>
     

      <div
  style={{
    minHeight: "calc(100vh - 140px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start", 
    padding: "20px",
    paddingTop: "30px",
  }}
>
        <div
          style={{
            width: "90%",
            maxWidth: "900px",
            background: "linear-gradient(135deg, #eef7f0, #ffffff)",
            transform: "scale(0.85)",   
            transformOrigin: "top center", 
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            height: "85vh",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ width: 220, margin: "auto" }}
            >
              <Lottie animationData={robotWave} loop />
            </motion.div>

            <h1 style={{ color: "#1b5e20" }}>VegNova Assistant</h1>
          </div>

          <div
            ref={chatContainerRef}
            style={{
  flex: 1,
  overflowY: "auto",
  padding: "10px",
}}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.type === "user" ? "flex-end" : "flex-start",
                  margin: "10px 0",
                }}
              >
                <div
  style={{
    padding: "12px",
    borderRadius: "12px",
    maxWidth: "70%",
    minHeight: "40px",
                    background:
                      msg.type === "user" ? "#1b5e20" : "#ffffff",
                    color: msg.type === "user" ? "#fff" : "#000",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything... (e.g., carrot price January 2023)"
              style={{ flex: 1, padding: "12px" }}
            />

            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>

      
    </>
  );
}

export default ChatBot;