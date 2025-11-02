export interface ServiceResult<T> {
  result: T;
}

export const isServiceResult = (s: any): s is ServiceResult<any> => {
  return s.result !== undefined;
};
