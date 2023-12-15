import React from "react";
import { useState, 
    //useEffect 
} from "react";
import "./predictor.css";
 
const Predictor = () => {
    //const [message, setMessage] = useState('');
    const [tickerInput, setTickerInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [predictedValue, setPredictedValue] = useState('');
    //const [userHistory, setUserHistory] = useState('');
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
        const response = await fetch(`http://54.183.100.235/predict/${user_id}`, {
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
            //setMessage('Prediction retrieved successfully');
        } else {
            //setMessage('Failed to process data');
        }

        setTickerInput('');
        setDateInput('');
    } catch (error) {
        console.error('Error:', error);
    }
};
/*
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



    function formatDate(timestamp) {
        const dateObject = new Date(timestamp * 1000); // Convert seconds to milliseconds

        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();
        const year = dateObject.getFullYear().toString().slice(-2);

        // Padding single-digit day or month with leading zero if needed
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        const formattedDay = day < 10 ? `0${day}` : `${day}`;

        const formattedDate = `${formattedMonth}/${formattedDay+1}/${year}`;
        return formattedDate;
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
                        {userHistory.map((element) => {
                            return (
                                <>
                                    <h3>Ticker</h3>
                                    <h6>{element.ticker}</h6>
                                    <h3>Trained From Start Date</h3>
                                    <h6>{element.date}</h6>
                                    <h3>Predicted Value</h3>
                                    <h6>{element.predicted_value}</h6>
                                    <h3>Date Predicted For</h3>
                                    <h6>{formatDate(element.timestamp)}</h6>
                                </>
                            )
                        })}
                    </ul>
                </div>
            </div>
        );
    }
    else {
        */
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
//}
    

 
export default Predictor;