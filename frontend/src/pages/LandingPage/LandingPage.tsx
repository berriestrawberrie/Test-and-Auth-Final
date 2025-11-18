import Login from "../../components/Login/Login";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import "./LandingPage.css";

interface Props {}
const LandingPage: React.FC<Props> = () => {
  // return <Login />;
  return <RegistrationForm />;
};

export default LandingPage;
