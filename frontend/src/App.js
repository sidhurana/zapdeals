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
      setDeals(response.data);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar user={user} signInWithGoogle={signInWithGoogle} logout={logout} setSearchTerm={setSearchTerm} />
      {loading ? <p className="text-center text-muted">Loading deals...</p> : <DealsGrid deals={deals} searchTerm={searchTerm} />}
      <Footer />
    </>
  );
}

export default App;

