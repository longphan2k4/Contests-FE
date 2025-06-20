import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useParams } from "react-router-dom";
import AppFormDialog from "../../../../components/AppFormDialog";
import ListStudent from "./ListStudent";

import { type CreatesContestInput } from "../types/contestant.shame";
interface CreateContestantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateContestant({
  isOpen,
  onClose,
}: CreateContestantProps): React.ReactElement {
  const { slug } = useParams();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleSubmit = (data: CreatesContestInput) => {};

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Thêm thí sinh"
      maxWidth="lg"
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Thông tin" />
          <Tab label="Chi tiết" />
          <Tab label="Khác" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <Box sx={{ p: 2 }}>
          <ListStudent
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ p: 2 }}>
          <p>Chi tiết thí sinh (Tab 2) — bạn thêm nội dung ở đây</p>
        </Box>
      )}
    </AppFormDialog>
  );
}
