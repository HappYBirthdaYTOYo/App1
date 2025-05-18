
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";
import NotesPage from "./pages/NotesPage";
import JournalPage from "./pages/JournalPage";
import WritingPage from "./pages/WritingPage";
import TravelPage from "./pages/TravelPage";
import AssistantPage from "./pages/AssistantPage";
import VaultPage from "./pages/VaultPage";
import TimeCapsulePage from "./pages/TimeCapsulePage";
import TimelinePage from "./pages/TimelinePage";
import ProfilePage from "./pages/ProfilePage";
import QuotesPage from "./pages/QuotesPage";
import BucketListPage from "./pages/BucketListPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<TasksPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/travel" element={<TravelPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/time-capsule" element={<TimeCapsulePage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/quotes" element={<QuotesPage />} />
            <Route path="/bucket-list" element={<BucketListPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
