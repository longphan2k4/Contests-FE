import React from "react";
import { type MatchInfo, type ListContestant } from "../type/control.type";
import { useParams } from "react-router-dom";
import { useSocket } from "@contexts/SocketContext";
import { useToast } from "@contexts/toastContext";
import FormAutocompleteFilter from "@components/FormAutocompleteFilter";
import { Button } from "@mui/material";

interface AwardControlProps {
  MatchInfo: MatchInfo | null;
  ListContestant: ListContestant[] | [];
}

const AwardControl: React.FC<AwardControlProps> = ({
  MatchInfo,
  ListContestant,
}) => {
  const { match } = useParams();
  const { socket } = useSocket();
  const { showToast } = useToast();

  const [gold, setGold] = React.useState<number | undefined>();
  const [silver, setSilver] = React.useState<number | undefined>();
  const [bronze, setBronze] = React.useState<number | undefined>();

  // Gộp danh sách thí sinh từ tất cả group
  const allContestants = React.useMemo(() => {
    return ListContestant.flatMap(group =>
      group.contestantMatches
        .filter(c => c.status === "in_progress")
        .map(c => ({
          registrationNumber: c.registrationNumber,
          fullName: `${c.registrationNumber} - ${c.contestant.student.fullName} `,
        }))
    );
  }, [ListContestant]);
  const getOptions = (exclude: number[] = []) => {
    return allContestants
      .filter(c => !exclude.includes(c.registrationNumber))
      .map(c => ({
        label: c.fullName,
        value: c.registrationNumber,
      }));
  };

  const EmitScreenUpdate = (controlKey: string) => {
    if (!socket || !match) {
      showToast(`Cập nhật màn hình thất bại`, "error");
      return;
    }

    if (controlKey === "wingold") {
      if (!MatchInfo?.studentId) {
        showToast(`Vui lòng cập nhật thí sinh gold trước`, "error");
        return;
      }
    }

    socket.emit(
      "screen:update",
      {
        match,
        controlKey: controlKey,
      },
      (err: any, response: any) => {
        if (err) {
          console.error("Error updating screen:", err);
          showToast(err.message, "error");
        } else {
          showToast(response.message, "success");
        }
      }
    );
  };

  const EmitAwardUpdate = () => {
    if (!socket || !match) {
      showToast(`Cập nhật giải thưởng thất bại`, "error");
      return;
    }

    socket.emit(
      "update:winGold",
      {
        match: match,
        registrationNumber: gold,
      },
      (err: any, response: any) => {
        if (err) {
          showToast(err.message, "error");
        } else {
          showToast(response.message, "success");
        }
      }
    );
  };

  return (
    <div className="">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Quản lý giải thưởng
      </h2>

      <div className="bg-white rounded-xl border border-gray-100 grid gap-4 p-4 overflow-hidden grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Gold */}
        <div className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <h2 className="text-xl font-bold text-yellow-600 mb-4 text-center">
            Giải thưởng Gold 🥇
          </h2>
          <FormAutocompleteFilter
            label="Thí sinh"
            options={getOptions([silver, bronze].filter(Boolean) as number[])}
            value={gold}
            onChange={val => setGold(typeof val === "number" ? val : undefined)}
            sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
          />
          <div className="flex justify-center mt-6">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => EmitAwardUpdate()}
            >
              Cập nhật
            </Button>
          </div>
          <div className="flex justify-center mt-6 ">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => EmitScreenUpdate("wingold")}
            >
              Show
            </Button>
          </div>
        </div>

        {/* Silver */}
        <div className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <h2 className="text-xl font-bold text-gray-500 mb-4 text-center">
            Giải thưởng Silver 🥈
          </h2>
          <FormAutocompleteFilter
            label="Thí sinh"
            options={getOptions([gold, bronze].filter(Boolean) as number[])}
            value={silver}
            onChange={val =>
              setSilver(typeof val === "number" ? val : undefined)
            }
            sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
          />
        </div>

        {/* Bronze */}
        <div className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <h2 className="text-xl font-bold text-orange-700 mb-4 text-center">
            Giải thưởng Bronze 🥉
          </h2>
          <FormAutocompleteFilter
            label="Thí sinh"
            options={getOptions([gold, silver].filter(Boolean) as number[])}
            value={bronze}
            onChange={val =>
              setBronze(typeof val === "number" ? val : undefined)
            }
            sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
          />
        </div>
      </div>
    </div>
  );
};

export default AwardControl;
