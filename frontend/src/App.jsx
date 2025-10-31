import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SkillsList from './pages/SkillsList';
import AddSkill from './pages/AddSkill';
import EditSkill from './pages/EditSkill';
import SkillDetail from './pages/SkillDetail';  
import Timeline from './pages/Timeline';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/skills" element={<SkillsList />} />
            <Route path="/add-skill" element={<AddSkill />} />
            <Route path="/edit-skill/:id" element={<EditSkill />} />
            <Route path="/skill/:id" element={<SkillDetail />} />  
            <Route path="/timeline" element={<Timeline />} />
            
            <Route path="*" element={
              <div style={{textAlign: 'center', padding: '3rem'}}>
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;