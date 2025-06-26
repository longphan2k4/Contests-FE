import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack, InputAdornment,
  FormControlLabel,
  Divider, Radio,
  RadioGroup,
  Chip,
  Avatar,
  Autocomplete,
  Paper,
} from "@mui/material";
import { Button } from "@mui/material";
import { Pagination } from "@mui/material";

import {
  type UpdateContestantInput,
  type ContestantQueryInput,
  type Contestant,
  type pagination,
  type listStatus,
  type listRound,
} from "../../contestant/types/contestant.shame";

import CreateContestant from "../components/contestantMatchPage/CreateContestant";
import ViewContestant from "../components/contestantMatchPage/ViewContestant";
import Editecontestant from "../components/contestantMatchPage/EditeContestant";
import Listcontestant from "../components/contestantMatchPage/ListContestant";
import { useToast } from "../../../../contexts/toastContext";
import ConfirmDelete from "../../../../components/Confirm";
import CreateUser from "../../../admin/user/components/CreateUser";
import { CreateUser as CreateUserAPI } from "../../../admin/user/service/api";
import { type CreateUserInput } from "../../../admin/user/types/user.shame";
import FormAutocompleteFilter from "../../../../components/FormAutocompleteFilter";

import {
  useGetAll,
  useUpdate,
  useDelete,
  useDeletes,
  useContestStatus,
  useListRound,
} from "../hook/contestantMatchPage/useContestant";
import AddIcon from "@mui/icons-material/Add";
import GroupWorkIcon from "@mui/icons-material/GroupWork";

import SearchIcon from "@mui/icons-material/Search";
import { 
  GroupDivisionService, 
  type JudgeInfo, 
  type SchoolInfo, 
  type ClassInfo,
  type GroupInfo 
} from "../service/group-division.service";
import { useGroupDivision } from "../hook/useGroupDivision";

const ContestantMatchPage: React.FC = () => {
  const [contestant, setcontestant] = useState<Contestant[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<pagination>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false); const [isEditOpen, setIsEditOpen] = useState(false);
  const [isComfirmDelete, setIsComfirmDelete] = useState(false);
  // const [isComfirmDeleteMany, setIsComfirmDeleteMany] = useState(false);
  const [isGroupDivisionOpen, setIsGroupDivisionOpen] = useState(false);  // Group division states
  const [groupDivisionStep, setGroupDivisionStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [numberOfGroups, setNumberOfGroups] = useState<number>(0);
  const [maxMembersPerGroup, setMaxMembersPerGroup] = useState<number>(0);
  const [shouldAutoDistribute, setShouldAutoDistribute] = useState(false);

  // xác nhận quay lại bước trước trong phân chia nhóm
  const [isConfirmBackOpen, setIsConfirmBackOpen] = useState(false);

  // Xác nhận xóa nhóm
  const [isConfirmDeleteGroupOpen, setIsConfirmDeleteGroupOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{ index: number; name: string; contestantCount: number } | null>(null);

  // Modal tạo trọng tài mới
  const [isCreateJudgeOpen, setIsCreateJudgeOpen] = useState(false);
  
  // Flag để tránh useEffect override local changes
  const [skipSyncFromAPI, setSkipSyncFromAPI] = useState(false);

  // Function to allow sync from API again (when user wants to refresh or navigate)
  const allowSyncFromAPI = useCallback(() => {
    setSkipSyncFromAPI(false);
  }, []);

  // Group management states
  const [groups, setGroups] = useState<{ [key: number]: Contestant[] }>({});
  const [activeGroupTab, setActiveGroupTab] = useState<number>(0);
  const [totalGroups, setTotalGroups] = useState<number>(0);
  const [hasInitializedGroups, setHasInitializedGroups] = useState<boolean>(false);

  // Drag scroll states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [filter, setFilter] = useState<ContestantQueryInput>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [listStatus, setListStatus] = useState<listStatus[]>([]);
  const [listRound, setListRound] = useState<listRound[]>([]);

  // Judge-related states
  const [availableJudges, setAvailableJudges] = useState<JudgeInfo[]>([]);
  const [judgeSearchTerm, setJudgeSearchTerm] = useState<string>('');
  const [assignedJudges, setAssignedJudges] = useState<{ [groupIndex: number]: JudgeInfo | null }>({});
  const [isLoadingJudges, setIsLoadingJudges] = useState(false);
  
  // New filter states
  const [listSchools, setListSchools] = useState<SchoolInfo[]>([]);
  const [listClasses, setListClasses] = useState<ClassInfo[]>([]);
  const [listMatches, setListMatches] = useState<any[]>([]);
  const [listGroups, setListGroups] = useState<GroupInfo[]>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  
  const [isOpenTip, setIsOpenTip] = useState(false);
  const toggleTip = () => {
    setIsOpenTip(!isOpenTip);
  };
  const { showToast } = useToast();
  const { slug, matchId: matchIdParam } = useParams();
  const matchId = matchIdParam ? parseInt(matchIdParam) : null;

  // Hook để lấy danh sách nhóm hiện tại
  const {
    groups: existingGroups,
    isLoading: isLoadingGroups,
    hasGroups,
    refetch: refetchGroups
  } = useGroupDivision(matchId);

  const {
    data: contestantData,
    isLoading: issLoading,
    isError: issError,
    refetch: refetchs,
  } = useGetAll({ ...filter, matchId: matchId || undefined }, slug ?? null);

  // const { mutate: mutateCreates } = useCreates();

  const { mutate: mutateUpdate } = useUpdate();

  const { mutate: mutateDelete } = useDelete();

  const { mutate: mutateDeletes } = useDeletes();

  const { data: roundData } = useListRound(slug ?? null);

  const { data: statusData } = useContestStatus();


  useEffect(() => {
    if (roundData) {
      setListRound(roundData.data);
    }
  }, [roundData]);
  useEffect(() => {
    if (statusData?.data?.options?.length) {
      setListStatus(statusData?.data?.options);
    } else {
      setListStatus([]);
    }
  }, [statusData]);  useEffect(() => {
    if (contestantData) {
      console.log('contestantData:', contestantData); // Debug log
      // Try both possible keys
      const contestants = contestantData.data.contestantes || contestantData.data.Contestantes || [];
      console.log('contestants:', contestants); // Debug log
      
      // Bây giờ backend đã trả về đầy đủ thông tin, không cần mapping thêm
      setcontestant(contestants);
      setPagination(contestantData.data.pagination);
    }
  }, [contestantData]);

  // Xử lý khi có dữ liệu nhóm từ API
  useEffect(() => {
    console.log('Sync effect triggered:', {
      hasExistingGroups: existingGroups?.length > 0,
      skipSyncFromAPI,
      activeGroupTab,
      hasInitializedGroups
    });
    
    if (existingGroups && existingGroups.length > 0 && !skipSyncFromAPI) {
      console.log('Syncing data from API...');
      // Chuyển đổi dữ liệu từ API thành format local state
      const convertedGroups: { [key: number]: Contestant[] } = {};
      const convertedJudges: { [groupIndex: number]: JudgeInfo | null } = {};      existingGroups.forEach((group, index) => {
        // Convert contestants from GroupInfo to Contestant format
        convertedGroups[index] = group.contestantMatches.map(cm => ({
          id: cm.contestant.id,
          fullName: cm.contestant.student.fullName,
          roundName: cm.contestant.round.name,
          status: ' compete' as const,
          // Add required fields for Contestant type - sẽ được lấy từ API khác
          schoolName: '', // Tạm thời để trống, sẽ được cập nhật
          className: '', // Tạm thời để trống, sẽ được cập nhật
          schoolId: 0, // Tạm thời để 0, sẽ được cập nhật
          classId: 0, // Tạm thời để 0, sẽ được cập nhật
          studentCode: cm.contestant.student.studentCode || null,
          groupName: group.name,
          groupId: group.id,
        }));

        // Assign judges
        convertedJudges[index] = group.judge;
      });

      // Cập nhật state
      setGroups(convertedGroups);
      setAssignedJudges(convertedJudges);
      setTotalGroups(existingGroups.length);
      
      // Chỉ reset về tab 0 nếu:
      // 1. Lần đầu tiên khởi tạo nhóm, HOẶC
      // 2. Tab hiện tại không hợp lệ (vượt quá số nhóm hiện có)
      if (!hasInitializedGroups || activeGroupTab >= existingGroups.length) {
        setActiveGroupTab(0);
      }
      
      // Đánh dấu đã khởi tạo nhóm
      setHasInitializedGroups(true);

      // Nếu có nhóm thì chuyển thẳng đến bước 2
      if (isGroupDivisionOpen) {
        setGroupDivisionStep(2);
      }
    }
  }, [existingGroups, isGroupDivisionOpen, skipSyncFromAPI, activeGroupTab, hasInitializedGroups]);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);
  // Group division method handlers
  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    // Clear inputs when switching methods
    if (method !== 'byNumberOfGroups') {
      setNumberOfGroups(0);
    }
    if (method !== 'byMaxMembers') {
      setMaxMembersPerGroup(0);
    }
  };
  const canGoNext = () => {
    if (!selectedMethod) return false;

    // Check if selected method has required inputs
    if (selectedMethod === 'byNumberOfGroups' && numberOfGroups <= 0) return false;
    if (selectedMethod === 'byMaxMembers' && maxMembersPerGroup <= 0) return false;

    return true;
  };  // Initialize groups when moving to step 2
  const initializeGroups = () => {
    let requiredGroupCount = 0;

    if (selectedMethod === 'byNumberOfGroups') {
      requiredGroupCount = numberOfGroups;
    } else if (selectedMethod === 'byMaxMembers') {
      // Tính toán dựa trên số thí sinh ĐÃ CHỌN, chứ không phải tổng số
      requiredGroupCount = Math.ceil(selectedIds.length / maxMembersPerGroup);
    } else if (selectedMethod === 'random') {
      requiredGroupCount = 4; // Hoặc một con số bạn cho phép người dùng nhập
    }

    // Luôn tạo lại cấu trúc nhóm mới khi khởi tạo từ bước 1
    setTotalGroups(requiredGroupCount);
    const initialGroups: { [key: number]: Contestant[] } = {};
    for (let i = 0; i < requiredGroupCount; i++) {
      initialGroups[i] = [];
    }
    setGroups(initialGroups);
    setActiveGroupTab(0);
  };
  const distributeContestantsEvenly = useCallback((selectedContestants: Contestant[]) => {
    // Set flag để tránh useEffect override
    setSkipSyncFromAPI(true);
    
    if (selectedMethod === 'byNumberOfGroups' && totalGroups > 0) {
      const newGroups: { [key: number]: Contestant[] } = {};

      // Initialize empty groups
      for (let i = 0; i < totalGroups; i++) {
        newGroups[i] = [];
      }

      // Distribute contestants evenly
      selectedContestants.forEach((contestant, index) => {
        const groupIndex = index % totalGroups;
        newGroups[groupIndex].push(contestant);
      });

      setGroups(newGroups);
    } else if (selectedMethod === 'byMaxMembers' && maxMembersPerGroup > 0) {
      const newGroups: { [key: number]: Contestant[] } = {};
      let currentGroupIndex = 0;
      let currentGroupSize = 0;

      // Initialize first group
      newGroups[0] = [];

      selectedContestants.forEach((contestant) => {
        // If current group is full, move to next group
        if (currentGroupSize >= maxMembersPerGroup) {
          currentGroupIndex++;
          currentGroupSize = 0;
          newGroups[currentGroupIndex] = [];
        }

        newGroups[currentGroupIndex].push(contestant);
        currentGroupSize++;
      });

      // Update total groups based on actual groups created
      const actualGroupCount = currentGroupIndex + 1;
      setTotalGroups(actualGroupCount);

      // Initialize any missing groups for tabs display
      for (let i = 0; i < actualGroupCount; i++) {
        if (!newGroups[i]) {
          newGroups[i] = [];
        }
      }

      setGroups(newGroups);
    } else if (selectedMethod === 'random' && totalGroups > 0) {
      // Shuffle contestants randomly
      const shuffledContestants = [...selectedContestants].sort(() => Math.random() - 0.5);
      const newGroups: { [key: number]: Contestant[] } = {};
      // Initialize empty groups
      for (let i = 0; i < totalGroups; i++) {
        newGroups[i] = [];
      }

      // Distribute shuffled contestants evenly
      shuffledContestants.forEach((contestant, index) => {
        const groupIndex = index % totalGroups;
        newGroups[groupIndex].push(contestant);
      });

      setGroups(newGroups);
    }
    
    // Reset flag sau 1 giây
    setTimeout(() => {
      setSkipSyncFromAPI(false);
    }, 1000);
  }, [selectedMethod, totalGroups, maxMembersPerGroup]);

  // Remove contestant from group (local only)
  const removeContestantFromGroup = useCallback((groupIndex: number, contestantId: number) => {
    console.log('removeContestantFromGroup called:', { groupIndex, contestantId, currentGroups: groups });
    
    // Tìm thí sinh để kiểm tra và hiển thị thông tin
    const currentGroup = groups[groupIndex];
    if (!currentGroup) {
      console.error('Group not found:', groupIndex);
      showToast('Nhóm không tồn tại', 'error');
      return;
    }

    const contestant = currentGroup.find(c => c.id === contestantId);
    if (!contestant) {
      console.error('Contestant not found in group:', { contestantId, groupIndex, currentGroup });
      showToast('Thí sinh không tồn tại trong nhóm này', 'error');
      return;
    }

    console.log('Removing contestant:', contestant.fullName, 'from group', groupIndex + 1);

    // Set flag để tránh useEffect override trong thời gian dài hơn
    setSkipSyncFromAPI(true);
    
    // Xóa chỉ thí sinh được chỉ định khỏi nhóm được chỉ định
    setGroups(prevGroups => {
      const newGroups = { ...prevGroups };
      const originalLength = newGroups[groupIndex].length;
      newGroups[groupIndex] = newGroups[groupIndex].filter(c => c.id !== contestantId);
      
      console.log('Group updated:', {
        groupIndex,
        originalLength,
        newLength: newGroups[groupIndex].length,
        removedId: contestantId
      });
      
      return newGroups;
    });
    
    showToast(`Đã xóa tạm thời "${contestant.fullName}" khỏi Nhóm ${groupIndex + 1}`, 'info');
  }, [groups, showToast]);

  // Remove all contestants from a specific group (local only)
  const removeAllContestantsFromGroup = useCallback((groupIndex: number) => {
    console.log('removeAllContestantsFromGroup called:', { groupIndex, currentGroups: groups });
    
    const currentGroup = groups[groupIndex];
    if (!currentGroup || currentGroup.length === 0) {
      console.warn('Group is empty or not found:', groupIndex);
      showToast('Nhóm này không có thí sinh nào để xóa', 'warning');
      return;
    }

    const contestantCount = currentGroup.length;
    console.log('Removing all contestants from group:', groupIndex + 1, 'count:', contestantCount);

    // Set flag để tránh useEffect override
    setSkipSyncFromAPI(true);
    
    // Xóa tất cả thí sinh khỏi nhóm được chỉ định
    setGroups(prevGroups => {
      const newGroups = { ...prevGroups };
      newGroups[groupIndex] = [];
      
      console.log('All contestants removed from group:', {
        groupIndex,
        previousCount: contestantCount,
        newLength: newGroups[groupIndex].length
      });
      
      return newGroups;
    });
    
    showToast(`Đã xóa tạm thời tất cả ${contestantCount} thí sinh khỏi Nhóm ${groupIndex + 1}`, 'info');
  }, [groups, showToast]);

  // Handle next button click
  const handleNext = () => {
    if (groupDivisionStep === 1) {
      // 1. Kiểm tra xem người dùng đã chọn thí sinh để chia chưa
      if (selectedIds.length === 0) {
        showToast("Vui lòng chọn ít nhất một thí sinh từ danh sách để chia nhóm.", "warning");
        return; // Dừng lại nếu chưa có thí sinh nào được chọn
      }

      // 2. Vẫn gọi initializeGroups để tạo cấu trúc nhóm trống
      initializeGroups();

      // 3. Đặt cờ để useEffect thực hiện việc phân bổ
      setShouldAutoDistribute(true);

      // 4. Chuyển sang bước 2
      setGroupDivisionStep(2);
    } else {
      // Logic cho các bước tiếp theo nếu có (ví dụ: Bước 3: Hoàn thành)
      setGroupDivisionStep(prev => prev + 1);
    }
  };

  // Thêm useEffect này vào component ContestantMatchPage

  useEffect(() => {
    // Chỉ thực thi khi chuyển sang bước 2 và có cờ yêu cầu phân bổ
    if (groupDivisionStep === 2 && shouldAutoDistribute) {
      // Lấy danh sách các object thí sinh từ các ID đã chọn
      const contestantsToDistribute = selectedIds
        .map(id => contestant.find(c => c.id === id))
        .filter((c): c is Contestant => c !== undefined);

      if (contestantsToDistribute.length > 0) {
        // Gọi hàm phân bổ đã có
        distributeContestantsEvenly(contestantsToDistribute);
      }

      // Reset cờ và danh sách đã chọn sau khi hoàn tất
      setShouldAutoDistribute(false);
      setSelectedIds([]); // Xóa các lựa chọn ở danh sách chính để tránh nhầm lẫn
    }
  }, [groupDivisionStep, shouldAutoDistribute, contestant, selectedIds, distributeContestantsEvenly]);


  // back
  const handleBack = () => {
    // Kiểm tra xem có đang ở bước 2 và đã có thí sinh nào được chia nhóm chưa
    const hasProgress = Object.values(groups).some(group => group.length > 0);

    if (groupDivisionStep === 2 && hasProgress) {
      // Nếu có tiến trình, mở dialog xác nhận
      setIsConfirmBackOpen(true);
    } else {
      // Nếu không, quay lại bước 1 bình thường
      setGroupDivisionStep(prev => prev - 1);
    }
  };

  const resetGroupDivision = useCallback(() => {
    // Đặt lại tất cả state liên quan đến việc chia nhóm
    setGroups({});
    setTotalGroups(0);
    setSelectedMethod('');
    setNumberOfGroups(0);
    setMaxMembersPerGroup(0);
    setActiveGroupTab(0);
    setHasInitializedGroups(false); // Reset flag khởi tạo nhóm

    // Quay lại bước 1
    setGroupDivisionStep(1);

    // Đóng dialog sau khi thực hiện
    setIsConfirmBackOpen(false);
  }, []);

  // const handeDeletes = (ids: DeleteContestanteInput) => {
  //   mutateDeletes(ids, {
  //     onSuccess: data => {
  //       data.messages.forEach((item: any) => {
  //         if (item.status === "error") {
  //           showToast(item.msg, "error");
  //         } else {
  //           showToast(item.msg, "success");
  //         }
  //       });
  //       refetchs();
  //     },
  //     onError: () => {
  //       showToast("Xóa thí sinh học thất bại");
  //     },
  //   });
  // };

  const handleUpdate = (payload: UpdateContestantInput) => {
    if (selectedId) {
      mutateUpdate(
        { id: selectedId, payload },
        {
          onSuccess: () => {
            showToast(`Cập nhật thí sinh thành công`, "success");
            refetchs();
          },
          onError: (err: any) => {
            if (err.response?.data?.message)
              showToast(err.response?.data?.message, "error");
          },
        }
      );
    }
  };

  const handleDelete = useCallback((id: number | null) => {
    if (!id) return;
    mutateDelete(id, {
      onSuccess: () => {
        showToast(`Xóa thí sinh học thành công`);
        refetchs();
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message, "error");
      },
    });
  }, []);
  const handleAction = useCallback(
    (type: "view" | "edit" | "delete", id: number) => {
      setSelectedId(id);

      if (type === "delete") {
        setIsComfirmDelete(true);
      }
      if (type === "view") setIsViewOpen(true);
      if (type === "edit") setIsEditOpen(true);
    },
    [handleDelete]
  );  // Handle adding selected contestants to current active group only
  useEffect(() => {
    // Chỉ chạy khi ở bước 2, có thí sinh được chọn, VÀ KHÔNG phải đang trong quá trình phân bổ tự động
    if (groupDivisionStep === 2 && selectedIds.length > 0 && !shouldAutoDistribute) {
      const selectedContestants = selectedIds
        .map(id => contestant.find(c => c.id === id))
        .filter((c): c is Contestant => c !== undefined);

      if (selectedContestants.length > 0) {
        const allAssignedContestants = Object.values(groups).flat();
        const newContestants = selectedContestants.filter(newContestant =>
          !allAssignedContestants.some(existing => existing.id === newContestant.id)
        );

        if (newContestants.length > 0) {
          console.log('Adding contestants to group:', { activeGroupTab, newContestants: newContestants.length });
          // Set flag để tránh useEffect override - KHÔNG tự động reset
          setSkipSyncFromAPI(true);
          
          setGroups(prev => {
            const updated = {
              ...prev,
              [activeGroupTab]: [...(prev[activeGroupTab] || []), ...newContestants]
            };
            console.log('Groups after adding contestants:', updated);
            return updated;
          });
          
          // Không reset flag tự động nữa - để user tự quyết định khi nào sync lại
          showToast(`Đã thêm ${newContestants.length} thí sinh vào Nhóm ${activeGroupTab + 1}`, 'success');
        }
      }

      setSelectedIds([]);
    }
  }, [selectedIds, groupDivisionStep, contestant, groups, activeGroupTab, shouldAutoDistribute, showToast]);
  // Fetch judges when component mounts or when search term changes
  const fetchJudges = useCallback(async (search: string = '') => {
    try {
      setIsLoadingJudges(true);
      const response = await GroupDivisionService.getAvailableJudges({
        search,
        page: 1,
        limit: 50
      });

      setAvailableJudges(response.judges || []);
    } catch (error) {
      console.error('Error fetching judges:', error);
      showToast('Không thể tải danh sách trọng tài', 'error');
    } finally {
      setIsLoadingJudges(false);
    }
  }, [showToast]);

  // Fetch judges on component mount
  useEffect(() => {
    fetchJudges();
  }, [fetchJudges]);

  // Debounce judge search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (judgeSearchTerm !== '') {
        fetchJudges(judgeSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [judgeSearchTerm, fetchJudges]);

  // Fetch schools data
  const fetchSchools = useCallback(async () => {
    try {
      setIsLoadingSchools(true);
      const schools = await GroupDivisionService.getSchools();
      setListSchools(schools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      showToast('Không thể tải danh sách trường học', 'error');
    } finally {
      setIsLoadingSchools(false);
    }
  }, [showToast]);

  // Fetch classes by school
  const fetchClassesBySchool = useCallback(async (schoolId: number) => {
    try {
      setIsLoadingClasses(true);
      const classes = await GroupDivisionService.getClassesBySchool(schoolId);
      setListClasses(classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showToast('Không thể tải danh sách lớp học', 'error');
    } finally {
      setIsLoadingClasses(false);
    }
  }, [showToast]);

  // Fetch current groups - chỉ lấy nhóm của trận đấu hiện tại
  const fetchCurrentGroups = useCallback(async () => {
    if (!matchId) return;
    
    try {
      const groups = await GroupDivisionService.getCurrentGroups(matchId);
      setListGroups(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }, [matchId]);

  // Load schools on component mount
  useEffect(() => {
    fetchSchools();
    fetchCurrentGroups();
    
    // Reset groupId filter nếu không có matchId
    if (!matchId) {
      setFilter(prev => ({
        ...prev,
        groupId: undefined
      }));
    }
  }, [fetchSchools, fetchCurrentGroups, matchId]);

  // Load classes when school is selected
  useEffect(() => {
    if (filter.schoolId) {
      fetchClassesBySchool(filter.schoolId);
    } else {
      setListClasses([]);
    }
  }, [filter.schoolId, fetchClassesBySchool]);

  // Reset class filter when school changes
  useEffect(() => {
    if (filter.schoolId && filter.classId) {
      // Check if current class still belongs to selected school
      const currentClass = listClasses.find(c => c.id === filter.classId);
      if (!currentClass) {
        setFilter(prev => ({
          ...prev,
          classId: undefined
        }));
      }
    }
  }, [filter.schoolId, filter.classId, listClasses]);

  // Handle judge assignment
  const handleJudgeAssign = (groupIndex: number, judge: JudgeInfo | null) => {
    setAssignedJudges(prev => ({
      ...prev,
      [groupIndex]: judge
    }));
  };

  // Handle adding new group
  const handleAddNewGroup = useCallback(async () => {
    try {
      if (!matchId) {
        showToast('Không tìm thấy ID trận đấu', 'error');
        return;
      }

      // Kiểm tra có trọng tài nào chưa được assign không
      const assignedJudgeIds = Object.values(assignedJudges)
        .filter(judge => judge !== null)
        .map(judge => judge!.id);
      
      const unassignedJudges = availableJudges.filter(judge => 
        !assignedJudgeIds.includes(judge.id)
      );

      if (unassignedJudges.length === 0) {
        showToast('Không có trọng tài nào khả dụng để tạo nhóm mới', 'warning');
        return;
      }

      // Lấy trọng tài đầu tiên chưa được assign
      const selectedJudge = unassignedJudges[0];
      const newGroupName = `Nhóm ${totalGroups + 1}`;

      // Gọi API tạo nhóm mới
      await GroupDivisionService.createGroup(
        matchId,
        newGroupName,
        selectedJudge.id
      );

      // Cập nhật local state
      const newGroupIndex = totalGroups;
      setTotalGroups(prev => prev + 1);
      setGroups(prev => ({
        ...prev,
        [newGroupIndex]: []
      }));
      setAssignedJudges(prev => ({
        ...prev,
        [newGroupIndex]: selectedJudge
      }));

      // Chuyển đến tab nhóm mới
      setActiveGroupTab(newGroupIndex);

      // Refresh danh sách nhóm để đồng bộ với server
      setTimeout(() => {
        fetchCurrentGroups();
        refetchGroups();
      }, 500);

      showToast(`Tạo nhóm "${newGroupName}" thành công`, 'success');
    } catch (error) {
      console.error('Error creating new group:', error);
      let errorMessage = 'Lỗi khi tạo nhóm mới';
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      showToast(errorMessage, 'error');
    }
  }, [matchId, availableJudges, assignedJudges, totalGroups, fetchCurrentGroups, refetchGroups, showToast]);

  // Handle create new judge
  const handleCreateJudge = useCallback(async (data: CreateUserInput) => {
    try {
      await CreateUserAPI(data);
      showToast(`Tạo trọng tài "${data.username}" thành công`, 'success');
      
      // Reload danh sách trọng tài sau khi tạo thành công
      await fetchJudges('');
      
      setIsCreateJudgeOpen(false);
    } catch (error) {
      console.error('Error creating judge:', error);
      let errorMessage = 'Lỗi khi tạo trọng tài mới';
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      showToast(errorMessage, 'error');
    }
  }, [fetchJudges, showToast]);

  // Drag scroll handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (e.currentTarget as HTMLElement).offsetLeft);
    setScrollLeft((e.currentTarget as HTMLElement).scrollLeft);
    (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (e.currentTarget as HTMLElement).offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    (e.currentTarget as HTMLElement).scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    setIsDragging(false);
    (e.currentTarget as HTMLElement).style.cursor = 'grab';
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    setIsDragging(false);
    (e.currentTarget as HTMLElement).style.cursor = 'grab';
  }, []);

  // Get available judges for a specific group (excluding already assigned ones)
  const getAvailableJudgesForGroup = useCallback((groupIndex: number) => {
    const assignedJudgeIds = Object.entries(assignedJudges)
      .filter(([idx, judge]) => parseInt(idx) !== groupIndex && judge !== null)
      .map(([, judge]) => judge!.id);
    
    return availableJudges.filter(judge => !assignedJudgeIds.includes(judge.id));
  }, [availableJudges, assignedJudges]);

  // Helper function to count actually assigned judges (excluding null values)
  const getAssignedJudgesCount = useCallback(() => {
    return Object.values(assignedJudges).filter(judge => judge !== null).length;
  }, [assignedJudges]);

  // Helper function to check if all judges are assigned
  const areAllJudgesAssigned = useCallback(() => {
    return availableJudges.length > 0 && getAssignedJudgesCount() >= availableJudges.length;
  }, [availableJudges.length, getAssignedJudgesCount]);

  // Handle delete group
  const handleDeleteGroup = useCallback((groupIndex: number) => {
    const group = existingGroups?.[groupIndex];
    if (!group) return;

    const contestantCount = groups[groupIndex]?.length || 0;
    setGroupToDelete({
      index: groupIndex,
      name: group.name,
      contestantCount
    });
    setIsConfirmDeleteGroupOpen(true);
  }, [existingGroups, groups]);

  // Confirm delete group
  const confirmDeleteGroup = useCallback(async () => {
    if (!groupToDelete) return;

    try {
      const group = existingGroups?.[groupToDelete.index];
      if (!group) {
        showToast('Không tìm thấy nhóm để xóa', 'error');
        return;
      }

      // Gọi API xóa nhóm
      await GroupDivisionService.deleteGroup(group.id);

      // Thay vì cập nhật local state phức tạp, chúng ta sẽ refresh toàn bộ data từ server
      // để đảm bảo consistency và tránh lỗi reindex
      
      // Refresh data từ server ngay lập tức
      await refetchGroups();
      await fetchCurrentGroups();

      const message = groupToDelete.contestantCount > 0
        ? `Xóa nhóm "${groupToDelete.name}" và ${groupToDelete.contestantCount} thí sinh thành công`
        : `Xóa nhóm "${groupToDelete.name}" thành công`;

      showToast(message, 'success');
      
      // Reset về tab đầu tiên để tránh lỗi khi tab hiện tại bị xóa
      setActiveGroupTab(0);
      
    } catch (error) {
      console.error('Error deleting group:', error);
      let errorMessage = 'Lỗi khi xóa nhóm';
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        errorMessage = response?.data?.message || errorMessage;
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsConfirmDeleteGroupOpen(false);
      setGroupToDelete(null);
    }
  }, [groupToDelete, existingGroups, fetchCurrentGroups, refetchGroups, showToast]);

  // Debug useEffect to log button state
  useEffect(() => {
    const assignedCount = getAssignedJudgesCount();
    const shouldDisable = availableJudges.length === 0 || areAllJudgesAssigned();
    
    console.log('Button disable debug:', {
      availableJudges: availableJudges.length,
      assignedJudges: assignedCount,
      assignedJudgesState: assignedJudges,
      shouldDisable,
      reason: availableJudges.length === 0 ? 'No judges available' : 
              areAllJudgesAssigned() ? 'All judges assigned' : 'Can add group'
    });
  }, [availableJudges, assignedJudges, getAssignedJudgesCount, areAllJudgesAssigned]);

  // Không cần client-side filtering nữa vì tất cả đã được xử lý server-side
  const displayedContestants = useMemo(() => {
    return contestant;
  }, [contestant]);

  if (issLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  } if (issError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={<Button onClick={() => refetchs}>Thử lại</Button>}
        >
          Không thể tải danh danh sách thí sinh
        </Alert>
      </Box>
    );
  } return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5">Quản lý thí sinh </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>            <Button
            variant="outlined"
            startIcon={<GroupWorkIcon />}
            onClick={() => {
              // Reset flag khi mở/đóng modal để cho phép sync lại dữ liệu
              allowSyncFromAPI();
              setIsGroupDivisionOpen(!isGroupDivisionOpen);
              // Nếu mở group division lần đầu và đã có nhóm, chuyển đến step 2
              if (!isGroupDivisionOpen && hasGroups) {
                setGroupDivisionStep(2);
              } else if (!isGroupDivisionOpen) {
                setGroupDivisionStep(1);
              }
            }}
            color={isGroupDivisionOpen ? "primary" : "inherit"}
          >
            {hasGroups ? "Chỉnh sửa nhóm" : "Chia nhóm"}
          </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreate}
            >
              Thêm thí sinh
            </Button>
          </Box>
        </Box>      {/*  list card */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          useFlexGap
          flexWrap="wrap"
          sx={{
            alignItems: "stretch",
            mb: 2,
            gap: 2,
          }}
        >
          {/* Tìm kiếm */}
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={filter.search || ""}
            onChange={e =>
              setFilter(prev => ({
                ...prev,
                search: e.target.value,
              }))
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Bộ lọc vòng đấu */}
          <FormAutocompleteFilter
            label="Vòng đấu"
            options={[
              { label: "Tất cả", value: "all" },
              ...listRound.map(s => ({
                label: s.name,
                value: s.id,
              })),
            ]}
            value={filter.roundId ?? "all"}
            onChange={(val: string | number | undefined) =>
              setFilter(prev => ({
                ...prev,
                roundId: val === "all" ? undefined : Number(val),
              }))
            }
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Trạng thái */}
          <FormAutocompleteFilter
            label="Trạng thái"
            options={[
              { label: "Tất cả", value: "all" },
              ...listStatus.map(s => ({
                label: s.label,
                value: s.value,
              })),
            ]}
            value={filter.status ?? "all"}
            onChange={(val: string | number | undefined) =>
              setFilter(prev => ({
                ...prev,
                status:
                  val === "all"
                    ? undefined
                    : (val as "compete" | "eliminate" | "advanced"),
              }))
            }
            sx={{ flex: 1, minWidth: 200 }}
          />

          {/* Trường học */}
          <FormAutocompleteFilter
            label="Trường học"
            options={[
              { label: "Tất cả", value: "all" },
              ...listSchools.map(school => ({
                label: school.name,
                value: school.id,
              })),
            ]}
            value={filter.schoolId ?? "all"}
            onChange={(val: string | number | undefined) =>
              setFilter(prev => ({
                ...prev,
                schoolId: val === "all" ? undefined : Number(val),
                classId: undefined, // Reset class when school changes
              }))
            }
            sx={{ flex: 1, minWidth: 200 }}
            loading={isLoadingSchools}
          />

          {/* Lớp học */}
          <FormAutocompleteFilter
            label="Lớp học"
            options={[
              { label: "Tất cả", value: "all" },
              ...listClasses.map(cls => ({
                label: cls.name,
                value: cls.id,
              })),
            ]}
            value={filter.classId ?? "all"}
            onChange={(val: string | number | undefined) =>
              setFilter(prev => ({
                ...prev,
                classId: val === "all" ? undefined : Number(val),
              }))
            }
            sx={{ flex: 1, minWidth: 200 }}
            disabled={!filter.schoolId}
            loading={isLoadingClasses}
          />

          {/* Nhóm - chỉ hiển thị khi có matchId */}
          {matchId && (
            <FormAutocompleteFilter
              label="Nhóm"
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Chưa phân nhóm", value: "unassigned" },
                ...listGroups.map(group => ({
                  label: group.name,
                  value: group.id,
                })),
              ]}
              value={filter.groupId ?? "all"}
              onChange={(val: string | number | undefined) =>
                setFilter(prev => ({
                  ...prev,
                  groupId: val === "all" ? undefined : val === "unassigned" ? -1 : Number(val),
                }))
              }
              sx={{ flex: 1, minWidth: 200 }}
            />
          )}

          {/* Nút Xoá nhiều */}
          {/* {selectedIds.length > 0 && (
              <Button
                variant="contained"
                color="error"
                sx={{ width: { xs: "100%", sm: "auto" }, alignSelf: "center" }}
                onClick={() => setIsComfirmDeleteMany(true)}
              >
                Xoá ({selectedIds.length})
              </Button>
            )} */}
        </Stack>

        {/* Tổng số và thống kê filter */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {filter.schoolId && (
              <Chip 
                label={`Trường: ${listSchools.find(s => s.id === filter.schoolId)?.name}`}
                onDelete={() => setFilter(prev => ({ ...prev, schoolId: undefined, classId: undefined }))}
                size="small"
                color="primary"
              />
            )}
            {filter.classId && (
              <Chip 
                label={`Lớp: ${listClasses.find(c => c.id === filter.classId)?.name}`}
                onDelete={() => setFilter(prev => ({ ...prev, classId: undefined }))}
                size="small"
                color="primary"
              />
            )}
            {matchId && filter.groupId !== undefined && filter.groupId !== 0 && (
              <Chip 
                label={filter.groupId === -1 ? "Chưa phân nhóm" : `Nhóm: ${listGroups.find(g => g.id === filter.groupId)?.name}`}
                onDelete={() => setFilter(prev => ({ ...prev, groupId: undefined }))}
                size="small"
                color="primary"
              />
            )}
            {(filter.schoolId || filter.classId || (matchId && filter.groupId !== undefined && filter.groupId !== 0)) && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setFilter(prev => ({
                  ...prev,
                  schoolId: undefined,
                  classId: undefined,
                  groupId: undefined
                }))}
              >
                Xóa tất cả bộ lọc
              </Button>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Hiển thị: {displayedContestants.length} / Tổng số: {pagination.total} thí sinh
            {(filter.schoolId || filter.classId || (matchId && filter.groupId !== undefined && filter.groupId !== 0)) && (
              <span> (đã lọc)</span>
            )}
          </Typography>
        </Box>        {/* Danh sách thí sinh */}
        <Box sx={{
          flex: 1,
          overflow: "auto",
          '&::-webkit-scrollbar': {
            width: '4px',
            height: '4px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#a8a8a8'
            }
          },
          '& .disabled-row': {
            backgroundColor: '#f5f5f5',
            opacity: 0.6,
            '&:hover': {
              backgroundColor: '#f5f5f5 !important',
            },
            '& .MuiDataGrid-cell': {
              color: '#999',
            }
          }
        }}>
          <Listcontestant
            contestants={displayedContestants}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            assignedContestantIds={Object.values(groups).flat().map(c => c.id)}
            onView={id => handleAction("view", id)}
            onEdit={id => handleAction("edit", id)}
            onDelete={id => handleAction("delete", id)}
          />
        </Box>

        <Box>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
              <Select
                labelId="page-size-select-label"
                value={String(filter.limit || 10)}
                onChange={e => {
                  setFilter(prev => ({
                    ...prev,
                    limit: Number(e.target.value),
                  }));
                  filter.page = 1;
                }}
                label="Hiển thị"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Typography>
              Trang {filter.page || 1} / {pagination.totalPages}
            </Typography>
          </Box>
        </Box>
        <Box
          style={{
            display:
              pagination.totalPages !== undefined && pagination.totalPages > 1
                ? "block"
                : "none",
          }}
        >
          <Box className="flex flex-col items-center">
            {" "}
            <Pagination
              count={pagination.totalPages}
              page={filter.page ?? 1}
              color="primary"
              onChange={(_event, value) =>
                setFilter(prev => ({
                  ...prev,
                  page: value,
                }))
              }
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
        <CreateContestant 
          isOpen={isCreateOpen} 
          onClose={closeCreate}
          onSuccess={() => {
            refetchs();
            showToast("Thêm thí sinh thành công", "success");
          }}
        />

        <ViewContestant
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          id={selectedId}
        />

        <Editecontestant
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          id={selectedId}
          onSubmit={handleUpdate}
        />
        <ConfirmDelete
          open={isComfirmDelete}
          title="Xóa thí sinh học"
          onClose={() => setIsComfirmDelete(false)}
          description="Bạn có chắc chắn xóa thí sinh học này không"
          onConfirm={() => handleDelete(selectedId)}
        />
      </Box>      {/* Right Sidebar for Group Division */}
      {isGroupDivisionOpen && (
        <Box
          sx={{
            width: 400,
            backgroundColor: "#f5f5f5",
            borderLeft: "2px solid #e0e0e0",
            ml: 3,
            p: 3,
            height: "100vh",
            overflow: "auto",
            transition: "width 0.3s ease",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
          }}        >          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Chia nhóm thí sinh
              </Typography>
              {isLoadingGroups && (
                <CircularProgress size={16} />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Bước {groupDivisionStep} / 2
              {hasGroups && !isLoadingGroups && " • Đã có nhóm"}
            </Typography>
          </Box>{/* Step 1: Choose Methods */}
          {groupDivisionStep === 1 && (
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3 }}>
                Chọn phương pháp chia nhóm
              </Typography>

              <RadioGroup
                value={selectedMethod}
                onChange={(e) => handleMethodChange(e.target.value)}
              >
                {/* Method 1: By Number of Groups */}
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    value="byNumberOfGroups"
                    control={<Radio />}
                    label="Chia theo số lượng nhóm"
                    sx={{ mb: 1 }}
                  />
                  {selectedMethod === 'byNumberOfGroups' && (
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Số lượng nhóm"
                      value={numberOfGroups || ''}
                      onChange={(e) => setNumberOfGroups(Number(e.target.value))}
                      inputProps={{ min: 1 }}
                      sx={{ ml: 4 }}
                    />
                  )}
                </Box>

                {/* Method 2: By Max Members Per Group */}
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    value="byMaxMembers"
                    control={<Radio />}
                    label="Chia theo số thí sinh tối đa trong 1 nhóm"
                    sx={{ mb: 1 }}
                  />
                  {selectedMethod === 'byMaxMembers' && (
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Số thí sinh tối đa / nhóm"
                      value={maxMembersPerGroup || ''}
                      onChange={(e) => setMaxMembersPerGroup(Number(e.target.value))}
                      inputProps={{ min: 1 }}
                      sx={{ ml: 4 }}
                    />
                  )}
                </Box>

                {/* Method 3: Random */}
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    value="random"
                    control={<Radio />}
                    label="Chia ngẫu nhiên"
                  />
                </Box>
              </RadioGroup>

              <Divider sx={{ my: 3 }} />

              {/* Selected Method Summary */}
              {selectedMethod && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Phương pháp đã chọn:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {selectedMethod === 'byNumberOfGroups' && `Chia ${numberOfGroups} nhóm`}
                    {selectedMethod === 'byMaxMembers' && `Tối đa ${maxMembersPerGroup} thí sinh/nhóm`}
                    {selectedMethod === 'random' && 'Chia ngẫu nhiên'}                  </Typography>
                </Box>
              )}
            </Box>
          )}          {/* Step 2: Group Management */}
          {groupDivisionStep === 2 && (

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 2, p: 1, backgroundColor: '#e3f2fd', borderRadius: 1, border: '1px solid #2196f3', width: 'fit-content', }}>
                <Typography
                  variant="body2"
                  color="primary.main"
                  gutterBottom
                  onClick={toggleTip}
                  sx={{ cursor: 'pointer', userSelect: 'none', m: 0, p: 0 }}
                >
                  💡{isOpenTip ? 'Hướng dẫn' : ''}
                </Typography>
                {isOpenTip && (
                  <Typography variant="caption" color="text.secondary">
                    Chọn thí sinh từ danh sách bên trái (checkbox) để thêm vào nhóm hiện tại đang hoạt động.
                    Thí sinh đã thuộc nhóm khác sẽ không thể chọn lại (màu xám, checkbox disabled).
                    Mỗi lần chọn thí sinh sẽ chỉ thêm vào tab nhóm hiện tại, không phân bổ tự động sang các nhóm khác.
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Quản lý nhóm thí sinh
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {skipSyncFromAPI && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        allowSyncFromAPI();
                        fetchCurrentGroups();
                        showToast('Đã làm mới dữ liệu từ server', 'info');
                      }}
                      sx={{ fontSize: '11px', px: 1.5 }}
                      title="Làm mới dữ liệu từ server"
                    >
                      🔄 Sync
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Current Group Status */}
              <Box sx={{ mb: 2, p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Trạng thái hiện tại:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Tổng số nhóm: <strong>{totalGroups}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Tổng thí sinh đã phân: <strong>{Object.values(groups).flat().length}</strong>
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  • Phương pháp: <strong>
                    {selectedMethod === 'byNumberOfGroups' && `Chia ${numberOfGroups} nhóm`}
                    {selectedMethod === 'byMaxMembers' && `Tối đa ${maxMembersPerGroup} thí sinh/nhóm`}
                    {selectedMethod === 'random' && 'Chia ngẫu nhiên'}
                  </strong>
                </Typography> */}

                {/* Redistribute Button */}
                {Object.values(groups).flat().length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        const allContestants = Object.values(groups).flat();
                        // Clear all groups first
                        const emptyGroups: { [key: number]: Contestant[] } = {};
                        for (let i = 0; i < totalGroups; i++) {
                          emptyGroups[i] = [];
                        }
                        setGroups(emptyGroups);
                        // Redistribute
                        setTimeout(() => {
                          distributeContestantsEvenly(allContestants);
                        }, 0);
                      }}
                    >
                      🔄 Phân bổ lại thí sinh
                    </Button>
                  </Box>
                )}
              </Box>


              {/* Group Tabs - Custom scrollable design */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="medium">
                    Nhóm ({totalGroups})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => setIsCreateJudgeOpen(true)}
                      startIcon={<span style={{ fontSize: '14px' }}>+</span>}
                      sx={{ 
                        minHeight: 28,
                        fontSize: '12px',
                        px: 1.5
                      }}
                      title="Thêm trọng tài mới"
                    >
                      Trọng tài
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleAddNewGroup}
                      startIcon={<span style={{ fontSize: '14px' }}>+</span>}
                      sx={{ 
                        minHeight: 28,
                        fontSize: '12px',
                        px: 1.5
                      }}
                      disabled={
                        // Disable nếu tất cả judges đã được assign hoặc không có judge nào
                        availableJudges.length === 0 || areAllJudgesAssigned()
                      }
                      title={
                        availableJudges.length === 0 
                          ? "Không có trọng tài nào khả dụng" 
                          : areAllJudgesAssigned()
                          ? "Tất cả trọng tài đã được phân nhóm"
                          : "Thêm nhóm mới"
                      }
                    >
                      Nhóm
                    </Button>
                  </Box>
                </Box>
                
                {/* Scrollable group tabs */}
                <Box
                  sx={{
                    pt: '6px',
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    pb: 1,
                    cursor: 'grab',
                    userSelect: 'none',
                    '&:active': {
                      cursor: 'grabbing'
                    },
                    '&::-webkit-scrollbar': {
                      height: '3px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      borderRadius: '2px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: '2px',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.5)'
                      },
                      '&:active': {
                        backgroundColor: 'rgba(0,0,0,0.7)'
                      }
                    }
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  {Array.from({ length: totalGroups }, (_, index) => (
                    <Box
                      key={index}
                      sx={{
                        minWidth: 120,
                        p: 1,
                        borderRadius: 1,
                        border: activeGroupTab === index ? '2px solid #1976d2' : '1px solid #e0e0e0',
                        backgroundColor: activeGroupTab === index ? '#e3f2fd' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: activeGroupTab === index ? '#e3f2fd' : '#f5f5f5',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        position: 'relative'
                      }}
                    >
                      {/* Nút xóa nhóm */}
                      {totalGroups > 1 && (
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(index);
                          }}
                          sx={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: 'error.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            zIndex: 1,
                            '&:hover': {
                              backgroundColor: 'error.dark',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                          title="Xóa nhóm"
                        >
                          ×
                        </Box>
                      )}
                      
                      {/* Nội dung tab nhóm */}
                      <Box 
                        onClick={() => {
                          // Không reset flag khi chuyển tab để giữ local changes
                          setActiveGroupTab(index);
                        }}
                        sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight={activeGroupTab === index ? 'bold' : 'medium'}
                            color={activeGroupTab === index ? 'primary.main' : 'text.primary'}
                          >
                            Nhóm {index + 1}
                          </Typography>
                          {assignedJudges[index] && (
                            <Box sx={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              backgroundColor: 'success.main' 
                            }} />
                          )}
                        </Box>
                        <Chip
                          label={`${groups[index]?.length || 0} thí sinh`}
                          size="small"
                          color={activeGroupTab === index ? "primary" : "default"}
                          variant={activeGroupTab === index ? "filled" : "outlined"}
                          sx={{ fontSize: '10px', height: 20 }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Judge Selection for Active Group */}
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
                  Chọn trọng tài cho Nhóm {activeGroupTab + 1}
                </Typography>

                <Autocomplete
                  value={assignedJudges[activeGroupTab] || null}
                  onChange={(_, newValue) => handleJudgeAssign(activeGroupTab, newValue)}
                  options={getAvailableJudgesForGroup(activeGroupTab)}
                  getOptionLabel={(option) => `${option.username} (${option.email})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tìm và chọn trọng tài"
                      placeholder="Nhập tên hoặc email trọng tài..."
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingJudges ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                        {option.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {option.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.email}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  noOptionsText="Không tìm thấy trọng tài phù hợp"
                  clearText="Xóa lựa chọn"
                  openText="Mở danh sách"
                  closeText="Đóng danh sách"
                  loading={isLoadingJudges}
                  sx={{ mb: 1 }}
                />

                {/* Judge Assignment Status */}
                {assignedJudges[activeGroupTab] ? (
                  // <Box sx={{
                  //   display: 'flex',
                  //   alignItems: 'center',
                  //   gap: 1,
                  //   p: 1,
                  //   backgroundColor: '#e8f5e8',
                  //   borderRadius: 1,
                  //   border: '1px solid #4caf50'
                  // }}>
                  //   <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                  //     {assignedJudges[activeGroupTab]!.username.charAt(0).toUpperCase()}
                  //   </Avatar>
                  //   <Typography variant="body2" color="success.main" fontWeight="medium">
                  //     ✓ Đã gán: {assignedJudges[activeGroupTab]!.username}
                  //   </Typography>
                  // </Box>
                  <></>
                ) : (
                  <Typography variant="caption" color="warning.main" sx={{ fontStyle: 'italic' }}>
                    ⚠️ Chưa có trọng tài được gán cho nhóm này
                  </Typography>
                )}
              </Paper>

              {/* Active Group Content */}
              <Box sx={{ flex: 1, overflow: 'auto', pt: 1 }}>
                {groups[activeGroupTab]?.length > 0 ? (
                  <Box>
                    {/* Clear All Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Thí sinh trong nhóm ({groups[activeGroupTab]?.length || 0})
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => removeAllContestantsFromGroup(activeGroupTab)}
                        sx={{ 
                          minHeight: 28,
                          fontSize: '11px',
                          px: 1.5
                        }}
                      >
                        Xóa tất cả
                      </Button>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {groups[activeGroupTab].map((contestant) => (
                        <Box
                          key={contestant.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            backgroundColor: 'white',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                          }}
                        >
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                            {contestant.fullName?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {contestant.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {contestant.roundName} • {
                                contestant.status?.trim() === 'compete' ? 'Thi đấu' :
                                  contestant.status === 'eliminate' ? 'Bị loại' : 'Qua vòng'
                              }
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeContestantFromGroup(activeGroupTab, contestant.id)}
                            sx={{ minWidth: 'auto', p: 0.5 }}
                          >
                            ✕
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (<Box sx={{
                  textAlign: 'center',
                  py: 4,
                  color: 'text.secondary'
                }}>                    <Typography variant="body2">
                    Nhóm {activeGroupTab + 1} chưa có thí sinh
                  </Typography>
                  <Typography variant="caption">
                    Chọn thí sinh từ danh sách bên trái để thêm vào nhóm này
                  </Typography>
                </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Group Summary with Judge Info */}
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tóm tắt phân nhóm:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {Array.from({ length: totalGroups }, (_, index) => (
                    <Box key={index} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      backgroundColor: activeGroupTab === index ? '#e3f2fd' : 'transparent',
                      borderRadius: 1
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`Nhóm ${index + 1}`}
                          variant={activeGroupTab === index ? "filled" : "outlined"}
                          color={activeGroupTab === index ? "primary" : "default"}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {groups[index]?.length || 0} thí sinh
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {assignedJudges[index] ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Chip
                              label={assignedJudges[index]!.username}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </Box>
                        ) : (
                          <Chip
                            label="Chưa có trọng tài"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}          {/* Navigation Buttons */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: 2,
            borderTop: '1px solid #e0e0e0',
            mt: 'auto'
          }}>
            {groupDivisionStep === 2 ? (
              <Button
                variant="contained"
                color="error"
                onClick={handleBack}
              >
                Hủy
              </Button>
            ) : null}
            {/* <Button
              variant="outlined"
              disabled={groupDivisionStep === 1}
              onClick={handleBack}
            >
              Trước
            </Button> */}
            {groupDivisionStep === 1 ? (
              <Button
                variant="contained"
                disabled={!canGoNext()}
                onClick={handleNext}
              >
                Tiếp theo
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                disabled={Object.values(assignedJudges).some(judge => judge === null)} onClick={async () => {
                  // Validation: Check if all groups have judges assigned
                  const unassignedGroups = Object.entries(assignedJudges)
                    .filter(([, judge]) => judge === null)
                    .map(([groupIdx]) => parseInt(groupIdx) + 1);

                  if (unassignedGroups.length > 0) {
                    showToast(`Vui lòng gán trọng tài cho nhóm: ${unassignedGroups.join(', ')}`, 'warning');
                    return;
                  }

                  // Check if all groups have contestants
                  // const emptyGroups = Object.entries(groups)
                  //   .filter(([, contestants]) => contestants.length === 0)
                  //   .map(([groupIdx]) => parseInt(groupIdx) + 1);

                  // if (emptyGroups.length > 0) {
                  //   showToast(`Vui lòng thêm thí sinh vào nhóm: ${emptyGroups.join(', ')}`, 'warning');
                  //   return;
                  // }

                  // Reset flag để cho phép sync từ API khi hoàn thành
                  allowSyncFromAPI();
                  
                  // Prepare data for API call
                  const groupsData = Object.entries(groups)
                    .filter(([groupIndex]) => assignedJudges[parseInt(groupIndex)])
                    .map(([groupIndex, contestants]) => ({
                      judgeId: assignedJudges[parseInt(groupIndex)]!.id,
                      groupName: `Nhóm ${parseInt(groupIndex) + 1}`,
                      contestantIds: contestants.map(c => c.id)
                    }));

                  // Kiểm tra xem có nhóm nào chưa có trọng tài không
                  const groupsWithoutJudge = Object.keys(groups).filter(groupIndex => 
                    !assignedJudges[parseInt(groupIndex)]
                  );

                  if (groupsWithoutJudge.length > 0) {
                    showToast(`Vui lòng chọn trọng tài cho nhóm: ${groupsWithoutJudge.map(idx => parseInt(idx) + 1).join(', ')}`, 'warning');
                    return;
                  }

                  try {
                    if (matchId) {
                      await GroupDivisionService.divideGroups(matchId, { groups: groupsData });
                      showToast('Chia nhóm thành công!', 'success');
                      // Refetch groups để cập nhật dữ liệu
                      refetchGroups();
                    } else {
                      showToast('Không tìm thấy ID trận đấu', 'error');
                    }
                  } catch (error) {
                    let errorMessage = 'Lỗi khi chia nhóm';
                    if (error && typeof error === 'object' && 'response' in error) {
                      const response = (error as { response?: { data?: { message?: string } } }).response;
                      errorMessage = response?.data?.message || errorMessage;
                    }
                    showToast(errorMessage, 'error');
                  }
                }}
              >
                Hoàn thành
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Create Judge Modal */}
      <CreateUser
        isOpen={isCreateJudgeOpen}
        onClose={() => setIsCreateJudgeOpen(false)}
        onSubmit={handleCreateJudge}
      />

      {/* Confirm Back Dialog */}
      <ConfirmDelete
        open={isConfirmBackOpen}
        onClose={() => setIsConfirmBackOpen(false)}
        title="Xác nhận quay lại"
        description="Tiến trình chia nhóm hiện tại sẽ bị hủy và không thể hoàn tác. Bạn có chắc chắn muốn quay lại bước 1?"
        onConfirm={resetGroupDivision}
      />

      {/* Confirm Delete Group Dialog */}
      <ConfirmDelete
        open={isConfirmDeleteGroupOpen}
        onClose={() => {
          setIsConfirmDeleteGroupOpen(false);
          setGroupToDelete(null);
        }}
        title="Xác nhận xóa nhóm"
        description={
          groupToDelete
            ? groupToDelete.contestantCount > 0
              ? `Nhóm "${groupToDelete.name}" hiện có ${groupToDelete.contestantCount} thí sinh. Bạn có chắc chắn muốn xóa nhóm và tất cả thí sinh trong nhóm này không? Hành động này không thể hoàn tác.`
              : `Bạn có chắc chắn muốn xóa nhóm "${groupToDelete.name}" không? Hành động này không thể hoàn tác.`
            : ""
        }
        onConfirm={confirmDeleteGroup}
      />
    </Box>
  );
};

export default ContestantMatchPage;