import React, { createContext, useContext, useState } from "react";
import type { ContestantInfo } from "../types";

interface StudentContextType {
  contestantInfo: ContestantInfo | null;
  setContestantInfo: (info: ContestantInfo | null) => void;
  registrationNumber: number | null;
  setRegistrationNumber: (num: number | null) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contestantInfo, setContestantInfo] = useState<ContestantInfo | null>(
    null
  );
  const [registrationNumber, setRegistrationNumber] = useState<number | null>(
    null
  );

  return (
    <StudentContext.Provider
      value={{
        contestantInfo,
        setContestantInfo,
        registrationNumber,
        setRegistrationNumber,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = () => {
  const ctx = useContext(StudentContext);
  if (!ctx)
    throw new Error("useStudentContext must be used within StudentProvider");
  return ctx;
};
