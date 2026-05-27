"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileTabBar from "./MobileTabBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-14 sm:pb-0">
      <Navbar />
      {/* Changed from <main> to <div> — tool pages render their own <main> */}
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
