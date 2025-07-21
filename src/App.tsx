import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlanDashboard from "./pages/plan/PlanDashboard";
import Ejes from "./pages/plan/Ejes";
import Sectores from "./pages/plan/Sectores";
import Programas from "./pages/plan/Programas";
import Proyectos from "./pages/plan/Proyectos";
import Metas from "./pages/plan/Metas";
import Politicas from "./pages/Politicas";
import Secretarias from "./pages/catalogos/Secretarias";
import Gerencias from "./pages/catalogos/Gerencias";
import Seguimiento from "./pages/Seguimiento";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Plan de Desarrollo Routes */}
          <Route path="/plan" element={<PlanDashboard />} />
          <Route path="/plan/ejes" element={<Ejes />} />
          <Route path="/plan/sectores" element={<Sectores />} />
          <Route path="/plan/programas" element={<Programas />} />
          <Route path="/plan/proyectos" element={<Proyectos />} />
          <Route path="/plan/metas" element={<Metas />} />
          
          {/* Políticas Públicas Routes */}
          <Route path="/politicas" element={<Politicas />} />
          
          {/* Catálogos Routes */}
          <Route path="/catalogos/secretarias" element={<Secretarias />} />
          <Route path="/catalogos/gerencias" element={<Gerencias />} />
          
          {/* Seguimiento Route */}
          <Route path="/seguimiento" element={<Seguimiento />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
