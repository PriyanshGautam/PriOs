// SpotifyBox.js
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import "./SpotifyBox.css";
import "./ElasticSlider";
import ColorThief from "color-thief-browser";


const SpotifyBox = ({ SpotifyOpenCheck, setSpotifyOpenCheck }) => {
  const boxRef = useRef(null);
  const btnRef = useRef(null);
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const musicSectionRef = useRef(null);
  const playlistRef = useRef(null);
  const playlistBtnRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none"); 
  const [dominantColor, setDominantColor] = useState([29, 185, 84]); 
  const [isFullscreen, setIsFullscreen] = useState(false);



  const songList = [
    { title: "Two Reasons", artist: "Amber & prodGK", cover: "/assets/two_reasons_cover.webp", src: "/assets/two_reasons_music.mp3" },
    { title: "Together", artist: "SHUBH", cover: "/assets/shubh_togetherwebp.webp", src: "/assets/together_shubh_music.mp3" },
    { title: "Gehra Hua", artist: "Arijit Singh", cover: "/assets/gehra_hua_cover.webp", src: "/assets/gehra_hua_music.mp3" },
    { title: "At Peace", artist: "Karan Aujhla", cover: "/assets/atpeace_cover.webp", src: "/assets/atpeace_music.mp3" },
    { title: "Excuses", artist: "AP Dhillon", cover: "/assets/excuses_cover.webp", src: "/assets/excuses_ap.mp3" },
    { title: "Mrignaini", artist: "Karun", cover: "/assets/mrignaini_cover.webp", src: "/assets/mrignaini_music.mp3" },
    { title: "High On You", artist: "Jind Universe", cover: "/assets/highOnYou_cover.webp", src: "/assets/highOnYou_music.mp3" },
    { title: "Itti Si", artist: "Nanku", cover: "/assets/ittisi_nanku.webp", src: "/assets/ittiSi_music.mp3" },
    { title: "Gulabo", artist: "Arpit Bala", cover: "/assets/gulabo_cover.webp", src: "/assets/gulabo_music.mp3" },
    { title: "Tu Hi Meri Shab Hai", artist: "KK", cover: "/assets/tuHiMeriShab_cover.webp", src: "/assets/tuHiMeriShab_music.mp3" },
    { title: "Tere Bin", artist: "Talwinder", cover: "/assets/tere_bin_cover.webp", src: "/assets/tere_bin_music.mp3" },
    { title: "Softly", artist: "Karan Aujhla", cover: "/assets/softly_cover.webp", src: "/assets/softly_music.mp3" },
    { title: "I Know Love", artist: "Jind Universe", cover: "/assets/i_know_love_cover.webp", src: "/assets/i_know_love.mp3" },
    { title: "dusk", artist: "Bir", cover: "/assets/dusk_cover.webp", src: "/assets/dusk_music.mp3" },
    { title: "Dusk Till Dawn", artist: "NAVE, VIG", cover: "/assets/dusk_till_dawn_cover.webp", src: "/assets/dusk_till_dawn.mp3" },
    { title: "Its You", artist: "Big Money", cover: "/assets/its_you_cover.webp", src: "/assets/its_you.mp3" },
    { title: "Gulaab", artist: "Supreme Sidhu", cover: "/assets/gulaab_supreme_cover.webp", src: "/assets/gulaab_supreme.mp3" },
    { title: "Pretty Face", artist: "NAVE", cover: "/assets/pretty_face_cover.webp", src: "/assets/pretty_face.mp3" },
    { title: "Adore", artist: "Amrinder Gill", cover: "/assets/adore_cover.webp", src: "/assets/adore_music.mp3" },
    { title: "One Thousand Mile", artist: "Yo Yo Honey Singh", cover: "/assets/one_thousand_mile_cover.webp", src: "/assets/one_thousand_mile_music.mp3" },
  ];

  const currentSong = songList[currentIndex];

  useEffect(() => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = currentSong.cover;

  img.onload = () => {
    try {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      setDominantColor(color);
    } catch (err) {
      console.log("Color extraction failed");
    }
  };
}, [currentIndex]);


const toggleFullscreen = () => {
  setIsFullscreen(prev => !prev);
};




  const vibrate = (ms = 15) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(ms);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handlePressEffect = (el) => {
    const add = () => el.classList.add("pressed");
    const remove = () => el.classList.remove("pressed");

    el.addEventListener("touchstart", add);
    el.addEventListener("touchend", remove);
    el.addEventListener("mousedown", add);
    el.addEventListener("mouseup", remove);
    el.addEventListener("mouseleave", remove);
    el.addEventListener("touchcancel", remove);
    el.addEventListener("pointercancel", remove);
  };

  useEffect(() => {
    document.querySelectorAll(".interactive-btn").forEach(handlePressEffect);
  }, [showPlaylist]);

  useEffect(() => {
    if (SpotifyOpenCheck) {
      setIsVisible(true);
      gsap.fromTo(
        boxRef.current,
        { opacity: 0, y: -100, scale: 0.5, rotateY: "-90deg" },
        { opacity: 1, y: 0, scale: 1, rotateY: "0deg", duration: 0.6, ease: "power3.out" }
      );
    } else {
      gsap.to(boxRef.current, {
        opacity: 0,
        y: -100,
        scale: 0.5,
        rotateY: "-90deg",
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          setIsVisible(false);
          setShowPlaylist(false);
          setIsPlaying(false);
        },
      });
    }
  }, [SpotifyOpenCheck]);

  useEffect(() => {
    if (showPlaylist && playlistRef.current) {
      gsap.fromTo(
        playlistRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
      );
    } else if (musicSectionRef.current) {
      gsap.fromTo(
        musicSectionRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }
      );
    }

    if (playlistBtnRef.current) {
      const split = new SplitType(playlistBtnRef.current, { types: "chars" });
      gsap.fromTo(
        split.chars,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [showPlaylist]);

  const togglePlay = () => {
    vibrate(50);
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const skipTime = (seconds) => {
    if (audioRef.current) audioRef.current.currentTime += seconds;
  };

  const updateProgress = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime || 0);
    setDuration(audioRef.current.duration || 0);
    if (progressRef.current && audioRef.current.duration) {
      const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      progressRef.current.style.width = `${percent}%`;
    }
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const switchSong = (index) => {
    vibrate(50);
    setCurrentIndex(index);
    setShowPlaylist(false);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 150);
  };


  const playPreviousSong = () => {
  let prevIndex;

  if (isShuffle) {
    do {
      prevIndex = Math.floor(Math.random() * songList.length);
    } while (prevIndex === currentIndex);
  } else {
    prevIndex = currentIndex - 1;
  }

  if (repeatMode === "none" && prevIndex < 0) {
    return;
  }

  if (repeatMode === "all") {
    prevIndex = (prevIndex + songList.length) % songList.length;
  }

  switchSong(prevIndex);
};



  const playNextSong = () => {
  // Repeat ONE mode
  if (repeatMode === "one") {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    return;
  }

  let nextIndex;

  if (isShuffle) {
   do {
  nextIndex = Math.floor(Math.random() * songList.length);
} while (nextIndex === currentIndex);

  } else {
    nextIndex = currentIndex + 1;
  }

  // If repeatMode is NONE and we're at last song → stop
  if (repeatMode === "none" && nextIndex >= songList.length) {
    setIsPlaying(false);
    return;
  }

  // If repeatMode is ALL → loop back
  if (repeatMode === "all") {
    nextIndex = nextIndex % songList.length;
  }

  switchSong(nextIndex);
};


  if (!isVisible) return null;

  const minimizeSpotify = () => {
    vibrate(20);
    let spotifyBox = document.getElementById("spotify-box");
    let spotifyMainContentBox = document.getElementById("spotify-main-content-box");
    let lastButtonBox = document.getElementById("last-button-box");
    let minimizedSection = document.getElementById("minimized-section");
    minimizedSection.style.display = "flex";
    lastButtonBox.style.display = "none";
    spotifyMainContentBox.style.height = "100px";
    // spotifyMainContentBox.style.position = "absolute";
    spotifyMainContentBox.style.top = "calc(100% - 180px)";
    spotifyBox.style.height = "0px";
    spotifyBox.style.opacity = "0%";

  };
  const maximizeSpotify = () => {
    vibrate(20);
    let spotifyBox = document.getElementById("spotify-box");
    let spotifyMainContentBox = document.getElementById("spotify-main-content-box");
    let lastButtonBox = document.getElementById("last-button-box");
    let minimizedSection = document.getElementById("minimized-section");
    minimizedSection.style.display = "none";
    lastButtonBox.style.display = "flex";
    spotifyMainContentBox.style.height = "calc(100% - 70px)";
    spotifyMainContentBox.style.position = "relative";
    spotifyMainContentBox.style.top = "0px";
    spotifyBox.style.height = "100%";
    spotifyBox.style.opacity = "100%";
  };

  return (
    <div 
  className={`spotify-main-content-box ${isFullscreen ? "fullscreen-mode" : ""}`} 
  id="spotify-main-content-box"
>


{isFullscreen && (
  <div 
    className="immersive-bg"
    style={{ backgroundImage: `url(${currentSong.cover})` }}
  ></div>
)}




      <div
  className="dynamic-blob-bg"
  style={{
    "--blob-color": `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`
  }}
></div>



          <svg width="0" height="0">
      <filter id="liquid-displacement">
        <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
        <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
    
      

      <div className="spotify-box" id="spotify-box" ref={boxRef}>

    


        <audio
          ref={audioRef}
          onTimeUpdate={updateProgress}
          onEnded={playNextSong}
          volume={volume}
        >
          <source src={currentSong.src} type="audio/mp3" />
        </audio>

        <div className="spotify-header">
          <span className="spotify-header-title">Spotify</span>
        </div>

        {showPlaylist ? (
          <div className="spotify-playlist-view" ref={playlistRef}>
            {songList.map((song, index) => (
              <div
                key={index}
                className={`spotify-song-item hover-target ${index === currentIndex ? "active-song" : ""}`}
                onClick={() => switchSong(index)}
              >
                <div className="spotify-song-item-content">
                  <img src={song.cover} alt="cover" className="playlist-cover" />
                  <div className="playlist-text">
                    <span className="song-title">{song.title}</span>
                    <span className="song-artist">{song.artist}</span>
                    {index === currentIndex && isPlaying && (
                      <span className="now-playing-indicator">Now Playing</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`spotify-main-music-box ${isFullscreen ? "fullscreen-layout" : ""}`} ref={musicSectionRef}>
            <div className="spotify-above-name">
              <span className="spotify-above-name-title">NOW PLAYING</span>
              <span className="spotify-above-name-artist">{currentSong.title}</span>
            </div>

            
              <div className="spotify-music-box-image">
                <img
                  src={currentSong.cover}
                  alt="cover"
                  className={`cover-image hover-target interactive-btn ${isPlaying ? "playing" : ""}`}
                  onClick={togglePlay}
                />
              </div>

              <div className="spotify-music-box-text">
                <div className="spotify-music-box-text-name-artist">
                  <span className="spotify-music-box-text-name">{currentSong.title}</span>
                  <span className="spotify-music-box-text-artist">{currentSong.artist}</span>
                </div>
              </div>

              <div className="spotify-controls-container">

                <div className="audio-timeline-container hover-target" onClick={seek}>
                  <div className="audio-timeline">
                    <div className="audio-progress" ref={progressRef}></div>
                <div className="timeline-info">
                  <div>
                  {formatTime(currentTime)}
                  </div> 
                  
                  <div></div>
                   {formatTime(duration)}</div>
                  </div>
                </div>

                <div className="audio-buttons">

                  <button
  className={`shuffle_repeat_btn ${isShuffle ? "active-control" : ""}`}
  onClick={() => setIsShuffle(prev => !prev)}>
  


  <svg xmlns="http://www.w3.org" viewBox="0 0 512 512" width="24" height="24">
  <path d="M480 320l-64 64-64-64M480 192l-64-64-64 64M32 128h128l192 256h128M32 384h128l38-51" fill="none" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

</button>


                  
                  {/* <button className="side_btn_audio interactive-btn" onClick={() => skipTime(-5)}>⏮</button> */}
                  <button
    className="side_btn_audio interactive-btn"
    onClick={playPreviousSong}
  >
    ⏮
  </button>

  <button className="interactive-btn" onClick={togglePlay}>
    {isPlaying ? '⏸' : '▶'}
  </button>

  <button
    className="side_btn_audio interactive-btn"
    onClick={playNextSong}
  >
    ⏭
  </button>
                  {/* <button className="side_btn_audio interactive-btn" onClick={() => skipTime(5)}>⏭</button> */}
                  


          <button
  className="shuffle_repeat_btn"
  onClick={() => {
    if (repeatMode === "none") setRepeatMode("all");
    else if (repeatMode === "all") setRepeatMode("one");
    else setRepeatMode("none");
  }}
>
  {repeatMode === "none" && "🔁"}
  {repeatMode === "all" && "🔁 ALL"}
  {repeatMode === "one" && "🔂"}
</button>



                </div>

                <div className="audio-volume">
                  <img src="/assets/volume.svg" alt="volume" className="volume_icon" />
                  <input
                    className="hover-target"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                </div>
              </div>

          </div>
        )}




        {isFullscreen && (
  <div className="fullscreen-footer">
    <button 
      className="fullscreen-playlist-btn"
      onClick={() => setShowPlaylist(prev => !prev)}
    >
      Show Playlist
    </button>

    <button 
      className="fullscreen-exit-btn"
      onClick={toggleFullscreen}
    >
      Exit Fullscreen
    </button>
  </div>
)}


      </div>

      <div className="spotify-last-box" id="last-button-box" ref={btnRef}>
        <div className="spotify-left-btn-box">
          <div
            className="spotify-list-btn hover-target interactive-btn"
            onClick={() => {
              vibrate();
              setShowPlaylist((prev) => !prev);
            }}
          >
            <span className="spotify-list-text" ref={playlistBtnRef}>
              {showPlaylist ? "☰ Now Playing" : "Show Playlist"}
            </span>
          </div>
        </div>

        <div className="spotify-right-btn-box">

            <div 
  className="spotify_fullscreen_btn interactive-btn"
  onClick={toggleFullscreen}
>
  {isFullscreen ? "⤢" : "⤡"}
</div>


          {/* <div className="spotify_minimize_btn interactive-btn hover-target" onClick={minimizeSpotify}>
            -
          </div> */}
          <div
            className="spotify-close-btn interactive-btn"
            onClick={() => {
              vibrate(20);
              setSpotifyOpenCheck(false);
            }}
          >
            <span className="spotify-close-text hover-target">O</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyBox;
