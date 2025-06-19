import React from "react";

interface CurrentContestantsProps {
  countIn_progress?: number;
  total?: number;
  currentQuestion?: number;
}

const CurrentContestants: React.FC<CurrentContestantsProps> = ({
  countIn_progress,
  total,
  currentQuestion,
}) => {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <span className="text-3xl font-bold text-red-600">
            Câu {currentQuestion}
          </span>
        </div>
        <div>
          Thí sinh:{" "}
          <span className="text-3xl font-bold text-red-600">
            {countIn_progress ?? 5}/{total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrentContestants;
