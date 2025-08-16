import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import SplashScreen from "@/components/SplashScreen";
import AuthScreen from "@/components/AuthScreen";
import Home from "./pages/Home";
import Social from "./pages/Social";
import Events from "./pages/Events";
import Crypto from "./pages/Crypto";
import Learn from "./pages/Learn";
import Investment from "./pages/Investment";
import Adverts from "./pages/Adverts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading, checkSplashCompleted } = useAuth();
  const [showSplash, setShowSplash] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      if (loading) return;
      
      if (user) {
        const splashCompleted = await checkSplashCompleted();
        setShowSplash(!splashCompleted);
      }
      setInitializing(false);
    };

    initializeApp();
  }, [user, loading, checkSplashCompleted]);

  if (loading || initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background-muted flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading Marco-net Farming...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
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
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
