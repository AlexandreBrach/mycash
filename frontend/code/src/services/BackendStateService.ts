import { BackendFacadeInterface } from './backendFacade';

export interface BackendStateServiceInterface {
  retrieveSolde: () => Promise<number>;
  setSolde: (value: number) => Promise<void>;
}

const BackendStateService = (backend: BackendFacadeInterface): BackendStateServiceInterface => {
  const retrieveSolde = async (): Promise<number> => {
    const message = await backend.get<{ response: string }>('/solde');
    return parseFloat(message.response);
  };

  const setSolde = async (value: number): Promise<void> => {
    await backend.post('/solde', { value });
  };

  return {
    retrieveSolde,
    setSolde,
  };
};

export default BackendStateService;
