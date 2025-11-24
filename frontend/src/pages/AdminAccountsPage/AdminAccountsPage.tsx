import { useEffect } from "react";
import { getStudents } from "../../api/handlers/admins/adminHandler";

const AdminAccountsPage = () => {
  useEffect(() => {
    const handleStudentFetch = async () => {
      const students = await getStudents();
      console.log(students);
    };
    handleStudentFetch();
  }, []);
  return <div>AdminAccountsPage</div>;
};

export default AdminAccountsPage;
