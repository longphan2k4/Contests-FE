import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Fade,
  Alert,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useParams } from "react-router-dom";
import useResults from "../hooks/useResults";
import ResultsFilter from "../components/ResultsFilter";
import ResultsChart from "../components/ResultsChart";
import ResultsTable from "../components/ResultsTable";
import type { ResultFilterParams } from "../types";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import QuizIcon from "@mui/icons-material/Quiz";
import { useExportExcel } from "@/hooks/useExportExcel";
import { useToast } from "@/contexts/toastContext";

const ResultsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { slug } = useParams<{ slug: string }>();

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const {
    results,
    isLoading,
    error,
    fetchResults,
    getResultSummary,
    getUniqueRounds,
    getUniqueMatches,
    totalPages,
    totalResults,
  } = useResults({ contestSlug: slug });

  const { mutate: exportExcel } = useExportExcel();
  const { showToast } = useToast();

  const handleExportExcel = () => {
    // Tạo danh sách thí sinh từ results với thông tin chi tiết
    const studentMap = new Map();

    results.forEach(result => {
      const studentName = result.contestant.student.fullName;
      const studentCode = result.contestant.student.studentCode;

      if (!studentMap.has(studentName)) {
        studentMap.set(studentName, {
          studentName,
          studentCode,
          correct: 0,
          total: 0,
          matches: 0
        });
      }

      const student = studentMap.get(studentName);
      student.total += 1;
      student.matches += 1;
      if (result.isCorrect) {
        student.correct += 1;
      }
    });

    // Chuyển đổi Map thành array và sắp xếp theo số câu đúng
    const allStudents = Array.from(studentMap.values())
      .sort((a, b) => {
        // Sắp xếp theo số câu đúng giảm dần, nếu bằng nhau thì theo tỷ lệ chính xác
        if (b.correct !== a.correct) {
          return b.correct - a.correct;
        }
        return (b.correct / b.total) - (a.correct / a.total);
      });

    const data = allStudents.map((student, index) => ({
      "Hạng": index + 1,
      "Thí sinh": student.studentName || "N/A",
      "Mã SV": student.studentCode || "N/A",
      "Số câu đúng": student.correct,
      "Tổng câu": student.total,
      "Tỉ lệ chính xác": student.total > 0 ? `${((student.correct / student.total) * 100).toFixed(1)}%` : "0%",
      "Số trận": student.matches,
    }));

    exportExcel(
      {
        data: data,
        fileName: "results.xlsx",
      },
      {
        onSuccess: () => {
          showToast(`Xuất Excel thành công - ${data.length} thí sinh`, "success");
        },
        onError: (err: any) => {
          showToast(err.response?.data?.message, "error");
        },
      }
    );
  };

  const summary = getResultSummary;

  const handleFilter = (params: ResultFilterParams) => {
    fetchResults({
      ...params,
      contestSlug: slug,
      page: 1,
      limit: filter.limit,
    });
    setFilter((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setFilter((prev) => ({ ...prev, page: value }));
    fetchResults({ contestSlug: slug, page: value, limit: filter.limit });
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<string>) => {
    const newLimit = Number(event.target.value);
    setFilter((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    fetchResults({ contestSlug: slug, limit: newLimit, page: 1 });
  };

  // Load initial data
  useEffect(() => {
    fetchResults({ contestSlug: slug, page: filter.page, limit: filter.limit });
  }, [fetchResults, filter.page, filter.limit, slug]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <AssessmentIcon sx={{ color: "primary.main", fontSize: 40 }} />
            Kết quả cuộc thi
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleExportExcel}
              disabled={!summary.topStudents.length}
            >
              Xuất Excel
            </Button>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Xem và phân tích kết quả chi tiết của các cuộc thi
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Thống kê tổng quan */}
        <Fade in timeout={700}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <QuizIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {totalResults}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng số câu trả lời
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <TrendingUpIcon
                  sx={{ fontSize: 40, color: "success.main", mb: 1 }}
                />
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {summary.correctAnswers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Câu trả lời đúng
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <AssessmentIcon
                  sx={{ fontSize: 40, color: "warning.main", mb: 1 }}
                />
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {summary.accuracy.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tỷ lệ chính xác
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                <PeopleIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {summary.topStudents.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thí sinh tham gia
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Fade>

        {/* Bộ lọc */}
        <Fade in timeout={500}>
          <Box>
            <ResultsFilter
              onFilter={handleFilter}
              uniqueRounds={getUniqueRounds}
              uniqueMatches={getUniqueMatches}
            />
          </Box>
        </Fade>

        {/* Biểu đồ thống kê */}
        <Fade in timeout={900}>
          <Card elevation={2}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TrendingUpIcon color="primary" />
                Biểu đồ thống kê
              </Typography>
              <Box sx={{ mt: 2 }}>
                {!isLoading && !error && (
                  <ResultsChart summary={summary} results={results} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Kết quả chi tiết */}
        <Fade in timeout={1100}>
          <Box>
            {isLoading ? (
              <Card elevation={2}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      py: 8,
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <CircularProgress size={60} sx={{ mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Đang tải dữ liệu...
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="body1">{error}</Typography>
              </Alert>
            ) : (
              <>
                <ResultsTable results={results} />

                {/* Phân trang */}
                {totalPages > 0 && (
                  <Card elevation={1} sx={{ mt: 3 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <FormControl
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 120 }}
                          >
                            <InputLabel id="page-size-select-label">
                              Hiển thị
                            </InputLabel>
                            <Select
                              labelId="page-size-select-label"
                              value={String(filter.limit)}
                              onChange={handleChangeRowsPerPage}
                              label="Hiển thị"
                            >
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <Pagination
                            count={totalPages}
                            page={filter.page}
                            onChange={handlePageChange}
                            showFirstButton
                            showLastButton
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                            siblingCount={isMobile ? 0 : 1}
                          />
                        </Box>
                        <Typography
                          sx={{ ml: 2, minWidth: 100, textAlign: "right" }}
                        >
                          Trang {filter.page} / {totalPages}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </Box>
        </Fade>
      </Box>
    </Container>
  );
};

export default ResultsPage;

