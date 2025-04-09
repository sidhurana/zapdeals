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
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      fetchDeals(currentUser);
    });

    return () => unsubscribe();
  }, [selectedCategory]);

  const fetchDeals = async (user) => {
    try {
      const headers = {};
      if (user) {
        const idToken = await user.getIdToken();
        headers["Authorization"] = `Bearer ${idToken}`;
      }

      let url = "http://localhost:8000/api/deals";
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }

      const response = await axios.get(url, { headers });
      console.log("👉 Full API Response:", response.data);

      const items = response.data || [];
      setDeals(items);
    } catch (error) {
      console.error("❌ Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
  };

  return (
    <>
      <AppNavbar
        user={user}
        signInWithGoogle={signInWithGoogle}
        logout={logout}
        setSearchTerm={setSearchTerm}
        onCategorySelect={handleCategorySelect}
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

