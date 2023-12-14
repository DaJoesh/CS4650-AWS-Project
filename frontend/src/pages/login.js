import React, { useState } from "react";
import "./login.css"; // Import the CSS file for styles

export default function Login({ navigation }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(name, value) {
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit() {
    const email = formData.email;
    const password = formData.password;
    // Your validation logic goes here
    // Handle form submission and API calls here
  }

  return (
    <div className="container">
      <div className="box">
        <div className="infoCard">
          <h2>Email</h2>
          <input
            type="text"
            value={formData.email}
            placeholder="johndoe@abc.com"
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <h2>Password</h2>
          <input
            type="password"
            value={formData.password}
            placeholder="MyPassword123"
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <div className="horizontalButtonContainer">
            <button onClick={handleSubmit}>Log In</button>
            <button onClick={() => navigation.navigate("Signup")}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}