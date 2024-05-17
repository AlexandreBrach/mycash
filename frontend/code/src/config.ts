/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const getWindowEnvVar = (key: string, defaultValue: unknown) => {
    try {
        // @ts-ignore
        return window._env_[key] || defaultValue;
    } catch (err) {
        if (defaultValue === undefined) {
            console.error(`Env var not set : $${key}`);
            throw err;
        }
        return defaultValue;
    }
};

export const config = {
    app: {
        ENV: getWindowEnvVar('ENV', 'prod'),
    },
    api: {
        baseUrl: getWindowEnvVar('API_BASE_URL', '/backend'),
    }
};
