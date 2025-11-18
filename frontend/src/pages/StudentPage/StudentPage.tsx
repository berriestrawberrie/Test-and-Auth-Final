import "./studentpage.css";
import Filter from "../../components/Filter/Filter";
import Table from "../../components/Table/Table";

interface Props {
  title: string;
}
const StudentPage: React.FC<Props> = ({ title }) => {
  return (
    <div className="container">
      <h1>{title}</h1>
      <Filter isSubject={true} onchange={() => {}} />
      <Table
        title1={"Course"}
        title2={"Grade"}
        title3={"Year"}
        isExpand={false}
      />
    </div>
  );
};

export default StudentPage;
