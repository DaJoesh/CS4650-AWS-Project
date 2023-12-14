import React, { useState, createContext } from "react";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Home from "./pages";
import About from "./pages/about";
import Contact from "./pages/contact";
import Predictor from "./pages/predictor";
import Login from "./pages/login";

export const AuthContext = createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* Restrict Predictor route based on isLoggedIn */}
                    <Route
                        path="/predictor"
                        element={
                            isLoggedIn ? <Predictor /> : <Navigate to="/login" />
                        }
                    />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;