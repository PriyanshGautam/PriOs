import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const size = 10; // must match width/height in CSS

    // Instantly follow mouse with perfect center alignment
    const updateCursor = (e) => {
      cursor.style.top = `${e.clientY - size / 10}px`;
      cursor.style.left = `${e.clientX - size / 10}px`;
    };

    document.addEventListener('mousemove', updateCursor);

    // Add hover effects
    const addHoverListeners = () => {
      document.querySelectorAll('a, button, .hover-target').forEach((el) => {
        el.addEventListener('mouseenter', () =>
          cursor.classList.add('cursor-hovered')
        );
        el.addEventListener('mouseleave', () =>
          cursor.classList.remove('cursor-hovered')
        );
      });
    };

    // Observe DOM for new elements and reapply hover listeners
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial load
    addHoverListeners();

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      observer.disconnect();
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef}></div>;
};

export default CustomCursor;
