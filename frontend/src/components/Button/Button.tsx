import "./Button.css";

interface Props {
  text?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
}

const Button: React.FC<Props> = ({ text, onClick, disabled = false, size = "medium", isLoading = false }) => {
  const buttonText = isLoading ? "Loading..." : text;
  return (
    <button className={`button button--${size}`} onClick={onClick} disabled={disabled}>
      <span className={`button__text button__text--${size}`}>{buttonText}</span>
    </button>
  );
};

export default Button;
