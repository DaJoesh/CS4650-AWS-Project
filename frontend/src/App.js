import React from "react";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages";
import About from "./pages/about";
import Contact from "./pages/contact";
import Predictor from "./pages/predictor";
import Login from "./pages/login";
 
function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />}/>
                <Route path="/predictor" element={<Predictor />}/>
                <Route path="/login" element={<Login />}/>
            </Routes>
        </Router>
    );
}
 
export default App;