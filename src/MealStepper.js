import React, { useEffect, useState } from 'react';
import styles from './assets/styles/LandingPage.module.css';
import heroImage from "./assets/images/hero.png";

const LandingPage = () => {
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(`.${styles.animateOnScroll}`);
      const navbar = document.querySelector(`.${styles.navbar}`);
      
      // Handle navbar transparency
      if (window.scrollY > 100) {
        navbar.classList.add(styles.navbarScrolled);
      } else {
        navbar.classList.remove(styles.navbarScrolled);
      }
      
      // Handle section animations
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.8) {
          section.classList.add(styles.animated);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <span className={styles.companyName}>NutriSync</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <button 
              className={styles.ctaButton}
              onClick={() => window.location.href = '/test'}
            >
              Get Started
            </button>
          </div>
          <div className={styles.mobileMenuButton}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <section className={`${styles.hero} ${styles.animateOnScroll}`}>
        <div className={styles.heroContent}>
          <h1>Your Personalized <span>Meal Plan</span> Awaits</h1>
          <p>Get customized meal recommendations based on your preferences, favorite dishes, and dietary restrictions. Our system creates the perfect meal plan just for you.</p>
          <div className={styles.heroButtons}>
            <button 
              className={styles.ctaButton}
              onClick={() => window.location.href = '/test'}
            >
              Create My Plan
            </button>
            <button className={styles.learnMoreButton}>
              Learn More
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={heroImage} alt="Delicious Meal" />
        </div>
      </section>

      <section id="about" className={`${styles.section} ${styles.lightSection} ${styles.animateOnScroll}`}>
  <div className={styles.sectionContainer}>
    <h2 className={styles.sectionTitle}>About NutriSync</h2>
    <p className={styles.sectionLead}>NutriSync creates custom meal plans based on your food preferences and dietary needs. Tell us what you like, and we'll handle the rest.</p>
    <div className={styles.aboutContent}>
      <div className={styles.featureRow}>
        <div className={styles.featureText}>
          <h3 className={styles.featureHeading}>Preference-Based</h3>
          <p className={styles.featureDescription}>We create meal plans based on your favorite dishes and cuisine preferences, ensuring you'll always enjoy what you eat. Our sophisticated algorithm learns from your choices to continuously improve recommendations.</p>
        </div>
      </div>
      
      <div className={styles.featureRow}>
        <div className={styles.featureText}>
          <h3 className={styles.featureHeading}>Customizable</h3>
          <p className={styles.featureDescription}>Choose your meal size, protein level, and specific ingredients to avoid - your meal plan will be tailored to match exactly what you want. Our flexible system adapts to your changing preferences.</p>
        </div>
      </div>
      
      <div className={styles.featureRow}>
        <div className={styles.featureText}>
          <h3 className={styles.featureHeading}>Diverse Options</h3>
          <p className={styles.featureDescription}>Explore meal suggestions from various cuisines while staying true to your taste preferences and dietary requirements. Discover new favorites while enjoying familiar flavors.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="features" className={`${styles.section} ${styles.darkSection} ${styles.animateOnScroll}`}>
  <div className={styles.sectionContainer}>
    <h2 className={styles.sectionTitle}>Why Choose NutriSync?</h2>
    <p className={styles.sectionLead}>Experience meal planning that truly understands your preferences.</p>
    <div className={styles.aboutContent}>
      <div className={styles.featureRow}>
        <div className={styles.featureText}>
          <h3 className={styles.featureHeading}>Preference Matching</h3>
          <p className={styles.featureDescription}>Our system analyzes your favorite dishes and creates meal plans with options you'll love, taking into account your cuisine preferences and taste profile. The more you use NutriSync, the better it gets at understanding your unique taste preferences.</p>
        </div>
      </div>
      
      <div className={styles.featureRow}>
        <div className={styles.featureText}>
          <h3 className={styles.featureHeading}>Ingredient Filtering</h3>
          <p className={styles.featureDescription}>Simply tell us which ingredients you want to avoid, and we'll ensure they never appear in your meal recommendations. Whether it's allergies, dietary restrictions, or personal preferences, we make sure every meal works for you.</p>
        </div>
      </div>
      
      <div className={styles.featureRow}>
        <div className={styles.featureText}>
          <h3 className={styles.featureHeading}>Flexible Meal Options</h3>
          <p className={styles.featureDescription}>Choose which meal types you want plans for - whether it's lunch, dinner, or both - and we'll create the perfect lineup for your needs. Our system adapts to your schedule and lifestyle requirements.</p>
        </div>
      </div>
    </div>
  </div>
</section>

      <section id="how-it-works" className={`${styles.section} ${styles.lightSection} ${styles.animateOnScroll}`}>
  <div className={styles.sectionContainer}>
    <h2 className={styles.sectionTitle}>How It Works</h2>
    <p className={styles.sectionLead}>Getting started with NutriSync is easy. Follow these simple steps to create your custom meal plan.</p>
    
    <div className={styles.stepContainer}>
      <div className={styles.step}>
        <div className={styles.stepContent}>
          <h3 className={styles.stepHeading}>Share Your Preferences</h3>
          <p className={styles.stepDescription}>Tell us about your favorite dishes, preferred cuisines, meal sizes, and any ingredients you want to avoid. Our intuitive interface makes this process quick and enjoyable.</p>
        </div>
        <div className={styles.stepImageContainer}>01</div>
      </div>
      
      <div className={styles.step}>
        <div className={styles.stepContent}>
          <h3 className={styles.stepHeading}>Get Your Custom Plan</h3>
          <p className={styles.stepDescription}>Our system analyzes your preferences to create a meal plan with options you'll love, ensuring variety while respecting your choices. Each recommendation is carefully selected just for you.</p>
        </div>
        <div className={styles.stepImageContainer}>02</div>
      </div>
      
      <div className={styles.step}>
        <div className={styles.stepContent}>
          <h3 className={styles.stepHeading}>Enjoy Your Meals</h3>
          <p className={styles.stepDescription}>Follow your personalized meal plan and enjoy delicious dishes tailored specifically to your taste preferences. Discover new favorites while enjoying familiar flavors that you know you'll love.</p>
        </div>
        <div className={styles.stepImageContainer}>03</div>
      </div>
    </div>
  </div>
</section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.logo}>
            <span className={styles.footerCompanyName}>NutriSync</span>
          </div>
          <div className={styles.footerLinks}>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;