import { FC, useContext, useState } from 'react';
import factory from '../services/Factory';
import './BlocLines.scss';
import { ExtraitField, ExtraitLine } from '../interfaces/extraits';
import { BiNotepad, BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi';
import { FiMoreHorizontal } from 'react-icons/fi';
import { AppContext } from '../Pages/AppContext';
import { treeFlatten } from '../exportable/Hierarchie/Tree';

interface Props {
    lines: ExtraitLine[];
    unSelect: (id: string) => void;
    onSelect: (id: string) => void;
    selection: string[];
    onNoteSelect?: (id: string) => void;
}

const BlocLines: FC<Props> = ({ lines, unSelect, onSelect, selection, onNoteSelect = undefined }) => {

    const toogleLineSelection = (id: string) => {
        if (selection.indexOf(id) !== -1) {
            unSelect(id);
        } else {
            onSelect(id);
        }
    }

    const getLineClassName = (id: string) => {
        if (selection.indexOf(id) !== -1) {
            return "selected"
        }
        return "";
    }

    const sortBy = (fieldName: ExtraitField) => {
        if (fieldName !== sortField) {
            setSortField(fieldName);
        } else {
            setSortOrder(-1 * (sortOrder as number));
        }
    }

    const sortIcon = (fieldName: ExtraitField) => {
        return (fieldName === sortField) ? <div style={{ float: 'right' }}>
            {sortOrder === -1 ? <BiSolidDownArrow /> : <BiSolidUpArrow />}</div>
            : <div style={{ float: 'right' }}>&nbsp;&nbsp;</div>
    }


    const formatService = factory.getFormatService();

    const [sortField, setSortField] = useState<ExtraitField>('date_operation');
    const [sortOrder, setSortOrder] = useState<number>(-1);

    const { state } = useContext(AppContext);

    const colors = treeFlatten(state.categoryColors);

    return colors && <table className="extraits">
        <thead key="thead">
            <tr>
                <th onClick={() => sortBy('date_operation')}>Date opération {sortIcon('date_operation')} </th>
                <th onClick={() => sortBy('categorie_name')}>Catégorie {sortIcon('categorie_name')}</th>
                <th onClick={() => sortBy('label')}>Label {sortIcon('label')}</th>
                <th onClick={() => sortBy('montant')}>Montant {sortIcon('montant')}</th>
                <th>Mois réferent</th>
            </tr>
        </thead>
        <tbody>
            {lines
                .sort((lineA: ExtraitLine, lineB: ExtraitLine) => (lineA[sortField]! > lineB[sortField]!) ? sortOrder : -(sortOrder))
                .map((item) => {
                    // @TODO : == instead of === because object key seems to cast to numner
                    const colorItem = colors.find((c) => c.id == item.categorie)
                    return <tr
                        key={item.id} className={getLineClassName(item.id)}
                        onClick={() => toogleLineSelection(item.id)}
                        style={{ color: colorItem ? colorItem.data.color : "#AAAAAA" }}
                    >
                        <td>{formatService.renderDateOperation(item.date_operation)}</td>
                        <td className="category">{item.categorie_name}</td>
                        <td>
                            {item.label}
                            <div style={{ float: 'right' }} onClick={(e) => { e.stopPropagation(); onNoteSelect && onNoteSelect(item.id) }}>
                                {item.note === "" || <BiNotepad title={item.note} />}
                                {item.note === "" && <FiMoreHorizontal className='low' />}
                            </div>
                        </td>
                        <td className="montant">{formatService.renderMontant(item.montant)}&nbsp;&euro;</td>
                        <td>{formatService.renderMonth(item.categorie_month)}</td>
                    </tr>
                })}
        </tbody>
    </table>
        ;
}

export default BlocLines;