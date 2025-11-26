import "./modal.css";
import { useState } from "react";
import { gradeCreationSchema } from "../../schemas/gradesSchema";
import type {
  StudentInterface,
  BaseUserInterface,
} from "../../interfaces/userInterfaces";
import type { z } from "zod";

type GradeCreationInput = z.infer<typeof gradeCreationSchema>;
interface Props {
  handleClose: () => void;
  students: StudentInterface[];
}

const ModalGrade: React.FC<Props> = ({ handleClose, students }) => {
  const [formData, setFormData] = useState<GradeCreationInput>({
    courseId: 1,
    grade: "A",
    year: 1,
  });
  const gradeOptions = gradeCreationSchema.shape.grade.options;
  const yearOptions = gradeCreationSchema.shape.year.options.map(
    (opt) => (opt as z.ZodLiteral<any>).value
  );
  const [year, setYear] = useState<number>(1);
  const [courseId, setCourseId] = useState<number>(1);
  const [studentId, setStudentId] = useState<string>("");
  function getGradeForStudent(
    studentId: string,
    year: number,
    courseId: number
  ): string | undefined {
    const student = students.find((s) => s.id === studentId);
    if (!student) return "--";

    const match = student.grades.find(
      (g) => g.year === year && g.course.id === courseId
    );

    return match?.grade;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        {/*CURRENT STUDENT INFORMATION*/}
        <div className="modal-gradeinfo">
          <h4>
            Year {year} Grade:{" "}
            {courseId === 1
              ? "Math"
              : courseId === 2
              ? "Art"
              : courseId === 3
              ? "History"
              : "--"}
          </h4>
          <p>{getGradeForStudent(studentId, year, courseId)}</p>
        </div>
        <img
          className="modal-close"
          onClick={handleClose}
          src="/assets/icons/close.svg"
        />
        <form className="modal-form">
          <fieldset>
            <div>
              <label>Student</label>
              <select
                name="student"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              >
                <option>Select Student</option>
                {students.map((student: BaseUserInterface) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName + " " + student.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Year</label>
              <select
                name="year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <fieldset>
            <div>
              <label>Course</label>
              <select
                name="courseId"
                value={courseId}
                onChange={(e) => setCourseId(Number(e.target.value))}
              >
                <option value="-1">Select Course</option>
                <option value="1">Math</option>
                <option value="2">Art</option>
                <option value="3">History</option>
              </select>
            </div>
            <div>
              <label>Update Grade</label>
              <select name="grade">
                <option>Select Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalGrade;
