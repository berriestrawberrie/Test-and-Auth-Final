import "./registrationForm.css";
import RegistrationFormInput from "../RegistrationFormInput/RegistrationFormInput";
import { useState } from "react";
import Button from "../Button/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import { registerUser } from "../../api/handlers/users/usersHandler";
import { useNavigate } from "react-router-dom";
import { userCreationSchema } from "../../schemas/usersSchema";

const FORM_INITIAL_STATE = {
  firstname: "",
  lastname: "",
  personnumber: "",
  phone: "",
  address: "",
  email: "",
  password: "",
  repeatPassword: "",
};
const RegistrationForm = () => {
  const [formData, setFormData] = useState(FORM_INITIAL_STATE);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (error) {
      setError("");
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    let firebaseUser = null;

    try {
      const validatedUser = userCreationSchema.safeParse({
        firstName: formData.firstname,
        lastName: formData.lastname,
        personNumber: formData.personnumber,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
      });
      if (!validatedUser.success) throw validatedUser.error;

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      firebaseUser = userCredential.user;

      const token = await firebaseUser.getIdToken();

      await registerUser(validatedUser.data, token);

      setFormData(FORM_INITIAL_STATE);
      navigate("/admins");
    } catch (error: any) {
      console.error("Registration error:", error);

      if (firebaseUser) {
        try {
          await firebaseUser.delete();
          console.log("Rolled back Firebase user creation");
        } catch (deleteError) {
          console.error("Failed to rollback Firebase user:", deleteError);
        }
      }

      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else if (error.response?.status === 409) {
        setError("User already exists in database");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="registration-form" onSubmit={handleRegistration}>
      {error && <p className="registration-form__error">{error}</p>}
      <div className="registration-form__inner-wrapper">
        <RegistrationFormInput
          id="firstname"
          label="First name:"
          type="text"
          required
          minLength={2}
          maxLength={30}
          value={formData.firstname}
          onChange={handleChange}
        />
        <RegistrationFormInput
          id="lastname"
          label="Last name:"
          type="text"
          required
          minLength={2}
          maxLength={30}
          value={formData.lastname}
          onChange={handleChange}
        />
      </div>
      <div className="registration-form__inner-wrapper">
        <RegistrationFormInput
          id="personnumber"
          label="Person number:"
          type="text"
          required
          minLength={2}
          maxLength={30}
          value={formData.personnumber}
          onChange={handleChange}
        />
        <RegistrationFormInput
          id="phone"
          label="Telephone:"
          type="text"
          required
          minLength={2}
          maxLength={30}
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <RegistrationFormInput
        id="address"
        label="Address:"
        type="text"
        required
        minLength={2}
        maxLength={30}
        value={formData.address}
        onChange={handleChange}
      />
      <RegistrationFormInput
        id="email"
        label="Email:"
        type="email"
        required
        minLength={5}
        maxLength={40}
        value={formData.email}
        onChange={handleChange}
      />
      <div className="registration-form__inner-wrapper">
        <RegistrationFormInput
          id="password"
          label="Password:"
          type="password"
          required
          minLength={6}
          maxLength={20}
          value={formData.password}
          onChange={handleChange}
        />
        <RegistrationFormInput
          id="repeatPassword"
          label="Repeat Password:"
          type="password"
          required
          minLength={6}
          maxLength={20}
          value={formData.repeatPassword}
          onChange={handleChange}
        />
      </div>
      <Button text="Register" isLoading={isLoading} disabled={isLoading} />
    </form>
  );
};

export default RegistrationForm;
