import React, { useEffect, useState, useRef } from 'react';
import './Loader.css';
import gsap from 'gsap';
import Noise from "../NoiseBox/Noise";

const Loader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  const [siteLoaded, setSiteLoaded] = useState(false);

  const loaderRef = useRef(null);
  const fillRef = useRef(null);

  // Set initial state and fade in loader
  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.width = '0%'; // Force initial state
    }

    gsap.fromTo(loaderRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  // Detect when site is fully loaded
  useEffect(() => {
    const handleLoad = () => setSiteLoaded(true);

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;

        if ((next >= 100 || siteLoaded) && !showEnter) {
          clearInterval(interval);
          setTimeout(() => setShowEnter(true), 300);
          return 100;
        }

        return next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [siteLoaded, showEnter]);

  // Animate progress bar and percentage
  useEffect(() => {
    if (!fillRef.current) return;

    // Animate bar fill width
    gsap.to(fillRef.current, {
      width: `${progress}%`,
      duration: 0.4,
      ease: 'power1.out',
    });

    // Animate percentage number
    if (progress >= 100) {
      setDisplayProgress(100);
    } else {
      gsap.to({}, {
        duration: 0.3,
        onUpdate: () => {
          setDisplayProgress((prev) => prev + (progress - prev) * 0.2);
        },
      });
    }
  }, [progress]);

  // Animate enter button
  useEffect(() => {
    if (showEnter) {
      gsap.fromTo(
        '.enter-button',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, [showEnter]);

  // Handle full-screen transition
  const handleFinish = () => {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }

    gsap.to(loaderRef.current, {
      opacity: 0,
      duration: 0.7,
      onComplete: () => {
        onFinish();
      }
    });
  };

  return (
    <div className="loader-container" ref={loaderRef}>
      {/* Background Noise */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          overflow: "hidden",
          zIndex: -1,
        }}
      >
        <Noise
          patternSize={500}
          patternScaleX={5}
          patternScaleY={5}
          patternRefreshInterval={2}
          patternAlpha={15}
        />
      </div>

      {/* Loader Content */}
      <h1 className="loader-heading">Welcome to PriOS - Portfolio of Priyansh</h1>

      <div className="progress-text">{Math.round(displayProgress)}%</div>

      <div className="loading-bar-container">
        <div className="loading-bar-fill" ref={fillRef}></div>
      </div>

      {showEnter && (
        <button className="enter-button" onClick={handleFinish}>
          Knock Knock
          <img src="/assets/login_icon.webp" alt="Enter Icon" className="enter-icon" />
        </button>
      )}
    </div>
  );
};

export default Loader;
