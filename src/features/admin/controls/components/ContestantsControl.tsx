import React, { useState } from "react";
import { NoSymbolIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

const ContestantsControlUI: React.FC = () => {
  const fakeContestants = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    student_name: `${i + 1}`,
  }));

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Danh sách thí sinh</h2>

      <div className="grid grid-cols-10 gap-2">
        {fakeContestants.map(c => (
          <button
            key={c.id}
            onClick={() => toggleSelect(c.id)}
            className={`p-2 rounded-md font-semibold transition ${
              selectedIds.includes(c.id)
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {c.student_name}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Cứu trợ
        </button>

        <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center">
          <NoSymbolIcon className="w-5 h-5 mr-2" />
          Cấm thi
        </button>

        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
          Loại
        </button>

        <button
          onClick={() => setSelectedIds([])}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Reset chọn
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Đã chọn:{" "}
          {selectedIds.length > 0 ? selectedIds.join(", ") : "Không có"}
        </p>
      </div>
    </div>
  );
};

export default ContestantsControlUI;
