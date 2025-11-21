import "./Button.css";

interface Props {
  text?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  isActive?: boolean;
}

const Button: React.FC<Props> = ({
  text,
  onClick,
  disabled = false,
  size = "medium",
  isLoading = false,
  isActive,
}) => {
  const buttonText = isLoading ? "Loading..." : text;
  return (
    <button
      className={`button button--${size} ${isActive ? "button--active" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={`button__text button__text--${size}`}>{buttonText}</span>
    </button>
  );
};

export default Button;
