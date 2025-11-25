import { useEffect, useState } from "react";
import {
  deleteStudent,
  getStudents,
  editStudent,
} from "../../api/handlers/admins/adminHandler";
import type {
  StudentInterface,
  BaseUserInterface,
} from "../../interfaces/userInterfaces";

import AccountTable from "../../components/Table/AccountTable";
import Filter from "../../components/Filter/Filter";
import Modal from "../../components/Modal/Modal";
import { userUpdateSchema } from "../../schemas/usersSchema";
import type { z } from "zod";

type UserUpdateInput = z.infer<typeof userUpdateSchema>;

const AdminAccountsPage = () => {
  const [students, setStudents] = useState<StudentInterface[]>([]);
  //FILTER YEAR
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  //OPEN THE MODAL
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectedStudent = students;

  const handleRowClick = (student: BaseUserInterface) => {
    setSelectedStudentId(student.id);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  };

  const handleDeleteStudent = async (id: string, studentName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${studentName}? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }
    try {
      await deleteStudent(id);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
      );
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert("Failed to delete student. Please try again.");
    }
  };

  useEffect(() => {
    const handleStudentFetch = async () => {
      const fetchedStudents = await getStudents();
      if (fetchedStudents) {
        setStudents(fetchedStudents.users);
      }
    };
    handleStudentFetch();
  }, []);

  const handleStudentUpdate = async (id: string, data: UserUpdateInput) => {
    const updatedStudent = await editStudent(id, data);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === updatedStudent.user.id ? updatedStudent.user : s
      )
    );
  };

  return (
    <div>
      <Filter
        isSubject={false}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        setSelectedCourse={() => {}}
      />
      <AccountTable multiData={students} onRowClick={handleRowClick} />

      {isModalOpen && selectedStudent && (
        <Modal
          selectedStudentId={selectedStudentId}
          handleClose={closeModal}
          handleDelete={handleDeleteStudent}
          handleStudentUpdate={handleStudentUpdate}
          students={students}
        />
      )}
    </div>
  );
};

export default AdminAccountsPage;
