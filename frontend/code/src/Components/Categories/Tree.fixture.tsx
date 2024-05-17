import { FC, useState } from "react";
import CategorySelect from "./CategorySelect";

const Fixture: FC = () => {
  const categories = [
    "AC/DC",
    "Metallica",
    "Anthrax",
    "Sepultura",
    "Rolling Stones",
    "Cream",
    "Stray Cats",
    "Reverent Horton Heat",
  ];

  const [value, setValue] = useState<string | null>("AC/DC");

  const handleChange = (v: string | null) => {
    setValue(v);
  };

  return (
    <CategorySelect
      categories={categories}
      value={value}
      onChange={handleChange}
    ></CategorySelect>
  );
};

export default Fixture;
