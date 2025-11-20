import "./studentpage.css";
import { useEffect, useState } from "react";
import Filter from "../../components/Filter/Filter";
import Table from "../../components/Table/Table";
import useUserStore from "../../stores/usersStore";
import { getStudentData } from "../../api/handlers/students/studentsHandler";

interface Props {
  title: string;
}
const StudentPage: React.FC<Props> = ({ title }) => {
  //PULL USER FROM ZUSTAND
  const user = useUserStore((state) => state.user);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      //RETURN ON INVALID USER
      if (!user?.id) return;
      try {
        const data = await getStudentData(user.id);
        setStudentData(data);
      } catch (error: unknown) {
        console.error("Failed to fetch student data:", error);
      }
    };
    fetchStudent();
  }, [user]);

  return (
    <div className="container">
      <h1>{title}</h1>
      <Filter isSubject={true} onchange={() => {}} />
      <Table
        title1={"Course"}
        title2={"Grade"}
        title3={"Year"}
        isExpand={false}
        studentData={studentData}
      />
    </div>
  );
};

export default StudentPage;
