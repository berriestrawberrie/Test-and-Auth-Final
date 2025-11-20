import "./table.css";
import type { Student, Grade } from "../../interfaces/studentInterfaces";

interface Props {
  title1: string;
  title2: string;
  title3: string;
  title4?: string;
  isExpand: boolean;
  studentData: Student;
  selectedYear: number | null;
  selectedCourse: string | null;
}

const Table: React.FC<Props> = ({
  title1,
  title2,
  title3,
  title4,
  isExpand,
  studentData,
  selectedYear,
  selectedCourse,
}) => {
  let filteredGrades: Grade[] = [];

  //CHECK IF COURSES FILTERED
  if (selectedCourse === "All") {
    //FILTER & SORT GRADES BY YEAR ONLY
    filteredGrades = selectedYear
      ? studentData.grades
          .filter((grade) => grade.year === selectedYear)
          .sort((a, b) => a.year - b.year)
      : studentData.grades.sort((a, b) => a.year - b.year);
  } else {
    //FILTER & SORT GRADES BY YEAR
    filteredGrades = selectedYear
      ? studentData.grades
          .filter(
            (grade) =>
              grade.year === selectedYear &&
              grade.course.title === selectedCourse
          )
          .sort((a, b) => a.year - b.year)
      : studentData.grades
          .filter((grade) => grade.course.title === selectedCourse)
          .sort((a, b) => a.year - b.year);
  }

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
              {isExpand && <th className="th-title4">{title4}</th>}
            </tr>
          </thead>
          <tbody>
            {filteredGrades.map((grade) => (
              <tr key={grade.id}>
                <td>{grade.course.title}</td>
                <td>{grade.grade}</td>
                <td>{grade.year}</td>
                {isExpand && <td>Column 4 Data</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
