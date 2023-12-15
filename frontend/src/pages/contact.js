import React from "react";

const About = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column", // Added to make items appear in a column
      }}
    >
      <h1>Email us at: earodríguez@cpp.edu</h1>
      <h1>Call us at: 909-869-3451</h1>
    </div>
  );
};

export default About;