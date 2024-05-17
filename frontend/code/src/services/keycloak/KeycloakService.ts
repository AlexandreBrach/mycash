import Keycloak from 'keycloak-js';

export interface KeycloakServiceInterface {
  init: () => Promise<boolean>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | undefined;
  refreshToken: () => Promise<void>;
}

const _keycloak = new Keycloak('/config/keycloak.json');

export const KeycloakService = (): KeycloakServiceInterface => {
  return {
    init: async (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        _keycloak
          .init({
            onLoad: 'login-required',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            pkceMethod: 'S256',
          })
          .then((authenticated: boolean) => {
            if (authenticated) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    login: async (): Promise<void> => {
      await _keycloak.login();
    },
    logout: async () => {
      await _keycloak.logout();
    },
    getToken: () => {
      return _keycloak.token;
    },
    refreshToken: async (): Promise<void> =>
      new Promise((resolve, reject) => {
        _keycloak
          .updateToken(5)
          .then(() => {
            resolve();
          })
          .catch((err) => reject(err));
      }),
  };
};
