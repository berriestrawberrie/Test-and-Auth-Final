import "./table.css";
import type { Student } from "../../interfaces/studentInterfaces";
import type { StudentInterface } from "../../interfaces/userInterfaces";

interface Props {
  title1: string;
  title2: string;
  title3: string;
  studentData?: Student;
  multiData?: StudentInterface[];
  selectedYear: number | null;
  selectedCourse: string | null;
}

const Table: React.FC<Props> = ({
  title1,
  title2,
  title3,
  studentData,
  selectedYear,
  selectedCourse,
  multiData,
}) => {
  //HANDLE THE SINGLE STUDENT TABLE
  const filteredGrades = studentData
    ? studentData.grades
        .filter((grade) => {
          //IF YEAR SET FILTER ONLY MATCHING OTHERWISE INCLUDE ALL
          const yearMatch = selectedYear ? grade.year === selectedYear : true;

          //IF COURSE SET FILTER ONLY MATCHING OTHERWISE INCLUDE ALL
          const courseMatch =
            selectedCourse && selectedCourse !== "All"
              ? grade.course.title === selectedCourse
              : true;
          return yearMatch && courseMatch;
        })
        .sort((a, b) => a.year - b.year)
    : [];
  // HANDLE THE MULTI STUDENT TABLE
  const filteredStudents = multiData
    ? multiData.map((student) => ({
        ...student,
        grades: student.grades
          .filter((grade) => {
            const yearMatch = selectedYear ? grade.year === selectedYear : true;
            const courseMatch =
              selectedCourse && selectedCourse !== "All"
                ? grade.course.title === selectedCourse
                : true;
            return yearMatch && courseMatch;
          })
          .sort((a, b) => a.year - b.year),
      }))
    : [];

  return (
    <>
      <div className="table">
        {/*TABLE START */}
        <table>
          <thead>
            <tr>
              <th className="th-title1">{title1}</th>
              <th className="th-title2">{title2}</th>
              <th className="th-title3">{title3}</th>
            </tr>
          </thead>
          {/*SINGLE STUDENT TABLE */}
          {studentData && (
            <tbody>
              {filteredGrades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.course.title}</td>
                  <td>{grade.grade}</td>
                  <td>{grade.year}</td>
                </tr>
              ))}
            </tbody>
          )}
          {/* MULTI STUDENT TABLE */}
          {multiData && (
            <tbody>
              {filteredStudents.map((student) =>
                student.grades.map((grade) => (
                  <tr key={grade.id}>
                    <td>{student.firstName + " " + student.lastName}</td>
                    <td>{grade.grade}</td>
                    <td>{new Date(grade.date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};

export default Table;
