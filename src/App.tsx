
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Calendar from "./pages/Calendar";
import LiveResults from "./pages/LiveResults";
import Drivers from "./pages/Drivers";
import About from "./pages/About";
import RallyDetail from "./pages/RallyDetail";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRallies from "./pages/admin/AdminRallies";
import AdminRallyForm from "./pages/admin/AdminRallyForm";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminDriverForm from "./pages/admin/AdminDriverForm";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminTeamForm from "./pages/admin/AdminTeamForm";
import AdminCars from "./pages/admin/AdminCars";
import AdminCarForm from "./pages/admin/AdminCarForm";
import AdminResults from "./pages/admin/AdminResults";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/live" element={<LiveResults />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/about" element={<About />} />
          <Route path="/rallies/:slug" element={<RallyDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="rallies" element={<AdminRallies />} />
            <Route path="rallies/new" element={<AdminRallyForm />} />
            <Route path="rallies/:id" element={<AdminRallyForm />} />
            <Route path="drivers" element={<AdminDrivers />} />
            <Route path="drivers/new" element={<AdminDriverForm />} />
            <Route path="drivers/:id" element={<AdminDriverForm />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="teams/new" element={<AdminTeamForm />} />
            <Route path="teams/:id" element={<AdminTeamForm />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="cars/new" element={<AdminCarForm />} />
            <Route path="cars/:id" element={<AdminCarForm />} />
            <Route path="results" element={<AdminResults />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
