import './PageExtraits.scss'
import { FC, useContext, useEffect, useState } from "react";
import Bloclines from "../Components/BlocLines";
import Layout from "../Layout";
import { Criteria, ExtraitLine } from "../interfaces/extraits";
import factory from "../services/Factory";
import { CriteriaContext } from "./CriteriaContext";
import MonthFormElement from '../Components/MonthFormElement';
import CategoryTreeSelect from '../Components/CategoryTreeSelect';
import UploadControl from '../Components/UploadControl';
import ReactModal from 'react-modal';
import EditNote from '../Components/EditNote';

interface Props { }

const PageExtraits: FC<Props> = () => {

  const removeSelection = (id: string) => {
    setSelection(selection.filter((line) => line.id !== id));
  }

  const resetSelection = () => {
    setSelection([]);
  }

  const retrieveExtraits = async (criteria: Criteria) => {
    const data = await extraitService.filterExtraits(criteria);
    setExtraits(data);
  }

  const changeCategorie = async (categorieId: string | undefined) => {
    if (categorieId !== undefined) {
      await categoryService.change(
        selection.map((line) => line.id),
        categorieId);
      await retrieveExtraits(state.criteria);
      resetSelection()
    }
  }

  const changeDateRef = async (dateRef: string | undefined) => {
    if (undefined === dateRef) {
      alert('ne sera pas assigné (corriger le bug)')
    } else {
      await extraitService.updateRefDate(
        selection.map((line) => line.id),
        dateRef
      );
      retrieveExtraits(state.criteria);
      resetSelection()
    }
  }

  const addSelection = (id: string) => {
    const selectedLine = extraits.filter((line) => line.id === id);
    setSelection([...selection, ...selectedLine]);
  }

  const handleChangeCategory = (value: string | undefined) => {
    dispatch({ type: "setCriteria", data: { ...state.criteria, categoryId: value } })
  }

  const handleChangeMonth = (value: string) => {
    dispatch({ type: "setCriteria", data: { ...state.criteria, month: value } })
  }

  const handleNoteSelect = (id: string) => {
    const lines = extraits.filter((line) => line.id === id);
    setNoteSelection(lines[0])
  }

  const updateNote = async (note: string) => {
    await extraitService.updateNote(noteSelection!.id, note);
    setNoteSelection(undefined);
    // To leverage refresh
    dispatch({ type: "setCriteria", data: { ...state.criteria } })
  }

  const { state, dispatch } = useContext(CriteriaContext);

  const [selection, setSelection] = useState<ExtraitLine[]>([]);
  const [noteSelection, setNoteSelection] = useState<ExtraitLine | undefined>(undefined);
  const [extraits, setExtraits] = useState<ExtraitLine[]>([]);
  const [assignationCategoryId, setAssignationCategoryId] = useState<string | undefined>(undefined);
  const [refMonth, setRefMonth] = useState<string | undefined>(undefined);
  const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false);

  const categoryService = factory.getCategoryService();
  const extraitService = factory.getExtraitsService();
  const formatService = factory.getFormatService();

  const numberSelectedLines = selection.length;
  const totalSelectedLines = selection.reduce((prev, curr) => prev + curr.montant, 0);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    void retrieveExtraits(state.criteria);
  }, [state.criteria]
  );

  const content = (
    <div id="page-extraits">
      <div id="filter">
        <label>
          Mois&nbsp;:&nbsp;
        </label>
        <MonthFormElement value={state.criteria.month} onChange={(e) => handleChangeMonth(e as string)} />
        <label>
          Catégorie&nbsp;:&nbsp;
        </label>
        <CategoryTreeSelect
          value={state.criteria.categoryId}
          onChange={(e) => handleChangeCategory(e)}
          emptyOption={true} />

        <div style={{ float: 'right' }}>
          <button onClick={() => setIsOpenUpload(true)}>Import Extrait</button>
          <ReactModal
            isOpen={isOpenUpload}
            onRequestClose={() => { setIsOpenUpload(false) }}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            className="modal">
            <UploadControl onProcess={() => setIsOpenUpload(false)} />
          </ReactModal>
        </div>
      </div>
      <div id="filtered-extrait" className={numberSelectedLines === 0 ? 'alone' : ''}>
        <Bloclines
          lines={extraits}
          selection={selection.map((line) => line.id)}
          onSelect={addSelection}
          unSelect={removeSelection}
          onNoteSelect={handleNoteSelect}
        />
      </div>
      {numberSelectedLines === 0 || (<><div id="summary">
        <strong> {numberSelectedLines} </strong> lignes sélectionnées.
        Total: <strong>{formatService.renderMontant(totalSelectedLines)} &euro;</strong >
        &nbsp;&nbsp;<button onClick={resetSelection}> Unselect </button>&nbsp;&nbsp;
        Assignation:
        <CategoryTreeSelect
          value={assignationCategoryId}
          onChange={(e) => setAssignationCategoryId(e)}
        />
        <button onClick={(e) => changeCategorie(assignationCategoryId)}> Assigner </button>
        <MonthFormElement
          onChange={(e) => setRefMonth(e as string)}
          value={refMonth}
        />
        <button onClick={() => changeDateRef(refMonth)}> Assigner </button>
      </div>
        <div id="selected-extrait">
          <Bloclines
            lines={selection}
            selection={[]}
            onSelect={removeSelection}
            unSelect={() => { }}
          />
        </div></>)}
      <ReactModal
        isOpen={noteSelection !== undefined}
        onRequestClose={() => { setNoteSelection(undefined) }}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="modal">
        <EditNote
          line={noteSelection}
          onProcess={updateNote}
          abort={() => setNoteSelection(undefined)} />
      </ReactModal>
    </div >
  );

  return <Layout content={content} />;
};

export default PageExtraits;
