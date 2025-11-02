export interface ApplicationStateInterface {
  ready: boolean;
}

export interface ApplicationStateServiceInterface {
  get: () => Promise<ApplicationStateInterface>;
  set: () => Promise<ApplicationStateInterface>;
}

const ApplicationStateService = (): ApplicationStateServiceInterface => {
  const setState = (): Promise<ApplicationStateInterface> => {
    const p = Promise.resolve({ ready: true });
    return p;
  };

  const getState = async (): Promise<ApplicationStateInterface> => {
    const p = Promise.resolve({ ready: true });
    return p;
  };

  return {
    get: getState,
    set: setState,
  };
};

export default ApplicationStateService;
