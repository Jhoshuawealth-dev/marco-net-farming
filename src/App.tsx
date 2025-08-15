import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Social from "./pages/Social";
import Events from "./pages/Events";
import Crypto from "./pages/Crypto";
import Learn from "./pages/Learn";
import Investment from "./pages/Investment";
import Adverts from "./pages/Adverts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/social" element={<Social />} />
          <Route path="/events" element={<Events />} />
          <Route path="/crypto" element={<Crypto />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/adverts" element={<Adverts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
