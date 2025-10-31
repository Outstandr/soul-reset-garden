import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ModuleJourney from "./pages/ModuleJourney";
import BookLessons from "./pages/BookLessons";
import BookLessonContent from "./pages/BookLessonContent";
import Journal from "./pages/Journal";
import Auth from "./pages/Auth";
import UploadMasterclass from "./pages/UploadMasterclass";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journey/:moduleId" element={<ModuleJourney />} />
          <Route path="/book/:bookId" element={<BookLessons />} />
          <Route path="/book-lesson/:lessonId" element={<BookLessonContent />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/upload-masterclass" element={<UploadMasterclass />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
