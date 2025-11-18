import "./filter.css";
import Button from "../Button/Button";

interface Props {
  isSubject: boolean;
  onchange: () => void;
}

const Filter: React.FC<Props> = ({ isSubject, onchange }) => {
  return (
    <>
      <div className="filter">
        {/**FILTER BUTTONS */}
        <div className="filter__buttons">
          <Button text={"Year 1"} size={"medium"} />
          <Button text={"Year 2"} size={"medium"} />
          <Button text={"Year 3"} size={"medium"} />
          <Button text={"All"} size={"medium"} />
        </div>
        {/**OPTIONAL BUTTON */}
        <div className="filter__option">
          {isSubject ? (
            <select id="select-subject" onChange={onchange}>
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
