import React, { useEffect } from 'react';
import '../assets/styles/temp.css';
import heroImage from "../assets/images/hero.png";

const LandingPage = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      const navbar = document.querySelector('.navbar');
      
      // Handle navbar transparency
      if (window.scrollY > 100) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
      
      // Handle section animations
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
        <div className="nav-content">
          <div className="logo">
            {/* <img src="logo.png" alt="Company Logo" /> */}
            <span className="company-name">NutriSync</span>
          </div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <button 
              className="cta-button"
              onClick={() => window.location.href = '/home'}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="hero animate-on-scroll">
        <div className="hero-content">
          <h1>Your Personalized <span>Meal Plan</span> Awaits</h1>
          <br></br>
          <p>Get customized meal recommendations based on your dietary preferences, health conditions, and personal goals. Our AI-powered system creates the perfect balance of nutrition and taste just for you.</p>
          <br></br>
          <div className="hero-buttons">
            <button 
              className="cta-button"
              onClick={() => window.location.href = '/home'}
            >
              Start Now
            </button>
            <button className="learn-more-button">
              Learn More
            </button>
          </div>
          
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Healthy Meal" />
        </div>
      </section>

      <section id="about" className="about animate-on-scroll">
        <h2 className="section-title">About NutriSync</h2>
        <div className="about-content">
          <p className="about-lead">NutriSync is your ultimate guide to healthier eating. We create personalized meal plans tailored to your unique needs, whether you're looking to lose weight, manage a health condition, or simply eat better.</p>
          <div className="about-grid">
            <div className="about-item">
              <h3>Our Mission</h3>
              <p>To make healthy eating accessible, enjoyable, and sustainable for everyone through personalized nutrition planning and support.</p>
            </div>
            <div className="about-item">
              <h3>Expert-Backed</h3>
              <p>Our meal plans are developed in collaboration with registered dietitians and nutrition experts to ensure the highest quality recommendations.</p>
            </div>
            <div className="about-item">
              <h3>Personalization</h3>
              <p>Using advanced algorithms, we consider your unique preferences, restrictions, and goals to create truly personalized meal plans.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features animate-on-scroll">
        <h2 className="section-title">Why Choose NutriSync?</h2>
        <p className="features-lead">Experience the perfect blend of science-based nutrition and delicious meals tailored just for you.</p>
        <div className="features-grid">
          {[
            {
              title: "Smart Meal Planning",
              description: "Our AI-powered system creates balanced meal plans that perfectly match your dietary needs and preferences, while ensuring variety and nutrition."
            },
            {
              title: "Dietary Flexibility",
              description: "Whether you're vegan, keto, gluten-free, or have specific allergies, we adapt to your needs while maintaining optimal nutrition levels."
            },
            {
              title: "Progress Tracking",
              description: "Track your journey with detailed progress reports, nutritional insights, and personalized recommendations for better results."
            }
           
          ].map((feature, index) => (
            <div key={index} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="steps animate-on-scroll">
        <h2 className="section-title">How It Works</h2>
        <p className="steps-lead">Getting started with NutriSync is easy. Follow these simple steps to begin your journey to healthier eating.</p>
        <div className="steps-grid">
          {[
            {
              step: 1,
              title: "Tell Us About Yourself",
              description: "Fill out our comprehensive questionnaire about your dietary preferences, health conditions, goals, and lifestyle. The more we know, the better we can customize your plan."
            },
            {
              step: 2,
              title: "Get Your Personalized Plan",
              description: "Our AI analyzes your information to create a custom meal plan that perfectly matches your needs. Each meal is carefully selected to help you reach your goals."
            },
            {
              step: 3,
              title: "Start Your Journey",
              description: "Access your meal plan, shopping lists, and recipes through our easy-to-use platform. Track your progress, adjust preferences, and enjoy the journey to healthier eating."
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

      
    </div>
  );
};

export default LandingPage;