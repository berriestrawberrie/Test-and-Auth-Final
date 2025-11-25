import "./modal.css";

interface Props {
  handleClose: () => void;
}

const Modal: React.FC<Props> = ({ handleClose }) => {
  return (
    <div className="modal">
      <div className="modal__container">
        <h4>Student Name</h4>
        <ul>
          <li>Email: </li>
          <li>PersonNr: </li>
          <li>Tel: </li>
          <li>PersonNr: </li>
          <li>Address: </li>
        </ul>
        <img
          className="modal__close"
          onClick={() => handleClose}
          src="/assets/icons/close.svg"
        />
      </div>
    </div>
  );
};

export default Modal;
