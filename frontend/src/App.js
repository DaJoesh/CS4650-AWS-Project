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
                <Route path="/contact" element={<Contact />} />
                <Route
                    path="/predictor"
                    element={isLoggedIn ? <Predictor /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={<Login setIsLoggedIn={setIsLoggedIn} />}
                />
            </Routes>
        </Router>
    );
}

/* The isLoggedIn state represents the user's login status. You should replace this with your actual authentication logic that determines whether the user is logged in.
The Login component receives a function setIsLoggedIn as a prop. When the user successfully logs in within the Login component, you can call setIsLoggedIn(true) to update the login status.*/

 
export default App;