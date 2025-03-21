import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, ThumbsUp, Volume2 } from 'lucide-react';

const NumberGame = () => {
  // Game states
  const [gameMode, setGameMode] = useState('menu'); // 'menu', 'play', 'celebration'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  const [currentNumber, setCurrentNumber] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [animation, setAnimation] = useState('');
  
  // Audio elements
  const correctSound = useRef(null);
  const incorrectSound = useRef(null);
  const numberSound = useRef(null);
  
  // Helper functions for creating game content
  const getNumberRange = () => {
    switch(difficulty) {
      case 'easy': return { min: 1, max: 5 };
      case 'medium': return { min: 1, max: 10 };
      case 'hard': return { min: 1, max: 20 };
      default: return { min: 1, max: 5 };
    }
  };
  
  const generateOptions = (correctAnswer, count = 4) => {
    const { min, max } = getNumberRange();
    const options = [correctAnswer];
    
    while (options.length < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!options.includes(num)) {
        options.push(num);
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };
  
  const startNewRound = () => {
    const { min, max } = getNumberRange();
    const newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setCurrentNumber(newNumber);
    setOptions(generateOptions(newNumber));
    setFeedback(null);
    setShowHint(false);
    setAnimation('');
  };
  
  const handleOptionClick = (selectedNumber) => {
    if (selectedNumber === currentNumber) {
      // Correct answer
      setFeedback('correct');
      setScore(score + 1);
      setAnimation('celebrate');
      
      // Play correct sound
      if (correctSound.current) {
        correctSound.current.currentTime = 0;
        correctSound.current.play();
      }
      
      // Move to next round after delay
      setTimeout(() => {
        startNewRound();
      }, 1500);
    } else {
      // Incorrect answer
      setFeedback('incorrect');
      setShowHint(true);
      
      // Play incorrect sound
      if (incorrectSound.current) {
        incorrectSound.current.currentTime = 0;
        incorrectSound.current.play();
      }
    }
  };
  
  const handlePlayNumber = () => {
    if (numberSound.current) {
      numberSound.current.currentTime = 0;
      numberSound.current.play();
    }
  };
  
  const startGame = (level) => {
    setDifficulty(level);
    setGameMode('play');
    setScore(0);
    startNewRound();
  };
  
  // Setup game when difficulty changes
  useEffect(() => {
    if (gameMode === 'play') {
      startNewRound();
    }
  }, [difficulty]);
  
  // Generate dots for number visualization
  const renderDots = (number) => {
    const dots = [];
    for (let i = 0; i < number; i++) {
      dots.push(
        <div 
          key={i} 
          className="w-4 h-4 md:w-6 md:h-6 bg-blue-500 rounded-full"
          aria-hidden="true"
        />
      );
    }
    return dots;
  };
  
  // Render different game screens based on game mode
  const renderGameContent = () => {
    switch (gameMode) {
      case 'menu':
        return (
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-700">
              Number Game
            </h1>
            <p className="text-lg md:text-xl text-center">
              Help your toddler learn numbers 1-20 with this fun game!
            </p>
            <div className="flex flex-col space-y-4 w-full max-w-xs">
              <button
                onClick={() => startGame('easy')}
                className="py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xl font-bold focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors"
                aria-label="Start easy game with numbers 1 to 5"
              >
                Easy (1-5)
              </button>
              <button
                onClick={() => startGame('medium')}
                className="py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xl font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-colors"
                aria-label="Start medium game with numbers 1 to 10"
              >
                Medium (1-10)
              </button>
              <button
                onClick={() => startGame('hard')}
                className="py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xl font-bold focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors"
                aria-label="Start hard game with numbers 1 to 20"
              >
                Hard (1-20)
              </button>
            </div>
          </div>
        );
        
      case 'play':
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-between items-center w-full">
              <button
                onClick={() => setGameMode('menu')}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Back to menu"
              >
                Back
              </button>
              <div className="text-lg font-bold">
                Score: {score}
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Find this number:</h2>
              <div className={`text-8xl font-bold ${animation === 'celebrate' ? 'animate-bounce' : ''}`} aria-live="polite">
                {currentNumber}
              </div>
              <button 
                onClick={handlePlayNumber}
                className="mt-2 flex items-center justify-center p-2 bg-purple-100 hover:bg-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
                aria-label={`Hear the number ${currentNumber}`}
              >
                <Volume2 className="text-purple-700" size={24} />
              </button>
            </div>
            
            {showHint && (
              <div className="flex flex-wrap justify-center gap-2 max-w-xs" aria-label={`${currentNumber} dots`}>
                {renderDots(currentNumber)}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {options.map((number) => (
                <button
                  key={number}
                  onClick={() => handleOptionClick(number)}
                  className={`
                    w-20 h-20 md:w-24 md:h-24 text-4xl md:text-5xl font-bold rounded-xl 
                    focus:outline-none focus:ring-4 focus:ring-blue-300
                    ${feedback === 'correct' && number === currentNumber ? 'bg-green-500 text-white' : ''}
                    ${feedback === 'incorrect' && number === currentNumber ? 'bg-yellow-200' : ''}
                    ${!feedback || (feedback === 'incorrect' && number !== currentNumber) ? 'bg-white border-2 border-gray-300 hover:bg-gray-100' : ''}
                  `}
                  disabled={feedback === 'correct'}
                  aria-label={`${number}`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            {feedback && (
              <div 
                className={`flex items-center space-x-2 text-lg font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}
                aria-live="assertive"
              >
                {feedback === 'correct' ? (
                  <>
                    <ThumbsUp size={24} />
                    <span>Great job!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={24} />
                    <span>Try again!</span>
                  </>
                )}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        {renderGameContent()}
        
        {/* Hidden audio elements */}
        <audio ref={correctSound} src="https://cdn.freesound.org/previews/521/521642_5304293-lq.mp3" preload="auto" aria-hidden="true" />
        <audio ref={incorrectSound} src="https://cdn.freesound.org/previews/362/362204_6629250-lq.mp3" preload="auto" aria-hidden="true" />
        <audio 
          ref={numberSound} 
          src={`https://ssl.gstatic.com/dictionary/static/sounds/oxford/${currentNumber}--_us_1.mp3`} 
          preload="auto" 
          aria-hidden="true" 
        />
      </div>
    </div>
  );
};

export default NumberGame;