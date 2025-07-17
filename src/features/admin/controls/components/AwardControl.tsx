import React from "react";
import {
  type MatchInfo,
  type ListAward,
  type ListResult,
} from "../type/control.type";
import { useParams } from "react-router-dom";
import { useSocket } from "@contexts/SocketContext";
import { useToast } from "@contexts/toastContext";
import FormAutocompleteFilter from "@components/FormAutocompleteFilter";
import { Button } from "@mui/material";

interface AwardControlProps {
  MatchInfo: MatchInfo | null;
  ListAward: ListAward | null;
  ListResult?: ListResult[] | [];
}

const AwardControl: React.FC<AwardControlProps> = ({
  MatchInfo,
  ListAward,
  ListResult,
}) => {
  const { match } = useParams();
  const { socket } = useSocket();
  const { showToast } = useToast();

  const [gold, setGold] = React.useState<number | undefined>();
  const [firstPrize, setFirstPrize] = React.useState<number | undefined>();
  const [secondPrize, setSecondPrize] = React.useState<number | undefined>();
  const [thirdPrize, setThirdPrize] = React.useState<number | undefined>();

  const ListResults = React.useMemo(() => {
    return (
      ListResult?.map(result => ({
        label: `${result.label} - ${result.fullName} - ${result.value} câu`,
        value: result.contestantId,
      })) ?? []
    );
  }, [ListResult]);

  const ListGold = React.useMemo(() => {
    return (
      ListResult?.map(result => ({
        label: `${result.label} - ${result.fullName} - ${result.value} câu`,
        value: result.label,
      })) ?? []
    );
  }, [ListResult]);

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

  const EmitAwardUpdate = (
    contestantId: number | undefined,
    awardId: number | undefined
  ) => {
    if (!socket || !match) {
      showToast(`Cập nhật giải thưởng thất bại`, "error");
      return;
    }
    socket.emit(
      "update:award",
      {
        match: match,
        contestantId: contestantId,
        awardId: awardId,
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

  const EmitGoldUpdate = () => {
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
        Giải thưởng
      </h2>
      <div className="bg-white rounded-xl border border-gray-100 grid gap-4 p-4 overflow-hidden grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gold */}
        <div className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <h2 className="text-xl font-bold mb-4 text-center">Giải Gold</h2>
          <h6 className="font-bold mb-4 text-center">
            {MatchInfo?.studentName ?? "Không có thí sinh"}
          </h6>
          <FormAutocompleteFilter
            label="Thí sinh"
            options={ListGold}
            value={gold}
            onChange={val => setGold(Number(val))}
            sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
          />
          <div className="flex justify-center mt-6">
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => EmitGoldUpdate()}
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
        {ListAward?.firstPrize && ListAward && (
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Giải Nhất</h2>
            <h6 className="font-bold mb-4 text-center">
              {ListAward?.firstPrize?.contestantId !== null
                ? `${ListAward?.firstPrize.registrationNumber} -
                ${ListAward?.firstPrize?.fullName || ""}`
                : "Không có thí sinh"}
            </h6>
            <FormAutocompleteFilter
              label="Thí sinh"
              options={ListResults}
              value={firstPrize}
              onChange={val =>
                setFirstPrize(typeof val === "number" ? val : undefined)
              }
              sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
            />
            <div className="flex justify-center mt-6">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() =>
                  EmitAwardUpdate(firstPrize, ListAward?.firstPrize?.id)
                }
              >
                Cập nhật
              </Button>
            </div>
            <div className="flex justify-center mt-6 ">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => EmitScreenUpdate("allPrize")}
              >
                Show
              </Button>
            </div>
          </div>
        )}
        {ListAward?.secondPrize && ListAward && (
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <h2 className="font-bold mb-4 text-center">Giải Nhì</h2>
            <h6 className="font-bold  mb-4 text-center">
              {ListAward?.secondPrize?.contestantId !== null
                ? `${ListAward?.secondPrize.registrationNumber} -
                ${ListAward?.secondPrize?.fullName || ""}`
                : "Không có thí sinh"}
            </h6>
            <FormAutocompleteFilter
              label="Thí sinh"
              options={ListResults}
              value={secondPrize}
              onChange={val =>
                setSecondPrize(typeof val === "number" ? val : undefined)
              }
              sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
            />
            <div className="flex justify-center mt-6">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() =>
                  EmitAwardUpdate(secondPrize, ListAward?.secondPrize?.id)
                }
              >
                Cập nhật
              </Button>
            </div>
            <div className="flex justify-center mt-6 ">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => EmitScreenUpdate("allPrize")}
              >
                Show
              </Button>
            </div>
          </div>
        )}
        {ListAward?.thirdPrize && ListAward && (
          <div className="flex flex-col bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <h2 className="text-xl font-bold  mb-4 text-center">Giải Ba</h2>
            <h6 className="font-bold mb-4 text-center">
              {ListAward?.thirdPrize?.contestantId !== null
                ? `${ListAward?.thirdPrize.registrationNumber} -
                ${ListAward?.thirdPrize?.fullName || ""}`
                : "Không có thí sinh"}
            </h6>
            <FormAutocompleteFilter
              label="Thí sinh"
              options={ListResults}
              value={thirdPrize}
              onChange={val =>
                setThirdPrize(typeof val === "number" ? val : undefined)
              }
              sx={{ flex: 1, minWidth: { xs: "100%", sm: 200 } }}
            />
            <div className="flex justify-center mt-6">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() =>
                  EmitAwardUpdate(thirdPrize, ListAward?.thirdPrize?.id)
                }
              >
                Cập nhật
              </Button>
            </div>
            <div className="flex justify-center mt-6 ">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => EmitScreenUpdate("allPrize")}
              >
                Show
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AwardControl;
