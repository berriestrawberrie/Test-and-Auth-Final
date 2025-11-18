import Button from "../../components/Button/Button";
import "./adminLandingPage.css";

const AdminLandingPage = () => {
  return (
    <div className="admin-button-wrapper">
      <Button text="Register Student" size="large" />
      <Button text="Register Grades" size="large" />
      <Button text="Admin Student Accounts" size="large" />
    </div>
  );
};

export default AdminLandingPage;
