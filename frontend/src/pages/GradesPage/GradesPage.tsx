import "./gradespage.css";
import Filter from "../../components/Filter/Filter";

interface Props {
  title: string;
}
const GradesPage: React.FC<Props> = ({ title }) => {
  return (
    <div className="container">
      <h1>{title}</h1>
      <Filter isSubject={true} />
    </div>
  );
};

export default GradesPage;
