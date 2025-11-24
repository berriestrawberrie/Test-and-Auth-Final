import { useEffect, useState } from "react";
import { getStudents } from "../../api/handlers/admins/adminHandler";
import type { StudentInterface } from "../../interfaces/userInterfaces";
import Table from "../../components/Table/Table";

const AdminGradesPage = () => {
  const [students, setStudents] = useState<StudentInterface[]>([]);
  useEffect(() => {
    const handleStudentFetch = async () => {
      const fetchedStudents = await getStudents();
      if (fetchedStudents) {
        setStudents(fetchedStudents.users);
      }
    };
    handleStudentFetch();
  }, []);
  console.log(students);
  return (
    <div>
      <h4>AdminGradesPage</h4>
    </div>
  );
};

export default AdminGradesPage;
