import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

import AppFormDialog from "../../../../components/AppFormDialog";
import ListStudent from "./ListStudent";
import ListContestantNotContest from "./ListContestantNotContest";

interface CreateContestantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateContestant({
  isOpen,
  onClose,
}: CreateContestantProps): React.ReactElement {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <AppFormDialog
      open={isOpen}
      onClose={onClose}
      title="Thêm thí sinh"
      maxWidth="lg"
    >
      {/* Tabs điều hướng */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)}>
          <Tab label="Sinh viên" />
          <Tab label="Cuộc thi" />
        </Tabs>
      </Box>

      {/* Vòng đấu + Nút Thêm */}

      {/* Tab nội dung */}
      {tabIndex === 0 && (
        <Box>
          <ListStudent tab={tabIndex} open={isOpen} />
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ p: 2 }}>
          <ListContestantNotContest tab={tabIndex} open={isOpen} />
        </Box>
      )}
    </AppFormDialog>
  );
}
