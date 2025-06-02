import { Route } from 'react-router-dom';
import MatchPage from './pages/MatchPage';

const MatchRoutes = () => {
  return (
    <Route path="/match" element={<MatchPage />} />
  );
};
export default MatchRoutes;