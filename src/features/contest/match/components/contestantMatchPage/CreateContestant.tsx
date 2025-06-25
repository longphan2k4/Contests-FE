import React, { useState } from "react";
import { 
  Box, 
  Tabs, 
  Tab, 
  Button, 
  Typography, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ListStudent from "./ListStudent.tsx";
import { useToast } from "../../../../../contexts/toastContext";

interface CreateContestantProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateContestant({
  isOpen,
  onClose,
  onSuccess,
}: CreateContestantProps): React.ReactElement {
  const { showToast } = useToast();
  const [tabIndex, setTabIndex] = React.useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      showToast("Vui lòng chọn ít nhất một học sinh", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // const data: CreatesContestInput = {
      //   ids: selectedIds,
      //   roundId: currentRoundId, // You'll need to get this from context or props
      // };
      // await contestantApi.createMultiple(data);
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast(`Đã thêm ${selectedIds.length} thí sinh thành công`, "success");
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error creating contestants:", error);
      showToast("Có lỗi xảy ra khi thêm thí sinh", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedIds([]);
    setTabIndex(0);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Thêm thí sinh vào cuộc thi
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          disabled={isSubmitting}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Chọn học sinh" />
            <Tab label="Xem trước" />
          </Tabs>
        </Box>

        {tabIndex === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Chọn học sinh để thêm vào cuộc thi
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tìm kiếm và chọn các học sinh mà bạn muốn thêm vào cuộc thi. 
              Bạn có thể lọc theo trường học và lớp để dễ dàng tìm kiếm.
            </Typography>
            
            <ListStudent
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Xem trước danh sách thí sinh được chọn
            </Typography>
            
            {selectedIds.length === 0 ? (
              <Alert severity="info">
                Chưa có học sinh nào được chọn. Vui lòng quay lại tab "Chọn học sinh" để chọn.
              </Alert>
            ) : (
              <Box>
                <Typography variant="body1" gutterBottom>
                  Đã chọn <strong>{selectedIds.length}</strong> học sinh:
                </Typography>
                <Box sx={{ 
                  maxHeight: 300, 
                  overflow: 'auto',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  p: 1
                }}>
                  {selectedIds.map((id, index) => (
                    <Typography key={id} variant="body2" sx={{ py: 0.5 }}>
                      {index + 1}. Student ID: {id}
                    </Typography>
                  ))}
                </Box>
                
                <Alert severity="success" sx={{ mt: 2 }}>
                  Sẵn sàng thêm {selectedIds.length} học sinh vào cuộc thi!
                </Alert>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={selectedIds.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Đang thêm..." : `Thêm ${selectedIds.length} thí sinh`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
