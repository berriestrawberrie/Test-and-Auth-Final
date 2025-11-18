import LandingPage from "../pages/LandingPage/LandingPage";
import StudentPage from "../pages/GradesPage/StudentPage";
import { Route, Routes } from "react-router-dom";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/student" element={<StudentPage title={"Student"} />} />
    </Routes>
  );
};

export default RoutesComponent;
