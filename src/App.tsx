import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Policy from "./pages/Policy";
import Terms from "./pages/Terms";
import PulseCheckPrivacy from "./pages/PulseCheckPrivacy";
import PulseCheckTerms from "./pages/PulseCheckTerms";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/pulsecheck/privacy" element={<PulseCheckPrivacy />} />
        <Route path="/pulsecheck/terms" element={<PulseCheckTerms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
