import React from "react";
import { useState } from "react";
 
const Predictor = () => {
    const [message, setMessage] = useState('');
    const [tickerInput, setTickerInput] = useState('');
    const [dateInput, setDateInput] = useState('');

    const handleSubmit = event => {
        console.log('sumbitted');
        event.preventDefault();
        console.log(tickerInput);
        console.log(dateInput);
        /*get data here using tickerInput and dateInput, need middleware here*/

        setTickerInput('');
        setDateInput('');
    }
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