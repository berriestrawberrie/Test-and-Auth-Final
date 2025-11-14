import "./Button.css";

interface Props {
    text?: string;
    onClick?: () => void;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
}

const Button: React.FC<Props> = ({ text, onClick, disabled = false, size = "medium" }) => {
    return (
        <button className={`button button--${size}`} onClick={onClick} disabled={disabled}>
            <span className={`button__text button__text--${size}`}>{text}</span>
        </button>
    );
};

export default Button;
