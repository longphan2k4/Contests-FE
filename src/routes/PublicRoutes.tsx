import { Route } from "react-router-dom";
import Forbidden403 from "../components/403";
import NotFound404 from "../components/404";
import HomePage from "../features/home/pages/HomePage";
import ContestPage from "../features/home/pages/ContestPage";

const PublicRoutes = () => {
  return (
      <Route path="/">
        <Route index element={<HomePage />} />
        <Route path="contest" element={<ContestPage />} />
        <Route path="403" element={<Forbidden403 />} />
        <Route path="404" element={<NotFound404 />} />
        <Route path="*" element={<NotFound404 />} />
      </Route>
  );
};

export default PublicRoutes;