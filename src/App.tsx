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
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AdminRoute } from "./components/AdminRoute";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading, checkSplashCompleted } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [splashCompleted, setSplashCompleted] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      if (loading) return;
      
      // Check if splash was completed regardless of user status
      const completed = localStorage.getItem('splash_completed') === 'true';
      setSplashCompleted(completed);
      setShowSplash(!completed);
      setInitializing(false);
    };

    initializeApp();
  }, [loading]);

  const handleSplashComplete = () => {
    localStorage.setItem('splash_completed', 'true');
    setSplashCompleted(true);
    setShowSplash(false);
  };

  if (loading || initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading Marco-net Farming...</p>
        </div>
      </div>
    );
  }

  // Show splash screen first, regardless of authentication status
  if (showSplash && !splashCompleted) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // After splash is completed, check authentication
  if (!user) {
    return <AuthScreen />;
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
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="light">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
