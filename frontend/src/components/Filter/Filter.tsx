import "./filter.css";
import Button from "../Button/Button";

interface Props {
  isSubject: boolean;
  setSelectedYear: (year: number | null) => void;
}

const Filter: React.FC<Props> = ({ isSubject, setSelectedYear }) => {
  return (
    <>
      <div className="filter">
        {/**FILTER BUTTONS */}
        <div className="filter__buttons">
          <Button
            text={"Year 1"}
            onClick={() => setSelectedYear(1)}
            size={"medium"}
          />
          <Button
            text={"Year 2"}
            onClick={() => setSelectedYear(2)}
            size={"medium"}
          />
          <Button
            text={"Year 3"}
            onClick={() => setSelectedYear(3)}
            size={"medium"}
          />
          <Button
            text={"All"}
            onClick={() => setSelectedYear(null)}
            size={"medium"}
          />
        </div>
        {/**OPTIONAL BUTTON */}
        <div className="filter__option">
          {isSubject ? (
            <select id="select-subject">
              <option>Math</option>
              <option>Art</option>
              <option>History</option>
            </select>
          ) : (
            <Button text={"Import CSV"} size={"medium"} />
          )}
        </div>
      </div>
    </>
  );
};

export default Filter;
