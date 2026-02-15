import React, { useEffect, useRef, useState } from 'react';
import './DesktopAppBox.css';
import AboutMeBox from './AboutMeBox/AboutMeBox';
import SpotifyBox from './SpotifyBox/SpotifyBox';
import GallaryBox from './GallaryBox/GallaryBox';
import FlappyBirdGame from '../FlappyGame/FlappyGame';
import FileManagerBox from './FileManagerBox/FileManagerBox';
// import { vibrate } from '../utils/vibration';
import gsap from 'gsap';

const DesktopAppBox = () => {
  const iconBoxesRef = useRef([]);
  const [aboutMeOpenValue, setAboutMeOpenValue] = useState(false);
  const [spotifyMeOpenValue, setSpotifyMeOpenValue] = useState(false);
  const [gallaryOpenValue, setGallaryOpenValue] = useState(false);

  const iconData = [
    {
      img: "/assets/chrome-icon-png.webp",
      name: "about_me.html",
      onClick: () => {
        openFileManagerAboutMe();
      },
    },
    {
      img: "/assets/book_folder_icon.png",
      name: "IMPORTANT files check",
      onClick: () => {
        console.log("about_me clicked");
      },
    },
    {
      img: "/assets/spotify-icon-webp.webp",
      name: "fvrt_music",
      onClick: () => {
        setSpotifyMeOpenValue(false);
        setTimeout(() => setSpotifyMeOpenValue(true), 50);
      },
    },
    {
      img: "/assets/gallary_icon.webp",
      name: "Self Portraits",
      onClick: () => {
        setGallaryOpenValue(false);
        setTimeout(() => setGallaryOpenValue(true), 50);
      },
    },
    {
      img: "/assets/settings_icon.png",
      name: "Settings",
      onClick: () => {
        setGallaryOpenValue(false);
        setTimeout(() => setGallaryOpenValue(true), 50);
        openSettingsApp();
      },
    },
    {
      img: "/assets/contact_icon.webp",
      name: "Contact Me",
      onClick: () => {
        openContactBox();
        setGallaryOpenValue(false);
        setTimeout(() => setGallaryOpenValue(true), 50);
      },
    },
  ];

  // Animate icons only after full render
  useEffect(() => {
    const animateIcons = () => {
      const allElements = iconBoxesRef.current.filter(Boolean); // remove nulls

      if (allElements.length === iconData.length) {
        gsap.fromTo(
          allElements,
          { opacity: 0, y: -30, scale: 0.5 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      }
    };

    // Slight delay to ensure DOM readiness
    const animationDelay = setTimeout(() => {
      requestAnimationFrame(animateIcons);
    }, 50);

    return () => clearTimeout(animationDelay); // cleanup
  }, [iconData.length]);





  // FIle Manager Box State
  const boxRef = useRef(null);
  
    // Default size & position
    const defaultSize = { width: "70vw", height: 600 };
    const defaultPosition = { x: 10, y: 60 };
  
    const [size, setSize] = useState(defaultSize);
    const [position, setPosition] = useState(defaultPosition);
    const [resizing, setResizing] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [isFullScreenAnimating, setIsFullScreenAnimating] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
  
    // ===== RESIZE LOGIC =====
    const startResize = (e) => {
      e.preventDefault();
      setResizing(true);
  
      const startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
      const startY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;
  
      const doResize = (moveEvent) => {
        const currentX = moveEvent.type.includes("touch")
          ? moveEvent.touches[0].clientX
          : moveEvent.clientX;
        const currentY = moveEvent.type.includes("touch")
          ? moveEvent.touches[0].clientY
          : moveEvent.clientY;
  
        setSize({
          width: Math.max(150, startWidth + (currentX - startX)),
          height: Math.max(150, startHeight + (currentY - startY)),
        });
      };
  
      const stopResize = () => {
        setResizing(false);
        window.removeEventListener("mousemove", doResize);
        window.removeEventListener("mouseup", stopResize);
        window.removeEventListener("touchmove", doResize);
        window.removeEventListener("touchend", stopResize);
      };
  
      window.addEventListener("mousemove", doResize);
      window.addEventListener("mouseup", stopResize);
      window.addEventListener("touchmove", doResize);
      window.addEventListener("touchend", stopResize);
    };
  
    // ===== DRAG LOGIC WITH HARD BOUNDARIES =====
    const startDrag = (e) => {
      if (resizing) return;
      e.preventDefault();
      setDragging(true);
  
      const startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
      const startY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
      const startPos = { ...position };
  
      const doDrag = (moveEvent) => {
        const currentX = moveEvent.type.includes("touch")
          ? moveEvent.touches[0].clientX
          : moveEvent.clientX;
        const currentY = moveEvent.type.includes("touch")
          ? moveEvent.touches[0].clientY
          : moveEvent.clientY;
  
        let newX = startPos.x + (currentX - startX);
        let newY = startPos.y + (currentY - startY);
  
        // 🛑 HARD BOUNDARIES
        const maxX = window.innerWidth - size.width;
        const maxY = window.innerHeight - size.height;
  
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX > maxX) newX = maxX;
        if (newY > maxY) newY = maxY;
  
        setPosition({ x: newX, y: newY });
      };
  
      const stopDrag = () => {
        setDragging(false);
        window.removeEventListener("mousemove", doDrag);
        window.removeEventListener("mouseup", stopDrag);
        window.removeEventListener("touchmove", doDrag);
        window.removeEventListener("touchend", stopDrag);
      };
  
      window.addEventListener("mousemove", doDrag);
      window.addEventListener("mouseup", stopDrag);
      window.addEventListener("touchmove", doDrag);
      window.addEventListener("touchend", stopDrag);
    };
  
    // ===== CLOSE FUNCTION =====
    const closeFileManager = () => {
      let fileManager = document.getElementById("fileManager");
      fileManager.style.transition = "all 0.4s cubic-bezier(0.68,-0.55,0.27,1.55)";
      // fileManager.style.top = "100px";
      fileManager.style.opacity = "0";
      fileManager.style.height = "0px";
    };
  
  
  
    // ===== SHOW MENU FUNCTION =====
    const showMenu = () => {
      let leftBoxFileManager = document.getElementById("leftBoxFileManager");
      leftBoxFileManager.style.width = "150px";
      
      leftBoxFileManager.style.opacity = "1";
  
      let rightBoxFileManager = document.getElementById("rightBoxFileManager");
      rightBoxFileManager.style.width = "calc(100% - 150px)";
  
      let showMenuBox = document.getElementById("showMenuBox");
      showMenuBox.style.width = "0px";
      showMenuBox.style.opacity = "0";
    };
  
    const hideMenu = () => {
      let leftBoxFileManager = document.getElementById("leftBoxFileManager");
      leftBoxFileManager.style.width = "0px";
      leftBoxFileManager.style.transition = "all 0.4s cubic-bezier(0.68,-0.55,0.27,1.55)";
      leftBoxFileManager.style.opacity = "0";
  
      let rightBoxFileManager = document.getElementById("rightBoxFileManager");
      rightBoxFileManager.style.width = "100%";
  
      let showMenuBox = document.getElementById("showMenuBox");
      showMenuBox.style.width = "30px";
      showMenuBox.style.opacity = "1";
    };
  
    // ===== TOGGLE FULL SCREEN =====
    const toggleFullScreen = () => {
      setIsFullScreenAnimating(true);
  
      requestAnimationFrame(() => {
        if (!isFullScreen) {
          setSize({ width: window.innerWidth - 4, height: window.innerHeight - 120 });
          setPosition({ x: 2, y: 30 });
        } else {
          setSize(defaultSize);
          setPosition(defaultPosition);
        }
        setIsFullScreen(!isFullScreen);
      });
  
      setTimeout(() => setIsFullScreenAnimating(false), 400);
    };

    const openFileManagerAboutMe = () => {let fileManager = document.getElementById("fileManager");
      fileManager.style.transition = "all 0.4s cubic-bezier(0.68,-0.55,0.27,1.55)";
      // fileManager.style.top = "100px";
      fileManager.style.opacity = "1";
      fileManager.style.height = "600px";
    }


    //File Manager Box End Here



    // Resume Open Function
    const openResume = () => {
      let fileManagerOpenBox = document.getElementById('fileManagerOpenBox');
      fileManagerOpenBox.style.display = 'block';
      fileManagerOpenBox.style.opacity = '1';
      fileManagerOpenBox.style.transition = 'all 0.4s ease-in-out';
      
      // Close button functionality
      const closeButton = document.getElementById('closeOpenBoxBtn');
      closeButton.onclick = () => {
        fileManagerOpenBox.style.display = 'none';
        fileManagerOpenBox.style.opacity = '0';
      };
    }





    // Open Settings App

    const openSettingsApp = () =>{
      let settingsAppMainBoxVar = document.getElementById("settingsAppMainBox");
      settingsAppMainBoxVar.style.opacity = "1";
      settingsAppMainBoxVar.style.width = "300px";
      settingsAppMainBoxVar.style.height = "calc(90% - 100px)";
      settingsAppMainBoxVar.style.filter = "blur(0px)";
      settingsAppMainBoxVar.style.zIndex = "10000";
      // settingsAppMainBoxVar.style.transform = "skew(0deg)";


    }

    const closeSettingsApp = () =>{
      // console.log("close settings app");
      let settingsAppMainBoxVar = document.getElementById("settingsAppMainBox");
      settingsAppMainBoxVar.style.opacity = "0";
      settingsAppMainBoxVar.style.width = "10%";
      settingsAppMainBoxVar.style.height = "calc(50%)";
      settingsAppMainBoxVar.style.filter = "blur(100px)";
      settingsAppMainBoxVar.style.zIndex = "-1";
    }



    // Open Contacts App Method

    const openContactBox = () => {
      let contactMainBoxApp = document.getElementById("contactMainBox");
      contactMainBoxApp.style.width = "80%";
      contactMainBoxApp.style.height = "80%";
      contactMainBoxApp.style.zIndex = "100000";
      contactMainBoxApp.style.filter = "blur(0px)";
      contactMainBoxApp.style.opacity = "1";

    }
    const closeContactBtn = () => {
      let contactMainBoxApp = document.getElementById("contactMainBox");
      contactMainBoxApp.style.width = "10%";
      contactMainBoxApp.style.height = "10%";
      contactMainBoxApp.style.zIndex = "-1";
      contactMainBoxApp.style.filter = "blur(1000px)";
      contactMainBoxApp.style.opacity = "0";
    }




    // === SETTINGS APP DRAG + RESIZE LOGIC ===
const settingsRef = useRef(null);
const [settingsPosition, setSettingsPosition] = useState({ x: 100, y: 100 });
const [settingsSize, setSettingsSize] = useState({ width: 300, height: 400 });
const [isDraggingSettings, setIsDraggingSettings] = useState(false);
const [isResizingSettings, setIsResizingSettings] = useState(false);

// Drag logic for nav bar
const startDragSettings = (e) => {
  if (isResizingSettings) return;
  setIsDraggingSettings(true);

  const startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  const startY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
  const { x, y } = settingsPosition;

  const doDrag = (moveEvent) => {
    const currentX = moveEvent.type.includes("touch")
      ? moveEvent.touches[0].clientX
      : moveEvent.clientX;
    const currentY = moveEvent.type.includes("touch")
      ? moveEvent.touches[0].clientY
      : moveEvent.clientY;

    let newX = x + (currentX - startX);
    let newY = y + (currentY - startY);

    // Prevent going out of screen
    const maxX = window.innerWidth - settingsSize.width;
    const maxY = window.innerHeight - settingsSize.height;
    newX = Math.max(0, Math.min(maxX, newX));
    newY = Math.max(0, Math.min(maxY, newY));

    setSettingsPosition({ x: newX, y: newY });
  };

  const stopDrag = () => {
    setIsDraggingSettings(false);
    window.removeEventListener("mousemove", doDrag);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("touchmove", doDrag);
    window.removeEventListener("touchend", stopDrag);
  };

  window.addEventListener("mousemove", doDrag);
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("touchmove", doDrag);
  window.addEventListener("touchend", stopDrag);
};

// Resize logic for bottom-right corner
const startResizeSettings = (e) => {
  e.preventDefault();
  setIsResizingSettings(true);

  const startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  const startY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
  const { width, height } = settingsSize;

  const doResize = (moveEvent) => {
    const currentX = moveEvent.type.includes("touch")
      ? moveEvent.touches[0].clientX
      : moveEvent.clientX;
    const currentY = moveEvent.type.includes("touch")
      ? moveEvent.touches[0].clientY
      : moveEvent.clientY;

    let newWidth = width + (currentX - startX);
    let newHeight = height + (currentY - startY);

    setSettingsSize({
      width: Math.max(250, newWidth),
      height: Math.max(250, newHeight),
    });
  };

  const stopResize = () => {
    setIsResizingSettings(false);
    window.removeEventListener("mousemove", doResize);
    window.removeEventListener("mouseup", stopResize);
    window.removeEventListener("touchmove", doResize);
    window.removeEventListener("touchend", stopResize);
  };

  window.addEventListener("mousemove", doResize);
  window.addEventListener("mouseup", stopResize);
  window.addEventListener("touchmove", doResize);
  window.addEventListener("touchend", stopResize);
};






  return (
    <div className="Desktop-Icon">
      {iconData.map((icon, index) => (
        <div
          className="Icon-Box hover-target"
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(50);
            icon.onClick();
          }}
          key={index}
          ref={(el) => (iconBoxesRef.current[index] = el)}
        >
          <div className="Icon-Image">
            <div className="desk-icon-Box">
              <img src={icon.img} alt={icon.name} className="desk-icon-size" />
            </div>
            <div className="Icon-Name">{icon.name}</div>
          </div>
        </div>
      ))}

      {/* App Windows */}
      <AboutMeBox />
      <SpotifyBox
        SpotifyOpenCheck={spotifyMeOpenValue}
        setSpotifyOpenCheck={setSpotifyMeOpenValue}
      />
      <GallaryBox
        GallaryOpenCheck={gallaryOpenValue}
        setGallaryOpenCheck={setGallaryOpenValue}
      />

      {/* <FileManagerBox /> */}
      
      
      {/* <div className="game-window"> */}
  {/* <FlappyBirdGame /> */}
{/* </div> */}


        {/* Settigns App Box with good animations and SETTINGS APP BOX */}




      {/* <div id='settingsAppMainBox' className='settingsAppMainBox'>
        <div className='settingsAppNavBar'>
          <div className='settingsLeftNavBox'></div>
          <div className='closeSettingsApp' onClick={closeSettingsApp}>X</div>
        </div>
      </div> */}





          {/* Settings Box  */}


        <div
  id="settingsAppMainBox"
  ref={settingsRef}
  className="settingsAppMainBox"
  style={{
    opacity: "0",
    width: `${settingsSize.width}px`,
    height: `${settingsSize.height}px`,
    position: "absolute",
    left: `${settingsPosition.x}px`,
    top: `${settingsPosition.y}px`,
    transition: "opacity 0.3s ease",
    zIndex: "-1",
  }}
>
  <div
    className="settingsAppNavBar"
    onMouseDown={startDragSettings}
    onTouchStart={startDragSettings}
    style={{ cursor: "move" }}
  >
    <div className="settingsLeftNavBox"></div>
    <div className="closeSettingsApp" onClick={closeSettingsApp}>X</div>
  </div>

  <div className="settingsAppContent">
    {/* Your settings app content here */}
  </div>

  {/* Resize handle (bottom-right corner) */}
  <div
    className="resizeHandleSettings"
    onMouseDown={startResizeSettings}
    onTouchStart={startResizeSettings}
  />
</div>






{/* Contact Box  */}


<div className='contactAppMainBox' id='contactMainBox'>

  <div className='closeContactBoxBtn' onClick={closeContactBtn}>Close this Contact Box</div>
</div>











      {/* File Manager Box  */}
      <div
        id="fileManager"
        ref={boxRef}
        className="mainbox"
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          left: `${position.x}px`,
          top: `${position.y}px`,
          position: "absolute",
          transition: isFullScreenAnimating
            ? "all 0.4s cubic-bezier(0.05, 0.55, 0.28, 0.98)"
            : "none",
        }}
      >
        <div className="left-mainBox" id="leftBoxFileManager">
          <div className="hideMenuBox">
          <span className="hideMenu" onClick={hideMenu}>
            <img src="/assets/hide_menu_icon.png" alt="icon" />
          </span>
          </div>

          <div className="file_sideMenu_content">
            <div className="file_sideMenu_item">
              <div className='file_side_menu_items hover-target'>
                <img src='/assets/fvrt_icon_file.png' alt="icon" className='file_menu_item_icons'/>
                Favorites</div>
              <div className='file_side_menu_items hover-target'>
                <img src='/assets/recent_icon_file.png' alt="icon" className='file_menu_item_icons'/>
                Recents</div>
              <div className='sideMenuItemHeading'>Favorite</div>
              <div className='file_side_menu_items hover-target'>
                <img src='/assets/apps_icon_file.png' alt="icon" className='file_menu_item_icons'/>
              Applications</div>
              <div className='file_side_menu_items hover-target'>
                <img src='/assets/documents_icon_file.png' alt="icon" className='file_menu_item_icons'/>
              Documents</div>
              <div className='file_side_menu_items hover-target'>
                <img src='/assets/photos_icon_file.png' alt="icon" className='file_menu_item_icons'/>
              Images</div>
              <div className='sideMenuItemHeading'>Needed Things</div>
              <div className='file_side_menu_items hover-target'>
                <img src='/assets/projects_icon_file.png' alt="icon" className='file_menu_item_icons'/>
              Projects</div>
              </div>
            </div>


        </div>

        <div className="right-mainBox" id="rightBoxFileManager">
          <div className="taskBar">
            <div
              className="mid_taskBar"
              onMouseDown={startDrag}
              onTouchStart={startDrag}
            >
              <div className="mid_taskBar_content">
                <div id="showMenuBox" onClick={showMenu}>
                  <img src="/assets/show_menu_icon.png" alt="Show Menu" />
                </div>
                <div className="left_taskBox" onClick={toggleFullScreen}>
                  {isFullScreen ? (
                    <img src="/assets/exit_full_screen_icon.png" alt="Exit Full Screen" />
                  ) : (
                    <img src="/assets/full_screen.png" alt="Full Screen" />
                  )}
                </div>
                <div id='file_manager_heading'>Finder</div>
              </div>
            </div>
            <div className="right_taskBar">
              <span className="task_close" onClick={closeFileManager}>
                Close
              </span>
            </div>
          </div>
          <div className="file-manager-content">
            <div className="file-manager-header">
              <h2>Important Files</h2>
              <div id='file_manager_content'>

                <div className='file_manager_item_box hover-target' onclick={openResume}>
                  <div className='file_manager_item_icon' onclick={openResume}>
                    <img src='/assets/document_blank.png' alt="blank_doc"/>
                  </div>
                  <div className='file_manager_item_text'>
                    Resume.pdf
                  </div>
                </div>
                
                <div className='file_manager_item_box hover-target'>
                  <div className='file_manager_item_icon'>
                    <img src='/assets/document_blank.png' alt="blank_doc"/>
                  </div>
                  <div className='file_manager_item_text'>
                    Paper Presen.pdf
                  </div>
                </div>
                
                <div className='file_manager_item_box hover-target'>
                  <div className='file_manager_item_icon'>
                    <img src='/assets/document_blank.png' alt="blank_doc"/>
                  </div>
                  <div className='file_manager_item_text'>
                    Certificate2.pdf
                  </div>
                </div>
                
                <div className='file_manager_item_box hover-target'>
                  <div className='file_manager_item_icon'>
                    <img src='/assets/document_blank.png' alt="blank_doc"/>
                  </div>
                  <div className='file_manager_item_text'>
                    Resume.pdf
                  </div>
                </div>
                
                <div className='file_manager_item_box hover-target'>
                  <div className='file_manager_item_icon'>
                    <img src='/assets/document_blank.png' alt="blank_doc"/>
                  </div>
                  <div className='file_manager_item_text'>
                    Resume.pdf
                  </div>
                </div>
                
                <div className='file_manager_item_box hover-target'>
                  <div className='file_manager_item_icon'>
                    <img src='/assets/document_blank.png' alt="new_file"/>
                  </div>
                  <div className='file_manager_item_text'>
                    Resume.pdf
                  </div>
                </div>


              </div>
            </div>
            
          </div>
        </div>
        
        <div
          className="resize-handle"
          onMouseDown={startResize}
          onTouchStart={startResize}
        />
      </div>
      {/* <div className="resize-text">Resize by holding this corner</div> */}

      {/* File Manager Box End Here  */}


      <div id='fileManagerOpenBox'>
        <div className='openedBoxHeader'>
          <div id='headingOpenBox'>Important Files/Resume.pdf</div>
          <div id='closeOpenBoxBtn'>Close</div>
        </div>

        <div className='openBoxContent'>
        <div className='openBoxLeftSide'>
              <img src='/assets/Resume.jpg' alt="resume"/>
        </div>
        <div className='openBoxRightSide'>
          <div className='itemOpenBoxRight'>
            <div className='itemsOpenBox'>
              <img src='/assets/Resume.jpg' alt="resume" className='rightOpenBoxItemImage'/>
            </div>
          </div>
          </div>
          </div>
      </div>

    </div>
  );
};

export default DesktopAppBox;
