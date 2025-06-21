// // components/QuestionDisplay/index.tsx
// import React, { useState } from "react";
// import type { QuestionData } from "../../types/question.types";
// import {
//   fakeQuestionData,
//   sampleQuestions,
//   sampleAnswerTypes,
// } from "../../data/mockData";

// import QuestionContent from "./QuestionContent";

// const QuestionDisplay: React.FC = () => {
//   const [contentVisible, setContentVisible] = useState<boolean>(true);
//   const [answerVisible, setAnswerVisible] = useState<boolean>(false);
//   const [currentQuestion, setCurrentQuestion] =
//     useState<QuestionData>(fakeQuestionData);

//   // Demo controls
//   const toggleQuestion = () => {
//     setContentVisible(prev => {
//       const newValue = !prev;
//       // Nếu hiện câu hỏi thì ẩn đáp án
//       if (newValue) {
//         setAnswerVisible(false);
//       }
//       return newValue;
//     });
//   };

//   const toggleAnswer = () => {
//     setAnswerVisible(prev => {
//       const newValue = !prev;
//       // Nếu hiện đáp án thì ẩn câu hỏi
//       if (newValue) {
//         setContentVisible(false);
//       }
//       return newValue;
//     });
//   };

//   const switchQuestionType = (type: QuestionData["type"]) => {
//     const newQuestion = sampleQuestions[type];
//     if (newQuestion) {
//       setCurrentQuestion(newQuestion);
//       setAnswerVisible(false);
//       setContentVisible(true); // Hiện câu hỏi mới
//     }
//   };

//   const switchAnswerType = (
//     answerType: "option" | "text" | "image" | "video" | "audio"
//   ) => {
//     const answerData = sampleAnswerTypes[answerType];
//     if (answerData) {
//       setCurrentQuestion(prev => ({
//         ...prev,
//         correctAnswer: answerData.correctAnswer || prev.correctAnswer,
//         answerType: answerData.answerType || "text",
//         answerMediaUrl: answerData.answerMediaUrl,
//       }));

//       // Automatically show answer and hide question when switching answer type
//       setAnswerVisible(true);
//       setContentVisible(false);
//     }
//   };

//   return (
//     <div className="mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
//       {/* Demo Controls */}
//       {/* <DemoControls
//         contentVisible={contentVisible}
//         answerVisible={answerVisible}
//         onToggleQuestion={toggleQuestion}
//         onToggleAnswer={toggleAnswer}
//         onSwitchQuestionType={switchQuestionType}
//         onSwitchAnswerType={switchAnswerType}
//       /> */}

//       {/* Question Display */}
//       <div className="space-y-6">
//         {/* <QuestionInfo
//           questionNumber={currentQuestion.questionNumber}
//           phase={currentQuestion.phase}
//           topic={currentQuestion.topic}
//           type={currentQuestion.type}
//         /> */}

//         <QuestionContent
//           content={currentQuestion.content}
//           type={currentQuestion.type}
//           questionMedia={currentQuestion.mediaUrl}
//           options={currentQuestion.options}

//         />

//         { <AnswerDisplay
//           answer={currentQuestion.correctAnswer}
//           answerType={currentQuestion.answerType}
//           answerMediaUrl={currentQuestion.answerMediaUrl}
//           isVisible={answerVisible}
//         />
//       </div>
//     </div>
//   );
// };

// export default QuestionDisplay;
