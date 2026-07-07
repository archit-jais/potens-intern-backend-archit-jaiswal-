import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RecommendationPage from './pages/RecommendationPage.jsx';
import InternshipDetailsPage from './pages/InternshipDetailsPage.jsx';
import CataloguePage from './pages/CataloguePage.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/recommend" element={<RecommendationPage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/internships/:id" element={<InternshipDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
