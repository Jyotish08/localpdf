"use client";

import { Toaster } from "sonner";
import { useTheme } from "./ThemeProvider";

export default function ToastManager() {
  const { resolved } = useTheme();

  return (
    <Toaster
      theme={resolved as "light" | "dark"}
      position="bottom-right"
      toastOptions={{
        className: "bg-card text-foreground border-border",
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
        },
      }}
    />
  );
}
