import 'source-map-support/register';
import Factory, { FactoryInterface } from './services/Factory';
import express, { Express } from 'express';
import http from 'http';
import MiddlewareFactory from './middlewares/MiddlewareFactory';
import RouterFactory from './routes/RouteFactory';
import backendCheck from './routes/backendCheck';
import jsonBodyErrorHandlerMiddleware from './middlewares/jsonBodyErrorHandlerMiddleware';
import { config } from './config';

const factory = Factory;
const logger = Factory.getLoggerService();

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  logger.error(`Promise rejection error : missing the use of asyncHandler (express-async-handler) in express action`);
  logger.error(JSON.stringify(reason));
  logger.error(JSON.stringify(promise));
});

// declare module 'express-session' {
//   interface SessionData {
//     userId: string;
//     email: string;
//     lastName: string;
//     firstName: string;
//   }
// }

export const getExpressApp = (
  factory: FactoryInterface,
): { init: () => Promise<void>; bootstrap: () => Promise<void>; app: Express } => {
  const middlewareFactory = MiddlewareFactory(factory);
  const routerFactory = RouterFactory(factory);

  /**
   * To be run before the server is started
   * (wait for availability of external services, etc)
   *
   * @return  {<Promise><void>}
   */
  const init = async (): Promise<void> => {
    // BEFORE INIT
    let flag = false;

    while (true) {
      // CHECK (ok ? flag = true)
      flag = true;
      if (flag) {
        break;
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  };

  /**
   * To be run once the server is started
   * (initialisation of middleware, etc)
   *
   * @return  {<Promise><void>}
   */
  const bootstrap = async (): Promise<void> => {
    // Init middleware here
    // ...

    const logger = Factory.getLoggerService();

    logger.debug('==========================================');
    logger.notice(
      `Server started on port ${config.APP_PORT as number}'
      }.`,
    );
    logger.debug('==========================================');
  };

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // incoming request informations
  app.use(middlewareFactory.inputVerboseMiddleware);

  // *****************
  // OUTDOOR ACCESS
  // *****************

  // anonymous domain
  app.get('/backend/check', backendCheck);
  app.use('/backend/state', routerFactory.state);

  // *****************
  // AUTHENTICATED DOMAIN
  // *****************

  // POST PROCESS

  app.use(jsonBodyErrorHandlerMiddleware);
  app.use(middlewareFactory.errorHandlerMiddleWare);
  app.use(middlewareFactory.unmanagedExceptionMiddleWare);

  return { init, bootstrap, app };
};

export const startServer = async (factory: FactoryInterface): Promise<{ app: Express; server: http.Server }> => {
  const { app, init, bootstrap } = getExpressApp(factory);
  await init();

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(config.APP_PORT, () => {
        bootstrap();
        resolve({ app, server });
      });
    } catch (err) {
      reject(err);
    }
  });
};

const app = async () => {
  try {
    await startServer(factory);
  } catch (err) {
    logger.error(`Error starting the application ${JSON.stringify(err)}`);
    process.exit(1);
  }
};

void app();
