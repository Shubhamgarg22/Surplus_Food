// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/screen/home.tsx";
import ClaimHistory from "./components/screen/claimHistory.tsx";
import FeedbackScreen from "./components/screen/feedback.tsx";
import AIInsights from "./components/screen/aiinsight.tsx";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aIInsights" element={<AIInsights />} />
        <Route path="/feedbackScreen" element={<FeedbackScreen />} />
        <Route path="/claimHistory" element={<ClaimHistory />} />
      </Routes>
    </Router>
  );
};

export default App;
