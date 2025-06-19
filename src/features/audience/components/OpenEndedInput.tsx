import React, { useState, useEffect } from 'react';
import { shuffle } from '../utils/shuffle';

interface Props {
  correctAnswer: string;
  onSubmit: (isCorrect: boolean) => void;
}

const OpenEndedInput: React.FC<Props> = ({ correctAnswer, onSubmit }) => {
  const [answerSlots, setAnswerSlots] = useState<(string | null)[]>(Array(correctAnswer.length).fill(null));
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);

  // Khởi tạo chữ cái bị xáo trộn
  useEffect(() => {
    const letters = correctAnswer.split('');
    setAvailableLetters(shuffle(letters));
    setAnswerSlots(Array(correctAnswer.length).fill(null));
  }, [correctAnswer]);

  // Thêm chữ cái vào ô trống
  const addToAnswer = (letter: string) => {
    const index = answerSlots.findIndex((slot) => slot === null);
    if (index !== -1) {
      const newSlots = [...answerSlots];
      newSlots[index] = letter;
      setAnswerSlots(newSlots);
      setAvailableLetters((prev) => prev.filter((l) => l !== letter));
    }
  };

  // Xóa chữ cái khỏi ô trống
  const removeFromAnswer = (index: number) => {
    if (answerSlots[index] !== null) {
      const letter = answerSlots[index];
      const newSlots = [...answerSlots];
      newSlots[index] = null;
      setAnswerSlots(newSlots);
      setAvailableLetters((prev) => [...prev, letter as string]);
    }
  };

  // Gửi đáp án
  const handleSubmit = () => {
    const answer = answerSlots.join('');
    const isCorrect = answer === correctAnswer;
    console.log('Đáp án gửi đi:', answer, 'IsCorrect:', isCorrect);
    onSubmit(isCorrect);
    alert(`Đáp án bạn nhập: ${answer}, ${isCorrect ? 'Đúng' : 'Sai'}`);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap">
        <span className="mr-2">Đáp án:</span>
        {answerSlots.map((letter, index) => (
          <span
            key={index}
            onClick={() => removeFromAnswer(index)}
            className="mx-1 p-2 w-10 h-10 border rounded text-center cursor-pointer hover:bg-gray-100"
          >
            {letter || '_'}
          </span>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap">
        <span className="mr-2">Chữ cái:</span>
        {availableLetters.map((letter, index) => (
          <button
            key={index}
            onClick={() => addToAnswer(letter)}
            className="mx-1 p-2 w-10 h-10 bg-gray-200 rounded hover:bg-gray-300"
          >
            {letter}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={answerSlots.some((slot) => slot === null)}
        className="px-4 py-2 bg-blue-700 text-white rounded disabled:bg-gray-400"
      >
        Gửi
      </button>
    </div>
  );
};

export default OpenEndedInput;