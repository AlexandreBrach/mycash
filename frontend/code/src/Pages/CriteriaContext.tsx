import { FC, ReactNode, createContext, useContext, useEffect, useReducer } from "react";
import { Criteria } from "../interfaces/extraits";
import { AppContext } from "./AppContext";

interface CriteriaState {
    criteria: Criteria;
    syntheseMonth: string | undefined;
}

const initialState: CriteriaState = {
    criteria: {
        month: "",
        categoryId: undefined,
    },
    syntheseMonth: undefined
};

// pas d'intérêt fonctionnel, c'est là uniquement pour l'export
// les valeurs sont ovveridées plus bas 
export const CriteriaContext = createContext({
    state: initialState,
    dispatch: (value: { type: string, data: any }) => { }
});

interface Props {
    children?: ReactNode;
}

const CriteriaContextProvider: FC<Props> = ({ children }) => {

    const { state: appState } = useContext(AppContext);

    const reducer = (state: CriteriaState, action: { type: string, data: any }): CriteriaState => {
        switch (action.type) {
            case 'setCriteria':
                const criteria = action.data as Criteria;
                return { ...state, criteria: { ...state.criteria, ...criteria } };
            case 'setSyntheseMonth':
                return { ...state, syntheseMonth: action.data };
            default:
                throw Error(`action ${action.type} is not managed`);
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);
    const store = {
        state,
        dispatch
    };

    useEffect(() => {
        const run = async () => {
            const availablesMonths = appState.availableMonths;

            if (availablesMonths[0]) {
                dispatch({ type: 'setCriteria', data: { month: availablesMonths[availablesMonths.length === 0 ? 0 : 1].value } })
            }

        }
        if (appState.availableMonths.length !== 0) {
            dispatch({
                type: 'setSyntheseMonth',
                data: appState.availableMonths[appState.availableMonths.length === 0 ? 0 : 1].value
            })
        }
        void run();
    }, [appState.availableMonths]);

    return <CriteriaContext.Provider value={store}>{children}</CriteriaContext.Provider>;
};

export default CriteriaContextProvider;
