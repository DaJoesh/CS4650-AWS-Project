import React, { useState, createContext } from "react";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate, // Import Navigate from react-router-dom
} from "react-router-dom";
import Home from "./pages";
import About from "./pages/about";
import Contact from "./pages/contact";
import Predictor from "./pages/predictor";
import Login from "./pages/login";

// Create a context to manage user authentication state
export const AuthContext = createContext();

function App() {
    // State to manage user login status
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                        path="/about"
                        element={
                            isLoggedIn ? <About /> : <Navigate to="/login" />
                        }
                    />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;