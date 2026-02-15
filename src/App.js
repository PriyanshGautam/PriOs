import React, { useState, useEffect, useRef } from "react";
import "./main.css";

import Loader from "./Loader/Loader";
import Noise from "./NoiseBox/Noise";
import NavigationBar from "./NavigationBar/NavigationBar";
import DesktopAppBox from "./DesktopAppBox/DesktopAppBox";
import SpotifyBox from "./DesktopAppBox/SpotifyBox/SpotifyBox";
import Dock from "./Dock/Dock";
import CustomCursor from "./CustomCursor/CustomCursor";


function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [isSpotifyMinimized, setIsSpotifyMinimized] = useState(false);
  const [shuffledImages, setShuffledImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  const audioRef = useRef(null);

  const useVideoBackground = false;
  const useCustomAudio = true;

  const backgroundImages = [
    // "https://images.unsplash.com/photo-1653549892896-dde02867edee?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0",
    "/assets/wallpaper10.jpg",
  ];

  const backgroundVideos = [
    // "https://videos.pexels.com/video-files/855979/855979-hd_1920_1080_30fps.mp4",
    // "https://videos.pexels.com/video-files/7385122/7385122-uhd_2560_1440_30fps.mp4",
    // "https://www.pexels.com/download/video/5098247/"
  ];

  const backgroundAudioSrc = useCustomAudio
    ? "https://www.bensound.com/bensound-music/bensound-sunny.mp3"
    : selectedVideo;

  // Shuffle utility
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load background and prepare fade-in
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundVideos.length);
    setSelectedVideo(backgroundVideos[randomIndex]);
    setShuffledImages(shuffleArray(backgroundImages));

    // Delay to trigger fade-in
    setTimeout(() => {
      setBackgroundReady(true);
    }, 300);
  }, []);

  // Play background audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch((e) =>
        console.warn("Autoplay failed:", e)
      );
    }
  }, [isLoaded, selectedVideo]);

  const handleSpotifyOpenFromNav = () => {
    setIsSpotifyMinimized(false);
    setIsSpotifyOpen(true);
  };

  return (
    <>
      {!isLoaded ? (
        <Loader onFinish={() => setIsLoaded(true)} />
      ) : (
        <>
          {/* <CustomCursor /> */}
          {/* 🎞️ Background Video */}
          {useVideoBackground && selectedVideo && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="background-video"
            >
              <source src={selectedVideo} type="video/mp4" />
            </video>
          )}

          {/* 🖼️ Background Image */}
          {!useVideoBackground && (
            <div className="background">
              <div
                className={`background-image ${
                  backgroundReady ? "fade-in" : ""
                }`}
              >
                {shuffledImages.map((src, index) => (
                  <img key={index} src={src} alt={`Background ${index}`} />
                ))}
              </div>
            </div>
          )}

          {/* 🔊 Background Music */}
          <audio
            ref={audioRef}
            src={backgroundAudioSrc}
            autoPlay
            loop
            muted={isMuted}
          />

          {/* ✨ Noise Overlay */}
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

          {/* 🌐 Main UI Content */}
          <div className="main-container">
            <NavigationBar
              SpotifyMinimized={isSpotifyMinimized}
              setSpotifyMinimized={setIsSpotifyMinimized}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              onSpotifyOpen={handleSpotifyOpenFromNav}
            />
            <SpotifyBox
              SpotifyOpenCheck={isSpotifyOpen}
              setSpotifyOpenCheck={setIsSpotifyOpen}
              SpotifyMinimized={isSpotifyMinimized}
              setSpotifyMinimized={setIsSpotifyMinimized}
            />
            <Dock
  SpotifyMinimized={isSpotifyMinimized}
  setSpotifyMinimized={setIsSpotifyMinimized}
/>
            <DesktopAppBox />
          </div>
        </>
      )}
    </>
  );
}

export default App;