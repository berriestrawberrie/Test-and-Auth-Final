import "./registrationForm.css";
import RegistrationFormInput from "../RegistrationFormInput/RegistrationFormInput";
import { useState } from "react";
import Button from "../Button/Button";
import { auth } from "../../firebase/firebase.init";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { AxiosError } from "axios";
import { registerStudent } from "../../api/handlers/admins/adminHandler";

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
    try {
      const adminUser = auth.currentUser;
      if (!adminUser) throw new Error("Admin not authenticated");
      const adminToken = await adminUser.getIdToken();

      const registeredStudent = await registerStudent(
        {
          firstName: formData.firstname,
          lastName: formData.lastname,
          personNumber: formData.personnumber,
          phone: formData.phone,
          address: formData.address,
          email: formData.email,
          password: formData.password,
        },
        adminToken
      );
      console.log(registeredStudent);

      setFormData(FORM_INITIAL_STATE);
      navigate("/admins");
    } catch (error: unknown) {
      console.error("Registration error:", error);

      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          setError("This email is already registered");
        } else if (error.code === "auth/weak-password") {
          setError("Password should be at least 6 characters");
        } else {
          setError("Registration failed. Please try again.");
        }
      } else if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setError("User already exists in database");
        } else {
          setError("Registration failed. Please try again.");
        }
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
