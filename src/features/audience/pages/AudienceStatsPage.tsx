import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import RescueStatsDisplay from "../../match/components/QuestionDisplay/RescueStatsDisplay";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const AudienceStatsPage: React.FC = () => {
  const { rescueId: rescueIdParam } = useParams<{
    rescueId: string;
  }>();

  const rescueId = rescueIdParam ? parseInt(rescueIdParam, 10) : 0;

  useEffect(() => {
    document.title = "Thống kê trợ giúp khán giả - Olympic tin học.";
  }, []);

  // Kiểm tra params hợp lệ
  if (!rescueId || isNaN(rescueId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <InformationCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ID không hợp lệ
            </h3>
            <p className="text-gray-600">
              URL cần có định dạng: /audience/stats/[rescueId]
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RescueStatsDisplay
      rescueId={rescueId}
      autoRefresh={true}
      refreshInterval={3000}
    />
  );
};

export default AudienceStatsPage;
