import z from "zod";

export const ContestantMatchSchema = z.object({
  id: z.number().int(),
  matchId: z.number().int(),
  contestantId: z.number().int(),
  status: z.enum(["active", "eliminated", "advanced"]),
  score: z.number().optional(),
  contestant: z.object({
    id: z.number().int(),
    fullName: z.string(),
    student: z.object({
      fullName: z.string(),
      school: z.string().optional(),
      class: z.string().optional(),
    }),
  }),
  match: z.object({
    id: z.number().int(),
    name: z.string(),
    roundName: z.string(),
  }),
});

export const ContestantMatchQuerySchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Page phải là số nguyên dương")
    .default("1")
    .optional(),
  limit: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Limit phải là số nguyên dương")
    .default("10")
    .optional(),
  search: z.string().max(100, "Từ khóa tìm kiếm tối đa 100 ký tự").optional(),
  matchId: z
    .string()
    .transform(val => parseInt(val))
    .refine(
      val => !isNaN(val) && val > 0,
      "Id trận đấu phải là số nguyên dương"
    )
    .optional(),
  roundId: z
    .string()
    .transform(val => parseInt(val))
    .refine(
      val => !isNaN(val) && val > 0,
      "Id vòng đấu phải là số nguyên dương"
    )
    .optional(),
  status: z.enum(["active", "eliminated", "advanced"]).optional(),
  school: z.string().optional(),
  class: z.string().optional(),
});

export type ContestantMatch = z.infer<typeof ContestantMatchSchema>;
export type ContestantMatchQueryInput = z.infer<typeof ContestantMatchQuerySchema>;

export type ContestantMatchStatus = "active" | "eliminated" | "advanced";

export type ListStatus = {
  label: string;
  value: ContestantMatchStatus;
};

export type ListRound = {
  id: number;
  name: string;
};

export type ListMatch = {
  id: number;
  name: string;
};

export type Pagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export type ContestantMatchResponse = {
  data: {
    contestantMatches: ContestantMatch[];
    pagination: Pagination;
  };
};

export type FilterState = {
  selectedSchoolIds: number[];
  selectedClassIdsBySchool: { [schoolId: number]: number[] };
  searchSchool: string;
};


export const ContestantSchema = z.object({
  id: z.number().int(),
  roundName: z.string(),
  fullName: z.string(),
  status: z.enum([" compete", "eliminate", "advanced"]),
  studentCode: z.string().optional().nullable(),
  schoolName: z.string(),
  className: z.string(),
  groupName: z.string().optional(),
  schoolId: z.number(),
  classId: z.number(),
  groupId: z.number().optional(),
  registrationNumber: z.number().optional(),
});

export type Contestant = z.infer<typeof ContestantSchema>;

export const ContestantQuerySchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Page phải là số nguyên dương")
    .default("1")
    .optional(),
  limit: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val > 0, "Limit phải là số nguyên dương")
    .default("10")
    .optional(),
  search: z.string().max(100, "Từ khóa tìm kiếm tối đa 100 ký tự").optional(),
  contestId: z
    .string()
    .transform(val => parseInt(val))
    .refine(
      val => !isNaN(val) && val > 0,
      "Id cuộc thi phải là số nguyên dương"
    )
    .optional(),
  roundId: z
    .string()
    .transform(val => parseInt(val))
    .refine(
      val => !isNaN(val) && val > 0,
      "Id cuộc thi phải là số nguyên dương"
    )
    .optional(),
  status: z.enum(["compete", "eliminate", "advanced"]).optional(),
  schoolId: z.number().positive().optional(),
  classId: z.number().positive().optional(),
  groupId: z.number().optional(), // Có thể là -1 cho "unassigned"
  matchId: z.number().positive().optional(),
  schoolIds: z.preprocess(
    val => typeof val === "string" ? val.split(",").map(Number) : val,
    z.array(z.number()).optional()
  ),
  classIds: z.preprocess(
    val => typeof val === "string" ? val.split(",").map(Number) : val,
    z.array(z.number()).optional()
  ),
});

export type ContestantQueryInput = z.infer<typeof ContestantQuerySchema>;