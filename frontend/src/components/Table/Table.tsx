import "./table.css";

interface Props {
  title1: string;
  title2: string;
  title3: string;
  title4?: string;
  isExpand: boolean;
}

const Table: React.FC<Props> = ({
  title1,
  title2,
  title3,
  title4,
  isExpand,
}) => {
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
            <tr>
              <td>Column 1 Data</td>
              <td>Column 2 Data</td>
              <td>Column 3 Data</td>
              {isExpand && <td>Column 4 Data</td>}
            </tr>
            <tr>
              <td>Column 1 Data</td>
              <td>Column 2 Data</td>
              <td>Column 3 Data</td>
              {isExpand && <td>Column 4 Data</td>}
            </tr>
            <tr>
              <td>Column 1 Data</td>
              <td>Column 2 Data</td>
              <td>Column 3 Data</td>
              {isExpand && <td>Column 4 Data</td>}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
