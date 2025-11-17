import LandingPage from "../pages/LandingPage/LandingPage";
import GradesPage from "../pages/GradesPage/GradesPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import { Route, Routes } from "react-router-dom";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/grades" element={<GradesPage title={"Student"} />} />
      <Route path="/admin" element={<AdminPage title={"Admin"} />} />
    </Routes>
  );
};

export default RoutesComponent;
