
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AIAssistant } from "./AIAssistant";
import { ThemeProvider } from "./ThemeProvider";
import { PasswordSetupDialog } from "./PasswordSetupDialog";

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is the first time accessing the app
    const passwordConfigured = localStorage.getItem("passwordConfigured");
    if (!passwordConfigured) {
      setIsFirstAccess(true);
    }
  }, []);

  const handlePasswordSetup = () => {
    setIsFirstAccess(false);
    // After password is set, navigate to dashboard
    navigate("/dashboard");
  };

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

      <PasswordSetupDialog isOpen={isFirstAccess} onComplete={handlePasswordSetup} />
    </ThemeProvider>
  );
}

export default MainLayout;
