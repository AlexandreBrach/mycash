import axios, { AxiosResponse, AxiosError } from 'axios';
import { KeycloakServiceInterface } from './keycloak/KeycloakService';

export class NotFoundException extends Error {}
export class BackendAuthRequired extends Error {}
export class BackendForbidden extends Error {}
export class BackendErrorCanRetry extends Error {}
export class BackendErrorDontRetry extends Error {}
export class CanceledRequest extends Error {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertException = (response: AxiosResponse<any>): Error => {
  const { message } = response.data as { message: string };
  switch (response.status) {
    case 404:
      return new NotFoundException(message);
    case 401:
      return new BackendAuthRequired();
    case 403:
      return new BackendForbidden(message);
    case 408:
    case 502:
    case 504:
    case 522:
    case 523:
    case 524:
      return new BackendErrorCanRetry(`Backend error : ${response.status}`);
    case 400:
    case 500:
    default:
      return new BackendErrorDontRetry(`Backend error ${response.status}`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instanceOfAxiosResponse(object: any): object is AxiosError {
  // the only property that is need to check
  return 'response' in object;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCanceled = (object: any): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return 'message' in object && object.message === 'canceled';
};

export interface BackendFacadeInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toBackendDateFormat: (date: Date) => string;
  post: <Type>(path: string, body: any) => Promise<Type>;
  get: <Type>(path: string) => Promise<Type>;
  upload: <Type>(path: string, data: FormData) => Promise<Type>;
  abort: () => void;
}

const backendFacade = (backendUrl: string, keycloakService: KeycloakServiceInterface): BackendFacadeInterface => {
  let abortController = new AbortController();
  // let bearerToken: string | undefined = undefined;

  /**
   * If not already, configure axios to add the Bearer Token in all request.
   *
   * @returns
   */
  // const addBearerTokenInHeaders = (): void => {
  //   bearerToken = keycloakService.getToken() as string;

  //   if (!bearerToken) {
  //     console.error('Unable to get token from header ! KeycloakService probably not be initialized !');
  //   } else {
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${bearerToken}`;
  //   }
  // };

  return {
    toBackendDateFormat: (date: Date): string =>
      `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`,
    /**
     * Run a basic post request and return the content
     *
     * @param path
     * @param body
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: async <Type>(path: string, body: any): Promise<Type> => {
      // @TODO : add OAUTH Support
      // await keycloakService.refreshToken();
      // addBearerTokenInHeaders();
      let response: AxiosResponse<Type> | undefined = undefined;
      try {
        response = await axios.post(`${backendUrl}${path}`, body, {
          withCredentials: true,
          signal: abortController.signal,
        });
      } catch (err) {
        if (isCanceled(err)) {
          throw new CanceledRequest();
        }
        if (instanceOfAxiosResponse(err)) {
          response = err.response as AxiosResponse;
          if (response.status) {
            if (response.status === 401) {
              window.location.href = '/forbidden.html';
            } else {
              throw convertException(response);
            }
          }
          throw new BackendErrorDontRetry(`Backend return an unmanaged code`);
        }
        throw new BackendErrorDontRetry(`Unrecoverable backend error`);
      }

      if (response === undefined || !response.status || !response.data) {
        throw new BackendErrorCanRetry(`Empty response`);
      }

      if (response.status !== 200) {
        throw convertException(response);
      }

      return response.data;
    },
    /**
     * Run a basic HTTP get and return the content
     *
     * @param path
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: async <Type>(path: string): Promise<Type> => {
      // await keycloakService.refreshToken();
      // addBearerTokenInHeaders();
      let response: AxiosResponse<Type> | undefined = undefined;
      try {
        response = await axios.get(`${backendUrl}${path}`, {
          withCredentials: true,
          signal: abortController.signal,
        });
      } catch (err) {
        if (isCanceled(err)) {
          throw new CanceledRequest();
        }
        if (instanceOfAxiosResponse(err)) {
          response = err.response as AxiosResponse;
          if (response.status) {
            throw convertException(response);
          }
          throw new BackendErrorDontRetry(`Backend return an unmanaged code`);
        }
        throw new BackendErrorDontRetry(`Unrecoverable backend error`);
      }

      if (response === undefined || !response.status || !response.data) {
        throw new BackendErrorCanRetry(`Empty response`);
      }

      if (response.status !== 200) {
        throw convertException(response);
      }
      return response.data;
    },
    upload: async <Type>(path: string, data: FormData): Promise<Type> => {
      // @TODO : add OAUTH Support
      // await keycloakService.refreshToken();
      // addBearerTokenInHeaders();
      let response: AxiosResponse<Type> | undefined = undefined;
      try {
        response = await axios.post(`${backendUrl}${path}`, data, {
          withCredentials: true,
          signal: abortController.signal,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (err) {
        if (isCanceled(err)) {
          throw new CanceledRequest();
        }
        if (instanceOfAxiosResponse(err)) {
          response = err.response as AxiosResponse;
          if (response.status) {
            if (response.status === 401) {
              window.location.href = '/forbidden.html';
            } else {
              throw convertException(response);
            }
          }
          throw new BackendErrorDontRetry(`Backend return an unmanaged code`);
        }
        throw new BackendErrorDontRetry(`Unrecoverable backend error`);
      }

      if (response === undefined || !response.status || !response.data) {
        throw new BackendErrorCanRetry(`Empty response`);
      }

      if (response.status !== 200) {
        throw convertException(response);
      }

      return response.data;
    },

    /**
     * Abort all requests
     */
    abort: () => {
      abortController.abort();
      abortController = new AbortController();
    },
  };
};

export interface BackendFacadeFactoryInterface {
  get: () => BackendFacadeInterface;
}

/**
 * The factory distribute backendFacade with brand new abort controller
 *
 * @param backendFacade
 * @param notFoundHandler
 * @param forbiddenHandler
 * @param canRetryHandler
 * @param authRequiredHandler
 * @param dontRetryHandler
 * @returns
 */
const BackendFacadeFactory = (
  backendUrl: string,
  keycloakService: KeycloakServiceInterface,
): BackendFacadeFactoryInterface => ({
  get: (): BackendFacadeInterface => backendFacade(backendUrl, keycloakService),
});

export default BackendFacadeFactory;
