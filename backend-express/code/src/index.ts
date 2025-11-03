import 'source-map-support/register';
import { FactoryInterface } from './services/Factory';
import express, { Express } from 'express';
import http from 'http';
import RouterFactory from './routes/RouteFactory';
import backendCheck from './routes/backendCheck';
import jsonBodyErrorHandlerMiddleware from './middlewares/jsonBodyErrorHandlerMiddleware';
import { ApplicationConfig } from './config';
import { factoryMiddleware } from './middlewares/factoryMiddleware';
import { inputVerboseMiddleware } from './middlewares/inputVerboseMiddleware';
import { errorHandlerMiddleWare } from './middlewares/errorHandlerMiddleware';
import { unmanagedExceptionMiddleWare } from './middlewares/unmanagedExceptionMiddleware';
import { AppDataSource } from './infra/typeorm/ormconfig';

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error(`Promise rejection error : missing the use of asyncHandler (express-async-handler) in express action`);
  console.error(JSON.stringify(reason));
  console.error(JSON.stringify(promise));
});

// declare module 'express-session' {
//   interface SessionData {
//     userId: string;
//     email: string;
//     lastName: string;
//     firstName: string;
//   }
// }

export const getExpressApp = (): { init: () => Promise<void>; bootstrap: () => Promise<void>; app: Express } => {
  const routerFactory = RouterFactory();

  /**
   * To be run before the server is started
   * (wait for availability of external services, etc)
   *
   * @return  {<Promise><void>}
   */
  const init = async (): Promise<void> => {
    // BEFORE INIT
    let flag = false;

    await AppDataSource.initialize();
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

    console.debug('==========================================');
    console.debug(
      `Server started on port ${ApplicationConfig.APP_PORT as number}'
      }.`,
    );
    console.debug('==========================================');
  };

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(factoryMiddleware);
  app.use(inputVerboseMiddleware);

  // *****************
  // OUTDOOR ACCESS
  // *****************

  // anonymous domain
  app.get('/backend-express/check', backendCheck);
  app.use('/backend-express/state', routerFactory.state);
  app.use('/backend-express/previsions', routerFactory.previsions);

  // *****************
  // AUTHENTICATED DOMAIN
  // *****************

  // POST PROCESS

  app.use(jsonBodyErrorHandlerMiddleware);
  app.use(errorHandlerMiddleWare);
  app.use(unmanagedExceptionMiddleWare);

  return { init, bootstrap, app };
};

export const startServer = async (): Promise<{ app: Express; server: http.Server }> => {
  const { app, init, bootstrap } = getExpressApp();
  await init();

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(ApplicationConfig.APP_PORT, () => {
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
    await startServer();
  } catch (err) {
    console.error(`Error starting the application ${JSON.stringify(err)}`);
    process.exit(1);
  }
};

void app();
