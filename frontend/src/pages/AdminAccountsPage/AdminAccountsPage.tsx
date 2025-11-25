import { useEffect, useState } from "react";
import { addGradeToStudent, deleteStudent, getStudents } from "../../api/handlers/admins/adminHandler";
import type { StudentInterface } from "../../interfaces/userInterfaces";
import type { GradeCreationInput } from "../../schemas/gradesSchema";

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
  const handleAddGrade = async (studentId: string, gradeData: GradeCreationInput) => {
    try {
      // Assuming addGradeToStudent is imported from adminHandler
      const response = await addGradeToStudent(studentId, gradeData);
      console.log(response);
      alert("Grade added successfully!");
    } catch (error) {
      console.error("Failed to add grade:", error);
      alert("Failed to add grade. Please try again.");
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
  return (
    <ul>
      {students?.map((student) => (
        <li
          key={student.id}
          style={{ cursor: "pointer", padding: "1rem", marginBlock: "0.5rem", border: "1px solid #ccc" }}
          onClick={() => handleAddGrade(student.id, { courseId: 1, grade: "A", year: 1 })}>
          {student.email}
        </li>
      ))}
    </ul>
  );
};

export default AdminAccountsPage;
