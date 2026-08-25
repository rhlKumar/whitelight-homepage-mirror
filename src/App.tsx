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
import WellnessPrivacy from "./pages/WellnessPrivacy";
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
        <Route path="/loveguru/privacy" element={<WellnessPrivacy appName="Loveguru" slug="loveguru" />} />
        <Route path="/bizguru/privacy" element={<WellnessPrivacy appName="Business Guru" slug="bizguru" />} />
        <Route path="/pashudost/privacy" element={<WellnessPrivacy appName="Pashudost" slug="pashudost" />} />
        <Route path="/maya/privacy" element={<WellnessPrivacy appName="Parvarish Coach" slug="maya" />} />
        <Route path="/sukoon/privacy" element={<WellnessPrivacy appName="Intimacy Coach" slug="sukoon" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
