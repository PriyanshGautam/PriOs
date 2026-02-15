import React, { useState, useEffect, useRef } from 'react';

const GRAVITY = 2;
const JUMP_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const BIRD_SIZE = 40;

export default function FlappyBirdGame() {
  const [birdPosition, setBirdPosition] = useState(200);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [pipeLeft, setPipeLeft] = useState(500);
  const [pipeHeight, setPipeHeight] = useState(200);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameLoopRef = useRef(null);

  // Gravity effect
  useEffect(() => {
    if (gameHasStarted && birdPosition < 480) {
      gameLoopRef.current = setInterval(() => {
        setBirdPosition((pos) => pos + GRAVITY);
      }, 24);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [gameHasStarted, birdPosition]);

  // Move pipes
  useEffect(() => {
    if (gameHasStarted && pipeLeft > -PIPE_WIDTH) {
      const pipeInterval = setInterval(() => {
        setPipeLeft((left) => left - 5);
      }, 24);
      return () => clearInterval(pipeInterval);
    } else if (gameHasStarted) {
      setPipeLeft(500);
      setPipeHeight(Math.floor(Math.random() * 250) + 100);
      setScore((score) => score + 1);
    }
  }, [gameHasStarted, pipeLeft]);

  // Collision detection
  useEffect(() => {
    const birdTop = birdPosition;
    const birdBottom = birdPosition + BIRD_SIZE;
    const pipeTop = pipeHeight;
    const pipeBottom = pipeHeight + PIPE_GAP;

    if (
      pipeLeft < 50 + BIRD_SIZE &&
      pipeLeft + PIPE_WIDTH > 50 &&
      (birdTop < pipeTop || birdBottom > pipeBottom)
    ) {
      clearInterval(gameLoopRef.current);
      setIsGameOver(true);
      setGameHasStarted(false);
      new Audio('/assets/gameover.mp3').play();
    }
  }, [birdPosition, pipeLeft]);

  const handleJump = () => {
    if (!gameHasStarted) return;
    new Audio('/assets/jump.mp3').play();
    const newPosition = birdPosition - JUMP_HEIGHT;
    setBirdPosition(newPosition < 0 ? 0 : newPosition);
  };

  const startGame = () => {
    setBirdPosition(200);
    setPipeLeft(500);
    setPipeHeight(200);
    setScore(0);
    setIsGameOver(false);
    setGameHasStarted(true);
  };

  return (
    <div
      onClick={handleJump}
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to bottom, #70c5ce, #ffffff)',
        overflow: 'hidden',
        position: 'relative',
        cursor: gameHasStarted ? 'pointer' : 'default',
      }}
    >
      {/* Bird */}
      {gameHasStarted && !isGameOver && (
        <img
          src="/assets/bird.png"
          alt="bird"
          style={{
            position: 'absolute',
            left: '50px',
            top: birdPosition,
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            transition: 'top 0.1s',
          }}
        />
      )}

      {/* Pipes */}
      {gameHasStarted && !isGameOver && (
        <>
          <img
            src="/assets/pipe-top.png"
            alt="pipe-top"
            style={{
              position: 'absolute',
              top: 0,
              left: pipeLeft,
              width: PIPE_WIDTH,
              height: pipeHeight,
            }}
          />
          <img
            src="/assets/pipe-bottom.png"
            alt="pipe-bottom"
            style={{
              position: 'absolute',
              top: pipeHeight + PIPE_GAP,
              left: pipeLeft,
              width: PIPE_WIDTH,
              height: 500 - pipeHeight - PIPE_GAP,
            }}
          />
        </>
      )}

      {/* Score Display */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'rgba(0, 0, 0, 0.5)',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        Score: {score}
      </div>

      {/* Game Over Message */}
      {isGameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '36px',
            fontWeight: 'bold',
            background: 'rgba(255, 0, 0, 0.8)',
            color: '#fff',
            padding: '20px 40px',
            borderRadius: '20px',
            textAlign: 'center',
          }}
        >
          💀 Game Over
          <br />
          Tap Play to Retry
        </div>
      )}

      {/* Center Logo and Play Button (only if not playing) */}
      {!gameHasStarted && (
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <img
            src="/assets/flappy_logo.png"
            alt="Flappy Logo"
            style={{ width: '220px', marginBottom: '20px' }}
          />
          <img
            src="/assets/play_button.png"
            alt="Play"
            style={{
              width: '90px',
              cursor: 'pointer',
              filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))',
              transition: 'transform 0.3s ease',
            }}
            onClick={startGame}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      )}
    </div>
  );
}
