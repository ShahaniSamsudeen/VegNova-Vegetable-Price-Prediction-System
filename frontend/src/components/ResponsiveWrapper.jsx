import { useEffect, useState } from "react";

export default function ResponsiveWrapper({ children }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1440; // your design width
      const currentWidth = window.innerWidth;
      const newScale = Math.min(currentWidth / baseWidth, 1);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: "1440px",
        
      }}
    >
      {children}
    </div>
  );
}