import React, { useState, useEffect, useCallback } from 'react';
import './JackhammerGame.css';

const JackhammerGame = () => {
  const [clicks, setClicks] = useState(0);
  const [jackhammer, setJackhammer] = useState({ strength: 0 });
  const [bricksBroken, setBricksBroken] = useState(0);
  const [gameState, setGameState] = useState('ready');
  const [timeLeft, setTimeLeft] = useState(5);

  const CLICK_DURATION = 5; // seconds
  const POWER_MULTIPLIER = 2;
  const BRICK_STRENGTH = 3;
  const TOTAL_BRICKS = 50; // Increased number of bricks
  const BRICKS_PER_ROW = 10;

  const handleClick = useCallback(() => {
    if (gameState === 'clicking') {
      setClicks(prevClicks => prevClicks + 1);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('clicking');
    setClicks(0);
    setJackhammer({ strength: 0 });
    setBricksBroken(0);
    setTimeLeft(CLICK_DURATION);
  };

  useEffect(() => {
    let timer;
    if (gameState === 'clicking') {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameState('breaking');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'breaking') {
      const strength = clicks * POWER_MULTIPLIER;
      setJackhammer({ strength });
      const broken = Math.min(Math.floor(strength / BRICK_STRENGTH), TOTAL_BRICKS);
      setBricksBroken(broken);
    }
  }, [gameState, clicks]);

  const renderBricks = () => {
    return Array(TOTAL_BRICKS).fill().map((_, index) => (
      <div 
        key={index} 
        className={`brick ${index < bricksBroken ? 'broken' : ''}`}
        style={{
          width: `${100 / BRICKS_PER_ROW}%`,
          height: `${100 / (TOTAL_BRICKS / BRICKS_PER_ROW)}%`
        }}
      />
    ));
  };

  return (
    <div className="game-container">
      <h1>Jackhammer Clicking Game</h1>
      <div className="game-area">
        <div className={`jackhammer ${gameState === 'breaking' ? 'hammering' : ''}`} onClick={handleClick}>
          🔨
        </div>
        <div className="wall">{renderBricks()}</div>
        {gameState === 'ready' && (
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        )}
        {gameState === 'clicking' && (
          <div className="timer">Time left: {timeLeft} seconds</div>
        )}
        {gameState === 'breaking' && (
          <button onClick={startGame} className="restart-button">
            Play Again
          </button>
        )}
      </div>
      <div className="stats">
        <div className="stat">Clicks: {clicks}</div>
        <div className="stat">Jack Hammer Strength: {jackhammer.strength}</div>
        <div className="stat">Bricks broken: {bricksBroken}</div>
      </div>
    </div>
  );
};

export default JackhammerGame;