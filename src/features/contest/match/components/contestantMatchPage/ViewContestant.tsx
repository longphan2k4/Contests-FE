import AppFormDialog from "../../../../../components/AppFormDialog";
import { Box, Chip, Typography, Divider } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BadgeIcon from '@mui/icons-material/Badge';
import NumbersIcon from '@mui/icons-material/Numbers';
import GroupIcon from '@mui/icons-material/Group';

import { useParams } from 'react-router-dom';

import { useGetById, useGetContestantWithGroups } from "../../hook/contestantMatchPage/useContestant";

interface ViewcontestantProps {
  id: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewContestant({
  id,
  isOpen,
  onClose,
}: ViewcontestantProps): React.ReactElement {
  // Lấy matchId và slug từ URL params
  const { matchId: matchIdParam, slug } = useParams();
  const matchId = matchIdParam ? parseInt(matchIdParam) : null;

  // Gọi cả 2 API
  const { data: contestantWithGroups, isLoading: isLoadingWithGroups, error: errorWithGroups } = useGetContestantWithGroups(
    id || 0,
    slug || '',
    matchId || 0
  );
  const { data: contestantBasic, isLoading: isLoadingBasic, error: errorBasic } = useGetById(id);

  // Logic thông minh để chọn data
  let contestant, isLoading, error, isInMatch;
  
  if (matchId && id && slug) {
    // Trong context trận đấu - thử dùng API với nhóm trước
    if (!isLoadingWithGroups && !errorWithGroups && contestantWithGroups) {
      // Thành công lấy data từ API với nhóm (thí sinh có trong trận)
      contestant = contestantWithGroups;
      isLoading = isLoadingWithGroups;
      error = errorWithGroups;
      isInMatch = true;
    } else if (!isLoadingBasic && contestantBasic) {
      // Fallback về API cơ bản (thí sinh không trong trận)
      contestant = contestantBasic;
      isLoading = isLoadingBasic;
      error = errorBasic;
      isInMatch = false;
    } else {
      // Đang loading hoặc có lỗi
      contestant = null;
      isLoading = isLoadingWithGroups || isLoadingBasic;
      error = errorBasic; // Ưu tiên error từ API cơ bản vì ít lỗi hơn
      isInMatch = false;
    }
  } else {
    // Không có matchId hoặc slug - chỉ dùng API cơ bản
    contestant = contestantBasic;
    isLoading = isLoadingBasic;
    error = errorBasic;
    isInMatch = false;
  }

  // Debug log để xem cấu trúc dữ liệu
  console.log('ViewContestant - matchId from params:', matchId);
  console.log('ViewContestant - slug from params:', slug);
  console.log('ViewContestant - isInMatch:', isInMatch);
  console.log('ViewContestant - contestantWithGroups:', contestantWithGroups);
  console.log('ViewContestant - contestantBasic:', contestantBasic);
  console.log('ViewContestant - final contestant data:', contestant);
  console.log('ViewContestant - isLoading:', isLoading);
  console.log('ViewContestant - error:', error);

  // Hàm format trạng thái
  const getStatusInfo = (status?: string) => {
    switch (status?.trim()) {
      case ' compete': // Lưu ý có space ở đầu
      case 'compete':
        return { label: 'Thi đấu', color: 'primary' as const, icon: '🏆' };
      case 'eliminate':
        return { label: 'Bị loại', color: 'error' as const, icon: '❌' };
      case 'advanced':
        return { label: 'Qua vòng', color: 'success' as const, icon: '✅' };
      default:
        return { label: 'Không xác định', color: 'default' as const, icon: '❓' };
    }
  };

  const statusInfo = getStatusInfo(contestant?.status);

  // Hiển thị loading state
  if (isLoading) {
    return (
      <Box>
        <AppFormDialog
          open={isOpen}
          onClose={onClose}
          title="Đang tải thông tin..."
          maxWidth="md"
        >
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography>Đang tải thông tin thí sinh...</Typography>
          </Box>
        </AppFormDialog>
      </Box>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <Box>
        <AppFormDialog
          open={isOpen}
          onClose={onClose}
          title="Lỗi"
          maxWidth="md"
        >
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">
              Không thể tải thông tin thí sinh. Vui lòng thử lại.
            </Typography>
          </Box>
        </AppFormDialog>
      </Box>
    );
  }

  return (
    <Box>
      <AppFormDialog
        open={isOpen}
        onClose={onClose}
        title={`Thông tin thí sinh: ${contestant?.student?.fullName || 'Đang tải...'}`}
        maxWidth="md"
      >
        <Box sx={{ p: 2 }}>
          {/* Header với avatar và tên */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            border: '1px solid #e9ecef'
          }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              {contestant?.student?.fullName?.charAt(0)?.toUpperCase() || '?'}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {contestant?.student?.fullName || 'Đang tải...'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={<span>{statusInfo.icon}</span>}
                  label={statusInfo.label}
                  color={statusInfo.color}
                  size="small"
                  variant="filled"
                />
              </Box>
            </Box>
          </Box>

          {/* Thông báo loại dữ liệu */}
          {isInMatch && contestant?.group && (
            <Box sx={{ 
              p: 1.5, 
              backgroundColor: '#e3f2fd', 
              borderRadius: 1, 
              border: '1px solid #90caf9',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <EmojiEventsIcon fontSize="small" color="primary" />
              <Typography variant="body2" color="primary.main" fontWeight="medium">
                📊 Thí sinh có trong trận đấu này (bao gồm thông tin nhóm)
              </Typography>
            </Box>
          )}

          {isInMatch && !contestant?.group && (
            <Box sx={{ 
              p: 1.5, 
              backgroundColor: '#e8f5e8', 
              borderRadius: 1, 
              border: '1px solid #4caf50',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <EmojiEventsIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" fontWeight="medium">
                Thí sinh chưa được phân nhóm trong trận đấu này
              </Typography>
            </Box>
          )}

          {!isInMatch && matchId && (
            <Box sx={{ 
              p: 1.5, 
              backgroundColor: '#fff3e0', 
              borderRadius: 1, 
              border: '1px solid #ffcc02',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <PersonIcon fontSize="small" color="warning" />
              <Typography variant="body2" color="warning.main" fontWeight="medium">
                ℹ️ Thí sinh không có trong trận đấu này (hiển thị thông tin cơ bản)
              </Typography>
            </Box>
          )}

          {!matchId && (
            <Box sx={{ 
              p: 1.5, 
              backgroundColor: '#f3e5f5', 
              borderRadius: 1, 
              border: '1px solid #ce93d8',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <PersonIcon fontSize="small" color="secondary" />
              <Typography variant="body2" color="secondary.main" fontWeight="medium">
                📋 Xem thông tin cơ bản (không trong context trận đấu)
              </Typography>
            </Box>
          )}

          {/* Thông tin chi tiết */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            
            {/* Thông tin sinh viên */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'white', 
              borderRadius: 1, 
              border: '1px solid #e0e0e0' 
            }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main'
              }}>
                <PersonIcon fontSize="small" />
                Thông tin sinh viên
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
                mt: 1
              }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Mã sinh viên
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BadgeIcon fontSize="small" color="action" />
                    {contestant?.student?.studentCode || 'Chưa có thông tin'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Họ và tên
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {contestant?.student?.fullName || 'Chưa có thông tin'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Thông tin lớp và trường */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'white', 
              borderRadius: 1, 
              border: '1px solid #e0e0e0' 
            }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main'
              }}>
                <SchoolIcon fontSize="small" />
                Thông tin học tập
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
                mt: 1
              }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Lớp
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ClassIcon fontSize="small" color="action" />
                    {contestant?.student?.class?.name || 'Chưa có thông tin'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Trường
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {contestant?.student?.class?.school?.name || 'Chưa có thông tin'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Thông tin cuộc thi */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'white', 
              borderRadius: 1, 
              border: '1px solid #e0e0e0' 
            }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main'
              }}>
                <EmojiEventsIcon fontSize="small" />
                Thông tin cuộc thi
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
                mt: 1
              }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tên cuộc thi
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {contestant?.contest?.name || 'Chưa có thông tin'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Vòng đấu
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {contestant?.round?.name || 'Chưa có thông tin'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Nhóm trong trận đấu
                  </Typography>
                  {isInMatch && contestant?.group ? (
                    <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon fontSize="small" color="action" />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {contestant.group.name}
                        <Chip 
                          label={`ID: ${contestant.group.id}`} 
                          size="small" 
                          variant="outlined" 
                          sx={{ fontSize: '0.75rem', height: '20px' }}
                        />
                      </Box>
                    </Typography>
                  ) : isInMatch && contestant?.group === null ? (
                    <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon fontSize="small" color="warning" />
                      <Typography component="span" color="warning.main">
                        Chưa phân nhóm trong trận hiện tại
                      </Typography>
                    </Typography>
                  ) : (
                    <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon fontSize="small" color="disabled" />
                      <Typography component="span" color="text.secondary">
                        {matchId ? 'Không có trong trận đấu này' : 'Chưa có thông tin'}
                      </Typography>
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Trạng thái
                  </Typography>
                  <Chip
                    icon={<span>{statusInfo.icon}</span>}
                    label={statusInfo.label}
                    color={statusInfo.color}
                    size="small"
                    variant="filled"
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Thông tin hệ thống */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#f8f9fa', 
              borderRadius: 1, 
              border: '1px solid #e9ecef'
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Thông tin hệ thống
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 2,
                fontSize: '0.875rem'
              }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <NumbersIcon fontSize="small" />
                    ID thí sinh: {contestant?.id || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ID sinh viên: {contestant?.studentId || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ID vòng đấu: {contestant?.roundId || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </AppFormDialog>
    </Box>
  );
}
