import { PrevisionsServiceInterface } from './PrevisionsService';

export const PrevisionsServiceStub = (): PrevisionsServiceInterface => {
  return {
    getAll() {
      return Promise.resolve([]);
    },
  };
};
