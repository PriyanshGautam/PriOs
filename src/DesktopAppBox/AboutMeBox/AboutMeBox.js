import React, { useEffect, useRef, useState } from 'react';
import './AboutMeBox.css';
import gsap from 'gsap';
import GlassSurface from '../../GlassSurface';

const AboutMeBox = (props) => {
  const boxRef = useRef(null);
  const btnLeftRef = useRef(null);
  const btnRightRef = useRef(null);

  const [isFullScreen, setIsFullScreen] = useState(false);

  // Drop-in animation when AboutMeBox opens
  useEffect(() => {
    if (props.AboutMeOpenCheck) {
      gsap.fromTo(
        boxRef.current,
        { opacity: 0, y: '-100vh', scale: 0.5 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'bounce.out',
        }
      );

      gsap.fromTo(
        [btnLeftRef.current, btnRightRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 0.2,
        }
      );
    }
  }, [props.AboutMeOpenCheck]);

  // Handle close with reverse drop animation
  const handleClose = () => {
    gsap.to(boxRef.current, {
      opacity: 0,
      y: '-100vh',
      scale: 0.5,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => {
        props.setAboutMeOpenCheck(false);
        setIsFullScreen(false); // Reset fullscreen state
      },
    });

    gsap.to([btnLeftRef.current, btnRightRef.current], {
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: 'power3.in',
    });
  };

  // Toggle fullscreen view
  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  return (
    <>
      {props.AboutMeOpenCheck && (
        <div className='main-box-container'>
          <div
            className={`about-me-box ${isFullScreen ? 'fullscreen-mode' : ''}`}
            ref={boxRef}
          >
            
          </div>

          <div className='bottom-last-box'>
            <div className='last-btn-left'>
              <div
                className='full-screen-btn interactive-btn'
                ref={btnLeftRef}
                onClick={toggleFullScreen}
              >
                {isFullScreen ? 'Exit Full Screen' : 'View in Full Screen'}
              </div>
            </div>
            <div className='last-btn-right'>
              <div
                className='full-screen-btn interactive-btn'
                ref={btnRightRef}
                onClick={handleClose}
              >
                Close
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutMeBox;
