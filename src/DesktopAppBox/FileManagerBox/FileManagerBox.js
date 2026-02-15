import React, { useRef, useState } from "react";
import "./FileManagerBox.css";

export default function FileManagerBox() {
  const boxRef = useRef(null);

  // Default size & position
  const defaultSize = { width: 430, height: 600 };
  const defaultPosition = { x: 20, y: 60 };

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
    fileManager.style.top = "100px";
    fileManager.style.opacity = "0";
    fileManager.style.height = "0px";
  };



  // ===== SHOW MENU FUNCTION =====
  const showMenu = () => {
    let leftBoxFileManager = document.getElementById("leftBoxFileManager");
    leftBoxFileManager.style.width = "150px";

    let rightBoxFileManager = document.getElementById("rightBoxFileManager");
    rightBoxFileManager.style.width = "calc(100% - 150px)";

    let showMenuBox = document.getElementById("showMenuBox");
    showMenuBox.style.width = "0px";
  };

  const hideMenu = () => {
    let leftBoxFileManager = document.getElementById("leftBoxFileManager");
    leftBoxFileManager.style.width = "0px";

    let rightBoxFileManager = document.getElementById("rightBoxFileManager");
    rightBoxFileManager.style.width = "100%";

    let showMenuBox = document.getElementById("showMenuBox");
    showMenuBox.style.width = "30px";
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

  return (
    <div>
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
            <img src="/assets/hide_menu_icon.png" alt="hide_menu" />
          </span>
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
                Finder
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
              Important Files
            </div>
          </div>
        </div>
        <div
          className="resize-handle"
          onMouseDown={startResize}
          onTouchStart={startResize}
        />
      </div>
      <div className="resize-text">Resize by holding this corner</div>
    </div>
  );
}
