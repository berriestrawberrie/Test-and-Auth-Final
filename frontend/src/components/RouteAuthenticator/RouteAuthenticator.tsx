import { useEffect, useState } from "react";
import useUserStore from "../../stores/usersStore";
import { auth } from "../../firebase/firebase.init";
import { loginUser } from "../../api/handlers/users/usersHandler";
import { Navigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import type { UserRoleType } from "../../interfaces/userInterfaces";

interface Props {
  children: React.ReactNode;
  requiredRole?: UserRoleType;
}

const RouteAuthenticator = ({ children, requiredRole }: Props) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setLoading(false);
          setAuthorized(false);
          return;
        }

        if (!user) {
          const token = await firebaseUser.getIdToken();
          const response = await loginUser(token);
          setUser(response.user);

          if (!requiredRole || response.user.role === requiredRole) {
            setAuthorized(true);
          }
        } else {
          if (!requiredRole || user.role === requiredRole) {
            setAuthorized(true);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user, setUser, requiredRole]);

  if (loading) {
    return <Loader />;
  }

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RouteAuthenticator;
