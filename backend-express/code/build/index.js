"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.getExpressApp = void 0;
require("source-map-support/register");
const Factory_1 = __importDefault(require("./services/Factory"));
const express_1 = __importDefault(require("express"));
const MiddlewareFactory_1 = __importDefault(require("./middlewares/MiddlewareFactory"));
const RouteFactory_1 = __importDefault(require("./routes/RouteFactory"));
const backendCheck_1 = __importDefault(require("./routes/backendCheck"));
const jsonBodyErrorHandlerMiddleware_1 = __importDefault(require("./middlewares/jsonBodyErrorHandlerMiddleware"));
const config_1 = require("./config");
const factory = Factory_1.default;
const logger = Factory_1.default.getLoggerService();
process.on('unhandledRejection', (reason, promise) => {
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
const getExpressApp = (factory) => {
    const middlewareFactory = (0, MiddlewareFactory_1.default)(factory);
    const routerFactory = (0, RouteFactory_1.default)(factory);
    /**
     * To be run before the server is started
     * (wait for availability of external services, etc)
     *
     * @return  {<Promise><void>}
     */
    const init = async () => {
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
    const bootstrap = async () => {
        // Init middleware here
        // ...
        const logger = Factory_1.default.getLoggerService();
        logger.debug('==========================================');
        logger.notice(`Server started on port ${config_1.config.APP_PORT}'
      }.`);
        logger.debug('==========================================');
    };
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    // incoming request informations
    app.use(middlewareFactory.inputVerboseMiddleware);
    // *****************
    // OUTDOOR ACCESS
    // *****************
    // anonymous domain
    app.get('/backend/check', backendCheck_1.default);
    app.use('/backend/state', routerFactory.state);
    // *****************
    // AUTHENTICATED DOMAIN
    // *****************
    // POST PROCESS
    app.use(jsonBodyErrorHandlerMiddleware_1.default);
    app.use(middlewareFactory.errorHandlerMiddleWare);
    app.use(middlewareFactory.unmanagedExceptionMiddleWare);
    return { init, bootstrap, app };
};
exports.getExpressApp = getExpressApp;
const startServer = async (factory) => {
    const { app, init, bootstrap } = (0, exports.getExpressApp)(factory);
    await init();
    return new Promise((resolve, reject) => {
        try {
            const server = app.listen(config_1.config.APP_PORT, () => {
                bootstrap();
                resolve({ app, server });
            });
        }
        catch (err) {
            reject(err);
        }
    });
};
exports.startServer = startServer;
const app = async () => {
    try {
        await (0, exports.startServer)(factory);
    }
    catch (err) {
        logger.error(`Error starting the application ${JSON.stringify(err)}`);
        process.exit(1);
    }
};
void app();
