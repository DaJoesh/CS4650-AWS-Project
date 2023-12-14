import React from "react";
import { useState } from "react";
 
const Predictor = () => {
    const [message, setMessage] = useState('');
    const [tickerInput, setTickerInput] = useState('');
    const [dateInput, setDateInput] = useState('');

    const handleSubmit = async (event) => {
        console.log('sumbitted');
        event.preventDefault();
        console.log(tickerInput);
        console.log(dateInput);
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticker: tickerInput,
                    date: dateInput,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message); // Assuming the Flask server sends back a JSON with a 'message' key
            } else {
                setMessage('Failed to process data');
            }

        setTickerInput('');
        setDateInput('');
    }
    useEffect(() => {
        fetch('/predict').then(res=>res.json()).then(data => {
            setTickerInput(data.predictedValue)
        })
    })
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