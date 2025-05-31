// components/QuestionDisplay/index.tsx
import React, { useState } from "react";
import type { QuestionData } from '../../types/question.types';
import { fakeQuestionData } from '../../data/mockData';
import { createQuestionByType } from "../../utils/questionHelper";
import QuestionInfo from './QuestionInfo';
import QuestionContent from './QuestionContent';
import AnswerDisplay from './AnswerDisplay';
// import DemoControls from './DemoControl';

const QuestionDisplay: React.FC = () => {
  const [contentVisible, setContentVisible] = useState<boolean>(true);
  const [answerVisible, setAnswerVisible] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>(fakeQuestionData);

  // Demo controls - ẩn sẽ báo warning
  const toggleQuestion = () => {
    setContentVisible(prev => !prev);
  };

  const toggleAnswer = () => {
    setAnswerVisible(prev => !prev);
  };

  const switchQuestionType = (type: QuestionData['type']) => {
    const newQuestion = createQuestionByType(type);
    setCurrentQuestion(newQuestion);
    setAnswerVisible(false);
  };

  return (
    <div className="max-w mx-auto bg-gray-100 min-h-screen p-4">
      {/* Demo Controls */}
      {/* <DemoControls
        contentVisible={contentVisible}
        answerVisible={answerVisible}
        onToggleQuestion={toggleQuestion}
        onToggleAnswer={toggleAnswer}
        onSwitchQuestionType={switchQuestionType}
      /> */}

      {/* Question Display */}
      <QuestionInfo 
        questionNumber={currentQuestion.questionNumber}
        phase={currentQuestion.phase}
        topic={currentQuestion.topic}
        type={currentQuestion.type}
      />
      
      <QuestionContent 
        content={currentQuestion.content}
        type={currentQuestion.type}
        mediaUrl={currentQuestion.mediaUrl}
        options={currentQuestion.options}
        isVisible={contentVisible}
      />
      
      <AnswerDisplay 
        answer={currentQuestion.correctAnswer} 
        isVisible={answerVisible} 
      />
    </div>
  );
};

export default QuestionDisplay;