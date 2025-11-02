import { ApplicationStateInterface, ApplicationStateServiceInterface } from './ApplicationStateService';

const ApplicationStateServiceStub = (): ApplicationStateServiceInterface => {
  const _getResponseLevelCount = async (): Promise<number> => {
    return Promise.resolve(1000);
  };

  const _getReferenceDataCount = async (): Promise<number> => {
    return Promise.resolve(1000);
  };

  const _getLastSurveyDate = async (): Promise<string> => {
    return Promise.resolve('2022-12-22');
  };

  const setState = async (): Promise<ApplicationStateInterface> => {
    return {
      ready: true,
    };
  };

  const getState = async (): Promise<ApplicationStateInterface> => {
    return setState();
  };

  return {
    get: getState,
    set: setState,
  };
};

export default ApplicationStateServiceStub;
