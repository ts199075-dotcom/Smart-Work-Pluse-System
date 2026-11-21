import { useState } from "react";
import { AppDataContext } from "./AppDataContext.js";

import { initialEmployees } from "../data/employeesData";
import { initialAttendance } from "../data/attendanceData";
import { initialProjects } from "../features/team-leader/projects/projectsData";

export function AppDataProvider({ children }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [projects, setProjects] = useState(initialProjects);
  const [attendance, setAttendance] = useState(initialAttendance);

  const value = {
    employees,
    setEmployees,
    projects,
    setProjects,
    attendance,
    setAttendance,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}