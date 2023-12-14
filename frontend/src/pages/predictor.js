import React from "react";
import { useState, useEffect } from "react";
 
const Predictor = () => {
    const [message, setMessage] = useState('');
    const [tickerInput, setTickerInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [predictedValue, setPredictedValue] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('submitted');
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
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if(tickerInput!==''&&dateInput!==''){
            fetch('/predict', {method: 'GET', headers: {'Content-Type':'application/json',},}) 
                .then(res => res.json())
                .then(data => {
                    setPredictedValue(data); /*either data or data.next_day_prediction*/
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            }
    }, [tickerInput, dateInput]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: 'column',
                justifyContent: "flex-start",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <h1>
                Stock Prediction
            </h1>
            <section>
                    <h2>How To Use</h2>
                    <ul>
                        <li>Enter the 4 Letter Ticker into the Ticker box for the stock.</li>
                        <li>Select the starting date from which data on this stock will be analyzed.</li>
                        <li>Click submit to send the request to the Stock Predictor AI</li>
                    </ul>
                </section>
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
                PredictedValue: {predictedValue}

                </h2>

            </form>
            <div style={{ display: 'flex' }}>
                <ul>
                    <li> prediction.ticker  -  prediction.prediction </li>
                </ul>
                <ul>
                    <li> predictionordered.ticker  -  predictionordered.prediction </li>
                </ul>
                <ul>
                    <li> predictionspecific.ticker  -  predictionspecific.prediction </li>
                </ul>
            </div>
        </div>
    );
}
    

 
export default Predictor;