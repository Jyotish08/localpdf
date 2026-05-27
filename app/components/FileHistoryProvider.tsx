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
}

const Ctx = createContext<FileHistoryCtx>({ files: [], addFile: () => {} });

export function useFileHistory() {
  return useContext(Ctx);
}

export default function FileHistoryProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileHistoryItem[]>([]);

  const addFile = useCallback((item: FileHistoryItem) => {
    setFiles((prev) => [item, ...prev].slice(0, 4));
  }, []);

  return <Ctx.Provider value={{ files, addFile }}>{children}</Ctx.Provider>;
}
