
import { FC, useContext, useState } from 'react';
import './CategoryTreeSelect.scss'
import { AppContext } from '../Pages/AppContext';
import { Popover } from './Popover';
import CategoryTreeSelector from './CategoryTreeSelector';
import { treeFindById } from '../exportable/Hierarchie/Tree';

interface Props {
    onChange: (e: string | undefined) => void;
    value: string | undefined;
    autoClose?: boolean;
    emptyOption?: boolean;
}

const CategoryTreeSelect: FC<Props> = ({ value, onChange, autoClose = true, emptyOption = false }) => {

    const handleSelect = (e: string | undefined) => {
        onChange(e);
        if (autoClose) {
            setOpen(false);
        }
    }

    const { state } = useContext(AppContext);
    const [open, setOpen] = useState<boolean>(false);


    if (!state.availableCategories) {
        return <></>
    }


    const renderContent = () => <div className='categorie-select'>
        <CategoryTreeSelector
            value={value}
            categories={state.availableCategories}
            colors={state.categoryColors}
            onSelectCategory={handleSelect}
            emptyOption={emptyOption}></CategoryTreeSelector>
    </div>

    return <Popover
        isOpen={open}
        openClose={setOpen}
        render={renderContent}
    >
        <button>
            {value === undefined ? "Catégorie ..." : treeFindById(state.availableCategories, value)!.name}
        </button>
    </Popover>
}

export default CategoryTreeSelect;
