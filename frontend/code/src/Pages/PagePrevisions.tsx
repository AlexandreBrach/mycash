import './PagePrevisions.scss';
import { FC, useContext, useEffect, useState } from 'react';
import Layout from '../Layout';
import { AppContext } from './AppContext';
import PrevisionsSelect from '../Components/Previsions/PrevisionsSelect';
import ReactModal from 'react-modal';
import { Echeance, PrevisionRules } from '../interfaces/extraits';
import PrevisionsForm from '../Components/Previsions/PrevisionsForm';
import factory from '../services/Factory';
import PrevisionTable from '../Components/PrevisionTable';
import EcheancierForm from '../Components/EcheancierForm';
import { getCategoryName } from '../helpers/categories';
import { Month } from '../exportable/Interval/Month';

const now = new Date();

const newRule: PrevisionRules = {
  amount: 0,
  categoryId: '1',
  id: 0,
  period: 1,
  start: new Month(now),
  end: undefined,
};

export const PagePrevisions: FC = () => {
  const COLUMN_NUMBER = 8;
  const handleClickNewRules = () => {
    setSelected(newRule);
    setIsOpenRulesForm(true);
  };

  const handleSelectRule = (id: number | undefined) => {
    const rule = state.previsionsRules.filter((rule) => rule.id === id)[0];
    setSelected(rule);
    setIsOpenRulesForm(true);
  };

  const refreshRules = async () => {
    const previsionsRules = await previsionService.getRules();
    dispatch({ type: 'setPrevisionsRules', data: { previsionsRules } });
  };

  const handleValidatonRule = async (value: PrevisionRules) => {
    await previsionService.setRule(value);
    await refreshRules();
    setIsOpenRulesForm(false);
  };

  const handleDeleteRule = async (value: PrevisionRules) => {
    await previsionService.deleteRule(value.id);
    await refreshRules();
    setIsOpenRulesForm(false);
  };

  const handleStartNewSaisie = () => {
    setEcheancierId(undefined);
    setEcheancier([{ date: new Month(now), amount: 0, categoryId: '0' }]);
    setIsOpenEcheancier(true);
  };

  const handleValidationEcheancier = async () => {
    if (!echeancier[0]) {
      alert('Il doit y avoir au moins une échéance.');
      return;
    }
    if (!echeancier[0].categoryId || echeancier[0].categoryId === '0') {
      alert('Vous devez sélectionner une catégorie');
    } else {
      await previsionService.setEcheancier(echeancierId, echeancier);
      await refreshEcheancierList();
      await refreshEcheances();
      setIsOpenEcheancier(false);
    }
  };

  const handleSelectEcheancier = async (id: string) => {
    const e = await previsionService.getEcheancier(id);
    setEcheancier(e.echeancier);
    setEcheancierId(e.collection);
    setIsOpenEcheancier(true);
  };

  const handleDeleteEcheancier = async (id: string) => {
    await previsionService.deleteEcheancier(id);
    await refreshEcheancierList();
    setIsOpenEcheancier(false);
  };

  const refreshEcheancierList = async () => {
    const e = await previsionService.getEcheanciers();
    setListEcheanciers(e);
  };

  const refreshEcheances = async () => {
    const e = await previsionService.getEcheancesInInterval(startMonth, COLUMN_NUMBER);
    setEcheances(e);
  };

  const refreshRuledEcheances = async (start: Month, end: Month) => {
    const p = await previsionService.getPrevisionsBetween(start, end);
    setRuledEcheances(p);
  };

  const { state, dispatch } = useContext(AppContext);
  const [selected, setSelected] = useState<PrevisionRules>(newRule);
  const [isOpenRulesForm, setIsOpenRulesForm] = useState<boolean>(false);
  const [isOpenEcheancier, setIsOpenEcheancier] = useState<boolean>(false);
  const [echeancier, setEcheancier] = useState<Echeance[]>([]);
  const [listEcheanciers, setListEcheanciers] = useState<{ id: string; category: string }[]>([]);
  const [echeancierId, setEcheancierId] = useState<string | undefined>();
  const [echeances, setEcheances] = useState<Echeance[]>([]);
  const [ruledEcheances, setRuledEcheances] = useState<Echeance[]>([]);
  const [startMonth, setStartDate] = useState<Month>(new Month(new Date()));

  useEffect(() => {
    void refreshEcheancierList();
  }, []);

  useEffect(() => {
    void void refreshRuledEcheances(startMonth, startMonth.nextMonth(COLUMN_NUMBER));
  }, [startMonth, state.previsionsRules]);

  useEffect(() => {
    void refreshEcheances();
  }, [startMonth]);

  const previsionService = factory.getPrevisionsService();

  const ruleSelectContent = (
    <>
      <h1>Previsions</h1>
      <h2>Réccurences</h2>
      <div id="reccurence-list">
        {state.previsionsRules && (
          <PrevisionsSelect
            previsions={state.previsionsRules}
            onSelect={handleSelectRule}
            value={selected ? selected.id : undefined}
          />
        )}
      </div>
      <button onClick={handleClickNewRules}>Nouvelle récurence</button>
      <h2>Echéanciers</h2>
      <ul className="prevision-select">
        {listEcheanciers.map((e) => (
          <li key={e.id} onClick={() => handleSelectEcheancier(e.id)}>
            {getCategoryName(state.availableCategories, e.category)}
          </li>
        ))}
      </ul>

      <button onClick={handleStartNewSaisie}>Nouvelle saisie</button>
      <ReactModal
        ariaHideApp={false}
        isOpen={isOpenRulesForm}
        onRequestClose={() => {
          setIsOpenRulesForm(false);
        }}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="modal"
      >
        <PrevisionsForm value={selected} validation={handleValidatonRule} deleteAction={handleDeleteRule} />
      </ReactModal>
      <ReactModal
        ariaHideApp={false}
        isOpen={isOpenEcheancier}
        onRequestClose={() => {
          setIsOpenEcheancier(false);
        }}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        className="modal"
      >
        <div id="echeance-modal">
          <EcheancierForm
            echeancier={echeancier}
            echeancierId={echeancierId}
            onChange={setEcheancier}
            validation={handleValidationEcheancier}
            deleteAction={handleDeleteEcheancier}
          />
        </div>
      </ReactModal>
    </>
  );

  const content = (
    <div id="page-previsions">
      <div className="section" id="list">
        {ruleSelectContent}
      </div>
      <div className="section" id="matrix">
        {ruledEcheances === undefined || (
          <PrevisionTable
            echeanceTable={ruledEcheances}
            columnNumber={COLUMN_NUMBER}
            startMonth={startMonth}
            onChangeStartDate={setStartDate}
          />
        )}
      </div>
    </div>
  );

  return <Layout content={content} />;
};
