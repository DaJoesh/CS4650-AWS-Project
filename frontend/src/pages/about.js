import React from "react";
 
const About = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: 'column',
                justifyContent: "flex-start",
                alignItems: "flex-start",
                height: "100vh",
                paddingLeft: '100px',
                paddingRight: '100px',
            }}
        >

                <h1>
                    CS4650 AWS Project : Stock Trading AI
                </h1>
                <section>
                    <h2>Project Overview</h2>
                    <p>
                    <strong>Purpose:</strong> This project combines the concepts of Machine Learning with Cloud Computing in order to host a remote AI that can predict given stocks. This allows anyone who signs up to remotely predict the stock they want without having to download the program and use their machine’s resources during the calculations.
                    </p>
                    <p>
                    <strong>Capabilities:</strong> The Stock Trading AI can receive a given ticker with a start date and predict the next day's price by giving this information to the model. The web program can take this information and display it to the user while also sending it to the remote database.
                    </p>
                </section>
                <section>
                    <h2>Technologies Used</h2>
                    <p>
                    This project was built using React as the frontend to handle webpage displays, Flask as the middleware to communicate between the database and the GUI, and MySQL as the database management and hosting software. This is all hosted on Amazon Web Services EC2.
                    </p>
                    <ul>
                    <li><strong>Front-End:</strong> React</li>
                    <li><strong>Middleware:</strong>Flask</li>
                    <li><strong>Database:</strong> MySQL</li>
                    <li><strong>Cloud Services:</strong> AWS</li>
                    </ul>
                </section>

                <section>
                    <h2>Development Team</h2>
                    <p>
                    <strong>Abdul Kalam Syed</strong><br />
                    <strong>Role: </strong> Frontend and Middleware
                    </p>
                    <p>
                    <strong>Drake Fafard</strong><br />
                    <strong>Role: </strong> Backend and Presentation
                    </p>
                    <p>
                    <strong>Joshua Jenkins</strong><br />
                    <strong>Role: </strong> Team Lead and Web Services
                    </p>
                    <p>
                    <strong>Michael Tran</strong><br />
                    <strong>Role: </strong> Frontend and Middleware
                    </p>
                </section>

                <section>
                    <h2>Project Github Link</h2>
                    <p><a href="https://github.com/DaJoesh/CS4650-AWS-Project/tree/main" target="_blank" rel="noopener noreferrer">Github.com/DaJoesh/CS4650-AWS-Project</a></p>
                </section>

                <section>
                    <h2>Contact Information</h2>
                    <p>earodriguez@cpp.edu</p>
                </section>

            
        </div>
    );
};
 
export default About;