import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./NavigationBar.css";

function NavigationBar({ SpotifyMinimized, setSpotifyMinimized, isMuted, setIsMuted }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const trailRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`);
      setDate(`${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`);
    };
    const intervalId = setInterval(updateDateTime, 1000);
    updateDateTime();
    return () => clearInterval(intervalId);
  }, []);

  useGSAP(() => {
    gsap.from(".navigation-bar", {
      y: -100,
      duration: 1,
      ease: "power2.out",
      delay: 0.3,
    });

    gsap.from([".nav-des", ".nav-des-two"], {
      y: -30,
      opacity: 0,
      duration: 1,
      delay: 1,
      stagger: 0.2,
      ease: "power1.inOut",
    });
  }, []);

  const handleSpotifyClick = () => setSpotifyMinimized(false);

  const handleMouseMove = (e) => {
    const { clientX: x, clientY: y } = e;

    trailRefs.current.forEach((ref, index) => {
      gsap.to(ref, {
        x: x + index * 10,
        y: y + index * 10,
        duration: 0.4 + index * 0.1,
        ease: "power2.out",
      });
    });
  };

  const showTrails = () => {
    trailRefs.current.forEach((ref) => {
      gsap.to(ref, {
        opacity: 1,
        duration: 0.3,
      });
    });
    window.addEventListener("mousemove", handleMouseMove);
  };

  const hideTrails = () => {
    trailRefs.current.forEach((ref) => {
      gsap.to(ref, {
        opacity: 0,
        duration: 0.3,
      });
    });
    window.removeEventListener("mousemove", handleMouseMove);
  };

  return (
    <nav className="navigation-bar" ref={containerRef}>
      <div className="name-box">
        <span
          className="name"
          onMouseEnter={showTrails}
          onMouseLeave={hideTrails}
        >
          Priyansh Gautam
        </span>
      </div>

      {SpotifyMinimized ? (
        <>
          <div className="nav-des clickable" onClick={handleSpotifyClick}>
            Open Spotify
          </div>
          <div className="nav-des-two clickable" onClick={handleSpotifyClick}>
            Open Spotify
          </div>
        </>
      ) : (
        <>
          <div className="nav-des">
            Trauma-Bonded to VS Code and Coffee (Software Engineer)
          </div>
          <div className="nav-des-two">Software Engineer</div>
        </>
      )}

      <div className="time-box">
        <span className="time">{time}</span>
        <span style={{ marginLeft: "10px" }}>{date}</span>
      </div>

      {/* Trail images */}
      {/* <img
        src="/assets/1.jpg"
        ref={(el) => (trailRefs.current[0] = el)}
        className="trail-image"
        alt="trail1"
      /> */}
      <img
        src="/assets/2.jpg"
        ref={(el) => (trailRefs.current[1] = el)}
        className="trail-image"
        alt="trail2"
      />
      {/* <img
        src="/images/pri3.jpg"
        ref={(el) => (trailRefs.current[2] = el)}
        className="trail-image"
        alt="trail3"
      /> */}
    </nav>
  );
}

export default NavigationBar;
