import { useEffect, useState } from "react";
import { getStudents } from "../../api/handlers/admins/adminHandler";
import type { StudentInterface } from "../../interfaces/userInterfaces";
import Table from "../../components/Table/Table";
import Filter from "../../components/Filter/Filter";

const AdminGradesPage = () => {
  //FILTER YEAR
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  //FILTER COURSES
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
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
      <Filter
        isSubject={true}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        setSelectedCourse={setSelectedCourse}
      />
      <Table
        title1={"Student"}
        title2={"Grade"}
        title3={"Date"}
        multiData={students}
        selectedYear={selectedYear}
        selectedCourse={selectedCourse}
      />
    </div>
  );
};

export default AdminGradesPage;
