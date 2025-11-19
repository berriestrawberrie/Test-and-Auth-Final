import RouteAuthenticator from "../components/RouteAuthenticator/RouteAuthenticator";
import AdminLandingPage from "../pages/AdminLandingPage/AdminLandingPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import RegisterUserPage from "../pages/RegisterUserPage/RegisterUserPage";
import StudentPage from "../pages/StudentPage/StudentPage";
import { Route, Routes } from "react-router-dom";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/admins/*"
        element={
          <RouteAuthenticator requiredRole="ADMIN">
            <Routes>
              <Route index element={<AdminLandingPage />} />
              <Route path="register" element={<RegisterUserPage />} />
            </Routes>
          </RouteAuthenticator>
        }
      />
      <Route path="/students" element={<StudentPage title={"Grades"} />} />
    </Routes>
  );
};

export default RoutesComponent;
