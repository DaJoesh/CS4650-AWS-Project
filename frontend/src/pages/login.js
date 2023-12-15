import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./login.css"; // Import the CSS file for styles;

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

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

  function validateEmail(email) {
    const mail = String(email);
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.(com|edu)$/;
    const validEmail = emailRegex.test(mail);
    return validEmail;
  }

  async function handleSubmit() {
    const email = formData.email;
    const password = formData.password;
    if (email.length < 1 || password.length < 1 || !validateEmail(email)) {
      alert("Login failed. Please check your credentials.");
      return;
    }

    try {
      const response = await fetch("http://54.183.100.235/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Success:", result);
      if (result && !result.hasOwnProperty("error")) {
        localStorage.setItem("user_id", result.user_id);
        setIsLoggedIn(true); // Update isLoggedIn state upon successful login
        navigate("/predictor");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}