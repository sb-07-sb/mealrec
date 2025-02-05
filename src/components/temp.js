import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles/temp.css";

const Home = () => {
  return (
    <div className="container-fluid p-5 text-center position-relative">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm d-flex justify-content-between">
        <a className="navbar-brand fw-bold" href="#">Fitness Assistant</a>
        <div>
          <button className="btn btn-outline-primary me-2">Login</button>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </nav>
      
      <header className="my-5 position-relative">
        <h1 className="display-5 fw-bold">Connect effortlessly with a personalized fitness plan</h1>
        <p className="lead">Get customized meal recommendations and fitness guidance tailored to your needs.</p>
        <button className="btn btn-primary me-2">Get Started</button>
        <button className="btn btn-outline-primary">Learn More</button>
        <div className="background-lines"></div>
      </header>
      
      <section className="my-5 position-relative">
        <h2 className="fw-bold">Why Choose Us?</h2>
        <div className="row mt-4">
          <div className="col-md-4">
            <h3>Success Rate</h3>
            <p>Users see improvement in their health within weeks.</p>
          </div>
          <div className="col-md-4">
            <h3>Personalized Plans</h3>
            <p>Customized meal and workout plans to suit your needs.</p>
          </div>
          <div className="col-md-4">
            <h3>Global Reach</h3>
            <p>Helping users worldwide achieve their fitness goals.</p>
          </div>
        </div>
        <div className="background-lines"></div>
      </section>
      
      <section className="my-5 position-relative">
        <h2 className="fw-bold">How It Works</h2>
        <p>Sign up, fill in your fitness details, and get personalized recommendations instantly.</p>
        <div className="row mt-4">
          <div className="col-md-4">
            <h3>Step 1</h3>
            <p>Create your profile with your fitness goals.</p>
          </div>
          <div className="col-md-4">
            <h3>Step 2</h3>
            <p>Receive meal plans and workout schedules.</p>
          </div>
          <div className="col-md-4">
            <h3>Step 3</h3>
            <p>Track your progress and adjust as needed.</p>
          </div>
        </div>
        <div className="background-lines"></div>
      </section>
      
      <footer className="mt-5 text-muted">&copy; 2025 Fitness Assistant. All Rights Reserved.</footer>
    </div>
  );
};

export default Home;
