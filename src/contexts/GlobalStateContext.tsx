import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { StateConfig, stateConfigs, DEFAULT_STATE, getActiveStates, getAllStates } from "@/config/states";

interface StateContextType {
  currentState: StateConfig;
  setCurrentState: (stateId: string) => void;
  activeStates: StateConfig[];
  allStates: StateConfig[];
}

export const StateContext = createContext<StateContextType>({
  currentState: { id: "WA", name: "Washington", abbreviation: "WA", isActive: true, contact: { address: "", city: "", state: "", zip: "", phone: "", admissionsPhone: "", email: "", admissionsEmail: "" }, officeHours: { weekday: "", saturday: "", sunday: "" }, regulatory: { department: "", departmentAbbr: "", certifications: [] }, regions: [] },
  setCurrentState: () => {},
  activeStates: [],
  allStates: [],
});

interface StateProviderProps {
  children: ReactNode;
}

export function StateProvider({ children }: StateProviderProps) {
  const [currentStateId, setCurrentStateId] = useState<string>(DEFAULT_STATE);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aliko-state");
      if (saved && stateConfigs[saved]?.isActive) {
        setCurrentStateId(saved);
      }
    }
    setIsInitialized(true);
  }, []);

  const currentState = stateConfigs[currentStateId] || stateConfigs[DEFAULT_STATE];
  const activeStates = getActiveStates();
  const allStates = Object.values(stateConfigs);

  const setCurrentState = (stateId: string) => {
    if (stateConfigs[stateId]?.isActive) {
      setCurrentStateId(stateId);
      if (typeof window !== "undefined") {
        localStorage.setItem("aliko-state", stateId);
      }
    }
  };

  useEffect(() => {
    if (!isInitialized) return;

    if (!stateConfigs[currentStateId]?.isActive) {
      setCurrentStateId(DEFAULT_STATE);
      if (typeof window !== "undefined") {
        localStorage.setItem("aliko-state", DEFAULT_STATE);
      }
    }
  }, [currentStateId, isInitialized]);

  return (
    <StateContext.Provider
      value={{
        currentState,
        setCurrentState,
        activeStates,
        allStates,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}
