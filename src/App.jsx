import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import NavBar from './components/NavBar';
import DetectPage from '../src/components/pages/DetectPage';
import LearnPage from '../src/components/pages/LearnPage';
import PracticePage from '../src/components/pages/PracticePage';
import CommunityPage from '../src/components/pages/CommunityPage';

function App() {
  // const [userProgress] = useState(65);
  // const recentSigns = ["Hello", "Thank You", "Good Morning", "How are you?", "Nice to meet you"];

  return (
    <>
       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <NavBar />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Routes>
              <Route path="/" element={<DetectPage />} />
              <Route path="/detect" element={<DetectPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/community" element={<CommunityPage />} />
            </Routes>
          </div>

          {/* <div className="lg:col-span-4 space-y-6">
            <ProgressCard userProgress={userProgress} />
            <RecentSignsCard recentSigns={recentSigns} />
            <QuickActionsCard />
          </div> */}
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
