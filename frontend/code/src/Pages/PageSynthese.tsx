import './PageSynthese.scss';
import { FC, useContext, useEffect, useState } from 'react';
import Layout from '../Layout';
import factory from '../services/Factory';
import SyntheseGridTree from '../Components/SyntheseGridTree';
import { Echeance, Encours, ExtraitLine, MonthData, TSynthese } from '../interfaces/extraits';
import { AppContext } from './AppContext';
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { CriteriaContext } from './CriteriaContext';
import { MouseHint } from '../Components/MouseHint';
import Montant from '../Components/Montant';
import { FlatTree, getAllDescendantId, treeFindById, treeFlatReduce } from '../exportable/Hierarchie/Tree';
import { getMonthPrevisions } from '../helpers/previsions';
import MontantTable from '../Components/MontantTable';
import EncoursWrapper from '../Components/Encours';

const PageSynthese: FC = () => {
  /**
   * Return the passed flatTree hydrated with all intermediate sum of categories / subcategories
   *
   * @param flat
   * @returns
   */
  const calcSum = (flat: FlatTree<{ value: number }>): FlatTree<{ value: number }> => {
    const sumReducer = (curr: { value: number }, prev: { value: number }) => ({ value: curr.value + prev.value });
    return treeFlatReduce(state.availableCategories, flat, sumReducer, { value: 0 });
  };

  /**
   * Return the global sum (= the sum of the tops if all the intermediate sum are calculated with calcSum)
   *
   * @param flat
   * @returns
   */
  const calcSumOfTops = (flat: FlatTree<{ value: number }>): number =>
    flat.filter((f) => topIds.indexOf(f.id) !== -1).reduce((c, p) => c + p.data.value, 0);

  const goOneMonthBefore = () => {
    if (currentIndex > 0) {
      dispatch({ type: 'setSyntheseMonth', data: state.availableMonths[currentIndex - 1].value });
    }
  };

  const goOneMonthAfter = () => {
    if (currentIndex < state.availableMonths.length) {
      dispatch({ type: 'setSyntheseMonth', data: state.availableMonths[currentIndex + 1].value });
    }
  };

  var retrieveExtraitPortion = async (categoryId: string, month: string) => {
    setExtraitPortion(await extraitService.filterExtraits({ categoryId, month }));
    setMouseHint(true);
  };

  const extraitService = factory.getExtraitsService();
  const backendStateService = factory.getBackendStateService();
  const previsionService = factory.getPrevisionsService();

  const { state } = useContext(AppContext);
  const { state: settings, dispatch } = useContext(CriteriaContext);
  const [synthese, setSynthese] = useState<TSynthese>({});
  const [mouseHint, setMouseHint] = useState<boolean>(false);
  const [extraitPortion, setExtraitPortion] = useState<ExtraitLine[]>([]);
  const [solde, setSolde] = useState<number>(0);
  const [echeances, setEcheances] = useState<Echeance[]>([]);
  const [encours, setEncours] = useState<Encours[]>([]);

  const selectedMonth = state.availableMonths.filter((month) => month.value === settings.syntheseMonth)[0];
  const currentIndex = state.availableMonths.findIndex((m: MonthData) => m.value === settings.syntheseMonth);

  const month = settings.syntheseMonth;

  useEffect(() => {
    const run = async () => {
      const synthese = await extraitService.retrieveSynthese();
      const s = await backendStateService.retrieveSolde();
      setSolde(s);
      setSynthese(synthese);
    };
    void run();
  }, [state, extraitService, backendStateService]);

  useEffect(() => {
    const run = async () => {
      if (month) {
        const m = parseInt(month.split('-')[1]);
        const y = parseInt(month.split('-')[0]);
        setEcheances(await previsionService.getEcheancesInInterval(new Date(y, m, 10), 1));
        setEncours(state.encours.filter((e) => e.date.getMonth() + 1 === m && e.date.getFullYear() === y));
      }
    };
    void run();
  }, [month, previsionService, state.encours]);

  let previsions = month
    ? getMonthPrevisions(state.previsionsRules, parseInt(month.split('-')[1]), parseInt(month.split('-')[0]))
    : [];

  // on ajoute les échéances issue des échéanciers statiques
  echeances.forEach((e) => {
    previsions.push({ id: e.categoryId, data: { value: e.amount } });
  });

  // synthese d'extraits factuel
  const s = synthese[settings.syntheseMonth!];
  const facts: FlatTree<{ value: number }> = s ? Object.keys(s).map((id) => ({ id, data: { value: s[id] } })) : [];

  // synthese d'extraits factuel et prévues
  let previsionsFacts: FlatTree<{ value: number }> = facts.filter(
    (rec) => previsions.findIndex((f) => f.id === rec.id) !== -1,
  );

  // reserve ou dépassement (prévue - factuel)
  let previsionDiffs: FlatTree<{ value: number }> = previsions.map((prev) => {
    const fact = previsionsFacts.find((f) => f.id === prev.id);
    return {
      id: prev.id,
      data: { value: fact === undefined ? prev.data.value : fact!.data.value - prev.data.value },
    };
  });

  // non prévus
  let otherFacts: FlatTree<{ value: number }> = facts
    .filter((rec) => previsions.findIndex((f) => f.id === rec.id) === -1)
    .filter((f) => f.data.value !== 0);
  otherFacts = calcSum(otherFacts);

  const topIds = state.availableCategories.map((c) => c.id);
  const apportTopIds = topIds
    .map((id) => {
      const f = otherFacts.find((f) => f.id === id);
      if (f === undefined) {
        return undefined;
      } else {
        return f.data.value < 0 ? undefined : f.id;
      }
    })
    .filter((v) => v !== undefined);

  const apportIds = [
    ...apportTopIds,
    ...apportTopIds.map((id) => getAllDescendantId(state.availableCategories.find((c) => c.id === id)!)).flat(),
  ];

  let unexpectedFacts = otherFacts.filter((f) => apportIds.indexOf(f.id) === -1);
  let apportsFacts = otherFacts.filter((f) => apportIds.indexOf(f.id) !== -1);

  previsions = calcSum(previsions);
  previsionsFacts = calcSum(previsionsFacts);
  previsionDiffs = calcSum(previsionDiffs);

  const bilanApport = calcSumOfTops(apportsFacts);
  const bilanPrevisions = calcSumOfTops(previsionsFacts);
  const bilanHorsProvision = calcSumOfTops(unexpectedFacts);
  const sumPrevisions = calcSumOfTops(previsions);

  const bilan = bilanApport + bilanPrevisions + bilanHorsProvision;

  const indicators = [
    {
      label: 'Solde actuel',
      value: solde,
    },
    {
      label: 'Total à provisionner',
      value: -sumPrevisions,
    },
    {
      label: 'Total Apport',
      value: bilanApport,
    },
    {
      label: 'Reste à provisionner',
      value: bilanApport + sumPrevisions,
    },
    {
      label: 'Réserve de provisions',
      value: -(sumPrevisions - bilanPrevisions),
    },
    {
      label: 'Non prévus',
      value: bilanHorsProvision,
    },
    {
      label: 'Bilan du mois',
      value: bilan,
    },
    {
      label: 'Solde de fin de mois',
      value: solde + bilan,
    },
  ];

  const content = (
    <div id="page-synthese">
      <div id="state">
        {selectedMonth && (
          <div id="month-selector">
            <BsFillCaretLeftFill id="left" onClick={goOneMonthAfter} />
            &nbsp;&nbsp;&nbsp;
            {selectedMonth.label}&nbsp;&nbsp;&nbsp;
            {currentIndex > 0 && <BsFillCaretRightFill id="right" onClick={goOneMonthBefore} />}
          </div>
        )}

        <div id="table-container">
          <MontantTable values={indicators} />
        </div>
      </div>
      <div id="synthese-grid">
        {selectedMonth && (
          <>
            {settings.syntheseMonth && synthese[settings.syntheseMonth] && (
              <SyntheseGridTree
                apportsFacts={apportsFacts}
                previsions={previsions}
                previsionsFacts={previsionsFacts}
                previsionDiffs={previsionDiffs}
                unexpectedFacts={unexpectedFacts}
                handleMontantClic={retrieveExtraitPortion}
              />
            )}
            <MouseHint isOpen={mouseHint} setIsOpen={setMouseHint}>
              <div className="extrait-hint">
                <table>
                  <tbody>
                    {extraitPortion.map((item) => (
                      <tr key={item.id}>
                        <td>{item.label}</td>
                        <td className="montant">
                          <Montant value={item.montant} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </MouseHint>
          </>
        )}
      </div>
      <div id="encours">
        {encours
          // bind encours to their facts
          .map((e) => ({
            fact: facts.filter((f) => f.id === e.categoryId).reduce((prev, curr) => prev + curr.data.value, 0),
            encours: e,
          }))
          // don't show regular paid
          .filter((e) => e.fact !== e.encours.amount)
          // no facts ? to the end of the list
          .sort((e) => (e.fact === 0 ? 1 : -1))
          // draw
          .map(({ fact, encours: e }, i) => (
            <EncoursWrapper key={i} encours={e} fact={fact} />
          ))}
      </div>
    </div>
  );
  return <Layout content={content} />;
};

export default PageSynthese;
