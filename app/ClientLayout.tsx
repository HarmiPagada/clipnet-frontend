"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import './styles/dashboard.css';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load dark mode from localStorage ONLY on client
  useEffect(() => {
    if (!isClient) return;
    
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "enabled") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, [isClient]);

  const toggleDarkMode = (isDark: boolean) => {
    if (!isClient) return;
    
    setDarkMode(isDark);
    if (isDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  };

  return (
    <>
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <main>
        <div className="container">
          <div className="main-content">
            <Sidebar />
            {children}
          </div>
        </div>
      </main>
    </>
  );
}