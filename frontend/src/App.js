// src/App.js
import React, { useEffect, useState } from "react";
import { signInWithGoogle, logout, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import AppNavbar from "./components/Navbar";
import DealsGrid from "./components/DealsGrid";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      fetchDeals(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const fetchDeals = async (user) => {
    try {
      const headers = {};
      if (user) {
        const idToken = await user.getIdToken();
        headers["Authorization"] = `Bearer ${idToken}`;
      }

      const response = await axios.get("http://localhost:8000/api/deals", { headers });
      
      // 👇 Log the full eBay API response to inspect image & pricing structure
      console.log("👉 Full API Response from eBay:", response.data);

      // Try logging just one item for clarity
      if (response.data?.itemSummaries?.length) {
        console.log("👉 Sample Item:", response.data.itemSummaries[0]);
      }

      // Use itemSummaries if available, otherwise fallback
      const items = response.data?.itemSummaries || response.data || [];
      setDeals(items);
    } catch (error) {
      console.error("❌ Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar
        user={user}
        signInWithGoogle={signInWithGoogle}
        logout={logout}
        setSearchTerm={setSearchTerm}
      />
      {loading ? (
        <p className="text-center text-muted">Loading deals...</p>
      ) : (
        <DealsGrid deals={deals} searchTerm={searchTerm} />
      )}
      <Footer />
    </>
  );
}

export default App;

