import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppHeader from "./components/Header";
import SignLanguageDetector from "../src/components/pages/SignLanguageDetector";
import LearnPage from "../src/components/pages/LearnPage";
import PracticePage from "../src/components/pages/PracticePage";
import CommunityPage from "../src/components/pages/CommunityPage";
import Home from "./components/pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detect" element={<SignLanguageDetector />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </div>
  );
}

export default App;
