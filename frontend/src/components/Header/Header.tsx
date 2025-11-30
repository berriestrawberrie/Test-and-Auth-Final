import useUserStore from "../../stores/usersStore";
import "./header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.init";

const Header: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const isOnLandingPage = location.pathname === "/";
  const isBackButtonShowing = location.pathname !== "/admins" && user?.role === "ADMIN";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Something went wrong at handleLogout", error);
    }
  };

  return (
    <header className="header">
      {isBackButtonShowing && (
        <Link to="/admins" className="header__back-button">
          &lsaquo; BACK
        </Link>
      )}
      {!isOnLandingPage && user && (
        <button className="header__logout-button" onClick={handleLogout}>
          <img
            className="header__logout-icon"
            src="/assets/icons/logout.svg"
            alt="An arrow coming out of a c-shape. Symbol of logout"
          />
          <span className="header__logout-text">{`${user.firstName} ${user.lastName}`}</span>
        </button>
      )}
    </header>
  );
};

export default Header;
