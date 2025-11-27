import "./modal.css";
import { useState } from "react";
import { gradeCreationSchema } from "../../schemas/gradesSchema";
import type {
  StudentInterface,
  BaseUserInterface,
} from "../../interfaces/userInterfaces";
import { z } from "zod";

type GradeCreationInput = z.infer<typeof gradeCreationSchema>;
interface Props {
  handleClose: () => void;
  students: StudentInterface[];
  handleSaveGrade: (id: string, data: GradeCreationInput) => Promise<void>;
}

const ModalGrade: React.FC<Props> = ({
  handleClose,
  students,
  handleSaveGrade,
}) => {
  const [formData, setFormData] = useState<GradeCreationInput>({
    courseId: 1,
    year: 1,
    grade: "A",
  });
  const gradeOptions = gradeCreationSchema.shape.grade.options;
  const yearOptions = gradeCreationSchema.shape.year.options.map(
    (opt) => (opt as z.ZodLiteral<number>).value
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" || name === "courseId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    //CHECK IF GRADE IS DIFFERENT
    const checkGrade = getGradeForStudent(
      studentId,
      formData.year,
      formData.courseId
    );
    if (String(checkGrade) === String(formData.grade)) {
      alert("You cannot save the same grade again.");
      return;
    }
    try {
      await handleSaveGrade(studentId, formData);
    } catch (error: unknown) {
      console.error("Failed to save grade:", error);
    }
  };

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
        <form onSubmit={handleSubmit} className="modal-form">
          <fieldset>
            <div>
              <label>Student</label>
              <select
                name="student"
                defaultValue=""
                onChange={(e) => setStudentId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Student
                </option>

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
                onChange={(e) => {
                  setYear(Number(e.target.value));
                  handleChange(e);
                }}
                value={year}
                required
              >
                <option value="" disabled>
                  Select Year
                </option>
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
                onChange={(e) => {
                  setCourseId(Number(e.target.value));
                  handleChange(e);
                }}
                required
              >
                <option value="" disabled>
                  Select Course
                </option>
                <option value="1">Math</option>
                <option value="2">Art</option>
                <option value="3">History</option>
              </select>
            </div>
            <div>
              <label>Update Grade</label>
              <select
                name="grade"
                onChange={handleChange}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select Grade
                </option>
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
