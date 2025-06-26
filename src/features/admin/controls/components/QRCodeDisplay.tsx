import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  rescueId: number;
  matchSlug: string;
  matchName?: string;
  currentQuestionOrder?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  rescueId,
  matchSlug,
  matchName,
  currentQuestionOrder,
}) => {
  const opinionURL = `${window.location.origin}/khan-gia/tro-giup/${matchSlug}/${rescueId}`;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-7xl w-full mx-auto m-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white text-center">
          <h1 className="text-3xl font-bold">TRỢ GIÚP KHÁN GIẢ</h1>
        </div>

        {/* Main Content - 2 cột */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Cột 1: QR Code */}
            <div className="flex justify-center">
              <QRCodeSVG
                value={opinionURL}
                size={800}
                level="M"
                includeMargin={true}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "800px",
                }}
              />
            </div>

            {/* Cột 2: Thông tin trận đấu và URL */}
            <div className="space-y-6">
              {/* Thông tin trận đấu */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">
                  Thông tin trận đấu
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-24">
                      Trận:
                    </span>
                    <span className="text-blue-700 font-bold text-lg">
                      {matchName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 font-medium w-24">
                      Câu hỏi:
                    </span>
                    <span className="text-blue-700 font-bold text-lg">
                      {currentQuestionOrder}
                    </span>
                  </div>
                </div>
              </div>

              {/* URL */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-3">
                  Hoặc truy cập link
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                  <p className="text-blue-600 font-mono text-sm break-all leading-relaxed">
                    {opinionURL}
                  </p>
                </div>
              </div>

              {/* Hướng dẫn */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-3">
                  Cách tham gia
                </h3>
                <div className="space-y-2 text-blue-700">
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </span>
                    <span>Quét mã QR bằng camera điện thoại</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </span>
                    <span>Hoặc truy cập link trên</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </span>
                    <span>Chọn đáp án và gửi kết quả</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
