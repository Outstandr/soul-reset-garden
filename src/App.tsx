import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ModuleJourney from "./pages/ModuleJourney";
import BookLessons from "./pages/BookLessons";
import BookLessonContent from "./pages/BookLessonContent";
import Journal from "./pages/Journal";
import Auth from "./pages/Auth";
import MentalPillar from "./pages/MentalPillar";
import PhysicalPillar from "./pages/PhysicalPillar";
import SpiritualPillar from "./pages/SpiritualPillar";
import ResetByDiscipline from "./pages/ResetByDiscipline";
import MasterclassLibrary from "./pages/MasterclassLibrary";
import ResetByDisciplineCourse from "./pages/ResetByDisciplineCourse";
import Certificate from "./pages/Certificate";
import FinalCertificationExam from "./pages/FinalCertificationExam";
import Profile from "./pages/Profile";
import TestWebhook from "./pages/TestWebhook";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/journey/:moduleId" element={<ProtectedRoute><ModuleJourney /></ProtectedRoute>} />
          <Route path="/book/:bookId" element={<ProtectedRoute><BookLessons /></ProtectedRoute>} />
          <Route path="/book-lesson/:lessonId" element={<ProtectedRoute><BookLessonContent /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
          <Route path="/mental-pillar/:lessonNumber?" element={<ProtectedRoute><MentalPillar /></ProtectedRoute>} />
          <Route path="/physical-pillar/:lessonNumber?" element={<ProtectedRoute><PhysicalPillar /></ProtectedRoute>} />
          <Route path="/spiritual-pillar/:lessonNumber?" element={<ProtectedRoute><SpiritualPillar /></ProtectedRoute>} />
          <Route path="/reset-by-discipline" element={<ProtectedRoute><ResetByDiscipline /></ProtectedRoute>} />
          <Route path="/masterclass-library" element={<ProtectedRoute><MasterclassLibrary /></ProtectedRoute>} />
          <Route path="/reset-discipline-course/:moduleNumber/:lessonNumber?" element={<ProtectedRoute><ResetByDisciplineCourse /></ProtectedRoute>} />
          <Route path="/final-certification-exam" element={<ProtectedRoute><FinalCertificationExam /></ProtectedRoute>} />
          <Route path="/certificate/:certificateNumber" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/test-webhook" element={<ProtectedRoute><TestWebhook /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
