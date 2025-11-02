"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationStateServiceStub = () => {
    const _getResponseLevelCount = async () => {
        return Promise.resolve(1000);
    };
    const _getReferenceDataCount = async () => {
        return Promise.resolve(1000);
    };
    const _getLastSurveyDate = async () => {
        return Promise.resolve('2022-12-22');
    };
    const setState = async () => {
        return {
            ready: true,
        };
    };
    const getState = async () => {
        return setState();
    };
    return {
        get: getState,
        set: setState,
    };
};
exports.default = ApplicationStateServiceStub;
