import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import "./Dock.css";

const dockItems = [
  { img: "/assets/finder_icon.png", label: "Finder" },
  { img: "/assets/search_icon.png", label: "Search" },
  { img: "/assets/chat_logo.webp", label: "Chat" },
  { img: "/assets/flappy_game_icon.png", label: "Flappy Bird Game" },
  { img: "/assets/insta_logo.png", label: "Instagram" },
];

const startMenuItems = [
  { label: "📶 Wi-Fi: Searching for job signals…" },
  { label: "💼 View Resume" },
  { label: "🧠 Skills & Tech Stack" },
  { label: "📁 Projects" },
  { label: "📞 Contact Me" },
  { label: "🛑 Close this menu" },
];

export default function Dock() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const dockRef = useRef(null);

  const toggleStartMenu = () => {
    setStartMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    gsap.fromTo(
      dockRef.current,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      }
    );
  }, []);

  return (
    <div className="dock-wrapper" ref={dockRef}>
      {/* Start Menu Button */}
      <div className="start-menu hover-target" onClick={toggleStartMenu}>
        <img
          src="/assets/win11_start_icon.jpg"
          alt="Start Menu"
          className="start-menu-icon"
        />
      </div>

      {/* Start Menu Panel */}
      {startMenuOpen && (
        <div className="start-menu-panel">
          <div className="start-item-container">
            {startMenuItems.map((item, index) => (
              <div
                className="start-item"
                key={index}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {
                  if (item.label.includes("Close")) {
                    setStartMenuOpen(false);
                  }
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dock Items */}
      <div className="dock-container">
        {dockItems.map((item, index) => {
          const isHovered = hoverIndex === index;
          const isAdjacent =
            hoverIndex === index - 1 || hoverIndex === index + 1;

          return (
            <div
              className={`dock-item ${
                isHovered ? "hovered" : isAdjacent ? "adjacent" : ""
              }`}
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <img src={item.img} alt={item.label} className="dock-icon" />
              {isHovered && <div className="dock-tooltip">{item.label}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
