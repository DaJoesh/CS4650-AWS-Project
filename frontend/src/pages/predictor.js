import React from "react";
import { useState, useEffect } from "react";
import "./predictor.css";
 
const Predictor = () => {
    //const [message, setMessage] = useState('');
    const [tickerInput, setTickerInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [predictedValue, setPredictedValue] = useState('');
    const [userHistory, setUserHistory] = useState('');
    const [displayTickerInput, setDisplayTickerInput] = useState('');
    const [displayDateInput, setDisplayDateInput] = useState('');

    const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('submitted');
    console.log(tickerInput);
    console.log(dateInput);
    setDisplayTickerInput(tickerInput);
    setDisplayDateInput(dateInput);


    try {
        const response = await fetch('http://127.0.0.1:5000/predict/2', {
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
            setPredictedValue(data.next_day_prediction); // Update predicted value in state
            setMessage('Prediction retrieved successfully');
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
            fetch(`http://127.0.0.1:5000/predict/${user_id}`, {method: 'GET', headers: {'Content-Type':'application/json',},}) 
                .then(res => res.json())
                .then(data => {
                    const history = data.map(predictionInput => {
                        const formattedDate = formatDate(predictionInput.timestamp);
                        return {
                            ticker: predictionInput.ticker,
                            date: predictionInput.date,
                            predicted_value: predictionInput.predicted_value,
                            timestamp: formattedDate
                        };
                    });
                    setUserHistory(history);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            }, []);

/* userhistory will contain an array of objects each representing one of the five entries a user had*/

    function formatDate(timestamp) {
    const dateObject = new Date(timestamp * 1000); // Convert seconds to milliseconds

    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const year = dateObject.getFullYear().toString().slice(-2);

    // Padding single-digit day or month with leading zero if needed
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    const formattedDate = `${formattedMonth}/${formattedDay}/${year}`;
    return formattedDate;
}


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

                <h2 className="h2Style">Ticker: {displayTickerInput}</h2>
                <h2 className="h2Style">Date: {displayDateInput}</h2>
                <h2 className="h2Style">PredictedValue: {predictedValue}</h2>

            </form>
            <div style={{ display: 'flex' }}>
                <ul>
                    <li> prediction.ticker  -  prediction.prediction {userHistory} </li>
                </ul>
            </div>
        </div>
    );
}
    

 
export default Predictor;