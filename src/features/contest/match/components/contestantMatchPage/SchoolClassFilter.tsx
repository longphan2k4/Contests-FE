import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Card,
    Checkbox,
    Typography,
    Button,
    TextField,
    Divider,
    CircularProgress,
    IconButton,
    Collapse,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// --- INTERFACES (Không thay đổi) ---
export interface School {
    id: number;
    name: string;
}
export interface Class {
    id: number;
    name: string;
    schoolId: number;
}
interface Props {
    schools: School[];
    getClassesBySchool: (schoolId: number) => Promise<Class[]>;
    onApply: (filter: { schoolIds: number[]; classIds: number[] }) => void;
    setIsFilterOpen?: (isOpen: boolean) => void;
}

// --- CÁC COMPONENT ĐƯỢC STYLED ĐỂ TẠO LAYOUT MỚI ---

const FilterContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 1000,
    height: "551px",
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    borderRadius: typeof theme.shape.borderRadius === 'number'
        ? theme.shape.borderRadius * 2
        : `calc(${theme.shape.borderRadius} * 2)`,
    boxShadow: theme.shadows[3],
    overflow: 'hidden',
}));

const MainContent = styled(Box)({
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
});

const SectionPanel = styled(Box)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
}));

const PanelHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
}));

const PanelBody = styled(Box)({
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
});

const SchoolListItem = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    backgroundColor: selected ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// MỚI: Container cho lưới các trường học (2 cột)
const SchoolGridContainer = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Hiển thị 2 cột bằng nhau
    gap: theme.spacing(2), // Khoảng cách giữa các card trường học
    alignItems: 'start',
    animation: `${slideIn} 0.3s ease-out forwards`,
}));

// MỚI: Container cho danh sách lớp (dàn ngang, tự xuống dòng)
const ClassListContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap', // Tự động xuống dòng khi hết chỗ
    gap: theme.spacing(0, 2), // Khoảng cách giữa các lớp
    paddingLeft: theme.spacing(1),
    maxHeight: '120px', // Giới hạn chiều cao khoảng 3 dòng
    overflowY: 'auto', // Thêm thanh cuộn khi vượt quá chiều cao
}));

// MỚI: Item cho mỗi lớp (checkbox + tên)
const ClassItem = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    // Đặt chiều rộng tối thiểu để không bị vỡ layout khi tên lớp quá ngắn
    minWidth: '120px',
});


// === COMPONENT CHÍNH ===
const SchoolClassFilter: React.FC<Props> = ({ schools, getClassesBySchool, onApply, setIsFilterOpen }) => {
    // --- STATE MANAGEMENT (Không thay đổi) ---
    const [search, setSearch] = useState("");
    const [selectedSchools, setSelectedSchools] = useState<number[]>([]);
    const [classesBySchool, setClassesBySchool] = useState<{ [schoolId: number]: Class[] }>({});
    const [loadingClasses, setLoadingClasses] = useState<Set<number>>(new Set());
    const [selectedClasses, setSelectedClasses] = useState<{ [schoolId: number]: number[] }>({});
    const [expandedSchools, setExpandedSchools] = useState<{ [schoolId: number]: boolean }>({});


    // Lọc danh sách trường học dựa trên ô tìm kiếm
    const filteredSchools = useMemo(() =>
        schools.filter(s => s.name.toLowerCase().includes(search.toLowerCase())),
        [schools, search]
    );

    // Các trường đã chọn sẽ được hiển thị ở cột bên phải
    const schoolsToShowInClassPanel = useMemo(() =>
        schools.filter(s => selectedSchools.includes(s.id)),
        [schools, selectedSchools]
    );

    // Fetch danh sách lớp mỗi khi một trường mới được chọn
    useEffect(() => {
        selectedSchools.forEach(schoolId => {
            if (!classesBySchool[schoolId] && !loadingClasses.has(schoolId)) {
                setLoadingClasses(prev => new Set(prev).add(schoolId));
                getClassesBySchool(schoolId)
                    .then(classes => {
                        setClassesBySchool(prev => ({ ...prev, [schoolId]: classes }));
                        setExpandedSchools(prev => ({ ...prev, [schoolId]: true }));
                    })
                    .finally(() => {
                        setLoadingClasses(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(schoolId);
                            return newSet;
                        });
                    });
            }
        });
    }, [selectedSchools, getClassesBySchool, classesBySchool, loadingClasses]);

    // --- CÁC HÀM HANDLER (Không thay đổi) ---
    const handleSchoolCheck = (schoolId: number, checked: boolean) => {
        setSelectedSchools(prev =>
            checked ? [...prev, schoolId] : prev.filter(id => id !== schoolId)
        );
        if (!checked) {
            const newSelectedClasses = { ...selectedClasses };
            delete newSelectedClasses[schoolId];
            setSelectedClasses(newSelectedClasses);
            setExpandedSchools(prev => ({ ...prev, [schoolId]: false }));
        }
    };
    const handleClassCheck = (schoolId: number, classId: number, checked: boolean) => {
        setSelectedClasses(prev => ({
            ...prev,
            [schoolId]: checked
                ? [...(prev[schoolId] || []), classId]
                : (prev[schoolId] || []).filter(id => id !== classId)
        }));
    };
    const handleSelectAllSchools = (checked: boolean) => {
        setSelectedSchools(checked ? schools.map(s => s.id) : []);
        if (!checked) setSelectedClasses({});
    };
    const handleSelectAllClasses = (schoolId: number, checked: boolean) => {
        setSelectedClasses(prev => ({
            ...prev,
            [schoolId]: checked ? (classesBySchool[schoolId] || []).map(c => c.id) : []
        }));
    };
    const handleApply = () => {
        const schoolIds = selectedSchools;
        const classIds = Object.values(selectedClasses).flat();
        onApply({ schoolIds, classIds });
    };
    const toggleSchoolExpand = (schoolId: number) => {
        setExpandedSchools(prev => ({ ...prev, [schoolId]: !prev[schoolId] }));
    }

    return (
        <FilterContainer>
            {/* Nút đóng không thay đổi */}
            <Button
                size="small"
                color="error"
                onClick={() => setIsFilterOpen && setIsFilterOpen(false)}
                sx={{
                    position: "absolute", top: 12, right: 12, minWidth: 32, minHeight: 32,
                    fontSize: 20, fontWeight: "bold", p: 0, backgroundColor: "transparent",
                    "&:hover": { backgroundColor: "transparent", boxShadow: "none", border: "none", }
                }}
                title="Đóng bộ lọc"
            >
                ✕
            </Button>
            <MainContent>
                {/* ======================= SECTION 1: DANH SÁCH TRƯỜNG (Không thay đổi) ======================= */}
                <SectionPanel sx={{ width: '35%', borderRight: '1px solid', borderColor: 'divider' }}>
                    <PanelHeader>
                        <Typography variant="h6" fontSize={18} fontWeight="bold">Chọn trường</Typography>
                        <TextField
                            label="Tìm kiếm trường..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            fullWidth
                            size="small"
                            sx={{ mt: 1.5 }}
                        />
                    </PanelHeader>
                    <PanelBody>
                        <SchoolListItem>
                            <Checkbox
                                checked={schools.length > 0 && selectedSchools.length === schools.length}
                                indeterminate={selectedSchools.length > 0 && selectedSchools.length < schools.length}
                                onChange={e => handleSelectAllSchools(e.target.checked)}
                            />
                            <Typography variant="subtitle2" fontWeight="bold">Chọn tất cả</Typography>
                        </SchoolListItem>
                        <Divider sx={{ my: 1 }} />
                        {filteredSchools.map(school => (
                            <SchoolListItem
                                key={school.id}
                                selected={selectedSchools.includes(school.id)}
                                onClick={() => handleSchoolCheck(school.id, !selectedSchools.includes(school.id))}
                            >
                                <Checkbox
                                    checked={selectedSchools.includes(school.id)}
                                    readOnly
                                />
                                <Typography variant="body2" title={school.name}>{school.name}</Typography>
                            </SchoolListItem>
                        ))}
                    </PanelBody>
                </SectionPanel>

                {/* ======================= SECTION 2: DANH SÁCH LỚP THEO TRƯỜNG (Đã cập nhật) ======================= */}
                <SectionPanel sx={{ width: '65%' }}>
                    <PanelHeader>
                        <Typography variant="h6" fontSize={18} fontWeight="bold">
                            Chọn lớp ({Object.values(selectedClasses).flat().length} đã chọn)
                        </Typography>
                    </PanelHeader>
                    <PanelBody sx={{ p: 2 }}>
                        {schoolsToShowInClassPanel.length > 0 ? (
                            // CẬP NHẬT: Sử dụng SchoolGridContainer để tạo layout 2 cột
                            <SchoolGridContainer>
                                {schoolsToShowInClassPanel.map(school => {
                                    const classes = classesBySchool[school.id] || [];
                                    const selectedCls = selectedClasses[school.id] || [];
                                    const isLoading = loadingClasses.has(school.id);
                                    const isExpanded = expandedSchools[school.id] ?? false;

                                    return (
                                        // Bỏ component ClassGroupWrapper không cần thiết
                                        <Card key={school.id} variant="outlined">
                                            <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleSchoolExpand(school.id)}>
                                                <IconButton size="small" sx={{ mr: 0.5 }}>
                                                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                                <Typography variant="subtitle1" fontWeight="bold" flex={1} noWrap title={school.name}>{school.name}</Typography>
                                                {isLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
                                            </Box>
                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                <Divider />
                                                <Box sx={{ p: 1.5 }}>
                                                    <Box sx={{ pl: 1, display: "flex", alignItems: "center", mb: 1 }}>
                                                        <Checkbox
                                                            size="small"
                                                            checked={classes.length > 0 && selectedCls.length === classes.length}
                                                            indeterminate={selectedCls.length > 0 && selectedCls.length < classes.length}
                                                            disabled={isLoading}
                                                            onChange={e => handleSelectAllClasses(school.id, e.target.checked)}
                                                        />
                                                        <Typography variant="body2">Tất cả lớp</Typography>
                                                    </Box>
                                                    
                                                    {/* CẬP NHẬT: Dùng ClassListContainer để dàn ngang các lớp */}
                                                    <ClassListContainer>
                                                        {classes.map(cls => (
                                                            <ClassItem key={cls.id}>
                                                                <Checkbox
                                                                    size="small"
                                                                    checked={selectedCls.includes(cls.id)}
                                                                    onChange={e => handleClassCheck(school.id, cls.id, e.target.checked)}
                                                                />
                                                                <Typography variant="body2">{cls.name}</Typography>
                                                            </ClassItem>
                                                        ))}
                                                    </ClassListContainer>
                                                </Box>
                                            </Collapse>
                                        </Card>
                                    )
                                })}
                            </SchoolGridContainer>
                        ) : (
                            <Box sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
                                <Typography>Chọn một trường từ danh sách bên trái</Typography>
                                <Typography variant="caption">để xem và chọn các lớp tương ứng.</Typography>
                            </Box>
                        )}
                    </PanelBody>
                </SectionPanel>
            </MainContent>

            {/* Nút Áp dụng không thay đổi */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button variant="contained" size="large" fullWidth onClick={handleApply}>
                    Áp dụng bộ lọc
                </Button>
            </Box>
        </FilterContainer>
    );
};

export default SchoolClassFilter;