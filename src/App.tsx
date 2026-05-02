import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home.tsx";
import Index from "./pages/Index.tsx";
import FlipClock from "./pages/FlipClock.tsx";
import Countdown from "./pages/Countdown.tsx";
import Stopwatch from "./pages/Stopwatch.tsx";
import Breathing from "./pages/Breathing.tsx";
import Stats from "./pages/Stats.tsx";
import Todo from "./pages/Todo.tsx";
import Notes from "./pages/Notes.tsx";
import Subject from "./pages/Subject.tsx";
import NotesSection from "./pages/NotesSection.tsx";
import Lumi from "./pages/Lumi.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pomodoro" element={<Index />} />
            <Route path="/flipclock" element={<FlipClock />} />
            <Route path="/countdown" element={<Countdown />} />
            <Route path="/stopwatch" element={<Stopwatch />} />
            <Route path="/breathe" element={<Breathing />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:subjectId" element={<Subject />} />
            <Route path="/notes/:subjectId/:sectionId" element={<NotesSection />} />
            <Route path="/lumi" element={<Lumi />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
