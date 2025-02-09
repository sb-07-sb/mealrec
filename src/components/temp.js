import React, { useEffect } from 'react';
import '../assets/styles/temp.css';

const LandingPage = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.8) {
          section.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <img src="logo.png" alt="Company Logo" />
          <span className="company-name">MealPlanPro</span>
        </div>
        <button 
          className="cta-button"
          onClick={() => window.location.href = '/stepper-form'}
        >
          Get Started
        </button>
      </nav>

      <section className="hero animate-on-scroll">
        <div className="hero-content">
          <h1>Your Personalized <span>Meal Plan</span> Awaits</h1>
          <p>Get customized meal recommendations based on your dietary preferences, health conditions, and personal goals.</p>
          <button 
            className="cta-button"
            onClick={() => window.location.href = '/stepper-form'}
          >
            Start Now
          </button>
        </div>
        <div className="hero-image">
          <img src="meal-plan-hero.jpg" alt="Healthy Meal" />
        </div>
      </section>

      <section className="about animate-on-scroll">
        <h2 className="section-title">About MealPlanPro</h2>
        <p>MealPlanPro is your ultimate guide to healthier eating. We create personalized meal plans tailored to your unique needs, whether you're looking to lose weight, manage a health condition, or simply eat better.</p>
      </section>

      <section className="features animate-on-scroll">
        <h2 className="section-title">Why Choose MealPlanPro?</h2>
        <div className="features-grid">
          {[
            {
              title: "Tailored to You",
              description: "We consider your dietary preferences, health conditions, and personal details to create the perfect meal plan for you."
            },
            {
              title: "Healthy & Delicious",
              description: "Enjoy a variety of healthy and delicious meals that fit your lifestyle and taste buds."
            },
            {
              title: "Easy to Follow",
              description: "Our meal plans are simple, easy to follow, and designed to help you achieve your health goals."
            }
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="steps animate-on-scroll">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          {[
            {
              step: 1,
              title: "Tell Us About Yourself",
              description: "Fill out our simple form with your dietary preferences, health conditions, and personal details."
            },
            {
              step: 2,
              title: "Get Your Plan",
              description: "We analyze your inputs and create a personalized meal plan just for you."
            },
            {
              step: 3,
              title: "Start Eating Better",
              description: "Follow your meal plan and enjoy healthier, more delicious meals every day."
            }
          ].map((item, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} MealPlanPro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;