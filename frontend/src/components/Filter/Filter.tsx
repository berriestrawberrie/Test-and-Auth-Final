import "./filter.css";
import Button from "../Button/Button";

interface Props {
  isSubject: boolean;
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  setSelectedCourse: (course: string | null) => void;
}

const Filter: React.FC<Props> = ({
  isSubject,
  setSelectedYear,
  selectedYear,
  setSelectedCourse,
}) => {
  return (
    <>
      <div className="filter">
        {/**FILTER BUTTONS */}
        <div className="filter__buttons">
          <Button
            text={"Year 1"}
            onClick={() => setSelectedYear(1)}
            size={"medium"}
            isActive={selectedYear === 1}
          />
          <Button
            text={"Year 2"}
            onClick={() => setSelectedYear(2)}
            size={"medium"}
            isActive={selectedYear === 2}
          />
          <Button
            text={"Year 3"}
            onClick={() => setSelectedYear(3)}
            size={"medium"}
            isActive={selectedYear === 3}
          />
          <Button
            text={"All"}
            onClick={() => setSelectedYear(null)}
            size={"medium"}
            isActive={selectedYear === null}
          />
        </div>
        {/**OPTIONAL BUTTON */}
        <div className="filter__option">
          {isSubject ? (
            <select
              id="select-subject"
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Math">Math</option>
              <option value="Art">Art</option>
              <option value="History">History</option>
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
