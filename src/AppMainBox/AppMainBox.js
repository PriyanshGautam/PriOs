import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./AppMainBox.css";
// import {clickSound} from "../Sound";


function AppMainBox() {
  var handleClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10); // You can change duration or add pattern like [50, 30, 50]
    }
    console.log("Button clicked");
  };



  useGSAP(() => {
    gsap.from(".app-main-box", {
      height: "0px",
      duration: 1,
      ease: "power2.out",
      delay: 0.3,
    });
  }, []);

  return (
    <div className="app-container">
      {/* <div className='app-box'> */}
      <div className="app-main-box"></div>
      <div className="app-bottom-box">
        <div className="left-Button-Box">
          <div
            className="open-btn app-btn"
            onClick={() => {
              handleClick();
              gsap.to(".app-main-box", {
                height: "80%",
                duration: 0.6,
                ease: "back.out",
              });
            }}
          >
            <span onClick={handleClick}>I</span>
          </div>
          <div
            className="close-btn app-btn"
            onClick={() => {
              handleClick();
              gsap.to(".app-main-box", {
                height: "0px",
                duration: 0.6,
                ease: "expo.out",
              });
            }}
          >
            <span className="close-text" onClick={handleClick}>
              O
            </span>
          </div>
        </div>
        <div className="right-Button-Box"> </div>
      </div>
      {/* </div> */}
    </div>
  );
}

export default AppMainBox;
