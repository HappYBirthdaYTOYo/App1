
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AIAssistant } from "./AIAssistant";
import { ThemeProvider } from "./ThemeProvider";

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen overflow-hidden">
        <div className={`fixed inset-y-0 z-50 md:relative md:flex transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <Sidebar />
        </div>
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header toggleMobileSidebar={() => setMobileMenuOpen(!mobileMenuOpen)} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
        
        <AIAssistant />
      </div>
    </ThemeProvider>
  );
}

export default MainLayout;
