import { FC } from "react";
import "./CategoryTreeSelector.scss";
import { Tree, treeFindById } from "../exportable/Hierarchie/Tree";

interface Props {
    value: string | undefined;
    categories: Array<Tree<{ name: string }>>
    colors: Array<Tree<{ color: string }>>
    onSelectCategory: (id: string | undefined) => void;
    emptyOption?: boolean;
    canSelectGroup?: boolean
}
interface CWProps {
    id: string;
    name: string;
    colors: Array<Tree<{ color: string }>>
    children: Array<Tree<{ name: string }>>;
    value: string | undefined;
    handle: (id: string) => void;
    canSelectGroup: boolean
}

const CategoryWrap: FC<CWProps> = ({ id, name, children, value, colors, handle, canSelectGroup }) => {
    const color = treeFindById(colors, id)?.color || '#777777';
    return <div className="category-container">

        {children.length !== 0 ?
            <span className="section-label" style={{ color }}>
                {!canSelectGroup ? name :
                    <a
                        className={`category-label ${id === value ? "selected" : ''}`}
                        style={{ color }}
                        onClick={(e) => { handle(id!) }}>
                        {name}
                    </a>
                }

            </span>
            :
            <a
                className={`category-label ${id === value ? "selected" : ''}`}
                style={{ color }}
                onClick={(e) => { handle(id!) }}>
                {name}
            </a>
        }

        {children.map((child) => <CategoryWrap
            key={child.id}
            id={child.id}
            value={value}
            name={child.data.name}
            children={child.children}
            colors={colors}
            handle={handle}
            canSelectGroup={canSelectGroup}
        />
        )}
    </div>
};

const CategoryTreeSelector: FC<Props> = ({ value, categories, colors, onSelectCategory, emptyOption = false, canSelectGroup = false }) => {

    const unselect = () => onSelectCategory(undefined);

    return <div className="category-wrap-container">
        {emptyOption && value !== undefined &&
            <a className="category-label" onClick={unselect}>Déselectionner</a>
        }
        {categories.map((cat: Tree<{ name: string }>) =>
            <CategoryWrap
                value={value}
                id={cat.id}
                key={cat.id}
                name={cat.data.name}
                colors={colors}
                children={cat.children}
                handle={onSelectCategory}
                canSelectGroup={canSelectGroup}
            />
        )}
    </div>
}

export default CategoryTreeSelector;