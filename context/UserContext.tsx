"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type Gender = 'Kobieta' | 'Mężczyzna';

type User = {
  age: number,
  sex: Gender,
  GrossSalary: number,
  StartYear: number,
  PlannedRetirementYear: number,
  sickDaysPerYear?: number,
  includeSickDays?: boolean,
  includeDelayedRetirement?: boolean,
  targetPension?: number,
  postalCode?: string
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
