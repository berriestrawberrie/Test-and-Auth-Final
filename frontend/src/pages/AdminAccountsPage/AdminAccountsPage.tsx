import { useEffect, useState } from "react";
import {
  deleteStudent,
  getStudents,
} from "../../api/handlers/admins/adminHandler";
import type {
  StudentInterface,
  BaseUserInterface,
} from "../../interfaces/userInterfaces";

import AccountTable from "../../components/Table/AccountTable";
import Filter from "../../components/Filter/Filter";
import Modal from "../../components/Modal/Modal";

const AdminAccountsPage = () => {
  const [students, setStudents] = useState<StudentInterface[]>([]);
  //FILTER YEAR
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  //FILTER COURSES
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  //OPEN THE MODAL
  const [selectedStudent, setSelectedStudent] =
    useState<BaseUserInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleRowClick = (student: BaseUserInterface) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
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
  console.log(isModalOpen);
  useEffect(() => {
    const handleStudentFetch = async () => {
      const fetchedStudents = await getStudents();
      if (fetchedStudents) {
        setStudents(fetchedStudents.users);
      }
    };
    handleStudentFetch();
  }, []);
  return (
    <div>
      <Filter
        isSubject={false}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        setSelectedCourse={setSelectedCourse}
      />
      <AccountTable multiData={students} onRowClick={handleRowClick} />

      {isModalOpen && <Modal handleClose={closeModal} />}
    </div>
  );
};

export default AdminAccountsPage;
