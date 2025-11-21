import { useEffect } from "react";
import { getStudents } from "../../api/handlers/admins/adminHandler";
import { auth } from "../../firebase/firebase.init";

const AdminAccountsPage = () => {
  const handleStudentFetch = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();
    const students = await getStudents(token);
    console.log(students);
  };
  useEffect(() => {
    handleStudentFetch();
  }, []);
  return <div>AdminAccountsPage</div>;
};

export default AdminAccountsPage;
