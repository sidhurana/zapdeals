import React, { useEffect, useState } from "react";

function App() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/deals")
      .then((res) => res.json())
      .then((data) => setDeals(data));
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>🔥 ZAPDEALS 🔥</h1>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
      }}>
        {deals.map((deal) => (
          <div key={deal.dealID || deal.gameID} 
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              background: "#fff",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <a 
              href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "black" }}
            >
              <img 
                src={deal.thumb} 
                alt={deal.title} 
                style={{ width: "100%", height: "150px", objectFit: "cover" }} 
              />
              <div style={{ padding: "10px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "5px" }}>{deal.title}</h3>
                <p style={{ margin: "0", fontSize: "14px", color: "#888" }}>
                  <b>Normal Price:</b> <span style={{ textDecoration: "line-through" }}>${deal.normalPrice}</span>
                </p>
                <p style={{ margin: "0", fontSize: "16px", color: "red", fontWeight: "bold" }}>
                  🔥 Deal Price: ${deal.salePrice}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
                  Savings: <b>{Math.round(deal.savings)}%</b> | ⭐ {deal.steamRatingText} ({deal.steamRatingPercent}%)
                </p>
                <button style={{
                  background: "green",
                  color: "white",
                  padding: "8px 12px",
                  width: "100%",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  marginTop: "10px"
                }}>
                  View Deal
                </button>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

