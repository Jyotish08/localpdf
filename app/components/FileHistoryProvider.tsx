"use client";

import { createContext, useContext, useState, useCallback } from "react";

export interface FileHistoryItem {
  filename: string;
  size: number;
  timestamp: number;
  tool: "compress" | "merge" | "split";
}

interface FileHistoryCtx {
  files: FileHistoryItem[];
  addFile: (item: FileHistoryItem) => void;
  pendingFiles: File[];
  setPendingFiles: (files: File[]) => void;
  clearPendingFiles: () => void;
}

const Ctx = createContext<FileHistoryCtx>({
  files: [],
  addFile: () => {},
  pendingFiles: [],
  setPendingFiles: () => {},
  clearPendingFiles: () => {},
});

export function useFileHistory() {
  return useContext(Ctx);
}

export default function FileHistoryProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileHistoryItem[]>([]);
  const [pendingFiles, setPendingFilesState] = useState<File[]>([]);

  const addFile = useCallback((item: FileHistoryItem) => {
    setFiles((prev) => [item, ...prev].slice(0, 4));
  }, []);

  const setPendingFiles = useCallback((incoming: File[]) => {
    setPendingFilesState(incoming);
  }, []);

  const clearPendingFiles = useCallback(() => {
    setPendingFilesState([]);
  }, []);

  return (
    <Ctx.Provider value={{ files, addFile, pendingFiles, setPendingFiles, clearPendingFiles }}>
      {children}
    </Ctx.Provider>
  );
}
