import { BrowserRouter, Routes, Route } from "react-router-dom";
import CsvUploadDataPreview from "./pages/CsvUploadDataPreview";
import InsightsRecommendationsHub from "./pages/InsightsRecommendationsHub";
import OnboardingFlowWizard from "./pages/OnboardingFlowWizard";
import LandingPage from "./pages/LandingPage";
import AiAnalystCopilot from "./pages/AiAnalystCopilot";
import SignUpLogin from "./pages/SignUpLogin";
import MainAnalyticsDashboard from "./pages/MainAnalyticsDashboard";
import WorkspaceSettingsPosIntegrations from "./pages/WorkspaceSettingsPosIntegrations";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignUpLogin />} />
        <Route path="/onboarding" element={<OnboardingFlowWizard />} />
        <Route path="/dashboard" element={<MainAnalyticsDashboard />} />
        <Route path="/upload" element={<CsvUploadDataPreview />} />
        <Route path="/insights" element={<InsightsRecommendationsHub />} />
        <Route path="/ai" element={<AiAnalystCopilot />} />
        <Route path="/settings" element={<WorkspaceSettingsPosIntegrations />} />
      </Routes>
    </BrowserRouter>
  );
}
