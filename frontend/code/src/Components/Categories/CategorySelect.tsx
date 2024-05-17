import { FC } from "react";
import Select from "react-select";

interface Props {
  categories: string[];
  value: string | null;
  onChange: (category: string | null) => void;
}

const CategorySelect: FC<Props> = ({ categories, value, onChange }) => {
  return (
    <Select
      name="categories"
      className="category-select"
      options={categories}
      value={value}
      onChange={(value) => {
        onChange(value);
      }}
    />
  );
};

export default CategorySelect;
