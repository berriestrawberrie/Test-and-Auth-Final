import { useEffect, useState } from "react";
import {
  getStudents,
  updateGradeToStudent,
} from "../../api/handlers/admins/adminHandler";
import type { StudentInterface } from "../../interfaces/userInterfaces";
import Table from "../../components/Table/Table";
import Filter from "../../components/Filter/Filter";
import Button from "../../components/Button/Button";
import ModalGrade from "../../components/Modal/ModalGrade";
import { gradeCreationSchema } from "../../schemas/gradesSchema";
import type { z } from "zod";

type GradeCreationInput = z.infer<typeof gradeCreationSchema>;

const AdminGradesPage = () => {
  //FILTER YEAR
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  //FILTER COURSES
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => {
    const handleStudentFetch = async () => {
      const fetchedStudents = await getStudents();
      if (fetchedStudents) {
        setStudents(fetchedStudents.users);
      }
    };
    handleStudentFetch();
  }, []);

  const handleSaveGrade = async (id: string, gradeData: GradeCreationInput) => {
    await updateGradeToStudent(id, gradeData);
  };

  return (
    <div>
      <h4>AdminGradesPage</h4>
      <Filter
        isSubject={true}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        setSelectedCourse={setSelectedCourse}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button text="Add Grade" onClick={() => setIsModalOpen(true)} />
      </div>
      {isModalOpen && (
        <ModalGrade
          students={students}
          handleClose={() => setIsModalOpen(false)}
          handleSaveGrade={handleSaveGrade}
        />
      )}
      <Table
        title1={"Student"}
        title2={"Grade"}
        title3={"Date"}
        title4={"Course"}
        isExpand={true}
        multiData={students}
        selectedYear={selectedYear}
        selectedCourse={selectedCourse}
      />
    </div>
  );
};

export default AdminGradesPage;
