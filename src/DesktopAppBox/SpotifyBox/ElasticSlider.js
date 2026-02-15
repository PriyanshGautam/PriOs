import { useEffect, useRef, useState } from "react";
import "./ElasticSlider.css";

const MAX_OVERFLOW = 50;

export default function ElasticSlider({
  defaultValue = 50,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
}) {
  return (
    <div className={`slider-container ${className}`}>
      <Slider
        defaultValue={defaultValue}
        startingValue={startingValue}
        maxValue={maxValue}
        isStepped={isStepped}
        stepSize={stepSize}
      />
    </div>
  );
}

function Slider({
  defaultValue,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
}) {
  const [value, setValue] = useState(defaultValue);
  const sliderRef = useRef(null);
  const [region, setRegion] = useState("middle");
  const [overflow, setOverflow] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handlePointerMove = (e) => {
    if (e.buttons > 0 && sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let newValue =
        startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);

      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }

      newValue = Math.min(Math.max(newValue, startingValue), maxValue);
      setValue(newValue);

      if (e.clientX < left) {
        setRegion("left");
        setOverflow(decay(left - e.clientX, MAX_OVERFLOW));
      } else if (e.clientX > left + width) {
        setRegion("right");
        setOverflow(decay(e.clientX - (left + width), MAX_OVERFLOW));
      } else {
        setRegion("middle");
        setOverflow(0);
      }
    }
  };

  const handlePointerDown = (e) => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    setScale(1.2);
  };

  const handlePointerUp = () => {
    setOverflow(0);
    setScale(1);
  };

  const getRangePercentage = () => {
    const totalRange = maxValue - startingValue;
    if (totalRange === 0) return 0;
    return ((value - startingValue) / totalRange) * 100;
  };

  return (
    <>
      <div
        className="slider-wrapper"
        style={{
          transform: `scale(${scale})`,
          opacity: scale > 1 ? 1 : 0.9,
          transition: "transform 0.2s ease, opacity 0.2s ease",
        }}
        onMouseEnter={() => setScale(1.2)}
        onMouseLeave={() => setScale(1)}
        onTouchStart={() => setScale(1.2)}
        onTouchEnd={() => setScale(1)}
      >
        {/* Left Icon */}
        <div
          className="slider-icon"
          style={{
            transform:
              region === "left"
                ? `translateX(${-overflow}px) scale(1.2)`
                : "scale(1)",
            transition: "transform 0.2s ease",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3z"></path>
          </svg>
        </div>

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className="slider-root"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <div
            className="slider-track-wrapper"
            style={{
              transform: `scaleX(${1 + overflow / 100}) scaleY(${
                1 - overflow / 300
              })`,
              transformOrigin:
                region === "left"
                  ? "right"
                  : region === "right"
                  ? "left"
                  : "center",
              transition: "transform 0.2s ease",
            }}
          >
            <div className="slider-track">
              <div
                className="slider-range"
                style={{ width: `${getRangePercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Icon */}
        <div
          className="slider-icon"
          style={{
            transform:
              region === "right"
                ? `translateX(${overflow}px) scale(1.2)`
                : "scale(1)",
            transition: "transform 0.2s ease",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z"></path>
          </svg>
        </div>
      </div>

      <p className="value-indicator">{Math.round(value)}</p>
    </>
  );
}

function decay(value, max) {
  if (max === 0) return 0;
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}
