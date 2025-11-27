import "./table.css";
import type {
  StudentInterface,
  BaseUserInterface,
} from "../../interfaces/userInterfaces";

interface Props {
  multiData: StudentInterface[];
  onRowClick: (student: BaseUserInterface) => void;
}
const protectedStudentIds = [
  "BMDeWpyRqHTvHulBD85QRGsbTed2",
  "rSYJICHffYeZ5fAGqzFpbbaVyjt2",
  "hGWeaVzLkjcnOlPpEOcEo1QFEq42",
  "Bl11qu3yEuZBKMtx6NK9VwsHn963",
  "RxH5xFzCGBVMRVfMRujKK43gRBr2",
];

const AccountTable: React.FC<Props> = ({ multiData, onRowClick }) => {
  return (
    <>
      <div className="table">
        {/*TABLE START */}
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Personnr</th>
              <th>Tel.</th>
              <th>Address</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {multiData.map((student) => (
              <tr key={student.id}>
                <td>
                  {protectedStudentIds.includes(student.id)
                    ? "*" + student.firstName + " " + student.lastName
                    : student.firstName + " " + student.lastName}
                </td>
                <td>{student.email}</td>
                <td>{student.personNumber}</td>
                <td>{student.phone}</td>
                <td>{student.address}</td>
                <td>
                  <img
                    onClick={() => onRowClick(student)}
                    src="/assets/icons/pen.svg"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="table-key">
          ( * ) <b>Protected Students: </b>Email cannot be changed all other
          information is editable.
        </p>
      </div>
    </>
  );
};

export default AccountTable;
