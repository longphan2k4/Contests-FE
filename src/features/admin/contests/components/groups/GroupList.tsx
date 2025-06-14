import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import type { Group } from '../../types';

interface GroupListProps {
  contestId: number;
  onAddGroup?: () => void;
  onEditGroup?: (groupId: number) => void;
  onDeleteGroup?: (groupId: number) => void;
  onViewGroupMembers?: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({
  contestId,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  onViewGroupMembers
}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');

  useEffect(() => {
    // Tạm thời sử dụng dữ liệu mẫu
    // Sau này sẽ thay thế bằng API call thực tế
    const fetchGroups = async () => {
      try {
        setLoading(true);
        // Giả lập API call
        setTimeout(() => {
          const sampleGroups: Group[] = [
            {
              id: 1,
              contestId: contestId,
              name: 'Nhóm A',
              description: 'Nhóm thí sinh khu vực miền Bắc',
              maxContestants: 10,
              roundId: 1,
              createdAt: '2023-09-15T00:00:00Z',
              updatedAt: '2023-09-15T00:00:00Z',
              contestants: [
                {
                  id: 1,
                  contestId: contestId,
                  fullName: 'Nguyễn Văn A',
                  email: 'nguyenvana@example.com',
                  registrationTime: '2023-09-10T08:30:00Z',
                  status: 'approved',
                  groupId: 1,
                  createdAt: '2023-09-10T08:30:00Z',
                  updatedAt: '2023-09-10T08:30:00Z'
                },
                {
                  id: 3,
                  contestId: contestId,
                  fullName: 'Lê Văn C',
                  email: 'levanc@example.com',
                  registrationTime: '2023-09-12T14:20:00Z',
                  status: 'approved',
                  groupId: 1,
                  createdAt: '2023-09-12T14:20:00Z',
                  updatedAt: '2023-09-12T14:20:00Z'
                }
              ]
            },
            {
              id: 2,
              contestId: contestId,
              name: 'Nhóm B',
              description: 'Nhóm thí sinh khu vực miền Nam',
              maxContestants: 10,
              roundId: 1,
              createdAt: '2023-09-15T00:00:00Z',
              updatedAt: '2023-09-15T00:00:00Z',
              contestants: [
                {
                  id: 2,
                  contestId: contestId,
                  fullName: 'Trần Thị B',
                  email: 'tranthib@example.com',
                  registrationTime: '2023-09-11T10:15:00Z',
                  status: 'approved',
                  groupId: 2,
                  createdAt: '2023-09-11T10:15:00Z',
                  updatedAt: '2023-09-11T10:15:00Z'
                }
              ]
            },
            {
              id: 3,
              contestId: contestId,
              name: 'Nhóm C',
              description: 'Nhóm thí sinh khu vực miền Trung',
              maxContestants: 10,
              roundId: 1,
              createdAt: '2023-09-15T00:00:00Z',
              updatedAt: '2023-09-15T00:00:00Z',
              contestants: []
            }
          ];
          setGroups(sampleGroups);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách nhóm');
        setLoading(false);
      }
    };

    fetchGroups();
  }, [contestId]);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'table' ? 'card' : 'table');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Danh sách nhóm</Typography>
        <Box>
          <Button
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={toggleViewMode}
          >
            {viewMode === 'table' ? 'Xem dạng thẻ' : 'Xem dạng bảng'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddGroup}
          >
            Thêm nhóm
          </Button>
        </Box>
      </Box>

      {groups.length === 0 ? (
        <Alert severity="info">Chưa có nhóm nào được tạo</Alert>
      ) : viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên nhóm</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Số thí sinh</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.id}</TableCell>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.description || '-'}</TableCell>
                  <TableCell>
                    {group.contestants?.length || 0}/{group.maxContestants || 'Không giới hạn'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Xem thành viên">
                      <IconButton
                        size="small"
                        onClick={() => onViewGroupMembers && onViewGroupMembers(group.id)}
                      >
                        <PeopleIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton
                        size="small"
                        onClick={() => onEditGroup && onEditGroup(group.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => onDeleteGroup && onDeleteGroup(group.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {group.name}
                    </Typography>
                    <Box>
                      <Tooltip title="Xem thành viên">
                        <IconButton
                          size="small"
                          onClick={() => onViewGroupMembers && onViewGroupMembers(group.id)}
                        >
                          <PeopleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => onEditGroup && onEditGroup(group.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          onClick={() => onDeleteGroup && onDeleteGroup(group.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {group.description || 'Không có mô tả'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={`${group.contestants?.length || 0}/${group.maxContestants || '∞'} thành viên`}
                      size="small"
                      color={
                        group.contestants && group.maxContestants && 
                        group.contestants.length >= group.maxContestants 
                          ? 'error' 
                          : 'primary'
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default GroupList;