import {useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';

//const API_URL = 

const App = () => {
    const [stockTicker, setStockTicker] = useState('');
    const[currentStockValue, setCurrentStockValue] = useState('');
    const [predictedStockValue, setPredictedStockValue] = useState('');

    //handles user input
    const handleInputChange = (e) => {
        setStockTicker(e.target.value);
        //use setstockticker to set value to the ticker
        //add updates on currentstockvalue and predictedstock value with the ai script
    };
    return(
        <div className="app">
            <Routes>
                <Route path ="/" element = {<App />}/>
                <Route path ="/about" element = {<AboutUs />}/>
                <Route path ="/contact" element = {<ContactUs />}/>
            </Routes>
        </div>
    );

}

export default App;