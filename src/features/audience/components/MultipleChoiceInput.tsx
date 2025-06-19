import React, { useState } from 'react';

interface Props {
  options: string[];
  correctAnswer: string;
  onSubmit: (isCorrect: boolean) => void;
}

const MultipleChoiceInput: React.FC<Props> = ({ options, correctAnswer, onSubmit }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    const isCorrect = selected === correctAnswer;
    console.log('Đáp án gửi đi:', selected, 'IsCorrect:', isCorrect);
    onSubmit(isCorrect);
    alert(`Đáp án bạn chọn: ${selected}, ${isCorrect ? 'Đúng' : 'Sai'}`);
  };

  return (
    <div>
      {options.map((opt, index) => (
        <label key={index} className="flex items-center mb-2">
          <input
            type="radio"
            value={opt}
            checked={selected === opt}
            onChange={() => setSelected(opt)}
            className="mr-2 cursor-pointer"
          />
          {opt}
        </label>
      ))}
      <button
        onClick={handleSubmit}
        disabled={selected === null}
        className="mt-4 px-4 py-2 bg-blue-700 text-white rounded disabled:bg-gray-400"
      >
        Gửi
      </button>
    </div>
  );
};

export default MultipleChoiceInput;