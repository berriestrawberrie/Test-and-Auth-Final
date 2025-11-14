import LandingPage from "../pages/LandingPage/LandingPage";
import { Route, Routes } from "react-router-dom";

const RoutesComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
        </Routes>
    );
};

export default RoutesComponent;
