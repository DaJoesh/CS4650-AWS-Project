import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
 
const Predictor = () => {
    const [predictedValue, setPredictedValue] = useState('');
    const [tickerInput, setTickerInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [fetchedData, setFetchedData] = useState([]);



    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const csrftoken = Cookies.get('csrftoken');
            const dateObject = new Date(dateInput);
            const formattedDateInput = dateObject.toISOString().split('T')[0];
    
            if (formattedDateInput) {
                const response = await axios.post(
                    'http://127.0.0.1:8000/',
                    {
                        ticker: tickerInput,
                        date: dateInput,
                    },
                    {
                        headers: {
                            'X-CSRFToken': csrftoken,
                        },
                    }
                );
    
                console.log(response.data);
                setPredictedValue(response.data.predictedValue);
    
                // Reset input fields after successful submission
                setTickerInput('');
                setDateInput('');
            } else {
                // Handle invalid dateInput here (e.g., display an error message)
                console.error('Invalid dateInput');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

const fetchData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/', {
            params: {
                ticker: tickerInput,
                date: dateInput
            }
        });

        console.log(response.data);
        setFetchedData(response.data);
    } catch (error) {
        console.error('error', error);
    }
};

useEffect(() => {
    // Fetch data initially or when tickerInput or dateInput changes
    fetchData();
}, [tickerInput, dateInput]);

    
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <form onSubmit = {handleSubmit}>
                <input
                    id="ticker_input"
                    name="ticker_input"
                    type="text"
                    placeholder="Ticker"
                    onChange={event=> setTickerInput(event.target.value)}
                    value={tickerInput}
                    />
                <input
                    id="date_input"
                    name="date_input"
                    type="date"
                    placeholder="Date"
                    onChange={event=> setDateInput(event.target.value)}
                    value={dateInput}
                    />
                <br />
                <button type = "submit">Submit</button>

                <h2>
                Ticker: {tickerInput}
                Date: {dateInput}

                </h2>


            </form>

        </div>
    );
};
 
export default Predictor;