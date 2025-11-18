import "./registrationForm.css";
import RegistrationFormInput from "../RegistrationFormInput/RegistrationFormInput";
import { useState } from "react";
import Button from "../Button/Button";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    personnumber: "",
    telephone: "",
    address: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [error, setError] = useState("");
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

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    console.log(formData);
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
          id="telephone"
          label="Telephone:"
          type="text"
          required
          minLength={2}
          maxLength={30}
          value={formData.telephone}
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
      <Button text="Register" />
    </form>
  );
};

export default RegistrationForm;
