import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./adminLandingPage.css";

const AdminLandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-button-wrapper">
      <Button text="Register Student" size="large" onClick={() => navigate("/admins/register")} />
      <Button text="Register Grades" size="large" onClick={() => navigate("/admins/grades")} />
      <Button text="Admin Student Accounts" size="large" onClick={() => navigate("/admins/accounts")} />
    </div>
  );
};

export default AdminLandingPage;
