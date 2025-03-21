import React, { useState, useEffect } from 'react';
import { AlertCircle, ThumbsUp, Star, StarsIcon } from 'lucide-react';

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
  const [buttonAnimation, setButtonAnimation] = useState('');
  
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
      
      // Move to next round after delay
      setTimeout(() => {
        startNewRound();
      }, 1500);
    } else {
      // Incorrect answer
      setFeedback('incorrect');
      setShowHint(true);
    }
  };
  
  const startGame = (level) => {
    setButtonAnimation(level);
    
    // Short delay for button animation
    setTimeout(() => {
      setDifficulty(level);
      setGameMode('play');
      setScore(0);
      startNewRound();
      setButtonAnimation('');
    }, 300);
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
  
  // Render simple illustrations based on difficulty level
  const renderIllustration = (level) => {
    switch(level) {
      case 'easy':
        return (
          <div className="flex justify-center space-x-2 mb-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-md bg-green-400 flex items-center justify-center text-white font-bold text-lg"
                style={{
                  transform: `rotate(${(i-2)*5}deg)`,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                {i+1}
              </div>
            ))}
          </div>
        );
      case 'medium':
        return (
          <div className="flex justify-center flex-wrap gap-2 mb-2 max-w-xs">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold"
                style={{
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                {i+1}
              </div>
            ))}
          </div>
        );
      case 'hard':
        return (
          <div className="flex justify-center items-end space-x-1 mb-2 max-w-xs overflow-x-auto py-2">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-4 h-10 rounded-t-lg bg-red-400 flex items-end justify-center pb-1 text-white font-bold text-xs"
                style={{
                  height: `${Math.max(20, 10 + i*2)}px`,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                {i+1}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };
  
  // Render different game screens based on game mode
  const renderGameContent = () => {
    switch (gameMode) {
      case 'menu':
        return (
          <div className="flex flex-col items-center space-y-8">
            {/* Character */}
            <div className="relative w-40 h-40 mb-12">
              <div className="absolute w-36 h-36 bg-purple-300 rounded-full top-2 left-2"></div>
              <div className="absolute w-36 h-36 bg-purple-500 rounded-full"></div>
              <div className="absolute w-24 h-24 bg-white rounded-full top-6 left-6"></div>
              <div className="absolute w-4 h-4 bg-black rounded-full top-16 left-14"></div>
              <div className="absolute w-4 h-4 bg-black rounded-full top-16 left-22"></div>
              <div className="absolute w-12 h-6 bg-black rounded-full top-24 left-12 overflow-hidden">
                <div className="w-12 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-center text-purple-700" style={{fontFamily: 'Fredoka One, cursive'}}>
              Number Game
            </h1>
            
            <p className="text-xl md:text-2xl text-center text-purple-600 font-bold">
              Let's count and learn numbers!
            </p>
            
            <div className="flex flex-col space-y-8 w-full max-w-xs">
              <div className={`transform transition-all duration-300 ${buttonAnimation === 'easy' ? 'scale-95' : 'scale-100'}`}>
                {renderIllustration('easy')}
                <button
                  onClick={() => startGame('easy')}
                  className="w-full py-5 px-6 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  aria-label="Start easy game with numbers 1 to 5"
                  style={{fontFamily: 'Fredoka One, cursive'}}
                >
                  <div className="flex items-center justify-center">
                    <Star className="w-8 h-8 mr-2" fill="white" />
                    Easy (1-5)
                  </div>
                </button>
              </div>
              
              <div className={`transform transition-all duration-300 ${buttonAnimation === 'medium' ? 'scale-95' : 'scale-100'}`}>
                {renderIllustration('medium')}
                <button
                  onClick={() => startGame('medium')}
                  className="w-full py-5 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-2xl text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  aria-label="Start medium game with numbers 1 to 10"
                  style={{fontFamily: 'Fredoka One, cursive'}}
                >
                  <div className="flex items-center justify-center">
                    <StarsIcon className="w-8 h-8 mr-2" fill="white" />
                    Medium (1-10)
                  </div>
                </button>
              </div>
              
              <div className={`transform transition-all duration-300 ${buttonAnimation === 'hard' ? 'scale-95' : 'scale-100'}`}>
                {renderIllustration('hard')}
                <button
                  onClick={() => startGame('hard')}
                  className="w-full py-5 px-6 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-2xl text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  aria-label="Start hard game with numbers 1 to 20"
                  style={{fontFamily: 'Fredoka One, cursive'}}
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                      <path d="M12 4L10.38 8.79L6 9.18L9.2 12.24L8.16 17L12 14.54V4Z" fill="rgba(0,0,0,0.2)" />
                    </svg>
                    Hard (1-20)
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
        
     // In the renderGameContent function, update the 'play' case:

case 'play':
    return (
      <div className="flex flex-col items-center space-y-6">
        {/* Header with score and back button */}
        <div className="flex justify-between items-center w-full">
          <button
            onClick={() => setGameMode('menu')}
            className="px-5 py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-full focus:outline-none focus:ring-4 focus:ring-purple-300 font-bold shadow-lg transform hover:scale-105 transition-all"
            aria-label="Back to menu"
            style={{fontFamily: 'Fredoka One, cursive'}}
          >
            <span className="flex items-center">
              ← Back
            </span>
          </button>
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-full shadow-md text-xl font-bold" style={{fontFamily: 'Fredoka One, cursive'}}>
            Score: {score}
          </div>
        </div>
        
        {/* Character */}
        <div className="absolute top-14 left-6 w-20 h-20">
          <div className="relative">
            <div className="absolute w-18 h-18 bg-purple-300 rounded-full top-1 left-1"></div>
            <div className="absolute w-18 h-18 bg-purple-500 rounded-full"></div>
            <div className="absolute w-12 h-12 bg-white rounded-full top-3 left-3"></div>
            <div className="absolute w-2 h-2 bg-black rounded-full top-8 left-7"></div>
            <div className="absolute w-2 h-2 bg-black rounded-full top-8 left-11"></div>
            <div className="absolute w-6 h-3 bg-black rounded-full top-12 left-6 overflow-hidden">
              <div className="w-6 h-1.5 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Target number section */}
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-purple-600 mb-2" style={{fontFamily: 'Fredoka One, cursive'}}>
            Find this number:
          </h2>
          <div 
            className={`text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 
              ${animation === 'celebrate' ? 'animate-bounce' : 'animate-pulse'}`} 
            aria-live="polite"
            style={{
              fontFamily: 'Fredoka One, cursive',
              textShadow: '4px 4px 8px rgba(147, 51, 234, 0.3)'
            }}
          >
            {currentNumber}
          </div>
        </div>
        
        {/* Dots hint */}
        {showHint && (
          <div className="flex flex-wrap justify-center gap-3 max-w-xs" aria-label={`${currentNumber} dots`}>
            {[...Array(currentNumber)].map((_, i) => (
              <div 
                key={i} 
                className="w-6 h-6 md:w-8 md:h-8 rounded-full transition-all animate-bounce"
                style={{
                  backgroundColor: `hsl(${(i * 25) % 360}, 80%, 60%)`,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  animationDelay: `${i * 0.1}s`
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
        
        {/* Number options */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          {options.map((number, index) => {
            // Different colors for each button
            const colors = [
              'from-green-400 to-green-600',
              'from-blue-400 to-blue-600',
              'from-yellow-400 to-yellow-600',
              'from-red-400 to-red-600'
            ];
            
            return (
              <button
                key={number}
                onClick={() => handleOptionClick(number)}
                className={`
                  w-28 h-28 md:w-32 md:h-32 text-6xl font-bold rounded-2xl 
                  focus:outline-none focus:ring-4 focus:ring-blue-300
                  shadow-xl transform transition-all duration-200 hover:scale-105
                  ${feedback === 'correct' && number === currentNumber ? 
                    'bg-gradient-to-r from-green-400 to-green-600 text-white animate-bounce' : 
                    feedback === 'incorrect' && number === currentNumber ? 
                    'bg-yellow-200 border-4 border-yellow-400 animate-pulse' : 
                    `bg-gradient-to-r ${colors[index]} text-white`}
                `}
                disabled={feedback === 'correct'}
                aria-label={`${number}`}
                style={{fontFamily: 'Fredoka One, cursive'}}
              >
                {number}
              </button>
            );
          })}
        </div>
        
        {/* Feedback section */}
        {feedback && (
          <div 
            className={`flex items-center space-x-3 text-2xl font-bold p-4 rounded-xl ${
              feedback === 'correct' ? 
              'bg-green-100 text-green-600 animate-pulse' : 
              'bg-yellow-100 text-orange-600'
            }`}
            aria-live="assertive"
            style={{fontFamily: 'Fredoka One, cursive'}}
          >
            {feedback === 'correct' ? (
              <>
                <ThumbsUp size={32} className="text-green-500" />
                <span>Great job!</span>
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `fall ${1 + Math.random() * 3}s linear forwards`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={32} className="text-orange-500" />
                <span>Try again!</span>
              </>
            )}
          </div>
        )}
      </div>
    );
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-between items-center w-full">
              <button
                onClick={() => setGameMode('menu')}
                className="px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold"
                aria-label="Back to menu"
                style={{fontFamily: 'Fredoka One, cursive'}}
              >
                Back
              </button>
              <div className="text-xl font-bold text-purple-700" style={{fontFamily: 'Fredoka One, cursive'}}>
                Score: {score}
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-purple-600 mb-2" style={{fontFamily: 'Fredoka One, cursive'}}>Find this number:</h2>
              <div 
                className={`text-9xl font-bold text-purple-700 ${animation === 'celebrate' ? 'animate-bounce' : ''}`} 
                aria-live="polite"
                style={{
                  fontFamily: 'Fredoka One, cursive',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {currentNumber}
              </div>
            </div>
            
            {showHint && (
              <div className="flex flex-wrap justify-center gap-2 max-w-xs" aria-label={`${currentNumber} dots`}>
                {renderDots(currentNumber)}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              {options.map((number) => (
                <button
                  key={number}
                  onClick={() => handleOptionClick(number)}
                  className={`
                    w-24 h-24 md:w-28 md:h-28 text-5xl md:text-6xl font-bold rounded-2xl 
                    focus:outline-none focus:ring-4 focus:ring-blue-300
                    shadow-lg transform transition-all duration-200 hover:scale-105
                    ${feedback === 'correct' && number === currentNumber ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' : ''}
                    ${feedback === 'incorrect' && number === currentNumber ? 'bg-yellow-200 border-2 border-yellow-400' : ''}
                    ${!feedback || (feedback === 'incorrect' && number !== currentNumber) ? 'bg-white border-4 border-gray-300 hover:border-blue-400' : ''}
                  `}
                  disabled={feedback === 'correct'}
                  aria-label={`${number}`}
                  style={{fontFamily: 'Fredoka One, cursive'}}
                >
                  {number}
                </button>
              ))}
            </div>
            
            {feedback && (
              <div 
                className={`flex items-center space-x-2 text-2xl font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}
                aria-live="assertive"
                style={{fontFamily: 'Fredoka One, cursive'}}
              >
                {feedback === 'correct' ? (
                  <>
                    <ThumbsUp size={28} />
                    <span>Great job!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={28} />
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
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-purple-200 p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-6">
        {renderGameContent()}
      </div>
    </div>
  );
};

export default NumberGame;
