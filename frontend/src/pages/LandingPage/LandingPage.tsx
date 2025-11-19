import Login from "../../components/Login/Login";
import "./LandingPage.css";
import useUserStore from "../../stores/usersStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/handlers/users/usersHandler";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import Loader from "../../components/Loader/Loader";

const LandingPage: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        let userToCheck = user;

        if (firebaseUser && !user) {
          const token = await firebaseUser.getIdToken();
          const response = await loginUser(token);
          setUser(response.user);
          userToCheck = response.user;
        }

        if (userToCheck) {
          const destination = userToCheck.role === "ADMIN" ? "/admins" : "/students";
          navigate(destination, { replace: true });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user, setUser, navigate]);

  if (loading) {
    return <Loader />;
  }

  return <Login />;
};

export default LandingPage;
