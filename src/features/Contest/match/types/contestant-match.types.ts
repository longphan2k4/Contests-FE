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
