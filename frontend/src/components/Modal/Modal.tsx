import "./modal.css";
import { useState } from "react";
import type {
  StudentInterface,
  BaseUserInterface,
} from "../../interfaces/userInterfaces";
import { ModalEdit } from "./ModalEdit";
import { userUpdateSchema } from "../../schemas/usersSchema";
import type { z } from "zod";
type UserUpdateInput = z.infer<typeof userUpdateSchema>;

interface Props {
  handleClose: () => void;
  handleDelete: (id: string, studentName: string) => void;
  selectedStudent: BaseUserInterface;
  handleStudentUpdate: (id: string, data: UserUpdateInput) => Promise<void>;
}

const Modal: React.FC<Props> = ({
  handleClose,
  selectedStudent,
  handleDelete,
  handleStudentUpdate,
}) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const openForm = () => {
    setIsEditOpen(!isEditOpen);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <img
          className="modal-close"
          onClick={handleClose}
          src="/assets/icons/close.svg"
        />
        {isEditOpen && (
          <>
            <ModalEdit
              selectedStudent={selectedStudent}
              setIsEditOpen={setIsEditOpen}
              handleStudentUpdate={handleStudentUpdate}
            />
          </>
        )}

        {!isEditOpen && (
          <>
            <h4>
              {selectedStudent.firstName + " " + selectedStudent.lastName}
            </h4>

            <div className="modal-details">
              <ul>
                <li>Email: </li>
                <li>PersonNr: </li>
                <li>Tel:</li>
                <li>Address: </li>
              </ul>
              <ul>
                <li>{selectedStudent.email}</li>
                <li>{selectedStudent.personNumber}</li>
                <li>{selectedStudent.phone}</li>
                <li>{selectedStudent.address}</li>
              </ul>
            </div>

            <div className="modal-actions">
              <button onClick={openForm}>Edit</button>
              <button
                onClick={() =>
                  handleDelete(
                    selectedStudent.id,
                    `${selectedStudent.firstName} ${selectedStudent.lastName}`
                  )
                }
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
