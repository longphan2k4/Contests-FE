import React, { useState, useEffect } from 'react';

// Interface cho dữ liệu API
interface ApiQuestion {
  id: number;
  intro: string;
  defaultTime: number;
  questionType: 'multiple_choice' | 'open_ended';
  content: string;
  questionMedia?: { type: string; url: string };
  options?: string[];
  correctAnswer?: string;
  mediaAnswer?: { type: string; url: string };
  score: number;
  difficulty: string;
  explanation: string;
  questionTopic: { id: number; name: string };
  questionDetails: { id: number; questionId: number; additionalNotes: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface cho Question nội bộ
interface Question {
  id: number;
  type: 'multiple-choice' | 'open-ended';
  text: string;
  intro?: string;
  options?: string[];
  correctAnswer?: string;
  questionMedia?: { type: string; url: string };
  mediaAnswer?: { type: string; url: string };
  explanation?: string;
  defaultTime?: number;
  score?: number;
  difficulty?: string;
  topic?: string;
  additionalNotes?: string;
}

// Dữ liệu giả chứa cả hai loại câu hỏi
const fakeQuestions: ApiQuestion[] = [
  {
    id: 1,
    intro: 'Câu hỏi giới thiệu về lập trình',
    defaultTime: 60,
    questionType: 'multiple_choice',
    content: 'Ngôn ngữ lập trình nào được sử dụng phổ biến nhất năm 2025?',
    questionMedia: { type: 'image', url: 'https://th.bing.com/th/id/R.2aabea88b1fd380c768a79058ce9a039?rik=HUlYPW6H0O5qHA&riu=http%3a%2f%2fknowitgetit.com%2fwp-content%2fuploads%2f2023%2f05%2fjavascripts-basics.png&ehk=PlnCaAv0sHSpIXI6hbxqw8vmOqLTlurTbSusHov8tTw%3d&risl=&pid=ImgRaw&r=0' },
    options: ['Java', 'Python', 'JavaScript', 'C++'],
    correctAnswer: 'JavaScript',
    mediaAnswer: { type: 'image', url: 'https://th.bing.com/th/id/OIP.67Vt6C69HV2tmmMYjl3o5gHaGc?r=0&w=512&h=446&rs=1&pid=ImgDetMain' },
    score: 1,
    difficulty: 'medium',
    explanation: 'JavaScript phổ biến vì có thể dùng cho cả frontend và backend.',
    questionTopic: { id: 3, name: 'Lập trình Web' },
    questionDetails: { id: 1, questionId: 1, additionalNotes: 'Hiểu biết cơ bản về xu hướng ngôn ngữ' },
    isActive: true,
    createdAt: '2025-06-16T09:30:00Z',
    updatedAt: '2025-06-16T09:30:00Z',
  },
  {
    id: 2,
    intro: 'Câu hỏi về địa lý',
    defaultTime: 60,
    questionType: 'open_ended',
    content: 'Thủ đô của Pháp là gì?',
    questionMedia: { type: 'image', url: 'https://th.bing.com/th/id/OIP.7xJp0D6M1bXWJb2g3KbyIgHaE-?r=0&rs=1&pid=ImgDetMain' },
    correctAnswer: 'Paris',
    mediaAnswer: { type: 'image', url: 'https://th.bing.com/th/id/OIP.dHRWs1VqdQHnhciqUNClPwHaLF?r=0&w=794&h=1189&rs=1&pid=ImgDetMain' },
    score: 1,
    difficulty: 'easy',
    explanation: 'Paris là thủ đô của Pháp, nổi tiếng với tháp Eiffel.',
    questionTopic: { id: 4, name: 'Địa lý' },
    questionDetails: { id: 2, questionId: 2, additionalNotes: 'Kiến thức cơ bản về thủ đô các nước' },
    isActive: true,
    createdAt: '2025-06-16T09:30:00Z',
    updatedAt: '2025-06-16T09:30:00Z',
  },
];

// Component cho câu hỏi trắc nghiệm
const MultipleChoiceInput: React.FC<{
  options: string[];
  correctAnswer: string;
  onSubmit: (isCorrect: boolean) => void;
}> = ({ options, correctAnswer, onSubmit }) => {
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

// Component cho câu hỏi tự luận
const OpenEndedInput: React.FC<{
  correctAnswer: string;
  onSubmit: (isCorrect: boolean) => void;
}> = ({ correctAnswer, onSubmit }) => {
  const [answerSlots, setAnswerSlots] = useState<(string | null)[]>(Array(correctAnswer.length).fill(null));
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);

  // Hàm xáo trộn mảng chữ cái
  const shuffle = (array: string[]): string[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

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

// Component chính
const AudienceOpinionPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Ánh xạ dữ liệu API sang Question
  useEffect(() => {
    const mappedQuestions: Question[] = fakeQuestions.map((q) => ({
      id: q.id,
      type: q.questionType === 'multiple_choice' ? 'multiple-choice' : 'open-ended',
      text: q.content,
      intro: q.intro,
      options: q.options,
      correctAnswer: q.correctAnswer,
      questionMedia: q.questionMedia,
      mediaAnswer: q.mediaAnswer,
      explanation: q.explanation,
      defaultTime: q.defaultTime,
      score: q.score,
      difficulty: q.difficulty,
      topic: q.questionTopic.name,
      additionalNotes: q.questionDetails.additionalNotes,
    }));
    setQuestions(mappedQuestions);
    setTimeLeft(mappedQuestions[0]?.defaultTime || 60);
    setIsLoading(false);
  }, []);

  // Bộ đếm thời gian
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerSubmit = () => {
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setIsSubmitted(false);
    setTimeLeft(questions[(currentQuestionIndex + 1) % questions.length]?.defaultTime || 60);
  };

  if (isLoading) return <div>Loading...</div>;
  if (questions.length === 0) return <div>Không có câu hỏi</div>;

  const question = questions[currentQuestionIndex];

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      {/* Hiển thị intro và topic */}
      <p className="text-gray-600 mb-2">{question.intro}</p>
      <p className="text-sm text-gray-500 mb-4">
        Chủ đề: {question.topic} | Độ khó: {question.difficulty} | Điểm: {question.score}
      </p>

      {/* Hiển thị thời gian */}
      <p className="text-red-500 mb-3">Thời gian còn lại: {timeLeft}s</p>

      {/* Hiển thị questionMedia */}
      {question.questionMedia?.type === 'image' && (
        <img
          src={question.questionMedia.url}
          alt="Question Media"
          className="w-full h-48 object-contain mb-4"
        />
      )}

      {/* Hiển thị câu hỏi */}
      <h1 className="text-2xl font-bold mb-4">{question.text}</h1>

      {/* Input phù hợp với loại câu hỏi */}
      {question.type === 'multiple-choice' && question.options && (
        <MultipleChoiceInput
          options={question.options}
          correctAnswer={question.correctAnswer || ''}
          onSubmit={handleAnswerSubmit}
        />
      )}
      {question.type === 'open-ended' && question.correctAnswer && (
        <OpenEndedInput
          correctAnswer={question.correctAnswer}
          onSubmit={handleAnswerSubmit}
        />
      )}

      {/* Hiển thị kết quả và giải thích sau khi gửi */}
      {isSubmitted && (
        <div className="mt-6">
          <p className="text-lg font-semibold mb-2">
            Đáp án đúng: {question.correctAnswer}
          </p>
          <p className="text-gray-700 mb-2">{question.explanation}</p>
          {question.mediaAnswer?.type === 'image' && (
            <img
              src={question.mediaAnswer.url}
              alt="Answer Media"
              className="w-full h-48 object-contain mb-4"
            />
          )}
          <p className="text-sm text-gray-600">
            Ghi chú: {question.additionalNotes}
          </p>
        </div>
      )}

      {/* Nút chuyển câu hỏi */}
      <button
        onClick={handleNextQuestion}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Câu hỏi tiếp theo
      </button>
    </div>
  );
};

export default AudienceOpinionPage;