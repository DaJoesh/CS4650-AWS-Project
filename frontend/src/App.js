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
import axios from 'axios';
 
class App extends React.Component  { 
    render(){
        return (
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />}/>
                    <Route path= "/predictor" element={<Predictor />}/>
                </Routes>
            </Router>
        );
    }
}
 
export default App;