import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Container,
  Button
} from '@mui/material';
import { getContestById } from '../services/contestsService';
import type { Contest } from '../types';
import RoundList from '../components/rounds/RoundList';
import ContestantList from '../components/contestants/ContestantList';
import GroupList from '../components/groups/GroupList';
import ResultList from '../components/results/ResultList';
import { format } from 'date-fns';
import EditContestDialog from '../components/EditContestDialog';
import { useToast } from '../../../../contexts/toastContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contest-tabpanel-${index}`}
      aria-labelledby={`contest-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `contest-tab-${index}`,
    'aria-controls': `contest-tabpanel-${index}`,
  };
}

const ContestDetailPage: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { showToast } = useToast();

  const fetchContest = async () => {
    try {
      setLoading(true);
      if (!contestId) return;
      
      const response = await getContestById(Number(contestId));
      console.log('response detail', response);
      if (response.success && response.data && response.data.Contest && response.data.Contest[0]) {
        // API trả về một mảng Contest, lấy phần tử đầu tiên
        setContest(response.data.Contest[0]);
      } else {
        throw new Error('Dữ liệu trả về không đúng định dạng');
      }
    } catch (error) {
      console.error('Error fetching contest:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải thông tin cuộc thi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContest();
  }, [contestId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleContestUpdated = (updatedContest: Contest) => {
    setContest(updatedContest);
    showToast('Cập nhật cuộc thi thành công', 'success');
  };

  // Xử lý các sự kiện cho vòng đấu
  const handleAddRound = () => {
    console.log('Thêm vòng đấu mới');
    // Sẽ mở modal hoặc chuyển hướng đến trang thêm vòng đấu
  };

  const handleEditRound = (roundId: number) => {
    console.log('Chỉnh sửa vòng đấu:', roundId);
    // Sẽ mở modal hoặc chuyển hướng đến trang chỉnh sửa vòng đấu
  };

  const handleDeleteRound = (roundId: number) => {
    console.log('Xóa vòng đấu:', roundId);
    // Sẽ hiển thị xác nhận xóa vòng đấu
  };

  // Xử lý các sự kiện cho thí sinh
  const handleAddContestant = () => {
    console.log('Thêm thí sinh mới');
    // Sẽ mở modal hoặc chuyển hướng đến trang thêm thí sinh
  };

  const handleEditContestant = (contestantId: number) => {
    console.log('Chỉnh sửa thí sinh:', contestantId);
    // Sẽ mở modal hoặc chuyển hướng đến trang chỉnh sửa thí sinh
  };

  const handleDeleteContestant = (contestantId: number) => {
    console.log('Xóa thí sinh:', contestantId);
    // Sẽ hiển thị xác nhận xóa thí sinh
  };

  // Xử lý các sự kiện cho nhóm
  const handleAddGroup = () => {
    console.log('Thêm nhóm mới');
    // Sẽ mở modal hoặc chuyển hướng đến trang thêm nhóm
  };

  const handleEditGroup = (groupId: number) => {
    console.log('Chỉnh sửa nhóm:', groupId);
    // Sẽ mở modal hoặc chuyển hướng đến trang chỉnh sửa nhóm
  };

  const handleDeleteGroup = (groupId: number) => {
    console.log('Xóa nhóm:', groupId);
    // Sẽ hiển thị xác nhận xóa nhóm
  };

  const handleViewGroupMembers = (groupId: number) => {
    console.log('Xem thành viên nhóm:', groupId);
    // Sẽ mở modal hiển thị danh sách thành viên nhóm
  };

  // Xử lý các sự kiện cho kết quả
  const handleEditResult = (resultId: number) => {
    console.log('Chỉnh sửa kết quả:', resultId);
    // Sẽ mở modal hoặc chuyển hướng đến trang chỉnh sửa kết quả
  };

  const handleViewResultDetail = (resultId: number) => {
    console.log('Xem chi tiết kết quả:', resultId);
    // Sẽ mở modal hiển thị chi tiết kết quả
  };

  const handleExportResults = (roundId: number) => {
    console.log('Xuất kết quả của vòng đấu:', roundId);
    // Sẽ tạo và tải xuống file kết quả
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!contest) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Không tìm thấy thông tin cuộc thi</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ 
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0px'
    }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {contest.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handleOpenEditDialog}
            >
              Chỉnh sửa
            </Button>
            <Button variant="contained" color="primary">
              Xuất báo cáo
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          mb: 3,
          '& .MuiTabs-root': {
            minHeight: '48px'
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            minHeight: '48px'
          }
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="Tabs quản lý cuộc thi"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Thông tin chung" {...a11yProps(0)} />
            <Tab label="Vòng đấu" {...a11yProps(1)} />
            <Tab label="Thí sinh" {...a11yProps(2)} />
            <Tab label="Nhóm" {...a11yProps(3)} />
            <Tab label="Kết quả" {...a11yProps(4)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              {contest.description}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Địa điểm:</strong> {contest.location}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Thời gian:</strong> {format(new Date(contest.startTime), 'dd/MM/yyyy HH:mm')} - {format(new Date(contest.endTime), 'dd/MM/yyyy HH:mm')}
              </Typography>
              {contest.slogan && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Slogan:</strong> {contest.slogan}
                </Typography>
              )}
            </Box>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <RoundList 
            contestId={Number(contestId)}
            onAddRound={handleAddRound}
            onEditRound={handleEditRound}
            onDeleteRound={handleDeleteRound}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <ContestantList 
            contestId={Number(contestId)}
            onAddContestant={handleAddContestant}
            onEditContestant={handleEditContestant}
            onDeleteContestant={handleDeleteContestant}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <GroupList 
            contestId={Number(contestId)}
            onAddGroup={handleAddGroup}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
            onViewGroupMembers={handleViewGroupMembers}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <ResultList 
            contestId={Number(contestId)}
            onEditResult={handleEditResult}
            onViewResultDetail={handleViewResultDetail}
            onExportResults={handleExportResults}
          />
        </TabPanel>

        {/* Dialog chỉnh sửa thông tin cuộc thi */}
        {contest && (
          <EditContestDialog
            contest={contest}
            open={editDialogOpen}
            onClose={handleCloseEditDialog}
            onUpdated={handleContestUpdated}
          />
        )}
    </Container>
  );
};

export default ContestDetailPage; 