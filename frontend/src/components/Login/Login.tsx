import "./login.css";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { loginUser } from "../../api/handlers/users/usersHandler";
import useUserStore from "../../stores/usersStore";

const Login = () => {
  const setUser = useUserStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await userCredential.user.getIdToken();

      const login = await loginUser(idToken);
      setUser(login.user);
      if (login.user.role === "ADMIN") {
        navigate(`/admin/${login.user.id}`);
        return;
      }
      navigate(`/elev/${login.user.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <h1 className="login__title">Login</h1>
      <form className="login__form" onSubmit={handleSubmit}>
        {error && <p className="login__error">{error}</p>}
        <label className="login__label" htmlFor="email">
          Email:
        </label>
        <input
          className="login__input"
          type="email"
          id="email"
          name="email"
          value={email}
          required
          min={5}
          max={40}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="login__label" htmlFor="password">
          Password:
        </label>
        <input
          className="login__input"
          type="password"
          id="password"
          name="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="remember" className="login__remember-label">
          <input className="login__remember-checkbox" type="checkbox" id="remember" name="remember" />
          Remember Me
        </label>
        <div className="login__button-wrapper">
          <Button text="Login" isLoading={isLoading} disabled={isLoading} />
          <Link to="/forgot-password" className="login__forgot-password">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
