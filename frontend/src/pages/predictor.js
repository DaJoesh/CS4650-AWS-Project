import React from "react";
import { useState, useEffect } from "react";
import "./predictor.css";
import { element } from "prop-types";
 
const Predictor = () => {
    //const [message, setMessage] = useState('');
    const [tickerInput, setTickerInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [predictedValue, setPredictedValue] = useState('');
    const [userHistory, setUserHistory] = useState('');
    const [displayTickerInput, setDisplayTickerInput] = useState('');
    const [displayDateInput, setDisplayDateInput] = useState('');
    const user_id = localStorage.getItem("user_id");

    const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('submitted');
    console.log(tickerInput);
    console.log(dateInput);
    setDisplayTickerInput(tickerInput);
    setDisplayDateInput(dateInput);


    try {
        const response = await fetch(`http://127.0.0.1:5000/predict/${user_id}`, {
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
            fetch(`http://127.0.0.1:5000/predict/${user_id}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setUserHistory(data);
                        console.log("Updated Prediction History:", data);
                    })
                    .catch((err) => console.error(err));
            } else {
            //setMessage('Failed to process data');
        }

        setTickerInput('');
        setDateInput('');
    } catch (error) {
        console.error('Error:', error);
    }
};

useEffect(() => {
    fetch(`http://127.0.0.1:5000/predict/${user_id}`)
      .then((response) => response.json())
      .then((data) => {
        if(data && !("error" in data))
        {
            setUserHistory(data);
            console.log("in the if line 58")
        }
        console.log("This is from fetch in prediction history", data);
      })
      .catch((err) => console.error(err));
  }, [predictedValue]);

/* userhistory will contain an array of objects each representing one of the five entries a user had*/


   
const addDay = (timeStamp) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day

    const date = new Date(timeStamp);
    date.setTime(date.getTime() + oneDay); // Add one day

    return date.toLocaleDateString(undefined, options);
};

const formatDate = (timeStamp) => {
    const options = { year: "numeric", month: "long", day: "numeric"}
    return new Date(timeStamp).toLocaleDateString(undefined, options)
  }



    if(userHistory) {
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
                    <h2>
                        Prediction History
                    </h2>
                    <ul>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {userHistory.map((element, index) => (
                         <div key={index} className="prediction-item" style={{ flexBasis: '30%', margin: '10px', border: '1px solid black', padding: '10px' }}>
                         <h3>Ticker</h3>
                         <p>{element.ticker}</p>
                         <h3>Trained From Start Date</h3>
                         <p>{formatDate(element.date)}</p>
                         <h3>Predicted Value</h3>
                         <p>{element.predicted_value}</p>
                         <h3>Date Predicted For</h3>
                         <p>{addDay(element.timestamp)}</p>
                     </div>
                    ))}
                    </div>
                </ul>
                </div>
            </div>
        );
    }
    else {
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
                    <h1>
                        Prediction History
                    </h1>
                </div>
            </div>
        );
    }
}
    

 
export default Predictor;