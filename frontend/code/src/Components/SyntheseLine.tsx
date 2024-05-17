import React, { FC, useContext, useState } from 'react';
import { FlatTree, Tree, treeFindById } from '../exportable/Hierarchie/Tree';
import { AppContext } from '../Pages/AppContext';
import Montant from './Montant';

/**
 * Recursive component that render a bunch of synthese line and their nested
 * chilren
 *
 * It is based on the general category tree and the depth level
 */

interface SyntheseLineProps {
  id?: string;
  categories: Array<Tree<{ name: string }>>;
  column1: FlatTree<{ value: number }>;
  column2: FlatTree<{ value: number }>;
  column3: FlatTree<{ value: number }>;
  level: number;
}

const SyntheseLine: FC<SyntheseLineProps> = ({ id = '', categories, column1, column2, column3, level }) => {
  const toogleExpand = function (key: string) {
    expands[key] = !expands[key];
    setExpands({ ...expands });
  };

  var initialExpands = Object.keys(categories).reduce((obj: Record<string, boolean>, key: string) => {
    obj[key] = false;
    return obj;
  }, {});

  const [expands, setExpands] = useState<Record<string, boolean>>(initialExpands);

  const { state } = useContext(AppContext);

  const colors = state.categoryColors;

  return (
    <>
      {categories.map((category, i) => {
        const expanded = expands[category.id];
        const colorItem = treeFindById(colors, category.id);
        const color = colorItem ? colorItem.color : '#777777';

        // Is something to render ?
        const value1 = column1.find((p) => p.id === category.id)?.data.value;
        const value2 = column2.find((f) => f.id === category.id)?.data.value;
        const value3 = column3.find((d) => d.id === category.id)?.data.value;

        if ([value1, value2, value3].every((i) => i === undefined)) {
          return <></>;
        }

        return (
          <React.Fragment key={i + id + level}>
            <tr className={'level' + level} style={{ color }}>
              <td className="category-label">
                {category.children.length !== 0 && (
                  <button
                    className={'link expand ' + (expanded ? 'expanded' : 'collapsed')}
                    onClick={() => toogleExpand(category.id)}
                  ></button>
                )}
                <span>{category.data.name}</span>
              </td>

              <td className="value">
                <Montant value={value1} />
              </td>

              <td className="value">{<Montant value={value2} />}</td>

              <td className="value">
                <Montant value={value3} />
              </td>
            </tr>

            {category.children.length !== 0 && expands[category.id] ? (
              <SyntheseLine
                id={id + level + i}
                column1={column1}
                column2={column2}
                column3={column3}
                categories={category.children}
                level={level + 1}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default SyntheseLine;
