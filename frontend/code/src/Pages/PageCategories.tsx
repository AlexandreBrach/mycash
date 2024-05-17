
import { FC, useContext, useEffect, useState } from 'react';
import factory from '../services/Factory';
import Layout from '../Layout';
import CategoryTreeSelector from '../Components/CategoryTreeSelector';
import { AppContext } from './AppContext';
import "./PageCategories.scss"
import CategoryFormElement from '../Components/CategoryFormElement';
import { ColorResult, HuePicker } from 'react-color';
import { treeFindById } from '../exportable/Hierarchie/Tree';

const Categories: FC = () => {

  const handleClickCreateButton = async () => {
    let response = prompt("Nom pour la nouvelle catégorie :");
    if ((null !== response) && ('' !== response.trim())) {
      await categoryService.create(response);
    }
  }

  const refreshCategory = async () => {
    dispatch({ type: "setAvailableCategories", data: { availableCategories: await categoryService.getTree() } })

  }

  const renameCategory = async (id: string) => {

    const oldName = treeFindById(state.availableCategories, id)!.name;

    let name = prompt("Nouveau nom pour la catégorie :", oldName);

    if ((null !== name) && ('' !== name.trim())) {
      await categoryService.rename(id, name);
      await refreshCategory();
    }
  };

  const deleteCategory = async (id: string) => {
    /* eslint-disable no-restricted-globals */
    if (confirm(`Suppression de la catégorie ${treeFindById(state.availableCategories, id)!.name} ?`)) {
      await categoryService.delete(id);
      await refreshCategory();
    }
  }

  const moveCategoryIn = async (id: string, ancestorId: string) => {
    if (id === ancestorId) {
      alert("Impossible de déplacer une catégorie dans elle-même.")

    } else {
      await categoryService.move(id, ancestorId);
      await refreshCategory();
    }
  }

  const handleSelectCategory = (id: string | undefined) => {
    setSelected(id);
  }

  const handleChangeSelectedColor = (value: ColorResult) => {
    setSelectedColor(value.hex);
  };

  const handleValidateColor = async () => {
    await categoryService.updateColor(selected!, selectedColor!);
    await refreshCategory();
  }


  const categoryService = factory.getCategoryService();
  const { state, dispatch } = useContext(AppContext);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [newAncestor, setNewAncestor] = useState('0')
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    const selectedColor: { color: string } | undefined = selected ? treeFindById(state.categoryColors, selected) : undefined;
    setSelectedColor(selectedColor ? selectedColor.color! : undefined);
  }, [selected])

  const topIds = state.availableCategories.map((cat) => cat.id);

  const content = (
    <div id="page-categories">
      <div id="category-list" className="section no-background">
        <input
          type="button"
          value="Créer une catégorie"
          onClick={handleClickCreateButton}
        /><br /><br />
        <CategoryTreeSelector
          value={selected}
          colors={state.categoryColors}
          categories={state.availableCategories}
          onSelectCategory={handleSelectCategory}
          canSelectGroup={true}
        />
      </div>
      {selected && (null !== selected) ?
        (
          <div className="section" id="category-edition">
            <h1 style={{ color: selectedColor }}>{treeFindById(state.availableCategories, selected)!.name}</h1>
            <div id="category-edition-control">
              <div id="action">
                <button onClick={(e) => renameCategory(selected)}>Renommer</button>
                <button onClick={(e) => deleteCategory(selected)}>Supprimer</button>
                {topIds.indexOf(selected) === -1 ||
                  <>

                    <div style={{ marginTop: '5px' }}>
                      <HuePicker color={selectedColor!} onChangeComplete={handleChangeSelectedColor} />
                    </div>
                    <button onClick={handleValidateColor}>Modifier la couleur</button>
                  </>
                }
              </div>
              <div id="move-action">
                Choisir un nouvel emplacement :
                <CategoryFormElement
                  value={newAncestor}
                  onChange={(e) => setNewAncestor(e)}
                  zeroLabel="--racine--"
                />&nbsp;
                <button onClick={
                  (e) => moveCategoryIn(selected, newAncestor)
                }>
                  Déplacer
                </button>
              </div>
            </div>
          </div>
        )
        :
        <></>}
    </div>
  )

  return <Layout content={content} />;
}


export default Categories;
