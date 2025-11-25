import React, { useState } from "react";
import { userUpdateSchema } from "../../schemas/usersSchema";
import type { BaseUserInterface } from "../../interfaces/userInterfaces";
import type { z } from "zod";

type UserUpdateInput = z.infer<typeof userUpdateSchema>;

interface ModalEditProps {
  selectedStudent: BaseUserInterface;
  setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleStudentUpdate: (id: string, data: UserUpdateInput) => Promise<void>;
}

export const ModalEdit: React.FC<ModalEditProps> = ({
  selectedStudent,
  setIsEditOpen,
  handleStudentUpdate,
}) => {
  const [formData, setFormData] = useState<UserUpdateInput>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //CHECK AT LEAST ONE UPDATE
    const hasChanges = (
      Object.keys(formData) as (keyof UserUpdateInput)[]
    ).some((key) => formData[key] !== selectedStudent[key]);

    if (!hasChanges) {
      alert("You must change at least one field before saving.");
      return;
    }
    //PROCEED WITH UPDATE
    try {
      await handleStudentUpdate(selectedStudent.id, formData);
      setIsEditOpen(false);
    } catch (error: unknown) {
      console.error("Failed to update student:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <fieldset>
        <div>
          <label>First Name</label>
          <input
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            placeholder={selectedStudent.firstName}
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            placeholder={selectedStudent.lastName}
          />
        </div>
      </fieldset>
      <fieldset>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder={selectedStudent.email}
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            name="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder={selectedStudent.phone}
          />
        </div>
      </fieldset>
      <fieldset>
        <div>
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            rows={4}
            cols={44}
            style={{ resize: "none" }}
            placeholder={selectedStudent.address}
          />
        </div>
      </fieldset>
      <div className="modal-actions">
        <button>Save</button>
        <button onClick={() => setIsEditOpen(false)}>Cancel</button>
      </div>
    </form>
  );
};
