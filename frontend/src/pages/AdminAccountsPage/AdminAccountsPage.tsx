import { useEffect, useState } from "react";
import { deleteStudent, getStudents } from "../../api/handlers/admins/adminHandler";
import type { StudentInterface } from "../../interfaces/userInterfaces";

const AdminAccountsPage = () => {
  const [students, setStudents] = useState<StudentInterface[]>([]);

  const handleDeleteStudent = async (id: string, studentName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }
    try {
      await deleteStudent(id);
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
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
        setStudents(fetchedStudents.data);
      }
    };
    handleStudentFetch();
  }, []);
  return (
    <ul>
      {students?.map((student) => (
        <li
          key={student.id}
          style={{ cursor: "pointer", padding: "1rem", marginBlock: "0.5rem", border: "1px solid #ccc" }}
          onClick={() => handleDeleteStudent(student.id, `${student.firstName} ${student.lastName}`)}>
          {student.email}
        </li>
      ))}
    </ul>
  );
};

export default AdminAccountsPage;
