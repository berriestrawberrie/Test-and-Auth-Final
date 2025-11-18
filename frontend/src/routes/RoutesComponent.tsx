import LandingPage from "../pages/LandingPage/LandingPage";
import StudentPage from "../pages/StudentPage/StudentPage";
import { Route, Routes } from "react-router-dom";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/student" element={<StudentPage title={"Grades"} />} />
    </Routes>
  );
};

export default RoutesComponent;
