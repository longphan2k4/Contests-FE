const SupplierVideo: React.FC = () => {
  return (
    <div className="">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Video Nhà Tài Trợ
      </h2>

      <div className="bg-white rounded-xl border border-gray-100 flex gap-6">
        {/* Danh sách video */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-800 text-white p-4 font-bold text-center rounded-t-xl">
            Danh Sách Video
          </div>
          <div className="p-4 h-[180px] overflow-y-auto">
            <ul className="space-y-2">
              <li className="p-3 rounded-lg cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300">
                Video 1
              </li>
              <li className="p-3 rounded-lg cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300">
                Video 2
              </li>
            </ul>
          </div>
        </div>

        {/* Video Preview */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-800 text-white p-4 font-bold text-center rounded-t-xl">
            Video Preview
          </div>
          <div className="p-4 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
              <p className="text-gray-500">Chọn video để xem trước</p>
            </div>
          </div>
        </div>

        {/* Điều khiển */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-md border border-gray-100">
          <div className="bg-gray-800 text-white p-4 font-bold text-center rounded-t-xl">
            Điều Khiển
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 w-full">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium">
                Team
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium">
                Sponsor
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md font-medium">
                Show
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md font-medium">
                Play
              </button>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-md font-medium">
                Pause
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md font-medium">
                Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierVideo;
