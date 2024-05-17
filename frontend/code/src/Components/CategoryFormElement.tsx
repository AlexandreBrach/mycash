import { FC, useContext } from "react";
import { AppContext } from "../Pages/AppContext";
import { treeFlatten } from "../exportable/Hierarchie/Tree";

interface Props {
    value: string;
    onChange: (e: string) => void;
    zeroLabel?: string;
}

const CategoryFormElement: FC<Props> = ({ value, onChange, zeroLabel = '---Aucun---' }) => {

    const { state } = useContext(AppContext);

    const categories = state.availableCategories;

    const items = treeFlatten(categories).map((flat) => (
        <option key={flat.id} value={flat.id}>
            {flat.data.name}
        </option>
    )
    );

    return (
        <select
            value={value}
            onChange={(e) => { onChange(e.target.value) }}>
            <option key="0" value="0">
                {zeroLabel}
            </option>
            {items}
        </select >
    )
}

export default CategoryFormElement;