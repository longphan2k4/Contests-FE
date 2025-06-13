import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, CircularProgress, Alert, Chip, IconButton, Tooltip, Button } from '@mui/material';
import { getContestById } from '../services/contestsService';
import { format } from 'date-fns';
import { GridDeleteIcon } from '@mui/x-data-grid';
import type { Contest } from '../types';

interface ContestCardProps {
    contestId: number;
    onShare?: () => void;
    onView?: (contestId: number) => void;
    onEdit?: (contestId: number) => void;
}

const ContestCard: React.FC<ContestCardProps> = ({ contestId, onView, onEdit }) => {
    const [contest, setContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContest = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getContestById(contestId);
                console.log('response5', response);
                console.log('response6', response.data);
                if (response.success && response.data) {
                    setContest(response.data);
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
        fetchContest();
    }, [contestId]);

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

    if (!contest) {
        return <Alert severity="warning">Không tìm thấy thông tin cuộc thi</Alert>;
    }

    return (
        <Box >
            <Card sx={{ 
                width: '100%',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                },
            }}>
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                    <Tooltip title="Xoá">
                        <IconButton onClick={() => onView?.(contest.id)} size="small" color="primary">
                            <GridDeleteIcon style={{ color: 'red' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
                <CardActionArea onClick={() => onView?.(contest.id)}>
                    {/* <CardMedia
                        component="img"
                        height="140"
                        image="/static/images/cards/contemplative-reptile.jpg"
                        alt={contest.name}
                        sx={{ objectFit: 'cover' }}
                    /> */}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main',
                            maxWidth: 270,
                        }}>
                            {contest.name || 'Chưa có tên'}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                            color: 'text.secondary',
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {contest.description}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                                label={contest.status} 
                                color={contest.status === 'upcoming' ? 'primary' : 'default'} 
                                size="small"
                                sx={{ fontWeight: 'medium' }}
                            />
                            <Chip 
                                label={contest.isActive ? 'Đang diễn ra' : 'Đã kết thúc'} 
                                color={contest.isActive ? 'success' : 'error'} 
                                size="small"
                                sx={{ fontWeight: 'medium' }}
                            />
                        </Box>
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                            <strong>Địa điểm:</strong> {contest.location}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                            <strong>Thời gian:</strong> {format(new Date(contest.startTime), 'dd/MM/yyyy HH:mm')} - {format(new Date(contest.endTime), 'dd/MM/yyyy HH:mm')}
                        </Typography>
                        {contest.slogan && (
                            <Typography variant="caption" display="block" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                <strong>Slogan:</strong> {contest.slogan}
                            </Typography>
                        )}
                    </CardContent>
                </CardActionArea>
                <Button 
                    fullWidth 
                    size="medium" 
                    color="primary" 
                    onClick={() => onEdit?.(contest.id)}
                >
                    Chỉnh sửa 
                </Button>
            </Card>
        </Box>
    );
};

export default ContestCard;