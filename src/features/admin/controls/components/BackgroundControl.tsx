import React from "react";

const BackgroundControl: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Điều khiển hiển thị
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <button className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium">
          Màn hình chờ
        </button>

        <button className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md font-medium">
          Sơ đồ trận
        </button>
        <button className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md font-medium">
          Bắt đầu
        </button>
        <button className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md font-medium">
          Kết thúc
        </button>
      </div>
    </div>
  );
};

export default BackgroundControl;
