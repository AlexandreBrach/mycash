import { LogLevel } from '../services/Logger/interface';

export class ServiceException {
  public publicMessage: string;
  public logMessage: string;
  public httpStatus: number;
  public logLevel: LogLevel;

  constructor(publicMessage: string, logMessage: string, httpStatus: number, logLevel: LogLevel) {
    this.publicMessage = publicMessage;
    this.logMessage = logMessage;
    this.httpStatus = httpStatus;
    this.logLevel = logLevel;
  }
}

export const errorServer = (publicMessage: string, logMessage?: string): ServiceException =>
  new ServiceException(publicMessage, logMessage ? logMessage : publicMessage, 500, LogLevel.ERROR);

export const errorNotFound = (publicMessage: string): ServiceException =>
  new ServiceException(publicMessage, `[NOT FOUND] : ${publicMessage}`, 404, LogLevel.INFO);

export const errorInvalidParameters = (publicMessage: string): ServiceException =>
  new ServiceException(publicMessage, `[INVALID PARAMETERS] : ${publicMessage}`, 400, LogLevel.INFO);

export const errorUnauthorized = (publicMessage: string): ServiceException =>
  new ServiceException(publicMessage, `[UNAUTHORIZED] : ${publicMessage}`, 401, LogLevel.INFO);

export const errorForbidden = (publicMessage: string): ServiceException =>
  new ServiceException(publicMessage, `[FORBIDDEN] : ${publicMessage}`, 403, LogLevel.INFO);

export const securityException = (publicMessage: string): ServiceException =>
  new ServiceException(publicMessage, `[SECURITY] : ${publicMessage}`, 500, LogLevel.WARNING);

export const errorLocked = (message: string): ServiceException =>
  new ServiceException('resource is locked', `[LOCKED] : ${message}`, 423, LogLevel.WARNING);
