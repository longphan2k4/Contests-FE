import { Route } from "react-router-dom";
import HomePage from "../features/home/pages/HomePage";

const PublicRoutes = () => {
  return (
    <Route path="/">
      <Route index element={<HomePage />} />
    </Route>
  );
};

export default PublicRoutes;
