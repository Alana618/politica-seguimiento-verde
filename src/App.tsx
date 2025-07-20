import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
          
          {/* Plan de Desarrollo Routes */}
          <Route path="/plan/ejes" element={<div>Ejes Estratégicos</div>} />
          <Route path="/plan/sectores" element={<div>Sectores</div>} />
          <Route path="/plan/programas" element={<div>Programas</div>} />
          <Route path="/plan/proyectos" element={<div>Proyectos</div>} />
          <Route path="/plan/metas" element={<div>Metas</div>} />
          
          {/* Políticas Públicas Routes */}
          <Route path="/politicas" element={<div>Políticas Públicas</div>} />
          
          {/* Catálogos Routes */}
          <Route path="/catalogos/secretarias" element={<div>Catálogo de Secretarías</div>} />
          <Route path="/catalogos/gerencias" element={<div>Catálogo de Gerencias</div>} />
          
          {/* Seguimiento Route */}
          <Route path="/seguimiento" element={<div>Seguimiento</div>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
