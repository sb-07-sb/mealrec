import React from "react";
import "../assets/styles/temp.css"; // Importing styles for the home page

const HomePage = () => {
  return (
    <div className="homepage">
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Meal Plan Logo" className="logo-image" />
        <h1 className="title">Meal Plan Generator</h1>
      </div>
      <nav className="navigation">
        <ul>
          <li><a href="#intro">Home</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#start">Get Started</a></li>
        </ul>
      </nav>
    </header>


      {/* Intro Section */}
      <section id="intro" className="intro">
        <h2>Your Personalized Meal Plan Awaits</h2>
        <p>Get a meal plan tailored to your preferences, goals, and dietary needs. Whether you're looking to lose weight, gain muscle, or maintain your current lifestyle, we've got you covered!</p>
        <button className="cta-button" onClick={() => window.location.href = "#start"}>Start Your Journey</button>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>Step 1: Fill Out Your Details</h3>
            <p>Provide basic information like your age, height, and weight.</p>
          </div>
          <div className="step">
            <h3>Step 2: Select Your Preferences</h3>
            <p>Choose your dietary restrictions, body type, and health goals.</p>
          </div>
          <div className="step">
            <h3>Step 3: Get Your Meal Plan</h3>
            <p>We will generate a meal plan tailored to your needs and preferences.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="start" className="start">
        <h2>Ready to Get Started?</h2>
        <p>Click below to fill out the form and get your personalized meal plan!</p>
        <button className="cta-button" onClick={() => window.location.href = "#"}>Start Now</button>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 Meal Plan Generator. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
