import { useContext } from "react";
import { AppDataContext } from "../contexts/AppDataContext.js";

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }

  return context;
}