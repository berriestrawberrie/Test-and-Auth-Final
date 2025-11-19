import "./registrationFormInput.css";

interface Props {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const RegistrationFormInput: React.FC<Props> = ({
  id,
  label,
  type,
  required,
  minLength,
  maxLength,
  value,
  onChange,
}) => {
  return (
    <label htmlFor={id} className="registration-form__input-wrapper">
      {label}
      <input
        type={type}
        id={id}
        className="registration-form__input"
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
      />
    </label>
  );
};

export default RegistrationFormInput;
