import React, { useState, useEffect } from 'react';

// Heroicons components (using outline versions)
const RotateCcwIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8.002 8.002 0 0115.356 2M15 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m18-4a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v4z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Type definitions
type HelpType = 'revive1' | 'revive2' | 'airplane';
type HelpStatus = 'disabled' | 'available' | 'used';

interface HelpIconProps {
  type: HelpType;
  status: HelpStatus;
}

interface HeaderProps {
  remainingContestants: number;
  totalContestants: number;
  helpItems: Array<{ type: HelpType; status: HelpStatus }>;
}

interface QuestionCounterProps {
  currentQuestion: number;
  totalQuestions: number;
}

interface DisplayScreenProps {
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
}

interface MatchHeaderProps {
  remainingContestants: number;
  totalContestants: number;
  currentQuestion?: number;
  totalQuestions?: number;
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  helpItems?: Array<{ type: HelpType; status: HelpStatus }>;
}

// Enhanced Help Icon component with responsive design
const HelpIcon: React.FC<HelpIconProps> = ({ type, status }) => {
  const getIcon = () => {
    switch (type) {
      case 'revive1':
        return <RotateCcwIcon />;
      case 'revive2':
        return <RotateCcwIcon />;
      case 'airplane':
        return <SendIcon />;
      default:
        return <XIcon />;
    }
  };

  const getStatusStyles = (): string => {
    switch (status) {
      case 'disabled':
        return 'opacity-40 grayscale';
      case 'available':
        return 'text-green-400 hover:scale-110 transition-transform duration-200 cursor-pointer';
      case 'used':
        return 'opacity-40 line-through';
      default:
        return '';
    }
  };

  const getTooltipText = (): string => {
    const typeName = type === 'revive1' ? 'Revive 1' : 
                     type === 'revive2' ? 'Revive 2' : 
                     type === 'airplane' ? 'Airplane' : type;
    
    const statusText = status === 'disabled' ? 'Not Available Yet' :
                       status === 'available' ? 'Available' :
                       status === 'used' ? 'Already Used' : status;
    
    return `${typeName}: ${statusText}`;
  };

  return (
    <div className="relative group mx-0.5 sm:mx-1">
      <div className={`p-1 sm:p-1.5 rounded-full bg-blue-700 ${getStatusStyles()}`} title={getTooltipText()}>
        {getIcon()}
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-blue-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
        {getTooltipText()}
      </div>
    </div>
  );
};

// Responsive Header Component with contestant count and help icons
const Header: React.FC<HeaderProps> = ({ remainingContestants, totalContestants, helpItems }) => {
  const contestantPercentage = (remainingContestants / totalContestants) * 100;
  
  const getContestantStyles = (): string => {
    if (remainingContestants <= 5) {
      return 'text-red-500 animate-pulse font-extrabold';
    }
    if (remainingContestants <= 10 || contestantPercentage <= 33.33) {
      return 'text-red-500 font-bold';
    }
    if (contestantPercentage <= 50) {
      return 'text-yellow-400';
    }
    return 'text-black';
  };

  const [animate, setAnimate] = useState<boolean>(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [remainingContestants]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between bg-white px-2 sm:px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg min-w-0">
      {/* Contestant count - responsive sizing */}
      <div className={`font-bold transition-all duration-300 ${getContestantStyles()} mb-1 sm:mb-0`}>
        <span className={`text-lg sm:text-xl ml-1 ${animate ? 'scale-125 inline-block transition-transform' : ''}`}>
          {remainingContestants}
        </span>
        <span className="text-sm sm:text-md text-blue-200">/{totalContestants}</span>
      </div>
      
      {/* Help Icons - responsive spacing and layout */}
      <div className="flex items-center justify-center sm:ml-3">
        {helpItems.map((item, index) => (
          <HelpIcon key={index} type={item.type} status={item.status} />
        ))}
      </div>
    </div>
  );
};

// Responsive Question Counter Component
const QuestionCounter: React.FC<QuestionCounterProps> = ({ currentQuestion, totalQuestions }) => {
  return (
    <div className="bg-white px-2 sm:px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg min-w-0">
      <div className="font-bold text-blue-900 text-center sm:text-left">
        <span className="text-sm sm:text-base">Câu:</span>
        <span className="text-lg sm:text-xl ml-1">{currentQuestion}</span>
        <span className="text-sm sm:text-md text-blue-200">/{totalQuestions}</span>
      </div>
    </div>
  );
};

// Responsive DisplayScreen with animation countdown
const DisplayScreen: React.FC<DisplayScreenProps> = ({ timeRemaining, setTimeRemaining }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setTimeRemaining]);

  const getTimerColor = () => {
    if (timeRemaining <= 5) return 'text-red-500 animate-pulse';
    if (timeRemaining <= 10) return 'text-orange-500';
    return 'text-black';
  };

  return (
    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 transition-all duration-300 bg-white shadow-md border-blue-400 mx-2 sm:mx-4">
      <div className={`text-sm sm:text-lg font-mono font-bold ${getTimerColor()}`}>
        {timeRemaining}s
      </div>
    </div>
  );
};

// Main responsive MatchHeader Component
const MatchHeaderComponent: React.FC<MatchHeaderProps> = ({ 
  remainingContestants, 
  totalContestants, 
  currentQuestion = 1,
  totalQuestions = 13,
  timeRemaining,
  setTimeRemaining,
  helpItems = [
    { type: 'revive1', status: 'available' },
    { type: 'revive2', status: 'used' },
    { type: 'airplane', status: 'disabled' }
  ]
}) => {
  return (
    <div className="mx-auto bg-gradient-to-r from-blue-900 to-blue-800 px-2 sm:px-4 py-2 sm:py-3 rounded-xl shadow-xl border border-blue-700">
      {/* Mobile Layout (stacked) */}
      <div className="flex flex-col sm:hidden space-y-2">
        {/* Top row: Question counter and timer */}
        <div className="flex justify-center items-center space-x-4">
          <div className="flex-1 max-w-xs">
            <QuestionCounter 
              currentQuestion={currentQuestion}
              totalQuestions={totalQuestions}
            />
          </div>
          <DisplayScreen timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining}/>
        </div>
        
        {/* Bottom row: Contestants and help items */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <Header 
              remainingContestants={remainingContestants}
              totalContestants={totalContestants}
              helpItems={helpItems}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout (horizontal) */}
      <div className="hidden sm:flex justify-between items-center">
        <div className="flex-1 flex justify-start min-w-0">
          <QuestionCounter 
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
          />
        </div>
        <div className="flex-shrink-0">
          <DisplayScreen timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining}/>
        </div>
        <div className="flex-1 flex justify-end min-w-0">
          <Header 
            remainingContestants={remainingContestants}
            totalContestants={totalContestants}
            helpItems={helpItems}
          />
        </div>
      </div>
    </div>
  );
};

// Demo component with responsive container
const MatchHeader: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(25);
  const [remainingContestants, setRemainingContestants] = useState<number>(45);
  const [currentQuestion, setCurrentQuestion] = useState<number>(5);

  const totalContestants = 100;
  const totalQuestions = 13;

  // Fake contestant elimination simulation
  useEffect(() => {
    const eliminationInterval = setInterval(() => {
      if (Math.random() < 0.3 && remainingContestants > 1) {
        setRemainingContestants(prev => Math.max(1, prev - Math.floor(Math.random() * 3) - 1));
      }
    }, 5000);

    return () => clearInterval(eliminationInterval);
  }, [remainingContestants]);

  // Fake question progression
  useEffect(() => {
    if (timeRemaining === 30) {
      setCurrentQuestion(prev => prev < totalQuestions ? prev + 1 : 1);
    }
  }, [timeRemaining, totalQuestions]);

  return (
        <MatchHeaderComponent
          remainingContestants={remainingContestants}
          totalContestants={totalContestants}
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
          timeRemaining={timeRemaining}
          setTimeRemaining={setTimeRemaining}
        />       
  );
};

export default MatchHeader;