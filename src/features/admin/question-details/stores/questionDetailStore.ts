import { create } from 'zustand';

interface QuestionDetailStore {
  existingQuestionIds: Map<number, Set<number>>; // Map<questionPackageId, Set<questionId>>
  setExistingQuestionIds: (packageId: number, questionIds: number[]) => void;
  getExistingQuestionIds: (packageId: number) => Set<number>;
  clearExistingQuestionIds: (packageId: number) => void;
}

export const useQuestionDetailStore = create<QuestionDetailStore>((set, get) => ({
  existingQuestionIds: new Map(),

  setExistingQuestionIds: (packageId: number, questionIds: number[]) => {
    set((state) => {
      const newMap = new Map(state.existingQuestionIds);
      newMap.set(packageId, new Set(questionIds));
      return { existingQuestionIds: newMap };
    });
  },

  getExistingQuestionIds: (packageId: number) => {
    return get().existingQuestionIds.get(packageId) || new Set();
  },

  clearExistingQuestionIds: (packageId: number) => {
    set((state) => {
      const newMap = new Map(state.existingQuestionIds);
      newMap.delete(packageId);
      return { existingQuestionIds: newMap };
    });
  }
})); 