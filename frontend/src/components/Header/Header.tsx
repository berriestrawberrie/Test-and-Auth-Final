import useUserStore from "../../stores/usersStore";
import "./header.css";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/elev");
    }

    setUser(null);
    // TODO: add firebase logout logic here.
  };

  return (
    <header className="header">
      {user && (
        <button className="header__logout-button" onClick={handleLogout}>
          <img
            className="header__logout-icon"
            src="./assets/icons/logout.svg"
            alt="An arrow coming out of a c-shape. Symbol of logout"
          />
          <span className="header__logout-text">{`${user.firstName} ${user.lastName}`}</span>
        </button>
      )}
    </header>
  );
};

export default Header;
