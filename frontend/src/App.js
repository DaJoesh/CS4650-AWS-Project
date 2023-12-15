import React, { useState, createContext } from "react";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import About from "./pages/about";
import Contact from "./pages/contact";
import Predictor from "./pages/predictor";
import Login from "./pages/login";
import SignUp from "./pages/signup"; // Import the SignUp component

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Router>
        <Navbar />
        <Routes>
          {/* Set the default landing page to About */}
          <Route path="/" element={<Navigate to="/about" />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Restrict Predictor route based on isLoggedIn */}
          <Route
            path="/predictor"
            element={isLoggedIn ? <Predictor /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />

        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;