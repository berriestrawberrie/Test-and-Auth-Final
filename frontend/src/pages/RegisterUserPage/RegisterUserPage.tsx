import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import "./registerUserPage.css";

const RegisterUserPage = () => {
  return (
    <div className="registration-page">
      <h1 className="registration-page__title">Register student:</h1>
      <RegistrationForm />{" "}
    </div>
  );
};

export default RegisterUserPage;
