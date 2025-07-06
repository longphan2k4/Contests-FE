import { useAllRescues } from './useControls';

export interface RescueItem {
  id: number;
  name: string;
  index: number | null;
  status: string;
  questionFrom: number;
  questionTo: number;
  rescueType: string;
  remainingContestants?: number;
}

export interface UseRescueReturn {
  rescues: RescueItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRescue = (matchSlug: string | null): UseRescueReturn => {
  const { data, isLoading, error, refetch } = useAllRescues(matchSlug);

  return {
    rescues: data?.data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
};

export default useRescue;
