import { PrevisionsServiceInterface } from './PrevisionsService';

export const PrevisionsServiceStub = (): PrevisionsServiceInterface => {
  return {
    getAllRules() {
      return Promise.resolve([]);
    },
  };
};
